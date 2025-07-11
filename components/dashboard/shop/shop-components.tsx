import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Eye, Package, Plus, ShoppingCart, TrendingUp } from "lucide-react"
import { useRouter } from 'next/navigation';

export function ShopQuickActions() {
  const router = useRouter();

  const handleAddProduct = () => {
      // This would open a product creation modal
      // For now, we'll just show an alert
      alert('Add product modal would open here');
  };
  
  const quickActions = [
      {
          label: 'Add New Product',
          icon: Plus,
          onClick: handleAddProduct,
      },
      {
          label: 'Manage Inventory',
          icon: Package,
          onClick: () => router.push('/dashboard/inventory'),
      },
      {
          label: 'View Orders',
          icon: ShoppingCart,
          onClick: () => router.push('/dashboard/orders'),
      },
      {
          label: 'View Storefront',
          icon: Eye,
          onClick: () => {
              // This would open the storefront in a new tab
              window.open('/marketplace', '_blank');
          },
      },
  ];

  return (
      <Card>
          <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your shop efficiently</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                  <Button key={index} className="justify-start" variant="outline" onClick={action.onClick}>
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.label}
                  </Button>
              ))}
          </CardContent>
      </Card>
  );
}

interface Product {
  id: string
  name: string
  sku: string
  stock: number
  minStock: number
  price: number
  status: "available" | "low_stock" | "out_of_stock"
}

interface LowStockAlertsProps {
  products: Product[]
}

export function LowStockAlerts({ products }: LowStockAlertsProps) {
  const lowStockProducts = products.filter(p => p.stock <= p.minStock)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Low Stock Alerts
        </CardTitle>
        <CardDescription>Products that need restocking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">All products are well stocked!</p>
          ) : (
            lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <Badge variant="destructive">
                    {product.stock} left
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Min: {product.minStock}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered"
  date: string
  itemCount: number
}

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">#{order.orderNumber}</h4>
                <p className="text-sm text-muted-foreground">{order.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {order.itemCount} items • {order.date}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${order.total}</p>
                <Badge
                  variant={
                    order.status === "delivered"
                      ? "default"
                      : order.status === "shipped"
                        ? "secondary"
                        : order.status === "processing"
                          ? "default"
                          : "outline"
                  }
                >
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface TopProduct {
  name: string
  sales: number
  revenue: number
}

interface TopSellingProductsProps {
  products: TopProduct[]
}

export function TopSellingProducts({ products }: TopSellingProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          Top Selling Products
        </CardTitle>
        <CardDescription>Best performers this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${product.revenue}</p>
                <Badge variant="secondary">#{index + 1}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function InventoryOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Overview</CardTitle>
        <CardDescription>Current stock status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Products</span>
            <span className="font-medium">1,247</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">In Stock</span>
            <span className="font-medium text-green-600">1,189</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Low Stock</span>
            <span className="font-medium text-orange-600">43</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Out of Stock</span>
            <span className="font-medium text-red-600">15</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Value</span>
            <span className="font-medium">$284,750</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
