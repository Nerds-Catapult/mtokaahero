import { authOptions } from '@/app/api/auth/[...nextauth]/config';
import { BusinessType } from '@/lib/generated/prisma';
import prisma from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const businessSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  description: z.string().optional(),
  businessType: z.enum(['GARAGE_OWNER', 'FREELANCE_MECHANIC', 'SPAREPARTS_SHOP']),
  licenseNumber: z.string().optional(),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  workingHours: z.object({
    monday: z.object({
      open: z.string(),
      close: z.string(),
      isOpen: z.boolean(),
    }),
    tuesday: z.object({
      open: z.string(),
      close: z.string(),
      isOpen: z.boolean(),
    }),
    wednesday: z.object({
      open: z.string(),
      close: z.string(),
      isOpen: z.boolean(),
    }),
    thursday: z.object({
      open: z.string(),
      close: z.string(),
      isOpen: z.boolean(),
    }),
    friday: z.object({
      open: z.string(),
      close: z.string(),
      isOpen: z.boolean(),
    }),
    saturday: z.object({
      open: z.string(),
      close: z.string(),
      isOpen: z.boolean(),
    }),
    sunday: z.object({
      open: z.string(),
      close: z.string(),
      isOpen: z.boolean(),
    }),
  }),
});

// Map user role to business type
function mapUserRoleToBusinessType(role: string): BusinessType {
  switch (role) {
    case 'GARAGE_OWNER':
      return BusinessType.GARAGE;
    case 'FREELANCE_MECHANIC':
      return BusinessType.FREELANCE_MECHANIC;
    case 'SPAREPARTS_SHOP':
      return BusinessType.SPAREPARTS_SHOP;
    default:
      throw new Error('Invalid business type');
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = businessSchema.parse(body);

    // Check if user already has a business
    const existingBusiness = await prisma.business.findFirst({
      where: { ownerId: session.user.id }
    });

    if (existingBusiness) {
      return NextResponse.json(
        { error: "Business profile already exists" },
        { status: 409 }
      );
    }

    // Create the business profile
    const business = await prisma.business.create({
      data: {
        ownerId: session.user.id,
        businessName: validatedData.businessName,
        description: validatedData.description,
        businessType: mapUserRoleToBusinessType(validatedData.businessType),
        licenseNumber: validatedData.licenseNumber,
        isActive: true,
        isVerified: false,
        addresses: {
          create: {
            isPrimary: true,
            address: {
              create: {
                street: validatedData.address.street,
                city: validatedData.address.city,
                state: validatedData.address.state,
                zipCode: validatedData.address.zipCode,
                country: validatedData.address.country,
              }
            }
          }
        }
      },
      include: {
        addresses: {
          include: {
            address: true
          }
        }
      }
    });

    // Create business hours
    const workingHours = validatedData.workingHours;
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    const businessHoursData = days.map((day, index) => ({
      businessId: business.id,
      dayOfWeek: index,
      openTime: workingHours[day as keyof typeof workingHours].open,
      closeTime: workingHours[day as keyof typeof workingHours].close,
      isClosed: !workingHours[day as keyof typeof workingHours].isOpen,
    }));

    await prisma.businessHours.createMany({
      data: businessHoursData
    });

    return NextResponse.json({
      message: "Business profile created successfully",
      business: {
        id: business.id,
        businessName: business.businessName,
        businessType: business.businessType,
      }
    });

  } catch (error) {
    console.error("Business creation error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data provided", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create business profile" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      include: {
        addresses: {
          include: {
            address: true
          }
        }
      }
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ business });

  } catch (error) {
    console.error("Business fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch business profile" },
      { status: 500 }
    );
  }
}
