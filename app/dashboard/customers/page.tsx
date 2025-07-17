"use client"

import { DashboardLayout } from '@/components/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBusinessStore } from '@/lib/stores/business-store';
import {
    Calendar,
    DollarSign,
    Eye,
    Filter,
    MessageSquare,
    Phone,
    Search,
    Star,
    TrendingUp,
    UserPlus,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCustomerDetails, setShowCustomerDetails] = useState<any>(null)

  const { customers, customerStats, isLoadingCustomers, customersError, business } = useBusinessStore();

  // Auto-fetch customers when business is available
  useEffect(() => {
      if (business?.id && customers.length === 0 && !isLoadingCustomers) {
          useBusinessStore.getState().fetchCustomers(business.id);
      }
  }, [business?.id, customers.length, isLoadingCustomers]);

  const filteredCustomers = customers.filter(customer => {
      const matchesSearch =
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
  });

  // Use stats from store or calculate fallback
  const stats = customerStats || {
      total: customers.length,
      active: customers.filter(c => c.status === 'active').length,
      totalSpent: customers.reduce((acc, c) => acc + c.totalSpent, 0),
      avgRating:
          customers.length > 0
              ? parseFloat((customers.reduce((acc, c) => acc + c.rating, 0) / customers.length).toFixed(1))
              : 0,
  };

  return (
      <DashboardLayout>
          <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                  <div>
                      <h1 className="text-3xl font-bold">Customer Management</h1>
                      <p className="text-muted-foreground">Manage your customer relationships and history</p>
                  </div>
                  <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Customer
                  </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                      <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                              <div>
                                  <p className="text-sm text-muted-foreground">Total Customers</p>
                                  {isLoadingCustomers ? (
                                      <Skeleton className="h-8 w-20 mt-2" />
                                  ) : (
                                      <p className="text-2xl font-bold">{stats.total}</p>
                                  )}
                              </div>
                              <Users className="h-8 w-8 text-blue-600" />
                          </div>
                      </CardContent>
                  </Card>
                  <Card>
                      <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                              <div>
                                  <p className="text-sm text-muted-foreground">Active Customers</p>
                                  {isLoadingCustomers ? (
                                      <Skeleton className="h-8 w-20 mt-2" />
                                  ) : (
                                      <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                                  )}
                              </div>
                              <TrendingUp className="h-8 w-8 text-green-600" />
                          </div>
                      </CardContent>
                  </Card>
                  <Card>
                      <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                              <div>
                                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                                  {isLoadingCustomers ? (
                                      <Skeleton className="h-8 w-24 mt-2" />
                                  ) : (
                                      <p className="text-2xl font-bold">${stats.totalSpent.toLocaleString()}</p>
                                  )}
                              </div>
                              <DollarSign className="h-8 w-8 text-orange-600" />
                          </div>
                      </CardContent>
                  </Card>
                  <Card>
                      <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                              <div>
                                  <p className="text-sm text-muted-foreground">Avg. Rating</p>
                                  {isLoadingCustomers ? (
                                      <Skeleton className="h-8 w-16 mt-2" />
                                  ) : (
                                      <p className="text-2xl font-bold">{stats.avgRating}</p>
                                  )}
                              </div>
                              <Star className="h-8 w-8 text-purple-600" />
                          </div>
                      </CardContent>
                  </Card>
              </div>

              {/* Filters */}
              <Card>
                  <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1 relative">
                              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                  placeholder="Search customers..."
                                  className="pl-10"
                                  value={searchQuery}
                                  onChange={e => setSearchQuery(e.target.value)}
                              />
                          </div>
                          <Select value={statusFilter} onValueChange={setStatusFilter}>
                              <SelectTrigger className="w-full md:w-48">
                                  <SelectValue placeholder="Filter by status" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="all">All Status</SelectItem>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                  <SelectItem value="vip">VIP</SelectItem>
                              </SelectContent>
                          </Select>
                          <Button variant="outline">
                              <Filter className="h-4 w-4 mr-2" />
                              More Filters
                          </Button>
                      </div>
                  </CardContent>
              </Card>

              {/* Customers List */}
              <Tabs defaultValue="list" className="space-y-4">
                  <TabsList>
                      <TabsTrigger value="list">List View</TabsTrigger>
                      <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="list">
                      <Card>
                          <CardHeader>
                              <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
                              <CardDescription>Manage your customer database</CardDescription>
                          </CardHeader>
                          <CardContent>
                              {customersError && (
                                  <div className="text-center py-8 text-red-600">
                                      <p>Error loading customers: {customersError}</p>
                                      <Button
                                          variant="outline"
                                          className="mt-2"
                                          onClick={() =>
                                              business?.id && useBusinessStore.getState().fetchCustomers(business.id)
                                          }
                                      >
                                          Try Again
                                      </Button>
                                  </div>
                              )}

                              {isLoadingCustomers ? (
                                  <div className="space-y-4">
                                      {[...Array(5)].map((_, i) => (
                                          <div key={i} className="p-4 border rounded-lg">
                                              <div className="flex items-start justify-between mb-3">
                                                  <div className="flex-1">
                                                      <div className="flex items-center space-x-3 mb-2">
                                                          <Skeleton className="h-6 w-32" />
                                                          <Skeleton className="h-5 w-16" />
                                                      </div>
                                                      <Skeleton className="h-4 w-48 mb-1" />
                                                      <Skeleton className="h-4 w-32 mb-2" />
                                                      <div className="flex items-center space-x-4">
                                                          <Skeleton className="h-4 w-20" />
                                                          <Skeleton className="h-4 w-16" />
                                                          <Skeleton className="h-4 w-12" />
                                                      </div>
                                                  </div>
                                                  <div className="text-right">
                                                      <Skeleton className="h-4 w-16 mb-1" />
                                                      <Skeleton className="h-4 w-20" />
                                                  </div>
                                              </div>
                                              <div className="flex gap-2">
                                                  <Skeleton className="h-8 w-24" />
                                                  <Skeleton className="h-8 w-16" />
                                                  <Skeleton className="h-8 w-20" />
                                                  <Skeleton className="h-8 w-28" />
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              ) : (
                                  <div className="space-y-4">
                                      {filteredCustomers.length === 0 ? (
                                          <div className="text-center py-8">
                                              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                              <p className="text-muted-foreground">
                                                  {searchQuery || statusFilter !== 'all'
                                                      ? 'No customers match your search criteria'
                                                      : 'No customers found. Start by adding your first customer.'}
                                              </p>
                                          </div>
                                      ) : (
                                          filteredCustomers.map(customer => (
                                              <div
                                                  key={customer.id}
                                                  className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                                              >
                                                  <div className="flex items-start justify-between mb-3">
                                                      <div className="flex-1">
                                                          <div className="flex items-center space-x-3 mb-2">
                                                              <h4 className="font-medium text-lg">{customer.name}</h4>
                                                              <Badge
                                                                  variant={
                                                                      customer.status === 'active'
                                                                          ? 'default'
                                                                          : customer.status === 'vip'
                                                                          ? 'secondary'
                                                                          : 'outline'
                                                                  }
                                                              >
                                                                  {customer.status}
                                                              </Badge>
                                                          </div>
                                                          <p className="text-sm text-muted-foreground mb-1">
                                                              {customer.email}
                                                          </p>
                                                          <p className="text-sm text-muted-foreground mb-2">
                                                              {customer.phone}
                                                          </p>
                                                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                              <div className="flex items-center">
                                                                  <Calendar className="h-4 w-4 mr-1" />
                                                                  {customer.totalBookings} bookings
                                                              </div>
                                                              <div className="flex items-center">
                                                                  <DollarSign className="h-4 w-4 mr-1" />$
                                                                  {customer.totalSpent}
                                                              </div>
                                                              <div className="flex items-center">
                                                                  <Star className="h-4 w-4 mr-1" />
                                                                  {customer.rating}/5
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <div className="text-right">
                                                          <p className="text-sm text-muted-foreground">Last Visit</p>
                                                          <p className="text-sm font-medium">{customer.lastVisit}</p>
                                                      </div>
                                                  </div>

                                                  <div className="flex gap-2">
                                                      <Button
                                                          size="sm"
                                                          variant="outline"
                                                          onClick={() => setShowCustomerDetails(customer)}
                                                      >
                                                          <Eye className="h-4 w-4 mr-1" />
                                                          View Details
                                                      </Button>
                                                      <Button size="sm" variant="outline">
                                                          <Phone className="h-4 w-4 mr-1" />
                                                          Call
                                                      </Button>
                                                      <Button size="sm" variant="outline">
                                                          <MessageSquare className="h-4 w-4 mr-1" />
                                                          Message
                                                      </Button>
                                                      <Button size="sm" variant="outline">
                                                          <Calendar className="h-4 w-4 mr-1" />
                                                          Book Service
                                                      </Button>
                                                  </div>
                                              </div>
                                          ))
                                      )}
                                  </div>
                              )}
                          </CardContent>
                      </Card>
                  </TabsContent>

                  <TabsContent value="analytics">
                      <div className="grid lg:grid-cols-2 gap-6">
                          <Card>
                              <CardHeader>
                                  <CardTitle>Customer Segments</CardTitle>
                                  <CardDescription>Customer distribution by status</CardDescription>
                              </CardHeader>
                              <CardContent>
                                  <div className="space-y-4">
                                      <div className="flex justify-between items-center">
                                          <span>Active Customers</span>
                                          <div className="flex items-center space-x-2">
                                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                                  <div
                                                      className="bg-green-600 h-2 rounded-full"
                                                      style={{
                                                          width: `${
                                                              stats.total > 0 ? (stats.active / stats.total) * 100 : 0
                                                          }%`,
                                                      }}
                                                  ></div>
                                              </div>
                                              <span className="text-sm">
                                                  {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}
                                                  %
                                              </span>
                                          </div>
                                      </div>
                                      <div className="flex justify-between items-center">
                                          <span>VIP Customers</span>
                                          <div className="flex items-center space-x-2">
                                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                                  <div
                                                      className="bg-purple-600 h-2 rounded-full"
                                                      style={{
                                                          width: `${
                                                              stats.total > 0
                                                                  ? (customers.filter(c => c.status === 'vip').length /
                                                                        stats.total) *
                                                                    100
                                                                  : 0
                                                          }%`,
                                                      }}
                                                  ></div>
                                              </div>
                                              <span className="text-sm">
                                                  {stats.total > 0
                                                      ? Math.round(
                                                            (customers.filter(c => c.status === 'vip').length /
                                                                stats.total) *
                                                                100,
                                                        )
                                                      : 0}
                                                  %
                                              </span>
                                          </div>
                                      </div>
                                      <div className="flex justify-between items-center">
                                          <span>Inactive Customers</span>
                                          <div className="flex items-center space-x-2">
                                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                                  <div
                                                      className="bg-gray-400 h-2 rounded-full"
                                                      style={{
                                                          width: `${
                                                              stats.total > 0
                                                                  ? (customers.filter(c => c.status === 'inactive')
                                                                        .length /
                                                                        stats.total) *
                                                                    100
                                                                  : 0
                                                          }%`,
                                                      }}
                                                  ></div>
                                              </div>
                                              <span className="text-sm">
                                                  {stats.total > 0
                                                      ? Math.round(
                                                            (customers.filter(c => c.status === 'inactive').length /
                                                                stats.total) *
                                                                100,
                                                        )
                                                      : 0}
                                                  %
                                              </span>
                                          </div>
                                      </div>
                                  </div>
                              </CardContent>
                          </Card>

                          <Card>
                              <CardHeader>
                                  <CardTitle>Top Customers</CardTitle>
                                  <CardDescription>Highest spending customers</CardDescription>
                              </CardHeader>
                              <CardContent>
                                  {isLoadingCustomers ? (
                                      <div className="space-y-3">
                                          {[...Array(5)].map((_, i) => (
                                              <div key={i} className="flex items-center justify-between">
                                                  <div className="flex items-center space-x-3">
                                                      <Skeleton className="h-4 w-6" />
                                                      <div>
                                                          <Skeleton className="h-4 w-24 mb-1" />
                                                          <Skeleton className="h-3 w-16" />
                                                      </div>
                                                  </div>
                                                  <Skeleton className="h-4 w-16" />
                                              </div>
                                          ))}
                                      </div>
                                  ) : (
                                      <div className="space-y-3">
                                          {customers.length === 0 ? (
                                              <p className="text-center text-muted-foreground py-4">
                                                  No customer data available
                                              </p>
                                          ) : (
                                              customers
                                                  .sort((a, b) => b.totalSpent - a.totalSpent)
                                                  .slice(0, 5)
                                                  .map((customer, index) => (
                                                      <div
                                                          key={customer.id}
                                                          className="flex items-center justify-between"
                                                      >
                                                          <div className="flex items-center space-x-3">
                                                              <span className="text-sm font-medium">#{index + 1}</span>
                                                              <div>
                                                                  <p className="font-medium">{customer.name}</p>
                                                                  <p className="text-sm text-muted-foreground">
                                                                      {customer.totalBookings} bookings
                                                                  </p>
                                                              </div>
                                                          </div>
                                                          <span className="font-medium">${customer.totalSpent}</span>
                                                      </div>
                                                  ))
                                          )}
                                      </div>
                                  )}
                              </CardContent>
                          </Card>
                      </div>
                  </TabsContent>
              </Tabs>

              {/* Customer Details Dialog */}
              <Dialog open={!!showCustomerDetails} onOpenChange={() => setShowCustomerDetails(null)}>
                  <DialogContent className="max-w-2xl">
                      <DialogHeader>
                          <DialogTitle>Customer Details</DialogTitle>
                          <DialogDescription>Complete customer information and history</DialogDescription>
                      </DialogHeader>
                      {showCustomerDetails && (
                          <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <h4 className="font-medium mb-2">Contact Information</h4>
                                      <div className="space-y-1 text-sm">
                                          <p>
                                              <strong>Name:</strong> {showCustomerDetails.name}
                                          </p>
                                          <p>
                                              <strong>Email:</strong> {showCustomerDetails.email}
                                          </p>
                                          <p>
                                              <strong>Phone:</strong> {showCustomerDetails.phone}
                                          </p>
                                          <p>
                                              <strong>Status:</strong>{' '}
                                              <Badge variant="outline">{showCustomerDetails.status}</Badge>
                                          </p>
                                      </div>
                                  </div>
                                  <div>
                                      <h4 className="font-medium mb-2">Service History</h4>
                                      <div className="space-y-1 text-sm">
                                          <p>
                                              <strong>Total Bookings:</strong> {showCustomerDetails.totalBookings}
                                          </p>
                                          <p>
                                              <strong>Total Spent:</strong> ${showCustomerDetails.totalSpent}
                                          </p>
                                          <p>
                                              <strong>Rating:</strong> {showCustomerDetails.rating}/5
                                          </p>
                                          <p>
                                              <strong>Last Visit:</strong> {showCustomerDetails.lastVisit}
                                          </p>
                                      </div>
                                  </div>
                              </div>

                              <div>
                                  <h4 className="font-medium mb-2">Vehicle Information</h4>
                                  <div className="space-y-2">
                                      {showCustomerDetails.vehicles?.map((vehicle: any, index: number) => (
                                          <div key={index} className="p-3 border rounded-lg">
                                              <p className="font-medium">
                                                  {vehicle.year} {vehicle.make} {vehicle.model}
                                              </p>
                                              <p className="text-sm text-muted-foreground">VIN: {vehicle.vin}</p>
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              <div className="flex gap-2">
                                  <Button
                                      variant="outline"
                                      onClick={() => setShowCustomerDetails(null)}
                                      className="flex-1"
                                  >
                                      Close
                                  </Button>
                                  <Button className="flex-1">Edit Customer</Button>
                              </div>
                          </div>
                      )}
                  </DialogContent>
              </Dialog>
          </div>
      </DashboardLayout>
  );
}
