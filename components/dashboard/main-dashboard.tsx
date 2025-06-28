import { AuthStatus } from "@/components/auth-status"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"
import { UserRole } from "@/lib/generated/prisma"
import { AdminDashboard } from "./admin/admin-dashboard"
import { CustomerDashboard } from "./customer/customer-dashboard"
import { ServiceProviderDashboard } from "./service-provider/service-provider-dashboard"
import { ShopDashboard } from "./shop/shop-dashboard"

export function MainDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AuthStatus />
      </div>
    )
  }

  // Determine which dashboard to show based on user role
  const renderDashboard = () => {
    switch (user?.role) {
      case UserRole.SPAREPARTS_SHOP:
        return <ShopDashboard />
      
      case UserRole.FREELANCE_MECHANIC:
      case UserRole.GARAGE_OWNER:
        return <ServiceProviderDashboard />
      
      case UserRole.CUSTOMER:
        return <CustomerDashboard />
      
      case UserRole.ADMIN:
        return <AdminDashboard />
      
      default:
        return <ServiceProviderDashboard />
    }
  }

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  )
}
