import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/config';
import prisma from '@/utils/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    // Verify the business belongs to the user
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: session.user.id,
      },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Get the last 6 months of data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get bookings for the last 6 months
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { serviceId: { in: (await prisma.service.findMany({ where: { businessId }, select: { id: true } })).map(s => s.id) } },
          { service: { businessId } }
        ],
        scheduledDate: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        scheduledDate: true,
        totalAmount: true,
        paymentStatus: true,
      },
      orderBy: {
        scheduledDate: 'asc',
      },
    });

    // Process the data into monthly format
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueByMonth: { [key: string]: number } = {};
    const bookingsByMonth: { [key: string]: number } = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = monthNames[date.getMonth()];
      revenueByMonth[monthKey] = 0;
      bookingsByMonth[monthKey] = 0;
    }

    // Process bookings data
    bookings.forEach((booking) => {
      const date = new Date(booking.scheduledDate);
      const monthKey = monthNames[date.getMonth()];
      
      // Count all bookings
      bookingsByMonth[monthKey] += 1;
      
      // Add revenue only for paid bookings
      if (booking.paymentStatus === 'PAID') {
        revenueByMonth[monthKey] += booking.totalAmount || 0;
      }
    });

    // Format data for charts
    const chartData = {
      revenue: Object.keys(revenueByMonth).map(month => ({
        month,
        revenue: revenueByMonth[month],
      })),
      bookings: Object.keys(bookingsByMonth).map(month => ({
        month,
        bookings: bookingsByMonth[month],
      })),
    };

    return NextResponse.json({ chartData }, { status: 200 });

  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
