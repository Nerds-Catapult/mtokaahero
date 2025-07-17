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
    const limit = parseInt(url.searchParams.get('limit') || '10');

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

    // Fetch recent bookings
    const bookings = await prisma.booking.findMany({
      where: {
        businessId,
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
        service: {
          select: {
            title: true,
            price: true,
          },
        },
      },
      orderBy: {
        scheduledDate: 'desc',
      },
      take: limit,
    }) as any[];

    // Transform the data to match the frontend interface
    const transformedBookings = bookings.map((booking) => ({
      id: booking.id,
      customerName: booking.customer?.name || 'Unknown Customer',
      service: booking.service?.title || 'Unknown Service',
      date: booking.scheduledDate.toISOString().split('T')[0],
      time: booking.scheduledTime,
      status: booking.status.toLowerCase(),
      price: booking.service?.price || booking.price,
    }));

    return NextResponse.json({
      bookings: transformedBookings,
    });

  } catch (error) {
    console.error('Error fetching business bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
