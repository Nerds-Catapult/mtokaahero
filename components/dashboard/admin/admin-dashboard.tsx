import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { AlertTriangle, BarChart3, Building, Settings, ShoppingCart, Users } from "lucide-react"
import { SimpleBarChart, SimpleLineChart, SimplePieChart } from "../charts/chart-components"
import { ChartSection, DashboardHeader } from "../shared/dashboard-components"
import { StatsGrid } from "../shared/stats-grid"

// Mock data for admin dashboard
const adminStats = [
  { title: "Total Users", value: "2,847", change: "+12.3%", icon: Users },
  { title: "Active Businesses", value: "156", change: "+8.1%", icon: Building },
  { title: "Monthly Revenue", value: "$45,230", change: "+15.7%", icon: ShoppingCart },
  { title: "System Issues", value: "3", change: "-2 resolved", icon: AlertTriangle },
]

const platformData = {
  userGrowth: [
    { month: "Jul", users: 2340 },
    { month: "Aug", users: 2456 },
    { month: "Sep", users: 2598 },
    { month: "Oct", users: 2703 },
    { month: "Nov", users: 2761 },
    { month: "Dec", users: 2847 },
  ],
  businessTypes: [
    { name: "Freelance Mechanics", value: 45 },
    { name: "Garages", value: 35 },
    { name: "Spare Parts Shops", value: 20 },
  ],
  monthlyRevenue: [
    { month: "Jul", revenue: 38500 },
    { month: "Aug", revenue: 41200 },
    { month: "Sep", revenue: 39800 },
    { month: "Oct", revenue: 43500 },
    { month: "Nov", revenue: 42100 },
    { month: "Dec", revenue: 45230 },
  ]
}

const recentActivity = [
  { id: "1", action: "New garage registered", user: "AutoFix Pro", time: "2 hours ago", type: "registration" },
  { id: "2", action: "Payment dispute resolved", user: "Customer #2847", time: "4 hours ago", type: "support" },
  { id: "3", action: "Service provider suspended", user: "QuickRepair LLC", time: "6 hours ago", type: "moderation" },
  { id: "4", action: "Bulk import completed", user: "System", time: "1 day ago", type: "system" },
]

function AdminQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Actions</CardTitle>
        <CardDescription>Quick access to admin tools</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start" variant="outline">
          <Users className="mr-2 h-4 w-4" />
          Manage Users
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Building className="mr-2 h-4 w-4" />
          Review Businesses
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <BarChart3 className="mr-2 h-4 w-4" />
          Analytics
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          System Settings
        </Button>
      </CardContent>
    </Card>
  )
}

function RecentActivity() {
  const getActivityColor = (type: string) => {
    switch (type) {
      case "registration": return "bg-green-100 text-green-800"
      case "support": return "bg-blue-100 text-blue-800"
      case "moderation": return "bg-red-100 text-red-800"
      case "system": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest platform activities and events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <Badge className={getActivityColor(activity.type)}>
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.user}</p>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function AdminDashboard() {
  const { user } = useAuth()
  const userName = user?.name || ""

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Admin Dashboard"
        description="Manage the platform, users, and system settings."
        userName={userName}
      />

      <StatsGrid stats={adminStats} />

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ChartSection
          title="User Growth"
          description="Platform user growth over time"
        >
          <SimpleLineChart data={platformData.userGrowth} />
        </ChartSection>

        <ChartSection
          title="Platform Revenue"
          description="Monthly platform revenue"
        >
          <SimpleBarChart data={platformData.monthlyRevenue} />
        </ChartSection>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <ChartSection
          title="Business Types"
          description="Distribution of business types"
        >
          <SimplePieChart data={platformData.businessTypes} />
        </ChartSection>

        <div className="lg:col-span-2">
          <AdminQuickActions />
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="businesses">Business Reviews</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <RecentActivity />
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage platform users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="businesses">
          <Card>
            <CardHeader>
              <CardTitle>Business Reviews</CardTitle>
              <CardDescription>Review and approve business registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Business review interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>System Reports</CardTitle>
              <CardDescription>Generate and view system reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Reporting interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
