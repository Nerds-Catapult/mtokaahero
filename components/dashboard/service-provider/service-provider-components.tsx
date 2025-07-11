import { AddServiceModal } from '@/components/modals/add-service-modal';
import { UpdateBusinessInfoModal } from '@/components/modals/update-business-info-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Edit, Eye, Plus, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface QuickAction {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick?: () => void;
}

export function ServiceProviderQuickActions() {
    const router = useRouter();
    const [showAddServiceModal, setShowAddServiceModal] = useState(false);
    const [showBusinessInfoModal, setShowBusinessInfoModal] = useState(false);

    // In a real app, we would get this from context or props
    const businessId = 'service-provider-business-id';

    const quickActions: QuickAction[] = [
        {
            label: 'Add New Service',
            icon: Plus,
            onClick: () => setShowAddServiceModal(true),
        },
        {
            label: 'View Schedule',
            icon: Calendar,
            onClick: () => router.push('/dashboard/bookings'),
        },
        {
            label: 'View Public Profile',
            icon: Eye,
            onClick: () => {
                // This would navigate to the public profile page
                // For now, we'll just show a message
                alert('Public profile view would open here');
            },
        },
        {
            label: 'Update Business Info',
            icon: Edit,
            onClick: () => setShowBusinessInfoModal(true),
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your business efficiently</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                    <Button key={index} className="justify-start" variant="outline" onClick={action.onClick}>
                        <action.icon className="h-4 w-4 mr-2" />
                        {action.label}
                    </Button>
                ))}
            </CardContent>

            {/* Quick Action Modals */}
            <AddServiceModal
                open={showAddServiceModal}
                onOpenChange={setShowAddServiceModal}
                businessId={businessId}
                onServiceAdded={() => {
                    // Refresh the services list or perform any necessary updates
                }}
            />

            <UpdateBusinessInfoModal
                open={showBusinessInfoModal}
                onOpenChange={setShowBusinessInfoModal}
                businessId={businessId}
            />
        </Card>
    );
}

interface Booking {
    id: string | number;
    customerName: string;
    service: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

interface RecentBookingsProps {
    bookings: Booking[];
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your latest customer appointments</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-medium">{booking.customerName}</h4>
                                <p className="text-sm text-muted-foreground">{booking.service}</p>
                                <p className="text-xs text-muted-foreground">
                                    {booking.date} at {booking.time}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge
                                    variant={
                                        booking.status === 'confirmed'
                                            ? 'default'
                                            : booking.status === 'pending'
                                            ? 'secondary'
                                            : 'outline'
                                    }
                                >
                                    {booking.status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

interface Review {
    id: string | number;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
}

interface CustomerReviewsProps {
    reviews: Review[];
}

export function CustomerReviews({ reviews }: CustomerReviewsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>What your customers are saying</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{review.customerName}</h4>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                                i < review.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-muted-foreground'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function BusinessPerformance() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Business Performance</CardTitle>
                <CardDescription>Your key metrics this month</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                        <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="font-medium">4.8/5</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Response Time</span>
                        <span className="font-medium text-green-600">&lt; 2 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Completion Rate</span>
                        <span className="font-medium">98%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Repeat Customers</span>
                        <span className="font-medium">67%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
