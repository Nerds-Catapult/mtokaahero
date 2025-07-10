'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye, DollarSign, Clock, Star, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { getBusinessServices, getMyBusinesses, createService, updateService, deleteService } from '@/lib/actions/shared/serviceActions';
import { getUserIdFromSession } from '@/lib/actions/shared/authSession';
import { ServiceStatus, Service, Booking, Review, Business } from '@/lib/generated/prisma';
import { Switch } from '@/components/ui/switch';

interface extendedService extends Service {
    bookings: Booking[];
    reviews: Review[];
}

export default function ServicesPage() {
    const [showNewService, setShowNewService] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [allServices, setAllServices] = useState<extendedService[]>([]);
    const [businesses, setBusinesses] = useState<Business | null>(null);
    const [formdata, setFormData] = useState({
        title: '',
        category: 'maintenance',
        description: '',
        price: 0,
        duration: 60,
        status: 'AVAILABLE',
        images: [],
        tags: []
    });

    const serviceStats = {
        total: allServices.length,
        active: allServices.filter(s => s.status === ServiceStatus.AVAILABLE).length,
        totalBookings: allServices.reduce((acc, s) => acc + s.bookings.length, 0),
    };

    const calculatePriceRange = (service: extendedService) => {
        if (!service.bookings || service.bookings.length === 0) return 'N/A';
        const prices = service.bookings.map(b => b.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;
    };

    const fetchServices = async () => {
        if (!businesses?.id) return;
        
        const response = await getBusinessServices(businesses.id);
        if (response.error) {
            console.error('Failed to fetch services:', response.error);
            return;
        }
        setAllServices(response.data as extendedService[]);
    };

    const fetchBusinesses = async () => {
        const userId = await getUserIdFromSession();
        if (!userId) return;
        const response = await getMyBusinesses(userId);
        if (response.error) {
            console.error('Failed to fetch businesses:', response.error);
            return;
        }
        setBusinesses(response.data as Business | null);
    };

    useEffect(() => {
        fetchBusinesses();
    }, []);
    
    // Call fetchServices whenever businesses changes
    useEffect(() => {
        if (businesses?.id) {
            fetchServices();
        }
    }, [businesses]);

    const addNewService = async () => {
        if (!businesses?.id) {
            console.error('No business found');
            return;
        }

        // Validate form data
        if (!formdata.title || !formdata.description || !formdata.price) {
            console.error('Please fill in all required fields');
            return;
        }

        const response = await createService(businesses.id, {
            title: formdata.title,
            description: formdata.description,
            price: parseFloat(formdata.price.toString()),
            duration: parseInt(formdata.duration.toString()),
            category: formdata.category,
            status: formdata.status as ServiceStatus,
            images: [],
            tags: []
        });

        if (response.error) {
            console.error('Failed to create service:', response.error);
            return;
        }

        // Add the new service to the list and reset form
        setAllServices([...allServices, response.data]);
        setFormData({
            title: '',
            category: 'maintenance',
            description: '',
            price: 0,
            duration: 60,
            status: 'AVAILABLE',
            images: [],
            tags: []
        });
        setShowNewService(false);
        
        // Refresh services list
        fetchServices();
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleUpdateService = async () => {
        if (!editingService?.id) return;
        
        const response = await updateService(editingService.id, {
            title: editingService.title,
            description: editingService.description,
            price: parseFloat(editingService.price.toString()),
            duration: parseInt(editingService.duration.toString()),
            category: editingService.category,
            status: editingService.status,
        });
        
        if (response.error) {
            console.error('Failed to update service:', response.error);
            return;
        }
        
        // Update the service in the list
        setAllServices(
            allServices.map(service => 
                service.id === editingService.id ? { ...service, ...response.data } : service
            )
        );
        
        setEditingService(null);
    };
    
    const handleDeleteService = async (serviceId: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        
        const response = await deleteService(serviceId);
        
        if (response.error) {
            console.error('Failed to delete service:', response.error);
            return;
        }
        
        // Remove the service from the list
        setAllServices(allServices.filter(service => service.id !== serviceId));
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Services Management</h1>
                        <p className="text-muted-foreground">Manage your business services and pricing</p>
                    </div>
                    <Dialog open={showNewService} onOpenChange={setShowNewService}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Service
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Add New Service</DialogTitle>
                                <DialogDescription>Create a new service offering for your business</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="title">Service Name</Label>
                                        <Input 
                                            id="title" 
                                            name="title" 
                                            placeholder="Oil Change" 
                                            value={formdata.title || ''}
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={formdata.category}
                                            onValueChange={(value) => setFormData({...formdata, category: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                                <SelectItem value="repair">Repair</SelectItem>
                                                <SelectItem value="diagnostics">Diagnostics</SelectItem>
                                                <SelectItem value="parts">Parts</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea 
                                        id="description" 
                                        name="description" 
                                        placeholder="Describe your service..." 
                                        rows={3} 
                                        value={formdata.description || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="price">Price ($)</Label>
                                        <Input 
                                            id="price" 
                                            name="price"
                                            type="number" 
                                            placeholder="50" 
                                            value={formdata.price || ''}
                                            onChange={(e) => setFormData({...formdata, price: Number(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="duration">Duration (mins)</Label>
                                        <Input 
                                            id="duration" 
                                            name="duration"
                                            type="number" 
                                            placeholder="60" 
                                            value={formdata.duration || ''}
                                            onChange={(e) => setFormData({...formdata, duration: Number(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={formdata.status || 'AVAILABLE'}
                                            onValueChange={(value) => setFormData({...formdata, status: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="AVAILABLE">Available</SelectItem>
                                                <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch 
                                        id="active" 
                                        checked={formdata.status === 'AVAILABLE'}
                                        onCheckedChange={(checked) => setFormData({...formdata, status: checked ? 'AVAILABLE' : 'UNAVAILABLE'})}
                                    />
                                    <Label htmlFor="active">Active Service</Label>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowNewService(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={addNewService} className="flex-1">
                                        Add Service
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Services</p>
                                    <p className="text-2xl font-bold">{serviceStats.total}</p>
                                </div>
                                <Plus className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Services</p>
                                    <p className="text-2xl font-bold text-green-600">{serviceStats.active}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                                    <p className="text-2xl font-bold">{serviceStats.totalBookings}</p>
                                </div>
                                <Star className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Services List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Services</CardTitle>
                        <CardDescription>Manage your service offerings and pricing</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {allServices.map(service => (
                                <div
                                    key={service.id}
                                    className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h4 className="font-medium text-lg">{service.title}</h4>
                                                <Badge
                                                    variant={
                                                        service.status === ServiceStatus.AVAILABLE
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {service.status === ServiceStatus.UNAVAILABLE
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                                <Badge variant="outline">{service.category}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                    <DollarSign className="h-4 w-4 mr-1" />$
                                                    {calculatePriceRange(service)}
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {service.duration}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Bookings</p>
                                            <p className="text-2xl font-bold">{service.bookings.length}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => setEditingService(service)}>
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleDeleteService(service.id)}>
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Service Dialog */}
                <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Edit Service</DialogTitle>
                            <DialogDescription>Update your service details</DialogDescription>
                        </DialogHeader>
                        {editingService && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="editServiceName">Service Name</Label>
                                        <Input 
                                            id="editServiceName" 
                                            name="title"
                                            value={editingService.title}
                                            onChange={(e) => setEditingService({...editingService, title: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="editCategory">Category</Label>
                                        <Select 
                                            defaultValue={editingService.category}
                                            onValueChange={(value) => setEditingService({...editingService, category: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                                <SelectItem value="repair">Repair</SelectItem>
                                                <SelectItem value="diagnostics">Diagnostics</SelectItem>
                                                <SelectItem value="parts">Parts</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="editDescription">Description</Label>
                                    <Textarea 
                                        id="editDescription" 
                                        name="description"
                                        value={editingService.description}
                                        onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                                        rows={3} 
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="editPrice">Price ($)</Label>
                                        <Input 
                                            id="editPrice" 
                                            name="price"
                                            type="number" 
                                            placeholder="50" 
                                            value={editingService.price || ''}
                                            onChange={(e) => setEditingService({...editingService, price: Number(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="editDuration">Duration (mins)</Label>
                                        <Input 
                                            id="editDuration" 
                                            name="duration"
                                            type="number" 
                                            placeholder="60" 
                                            value={editingService.duration || ''}
                                            onChange={(e) => setEditingService({...editingService, duration: Number(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="editStatus">Status</Label>
                                        <Select
                                            value={editingService.status || 'AVAILABLE'}
                                            onValueChange={(value) => setEditingService({...editingService, status: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="AVAILABLE">Available</SelectItem>
                                                <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch 
                                        id="editActive" 
                                        checked={editingService.status === 'AVAILABLE'}
                                        onCheckedChange={(checked) => setEditingService({...editingService, status: checked ? 'AVAILABLE' : 'UNAVAILABLE'})}
                                    />
                                    <Label htmlFor="editActive">Active Service</Label>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setEditingService(null)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleUpdateService} className="flex-1">
                                        Update Service
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
