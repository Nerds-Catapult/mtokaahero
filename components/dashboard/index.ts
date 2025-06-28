// Main dashboard export
export { MainDashboard } from "./main-dashboard"

// Individual dashboard components
export { AdminDashboard } from "./admin/admin-dashboard"
export { CustomerDashboard } from "./customer/customer-dashboard"
export { ServiceProviderDashboard } from "./service-provider/service-provider-dashboard"
export { ShopDashboard } from "./shop/shop-dashboard"

// Shared components
export { ChartSection, DashboardHeader } from "./shared/dashboard-components"
export { StatsGrid } from "./shared/stats-grid"

// Chart components
export { SimpleBarChart, SimpleLineChart, SimplePieChart } from "./charts/chart-components"

// Service provider components
export {
    BusinessPerformance, CustomerReviews, RecentBookings, ServiceProviderQuickActions
} from "./service-provider/service-provider-components"

// Shop components
export {
    InventoryOverview, LowStockAlerts,
    RecentOrders, ShopQuickActions, TopSellingProducts
} from "./shop/shop-components"
