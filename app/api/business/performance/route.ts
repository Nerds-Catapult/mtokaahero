import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/config';
import prisma from '@/utils/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const businessId = url.searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    // Verify business ownership
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: session.user.id,
      },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found or access denied' }, { status: 404 });
    }

    // Calculate performance metrics
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get total bookings this month
    const totalBookings = await prisma.booking.count({
      where: {
        businessId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // Get completed bookings this month
    const completedBookings = await prisma.booking.count({
      where: {
        businessId,
        status: 'COMPLETED',
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // Get reviews and calculate average rating
    const reviews = await prisma.review.findMany({
      where: {
        businessId,
      },
      select: {
        rating: true,
      },
    });

    // Get unique customers who had multiple bookings (repeat customers)
    const allCustomers = await prisma.booking.findMany({
      where: {
        businessId,
      },
      select: {
        customerId: true,
      },
    });

    const customerCounts = allCustomers.reduce((acc, booking) => {
      acc[booking.customerId] = (acc[booking.customerId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalCustomers = Object.keys(customerCounts).length;
    const repeatCustomers = Object.values(customerCounts).filter(count => count > 1).length;

    // Calculate metrics
    const customerSatisfaction = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    const completionRate = totalBookings > 0 
      ? (completedBookings / totalBookings) * 100 
      : 0;

    const repeatCustomersPercentage = totalCustomers > 0 
      ? (repeatCustomers / totalCustomers) * 100 
      : 0;

    // Mock response time (in a real app, you'd calculate this from actual data)
    const responseTime = "< 2 hours";

    const performance = {
      customerSatisfaction: Math.round(customerSatisfaction * 10) / 10,
      responseTime,
      completionRate: Math.round(completionRate),
      repeatCustomers: Math.round(repeatCustomersPercentage),
    };

    return NextResponse.json({
      performance,
    });

  } catch (error) {
    console.error('Error fetching business performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance metrics' },
      { status: 500 }
    );
  }
}
