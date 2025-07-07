"use client"

import { DashboardLayout } from '@/components/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserIdFromSession } from '@/lib/actions/shared/authSession';
import { getMyBusinesses } from '@/lib/actions/shared/serviceActions';
import { Business } from '@/lib/generated/prisma';
import { allBookings } from '@/lib/mock-data';
import { format } from 'date-fns';
import {
    AlertCircle,
    CalendarIcon,
    CheckCircle,
    Clock,
    Edit,
    Eye,
    Filter,
    MessageSquare,
    Phone,
    Plus,
    Search,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Label } from 'recharts';

export default function BookingsPage() {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showNewBooking, setShowNewBooking] = useState(false);

    const [businesses, setBusinesses] = useState<Business>();

    const fetchBusinesses = async () => {
        const userId = await getUserIdFromSession();
        if (!userId) return;

        const response = await getMyBusinesses(userId);
        if (response.error || !response.data) {
            console.error('Error fetching businesses:', response.error);
            return;
        }
        setBusinesses(response.data);
    };

    const createBooking = async (bookingData: any) => {};

    const bookingStatuses = {
        confirmed: { icon: CheckCircle, color: 'text-green-600', variant: 'default' as const },
        pending: { icon: AlertCircle, color: 'text-yellow-600', variant: 'secondary' as const },
        completed: { icon: CheckCircle, color: 'text-blue-600', variant: 'outline' as const },
        cancelled: { icon: XCircle, color: 'text-red-600', variant: 'destructive' as const },
    };

    const filteredBookings = allBookings.filter(booking => {
        const matchesSearch =
            booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.service.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const bookingStats = {
        total: allBookings.length,
        confirmed: allBookings.filter(b => b.status === 'confirmed').length,
        pending: allBookings.filter(b => b.status === 'pending').length,
        completed: allBookings.filter(b => b.status === 'completed').length,
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Bookings Management</h1>
                        <p className="text-muted-foreground">Manage your customer appointments and schedules</p>
                    </div>
                    <Dialog open={showNewBooking} onOpenChange={setShowNewBooking}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                New Booking
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Booking</DialogTitle>
                                <DialogDescription>Schedule a new appointment for a customer</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Input placeholder="Customer name" />
                                <Input placeholder="Customer phone" />
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Service type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="oil-change">Oil Change</SelectItem>
                                        <SelectItem value="brake-repair">Brake Repair</SelectItem>
                                        <SelectItem value="engine-diagnostics">Engine Diagnostics</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
                                    </PopoverContent>
                                </Popover>
                                <Checkbox>
                                    <Label htmlFor="terms">
                                        <Checkbox id="terms" />I agree to the terms and conditions
                                    </Label>
                                </Checkbox>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowNewBooking(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={() => setShowNewBooking(false)} className="flex-1">
                                        Create Booking
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
                                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                                    <p className="text-2xl font-bold">{bookingStats.total}</p>
                                </div>
                                <CalendarIcon className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Confirmed</p>
                                    <p className="text-2xl font-bold text-green-600">{bookingStats.confirmed}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600">{bookingStats.pending}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                    <p className="text-2xl font-bold text-blue-600">{bookingStats.completed}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search bookings..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                More Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Bookings List */}
                <Tabs defaultValue="list" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="list">List View</TabsTrigger>
                        <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                    </TabsList>

                    <TabsContent value="list">
                        <Card>
                            <CardHeader>
                                <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
                                <CardDescription>Manage your customer appointments</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {filteredBookings.map(booking => {
                                        const StatusIcon =
                                            bookingStatuses[booking.status as keyof typeof bookingStatuses]?.icon;
                                        const statusColor =
                                            bookingStatuses[booking.status as keyof typeof bookingStatuses]?.color;

                                        return (
                                            <div
                                                key={booking.id}
                                                className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-medium text-lg">{booking.customerName}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {booking.service}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {booking.date} at {booking.time}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge
                                                            variant={
                                                                bookingStatuses[
                                                                    booking.status as keyof typeof bookingStatuses
                                                                ]?.variant
                                                            }
                                                        >
                                                            <StatusIcon className="h-3 w-3 mr-1" />
                                                            {booking.status}
                                                        </Badge>
                                                        <span className="text-sm font-medium">${booking.price}</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <Phone className="h-4 w-4 mr-1" />
                                                        Call
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <MessageSquare className="h-4 w-4 mr-1" />
                                                        Message
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="calendar">
                        <Card>
                            <CardHeader>
                                <CardTitle>Calendar View</CardTitle>
                                <CardDescription>View bookings in calendar format</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-center">
                                    <Calendar mode="single" className="rounded-md border" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
