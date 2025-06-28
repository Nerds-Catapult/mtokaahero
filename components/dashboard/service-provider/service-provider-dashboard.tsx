import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import {
  chartData,
  dashboardData,
  recentBookings,
  recentReviews,
} from "@/lib/mock-data";
import {
  SimpleBarChart,
  SimpleLineChart,
  SimplePieChart,
} from "../charts/chart-components";
import { ChartSection, DashboardHeader } from "../shared/dashboard-components";
import { StatsGrid } from "../shared/stats-grid";
import {
  BusinessPerformance,
  CustomerReviews,
  RecentBookings,
  ServiceProviderQuickActions,
} from "./service-provider-components";

export function ServiceProviderDashboard() {
  const { user } = useAuth();
  const userType = user?.role === "FREELANCE_MECHANIC" ? "mechanic" : "garage";
  const stats = dashboardData[userType as keyof typeof dashboardData];

  const dashboardTitle =
    user?.role === "FREELANCE_MECHANIC"
      ? "Mechanic Dashboard"
      : "Garage Dashboard";
  const userName = user?.name || "";

  return (
    <div className="space-y-6">
      <DashboardHeader
        title={dashboardTitle}
        description="Welcome back! Here's what's happening with your business."
        userName={userName}
      />

      <StatsGrid stats={stats} />

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ChartSection
          title="Revenue Trend"
          description="Monthly revenue over the last 6 months"
        >
          <SimpleLineChart data={chartData.revenue} />
        </ChartSection>

        <ChartSection
          title="Bookings Overview"
          description="Monthly bookings comparison"
        >
          <SimpleBarChart data={chartData.bookings} />
        </ChartSection>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <ChartSection
          title="Service Distribution"
          description="Popular services breakdown"
        >
          <SimplePieChart data={chartData.services} />
        </ChartSection>

        <div className="lg:col-span-2">
          <ServiceProviderQuickActions />
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <BusinessPerformance />
        </TabsContent>

        <TabsContent value="bookings">
          {/* @ts-ignore */}
          <RecentBookings bookings={recentBookings} />
        </TabsContent>

        <TabsContent value="reviews">
          <CustomerReviews reviews={recentReviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
