"use client"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Eye, Edit, Calendar, Star } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { dashboardData, recentBookings, recentReviews, chartData } from "@/lib/mock-data"

// Simple chart components as fallback
const SimpleLineChart = ({ data }: { data: any[] }) => {
  const maxValue = Math.max(...data.map((d) => d.revenue || d.bookings || 0))
  const points = data
    .map((item, index) => {
      const value = item.revenue || item.bookings || 0
      const x = (index / (data.length - 1)) * 100
      const y = 100 - (value / maxValue) * 80
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="w-full h-full p-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polyline fill="none" stroke="#3B82F6" strokeWidth="2" points={points} />
          {data.map((item, index) => {
            const value = item.revenue || item.bookings || 0
            const x = (index / (data.length - 1)) * 100
            const y = 100 - (value / maxValue) * 80
            return <circle key={index} cx={x} cy={y} r="2" fill="#3B82F6" />
          })}
        </svg>
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          {data.map((item, index) => (
            <span key={index}>{item.month}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

const SimpleBarChart = ({ data }: { data: any[] }) => {
  const maxValue = Math.max(...data.map((d) => d.bookings || 0))

  return (
    <div className="h-[300px] w-full flex items-end justify-center bg-gray-50 rounded-lg p-4 gap-2">
      {data.map((item, index) => {
        const height = (item.bookings / maxValue) * 250
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="text-xs text-gray-600 mb-1">{item.bookings}</div>
            <div className="bg-green-500 rounded-t w-full min-h-[4px]" style={{ height: `${height}px` }} />
            <div className="text-xs text-gray-600 mt-1">{item.month}</div>
          </div>
        )
      })}
    </div>
  )
}

const SimplePieChart = ({ data }: { data: any[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]

  return (
    <div className="h-[250px] w-full flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="grid grid-cols-2 gap-4">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(0)
            return (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: colors[index] }} />
                <div className="text-sm">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-600">{percentage}%</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [userType] = useState("garage")
  const [mounted, setMounted] = useState(false)
  const stats = dashboardData[userType as keyof typeof dashboardData]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{stat.change}</span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleLineChart data={chartData.revenue} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bookings Overview</CardTitle>
              <CardDescription>Monthly bookings comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={chartData.bookings} />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Service Distribution</CardTitle>
              <CardDescription>Popular services breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <SimplePieChart data={chartData.services} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your business efficiently</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button className="justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add New Service
              </Button>
              <Button className="justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
              <Button className="justify-start" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Public Profile
              </Button>
              <Button className="justify-start" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Update Business Info
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Performance</CardTitle>
                <CardDescription>Your key metrics this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">4.8/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="font-medium text-green-600">&lt; 2 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Repeat Customers</span>
                    <span className="font-medium">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your latest customer appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{booking.customerName}</h4>
                        <p className="text-sm text-muted-foreground">{booking.service}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.date} at {booking.time}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "pending"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>What your customers are saying</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{review.customerName}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
