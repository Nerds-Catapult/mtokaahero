'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { AddProductModal } from '@/components/modals/add-product-modal';
import { EditProductModal } from '@/components/modals/edit-product-modal';
import { ProductDetailsModal } from '@/components/modals/product-details-modal';
import { UpdateStockModal } from '@/components/modals/update-stock-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    deleteProduct,
    getBusinessProducts,
    getLowStockProducts,
    getProductAnalytics,
    updateProductStock,
} from '@/lib/actions/productActions';
import { AlertTriangle, Edit, Eye, Package, Plus, Search, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import {toast} from 'sonner'

// Types for the component
type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    sku: string;
    barcode?: string;
    images: string[];
    status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
    category: string;
    subcategory?: string;
    brand?: string;
    model?: string;
    year?: number;
    partNumber?: string;
    compatibility: string[];
    stock: number;
    minStock: number;
    weight?: number;
    dimensions?: any;
    warranty?: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    business: {
        name: string;
        type: string;
    };
    _count: {
        orderItems: number;
        reviews: number;
        favorites: number;
    };
};

type Analytics = {
    totalProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
    availableCount: number;
    totalInventoryValue: number;
};

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // For demo purposes, using a hardcoded business ID
    // In a real app, this would come from auth context
    const businessId = 'spareparts-business-id';

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        console.log('🔄 Loading inventory data...');
        setLoading(true);
        try {
            const [productsResponse, lowStockResponse, analyticsResponse] = await Promise.all([
                getBusinessProducts(businessId),
                getLowStockProducts(businessId),
                getProductAnalytics(businessId),
            ]);

            console.log('📦 Products response:', productsResponse);
            if (productsResponse.success) {
                setProducts(productsResponse.data || []);
                console.log('✅ Products loaded:', productsResponse.data?.length);
            } else {
                console.log('❌ Products error:', productsResponse.error);
                toast.error(productsResponse.error?.message || 'Failed to load products');
            }

            console.log('📊 Low stock response:', lowStockResponse);
            if (lowStockResponse.success) {
                setLowStockProducts(lowStockResponse.data || []);
            }

            console.log('📈 Analytics response:', analyticsResponse);
            if (analyticsResponse.success) {
                setAnalytics(analyticsResponse.data);
            }
        } catch (error) {
            toast.error('An unexpected error occurred while loading data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await deleteProduct(productId, businessId);
            if (response.success) {
                toast.success('Product deleted successfully');
                loadData(); // Reload data
            } else {
                toast.error(response.error?.message || 'Failed to delete product');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        }
    };

    const handleUpdateStock = async (productId: string, newStock: number) => {
        try {
            const response = await updateProductStock(productId, businessId, newStock);
            if (response.success) {
                toast.success('Stock updated successfully');
                loadData(); // Reload data
                setShowStockModal(false);
            } else {
                toast.error(response.error?.message || 'Failed to update stock');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        }
    };

    // Filter products based on search and filter criteria
    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.partNumber?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Get unique categories from products
    const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return 'default';
            case 'OUT_OF_STOCK':
                return 'destructive';
            case 'DISCONTINUED':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const getStockStatusIcon = (product: Product) => {
        if (product.status === 'OUT_OF_STOCK') {
            return <AlertTriangle className="h-4 w-4 text-red-500" />;
        }
        if (product.stock <= product.minStock) {
            return <TrendingDown className="h-4 w-4 text-yellow-500" />;
        }
        return <TrendingUp className="h-4 w-4 text-green-500" />;
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Inventory Management</h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Inventory Management</h1>
                        <p className="text-muted-foreground">Manage your spare parts inventory and stock levels</p>                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => {
                            console.log('Testing toast...');
                            toast.success("success test");
                        }}
                    >
                        Test Toast
                    </Button>
                    <Button onClick={() => setShowAddModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>
                </div>

                {/* Analytics Cards */}
                {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics.totalProducts}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Available</CardTitle>
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{analytics.availableCount}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                                <TrendingDown className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{analytics.lowStockCount}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{analytics.outOfStockCount}</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Tabs */}
                <Tabs defaultValue="all" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="all">All Products</TabsTrigger>
                        <TabsTrigger value="low-stock">Low Stock Alerts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        {/* Filters */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Filters</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="search">Search</Label>
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="search"
                                                placeholder="Search products..."
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                className="pl-8"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="AVAILABLE">Available</SelectItem>
                                                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                                                <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                {categories.map(category => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Products Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Products ({filteredProducts.length})</CardTitle>
                                <CardDescription>Manage your inventory and stock levels</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Stock</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredProducts.map(product => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{product.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {product.brand} {product.model} {product.year}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                                                <TableCell>{product.category}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        {getStockStatusIcon(product)}
                                                        <span>{product.stock}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedProduct(product);
                                                                setShowStockModal(true);
                                                            }}
                                                        >
                                                            Update
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusColor(product.status) as any}>
                                                        {product.status.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedProduct(product);
                                                                setShowDetailsModal(true);
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedProduct(product);
                                                                setShowEditModal(true);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {filteredProducts.length === 0 && (
                                    <div className="text-center py-8">
                                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-medium">No products found</h3>
                                        <p className="text-muted-foreground">
                                            {products.length === 0
                                                ? 'Get started by adding your first product.'
                                                : 'Try adjusting your search or filter criteria.'}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="low-stock" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Low Stock Alerts</CardTitle>
                                <CardDescription>Products that need restocking</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {lowStockProducts.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead>Current Stock</TableHead>
                                                <TableHead>Min Stock</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {lowStockProducts.map(product => (
                                                <TableRow key={product.id}>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="font-medium">{product.name}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                SKU: {product.sku}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            {getStockStatusIcon(product)}
                                                            <span>{product.stock}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{product.minStock}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={getStatusColor(product.status) as any}>
                                                            {product.status.replace('_', ' ')}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedProduct(product);
                                                                setShowStockModal(true);
                                                            }}
                                                        >
                                                            Restock
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8">
                                        <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium">All products well stocked!</h3>
                                        <p className="text-muted-foreground">
                                            No products are currently running low on stock.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Modals */}
                <AddProductModal
                    open={showAddModal}
                    onOpenChange={setShowAddModal}
                    businessId={businessId}
                    onProductAdded={loadData}
                />

                {selectedProduct && (
                    <>
                        <EditProductModal
                            open={showEditModal}
                            onOpenChange={setShowEditModal}
                            product={selectedProduct}
                            businessId={businessId}
                            onProductUpdated={loadData}
                        />

                        <ProductDetailsModal
                            open={showDetailsModal}
                            onOpenChange={setShowDetailsModal}
                            product={selectedProduct}
                        />

                        <UpdateStockModal
                            open={showStockModal}
                            onOpenChange={setShowStockModal}
                            product={selectedProduct}
                            onStockUpdated={newStock => handleUpdateStock(selectedProduct.id, newStock)}
                        />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
