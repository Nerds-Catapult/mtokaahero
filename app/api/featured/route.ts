import prisma from '@/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/featured - Get featured services and businesses
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '6');
    const userLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
    const userLon = searchParams.get('lon') ? parseFloat(searchParams.get('lon')!) : undefined;
    const type = searchParams.get('type') || 'all'; // 'services', 'products', 'businesses', 'all'

    const result: any = {};

    // Get featured services
    if (type === 'services' || type === 'all') {
      const services = await prisma.service.findMany({
        where: {
          status: 'AVAILABLE',
          business: {
            isActive: true,
            isVerified: true,
          },
        },
        include: {
          business: {
            include: {
              addresses: {
                include: {
                  address: true,
                },
              },
            },
          },
        },
        orderBy: [
          { business: { rating: 'desc' } },
          { business: { totalReviews: 'desc' } },
        ],
        take: limit,
      });

      result.services = services;
    }

    // Get featured products
    if (type === 'products' || type === 'all') {
      const products = await prisma.product.findMany({
        where: {
          status: 'AVAILABLE',
          stock: { gt: 0 },
          business: {
            isActive: true,
            isVerified: true,
          },
        },
        include: {
          business: {
            include: {
              addresses: {
                include: {
                  address: true,
                },
              },
            },
          },
        },
        orderBy: [
          { business: { rating: 'desc' } },
          { business: { totalReviews: 'desc' } },
        ],
        take: limit,
      });

      result.products = products;
    }

    // Get featured businesses
    if (type === 'businesses' || type === 'all') {
      const businesses = await prisma.business.findMany({
        where: {
          isActive: true,
          isVerified: true,
        },
        include: {
          addresses: {
            include: {
              address: true,
            },
          },
          services: {
            where: { status: 'AVAILABLE' },
            take: 3,
            select: {
              id: true,
              title: true,
              price: true,
              category: true,
            },
          },
          products: {
            where: { 
              status: 'AVAILABLE',
              stock: { gt: 0 },
            },
            take: 3,
            select: {
              id: true,
              name: true,
              price: true,
              category: true,
            },
          },
        },
        orderBy: [
          { rating: 'desc' },
          { totalReviews: 'desc' },
        ],
        take: limit,
      });

      result.businesses = businesses;
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching featured items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured items' },
      { status: 500 }
    );
  }
}
