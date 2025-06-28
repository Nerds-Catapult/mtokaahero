import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { Calendar, Car, Clock, MapPin, Star, Wrench } from "lucide-react"
import { SimpleLineChart } from "../charts/chart-components"
import { ChartSection, DashboardHeader } from "../shared/dashboard-components"
import { StatsGrid } from "../shared/stats-grid"

// Mock data for customer dashboard
const customerStats = [
  { title: "Active Bookings", value: "3", change: "", icon: Calendar },
  { title: "Vehicles Registered", value: "2", change: "", icon: Car },
  { title: "Services Completed", value: "12", change: "+2 this month", icon: Wrench },
  { title: "Money Saved", value: "$450", change: "vs dealership", icon: Star },
]

const recentBookings = [
  {
    id: "1",
    service: "Oil Change",
    provider: "Mike's Auto Service",
    date: "2024-01-15",
    time: "10:00 AM",
    status: "confirmed" as const,
    vehicle: "Honda Civic 2020"
  },
  {
    id: "2",
    service: "Brake Inspection",
    provider: "Downtown Garage",
    date: "2024-01-18",
    time: "2:00 PM",
    status: "pending" as const,
    vehicle: "Toyota Camry 2019"
  },
  {
    id: "3",
    service: "AC Repair",
    provider: "QuickFix Mechanics",
    date: "2024-01-12",
    time: "9:00 AM",
    status: "completed" as const,
    vehicle: "Honda Civic 2020"
  }
]

const serviceHistory = [
  { month: "Aug", spent: 120 },
  { month: "Sep", spent: 85 },
  { month: "Oct", spent: 200 },
  { month: "Nov", spent: 150 },
  { month: "Dec", spent: 95 },
  { month: "Jan", spent: 180 },
]

function CustomerQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start" variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Book New Service
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Car className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <MapPin className="mr-2 h-4 w-4" />
          Find Nearby Services
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Star className="mr-2 h-4 w-4" />
          Leave Review
        </Button>
      </CardContent>
    </Card>
  )
}

function RecentBookingsList() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-blue-100 text-blue-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>Your upcoming and recent service appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{booking.service}</h4>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{booking.provider}</p>
                <p className="text-sm text-muted-foreground">{booking.vehicle}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {booking.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {booking.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function CustomerDashboard() {
  const { user } = useAuth()
  const userName = user?.name || ""

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Customer Dashboard"
        description="Manage your vehicles, bookings, and service history."
        userName={userName}
      />

      <StatsGrid stats={customerStats} />

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ChartSection
          title="Service Spending"
          description="Monthly spending on vehicle services"
        >
          <SimpleLineChart data={serviceHistory} />
        </ChartSection>

        <div>
          <CustomerQuickActions />
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
          <TabsTrigger value="history">Service History</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <RecentBookingsList />
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <CardTitle>My Vehicles</CardTitle>
              <CardDescription>Manage your registered vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Vehicle management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Service History</CardTitle>
              <CardDescription>Complete history of all services</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Service history coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
