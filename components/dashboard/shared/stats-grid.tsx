'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useBusinessStore } from '@/lib/stores/business-store';
import { Calendar, DollarSign, LucideIcon, Star, Users } from 'lucide-react';
import { useEffect } from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    change: string;
    icon: LucideIcon;
    isLoading?: boolean;
}

export function StatCard({ title, value, change, icon: Icon, isLoading }: StatCardProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-20" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    <span className={change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>{change}</span> from
                    last month
                </p>
            </CardContent>
        </Card>
    );
}

interface StatsGridProps {
    stats?: StatCardProps[];
}

export function StatsGrid({ stats }: StatsGridProps) {
    const { user } = useAuth();
    const { stats: businessStats, isLoadingStats, statsError, fetchBusinessData, business } = useBusinessStore();

    useEffect(() => {
        if (user?.id) {
            fetchBusinessData(user.id);
        }
    }, [user?.id, fetchBusinessData]);

    // Use stats from Zustand store if available, otherwise use passed stats
    const displayStats = businessStats
        ? [
              {
                  title: 'Total Revenue',
                  value: `$${businessStats.totalRevenue.toLocaleString()}`,
                  change: businessStats.revenueChange,
                  icon: DollarSign,
              },
              {
                  title: 'Total Bookings',
                  value: businessStats.totalBookings.toLocaleString(),
                  change: businessStats.bookingsChange,
                  icon: Calendar,
              },
              {
                  title: 'Total Customers',
                  value: businessStats.totalCustomers.toLocaleString(),
                  change: businessStats.customersChange,
                  icon: Users,
              },
              {
                  title: 'Average Rating',
                  value: businessStats.avgRating.toFixed(1),
                  change: businessStats.ratingChange,
                  icon: Star,
              },
          ]
        : stats || [];

    if (statsError) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="col-span-full">
                    <CardContent className="flex items-center justify-center p-6">
                        <p className="text-sm text-muted-foreground">Error loading stats: {statsError}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {displayStats.map((stat, index) => (
                <StatCard key={index} {...stat} isLoading={isLoadingStats && !businessStats} />
            ))}
        </div>
    );
}
