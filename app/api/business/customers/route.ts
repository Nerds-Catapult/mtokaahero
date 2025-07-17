import { authOptions } from '@/app/api/auth/[...nextauth]/config';
import prisma from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

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

    // Fetch customers who have bookings with this business
    const bookings = await prisma.booking.findMany({
      where: {
        businessId,
      },
      include: {
        customer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
            vehicles: true,
          },
        },
        service: {
          select: {
            price: true,
          },
        },
      },
    }) as any[];

    // Group bookings by customer and calculate stats
    const customerMap = new Map();

    bookings.forEach((booking) => {
      const customerId = booking.customer.id;
      
      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          id: customerId,
          name: booking.customer.user 
            ? `${booking.customer.user.firstName || ''} ${booking.customer.user.lastName || ''}`.trim() 
            : 'Unknown Customer',
          email: booking.customer.user?.email || '',
          phone: booking.customer.user?.phone || '',
          status: 'active', // You can implement logic to determine status
          totalBookings: 0,
          totalSpent: 0,
          rating: 4.5, // You can calculate actual rating from reviews
          lastVisit: '',
          vehicles: booking.customer.vehicles?.map((vehicle: any) => ({
            id: vehicle.id,
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            vin: vehicle.vin,
          })) || [],
          bookingDates: [],
        });
      }

      const customer = customerMap.get(customerId);
      customer.totalBookings += 1;
      customer.totalSpent += booking.service?.price || booking.price || 0;
      customer.bookingDates.push(booking.scheduledDate);
    });

    // Convert map to array and calculate last visit
    const customers = Array.from(customerMap.values()).map((customer: any) => {
      const sortedDates = customer.bookingDates.sort((a: Date, b: Date) => 
        new Date(b).getTime() - new Date(a).getTime()
      );
      
      return {
        ...customer,
        lastVisit: sortedDates[0] ? new Date(sortedDates[0]).toISOString().split('T')[0] : 'Never',
        bookingDates: undefined, // Remove this temporary field
      };
    });

    // Calculate customer stats
    const stats = {
      total: customers.length,
      active: customers.filter(c => c.status === 'active').length,
      totalSpent: customers.reduce((acc, c) => acc + c.totalSpent, 0),
      avgRating: customers.length > 0 
        ? parseFloat((customers.reduce((acc, c) => acc + c.rating, 0) / customers.length).toFixed(1))
        : 0,
    };

    return NextResponse.json({
      customers,
      stats,
    });

  } catch (error) {
    console.error('Error fetching business customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
