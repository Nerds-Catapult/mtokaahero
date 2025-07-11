'use client';

import { EmergencyServiceModal } from '@/components/modals/emergency-service-modal';
import { GetQuoteModal } from '@/components/modals/get-quote-modal';
import { ScheduleServiceModal } from '@/components/modals/schedule-service-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { recentBookings } from '@/lib/mock-data';
import { format } from 'date-fns';
import { AlertCircle, CalendarIcon, Car, CheckCircle, Clock, MessageSquare, Phone, Star, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';


export default function BookingsPage() {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [showBookingForm, setShowBookingForm] = useState(false);

    // State for quick action modals
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);

    const bookingStatuses = {
        confirmed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        pending: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        completed: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
        cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Car className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">MtokaaHero</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/marketplace" className="text-gray-600 hover:text-gray-900">
                            Marketplace
                        </Link>
                        <Link href="/bookings" className="text-blue-600 font-medium">
                            My Bookings
                        </Link>
                        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                            Dashboard
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-3">
                        <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
                            <DialogTrigger asChild>
                                <Button>New Booking</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Book a Service</DialogTitle>
                                    <DialogDescription>
                                        Schedule an appointment with a service provider
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="service">Service Type</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select service" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="oil-change">Oil Change</SelectItem>
                                                <SelectItem value="brake-repair">Brake Repair</SelectItem>
                                                <SelectItem value="engine-diagnostics">Engine Diagnostics</SelectItem>
                                                <SelectItem value="tire-service">Tire Service</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="provider">Service Provider</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select provider" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="autocare-pro">AutoCare Pro Garage</SelectItem>
                                                <SelectItem value="mikes-mobile">Mike's Mobile Mechanics</SelectItem>
                                                <SelectItem value="quickfix">QuickFix Auto Center</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Preferred Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={setSelectedDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div>
                                        <Label htmlFor="time">Preferred Time</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="9:00">9:00 AM</SelectItem>
                                                <SelectItem value="10:00">10:00 AM</SelectItem>
                                                <SelectItem value="11:00">11:00 AM</SelectItem>
                                                <SelectItem value="14:00">2:00 PM</SelectItem>
                                                <SelectItem value="15:00">3:00 PM</SelectItem>
                                                <SelectItem value="16:00">4:00 PM</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="notes">Additional Notes</Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Describe the issue or any special requirements..."
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowBookingForm(false)}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button onClick={() => setShowBookingForm(false)} className="flex-1">
                                            Book Service
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
                    <p className="text-gray-600">Manage your automotive service appointments</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Bookings</p>
                                    <p className="text-2xl font-bold">24</p>
                                </div>
                                <Calendar className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Upcoming</p>
                                    <p className="text-2xl font-bold">3</p>
                                </div>
                                <Clock className="h-8 w-8 text-orange-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold">18</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Spent</p>
                                    <p className="text-2xl font-bold">$1,240</p>
                                </div>
                                <Car className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bookings List */}
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Bookings</CardTitle>
                                <CardDescription>Your latest service appointments</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentBookings.map(booking => {
                                        const StatusIcon =
                                            bookingStatuses[booking.status as keyof typeof bookingStatuses]?.icon ||
                                            AlertCircle;
                                        const statusColor =
                                            bookingStatuses[booking.status as keyof typeof bookingStatuses]?.color ||
                                            'text-gray-600';
                                        const statusBg =
                                            bookingStatuses[booking.status as keyof typeof bookingStatuses]?.bg ||
                                            'bg-gray-50';

                                        return (
                                            <div
                                                key={booking.id}
                                                className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-medium text-lg">{booking.service}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            with {booking.customerName}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className={`${statusBg} ${statusColor} border-0`}
                                                    >
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {booking.status}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                                                    <div className="flex items-center">
                                                        <CalendarIcon className="h-4 w-4 mr-1" />
                                                        {booking.date}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        {booking.time}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline">
                                                        <Phone className="h-4 w-4 mr-1" />
                                                        Call
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <MessageSquare className="h-4 w-4 mr-1" />
                                                        Message
                                                    </Button>
                                                    {booking.status === 'completed' && (
                                                        <Button size="sm" variant="outline">
                                                            <Star className="h-4 w-4 mr-1" />
                                                            Review
                                                        </Button>
                                                    )}
                                                    {booking.status === 'confirmed' && (
                                                        <Button size="sm" variant="outline">
                                                            Reschedule
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => setShowScheduleModal(true)}
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule Service
                                </Button>
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => setShowQuoteModal(true)}
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Get Quote
                                </Button>
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => setShowEmergencyModal(true)}
                                >
                                    <Phone className="h-4 w-4 mr-2" />
                                    Emergency Service
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Favorite Providers */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Favorite Providers</CardTitle>
                                <CardDescription>Your trusted service providers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[
                                        { name: 'AutoCare Pro', rating: 4.9, services: 'Full Service' },
                                        { name: "Mike's Mobile", rating: 4.7, services: 'Mobile Repair' },
                                        { name: 'QuickFix Center', rating: 4.6, services: 'Quick Service' },
                                    ].map((provider, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                                        >
                                            <div>
                                                <p className="font-medium text-sm">{provider.name}</p>
                                                <p className="text-xs text-gray-600">{provider.services}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                                <span className="text-xs">{provider.rating}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Service History */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Service History</CardTitle>
                                <CardDescription>Your vehicle maintenance record</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Last Oil Change</span>
                                        <span>Dec 15, 2023</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Brake Inspection</span>
                                        <span>Nov 8, 2023</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tire Rotation</span>
                                        <span>Oct 22, 2023</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Quick Action Modals */}
            <ScheduleServiceModal
                open={showScheduleModal}
                onOpenChange={setShowScheduleModal}
                businessId="default-business-id"
            />
            <GetQuoteModal open={showQuoteModal} onOpenChange={setShowQuoteModal} businessId="default-business-id" />
            <EmergencyServiceModal
                open={showEmergencyModal}
                onOpenChange={setShowEmergencyModal}
                businessId="default-business-id"
            />
        </div>
    );
}
