"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Eye, DollarSign, Clock, Star, TrendingUp } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getBusinessServices, getMyBusinesses } from "@/lib/actions/shared/serviceActions"
import { getUserIdFromSession } from "@/lib/actions/shared/authSession"
import { ServiceStatus, Service, Booking, Review } from "@/lib/generated/prisma"


interface extendedService extends Service {
  bookings: Booking[]
  reviews: Review[]
}

export default function ServicesPage() {
  const [showNewService, setShowNewService] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [allServices, setAllServices] = useState<extendedService[]>([])

  const serviceStats = {
    total: allServices.length,
    active: allServices.filter(s => s.status === ServiceStatus.AVAILABLE).length,
    totalBookings: allServices.reduce((acc, s) => acc + s.bookings.length, 0),
    
  }


  const calculatePriceRange = (service: extendedService) => {
    if (!service.bookings || service.bookings.length === 0) return "N/A"
    const prices = service.bookings.map(b => b.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`
  }


  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Services Management</h1>
            <p className="text-muted-foreground">Manage your business services and pricing</p>
          </div>
          <Dialog open={showNewService} onOpenChange={setShowNewService}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>Create a new service offering for your business</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="serviceName">Service Name</Label>
                    <Input id="serviceName" placeholder="Oil Change" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="diagnostics">Diagnostics</SelectItem>
                        <SelectItem value="parts">Parts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your service..." rows={3} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="minPrice">Min Price ($)</Label>
                    <Input id="minPrice" type="number" placeholder="50" />
                  </div>
                  <div>
                    <Label htmlFor="maxPrice">Max Price ($)</Label>
                    <Input id="maxPrice" type="number" placeholder="100" />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (mins)</Label>
                    <Input id="duration" type="number" placeholder="60" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="active" />
                  <Label htmlFor="active">Active Service</Label>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowNewService(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={() => setShowNewService(false)} className="flex-1">
                    Add Service
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Services</p>
                  <p className="text-2xl font-bold">{serviceStats.total}</p>
                </div>
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Services</p>
                  <p className="text-2xl font-bold text-green-600">{serviceStats.active}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{serviceStats.totalBookings}</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Services</CardTitle>
            <CardDescription>Manage your service offerings and pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allServices.map((service) => (
                <div key={service.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-lg">{service.title}</h4>
                        <Badge variant={service.status === ServiceStatus.AVAILABLE ? "default" : "secondary"}>
                          {service.status === ServiceStatus.UNAVAILABLE ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">{service.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />${
                            calculatePriceRange(service)
                          }
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.duration}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Bookings</p>
                      <p className="text-2xl font-bold">{service.bookings.length}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingService(service)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Service Dialog */}
        <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>Update your service details</DialogDescription>
            </DialogHeader>
            {editingService && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editServiceName">Service Name</Label>
                    <Input id="editServiceName" defaultValue={editingService.name} />
                  </div>
                  <div>
                    <Label htmlFor="editCategory">Category</Label>
                    <Select defaultValue={editingService.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="diagnostics">Diagnostics</SelectItem>
                        <SelectItem value="parts">Parts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="editDescription">Description</Label>
                  <Textarea id="editDescription" defaultValue={editingService.description} rows={3} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="editMinPrice">Price Range</Label>
                    <Input id="editMinPrice" defaultValue={editingService.priceRange} />
                  </div>
                  <div>
                    <Label htmlFor="editDuration">Duration</Label>
                    <Input id="editDuration" defaultValue={editingService.duration} />
                  </div>
                  <div>
                    <Label htmlFor="editRating">Rating</Label>
                    <Input id="editRating" defaultValue={editingService.rating} disabled />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="editActive" defaultChecked={editingService.active} />
                  <Label htmlFor="editActive">Active Service</Label>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditingService(null)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={() => setEditingService(null)} className="flex-1">
                    Update Service
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
