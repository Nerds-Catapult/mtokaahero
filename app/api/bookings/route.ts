import { authOptions } from '@/app/api/auth/[...nextauth]/config';
import prisma from '@/utils/prisma';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createBookingSchema = z.object({
  serviceId: z.string(),
  businessId: z.string(),
  scheduledDate: z.string(),
  scheduledTime: z.string(),
  notes: z.string().optional(),
});

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createBookingSchema.parse(body);

    // Get the customer record
    const customer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer profile not found' },
        { status: 404 }
      );
    }

    // Get the service details
    const service = await prisma.service.findUnique({
      where: { id: validatedData.serviceId },
      include: { business: true },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    if (service.businessId !== validatedData.businessId) {
      return NextResponse.json(
        { success: false, error: 'Service does not belong to the specified business' },
        { status: 400 }
      );
    }

    // Check if the business is active
    if (!service.business.isActive) {
      return NextResponse.json(
        { success: false, error: 'Business is not currently accepting bookings' },
        { status: 400 }
      );
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        businessId: validatedData.businessId,
        serviceId: validatedData.serviceId,
        scheduledDate: new Date(validatedData.scheduledDate),
        scheduledTime: validatedData.scheduledTime,
        price: service.price,
        totalAmount: service.price,
        status: 'PENDING',
        notes: validatedData.notes,
      },
      include: {
        service: {
          select: {
            title: true,
            description: true,
            duration: true,
          },
        },
        business: {
          select: {
            businessName: true,
            addresses: {
              include: {
                address: true,
              },
              where: {
                isPrimary: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// GET /api/bookings - Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the customer record
    const customer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer profile not found' },
        { status: 404 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        customerId: customer.id,
      },
      include: {
        service: {
          select: {
            title: true,
            description: true,
            duration: true,
          },
        },
        business: {
          select: {
            businessName: true,
            logo: true,
            addresses: {
              include: {
                address: true,
              },
              where: {
                isPrimary: true,
              },
            },
          },
        },
      },
      orderBy: {
        scheduledDate: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
