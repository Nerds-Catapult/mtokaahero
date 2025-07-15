import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find the user's business
    const business = await prisma.business.findUnique({
      where: {
        ownerId: userId,
      },
      include: {
        addresses: {
          include: {
            address: true,
          },
        },
        analytics: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'No business found for this user' },
        { status: 404 }
      );
    }

    // Transform the data to match our Business interface
    const businessData = {
      id: business.id,
      businessName: business.businessName,
      businessType: business.businessType,
      description: business.description,
      logo: business.logo,
      coverImage: business.coverImage,
      isVerified: business.isVerified,
      isActive: business.isActive,
      rating: business.rating,
      totalReviews: business.totalReviews,
      yearsInBusiness: business.yearsInBusiness,
      createdAt: business.createdAt.toISOString(),
      updatedAt: business.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      business: businessData,
    });
  } catch (error) {
    console.error('Error fetching business data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
