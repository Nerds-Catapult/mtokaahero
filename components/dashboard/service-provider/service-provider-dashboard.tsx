import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { recentReviews } from '@/lib/constants';
import { useBusinessStore } from '@/lib/stores/business-store';
import { SimpleBarChart, SimpleLineChart } from '../charts/chart-components';
import { ChartSection, DashboardHeader } from "../shared/dashboard-components";
import { StatsGrid } from "../shared/stats-grid";
import { BusinessPerformance, CustomerReviews, RecentBookings } from './service-provider-components';

export function ServiceProviderDashboard() {
    const { user } = useAuth();
    const { chartData, isLoadingChartData } = useBusinessStore();

    const dashboardTitle = user?.role === 'FREELANCE_MECHANIC' ? 'Mechanic Dashboard' : 'Garage Dashboard';
    const userName = user?.name || '';

    return (
        <div className="space-y-6">
            <DashboardHeader
                title={dashboardTitle}
                description="Welcome back! Here's what's happening with your business."
                userName={userName}
            />

            <StatsGrid />

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <ChartSection title="Revenue Trend" description="Monthly revenue over the last 6 months">
                    {isLoadingChartData ? (
                        <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                <p className="text-sm text-gray-600 mt-2">Loading chart data...</p>
                            </div>
                        </div>
                    ) : (
                        <SimpleLineChart data={chartData?.revenue || []} />
                    )}
                </ChartSection>

                <ChartSection title="Bookings Overview" description="Monthly bookings comparison">
                    {isLoadingChartData ? (
                        <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                <p className="text-sm text-gray-600 mt-2">Loading chart data...</p>
                            </div>
                        </div>
                    ) : (
                        <SimpleBarChart data={chartData?.bookings || []} />
                    )}
                </ChartSection>
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
                    <RecentBookings />
                </TabsContent>

                <TabsContent value="reviews">
                    <CustomerReviews reviews={recentReviews} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
