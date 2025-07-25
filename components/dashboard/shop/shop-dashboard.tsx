import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { useBusinessStore } from '@/lib/stores/business-store';
import { SimpleBarChart, SimpleLineChart, SimplePieChart } from '../charts/chart-components';
import { ChartSection, DashboardHeader } from '../shared/dashboard-components';
import { StatsGrid } from '../shared/stats-grid';

import {
    InventoryOverview,
    LowStockAlerts,
    RecentOrders,
    ShopQuickActions,
    TopSellingProducts,
} from './shop-components';

const mockProducts = [
    { id: '1', name: 'Oil Filter', sku: 'OF001', stock: 5, minStock: 10, price: 15.99, status: 'low_stock' as const },
    { id: '2', name: 'Brake Pads', sku: 'BP002', stock: 2, minStock: 5, price: 45.99, status: 'low_stock' as const },
    { id: '3', name: 'Air Filter', sku: 'AF003', stock: 0, minStock: 8, price: 12.99, status: 'out_of_stock' as const },
];

const mockOrders = [
    {
        id: '1',
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        total: 156.45,
        status: 'processing' as const,
        date: '2025-06-28',
        itemCount: 3,
    },
    {
        id: '2',
        orderNumber: 'ORD-002',
        customerName: 'Jane Smith',
        total: 89.99,
        status: 'shipped' as const,
        date: '2025-06-27',
        itemCount: 2,
    },
    {
        id: '3',
        orderNumber: 'ORD-003',
        customerName: 'Mike Johnson',
        total: 234.78,
        status: 'delivered' as const,
        date: '2025-06-26',
        itemCount: 5,
    },
];

const mockTopProducts = [
    { name: 'Premium Oil Filter', sales: 145, revenue: 2318 },
    { name: 'Performance Brake Pads', sales: 89, revenue: 4090 },
    { name: 'High-Flow Air Filter', sales: 76, revenue: 985 },
];

export function ShopDashboard() {
    const { user } = useAuth();
    const { chartData, isLoadingChartData } = useBusinessStore();
    const userName = user?.name || '';

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="Shop Dashboard"
                description="Manage your automotive parts store and track sales performance."
                userName={userName}
            />

            {/* Stats Grid now fetches data from Zustand store */}
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

                <ChartSection title="Orders Overview" description="Monthly orders comparison">
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

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <ChartSection title="Product Categories" description="Sales distribution by category">
                    {isLoadingChartData ? (
                        <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                <p className="text-sm text-gray-600 mt-2">Loading chart data...</p>
                            </div>
                        </div>
                    ) : (
                        <SimplePieChart
                            data={[
                                { name: 'Engine Parts', value: 35 },
                                { name: 'Brake Components', value: 25 },
                                { name: 'Filters', value: 20 },
                                { name: 'Electronics', value: 20 },
                            ]}
                        />
                    )}
                </ChartSection>

                <div className="lg:col-span-2">
                    <ShopQuickActions />
                </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="orders">Recent Orders</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                    <TabsTrigger value="products">Top Products</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <InventoryOverview />
                </TabsContent>

                <TabsContent value="orders">
                    <RecentOrders orders={mockOrders} />
                </TabsContent>

                <TabsContent value="inventory">
                    <LowStockAlerts products={mockProducts} />
                </TabsContent>

                <TabsContent value="products">
                    <TopSellingProducts products={mockTopProducts} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
