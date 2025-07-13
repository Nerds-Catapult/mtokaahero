'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, ShoppingCart, Truck } from 'lucide-react';

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Orders</h1>
                    <p className="text-muted-foreground">
                        Manage customer orders and track fulfillment
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">156</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">8</div>
                        <p className="text-xs text-muted-foreground">Require attention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Processing</CardTitle>
                        <Truck className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">12</div>
                        <p className="text-xs text-muted-foreground">Being prepared</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">136</div>
                        <p className="text-xs text-muted-foreground">Successfully delivered</p>
                    </CardContent>
                </Card>
            </div>

            {/* Coming Soon Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Orders Management</CardTitle>
                    <CardDescription>
                        Complete order management system coming soon
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Order Management System</h3>
                    <p className="text-muted-foreground mb-4">
                        Full order tracking, fulfillment, and customer communication features are in development.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Features will include:
                    </p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Order processing and status updates</li>
                        <li>• Inventory integration and automatic stock updates</li>
                        <li>• Customer notifications and tracking</li>
                        <li>• Payment processing and invoicing</li>
                        <li>• Shipping integration and label printing</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
