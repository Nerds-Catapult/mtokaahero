import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Get current date and previous month for comparison
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch current month data
    const [
      currentBookings,
      currentRevenue,
      currentCustomers,
      totalBookings,
      totalRevenue,
      avgRating,
      completedBookings,
      totalCustomersCount,
    ] = await Promise.all([
      // Current month bookings count
      prisma.booking.count({
        where: {
          businessId,
          createdAt: { gte: currentMonthStart },
        },
      }),

      // Current month revenue
      prisma.booking.aggregate({
        where: {
          businessId,
          createdAt: { gte: currentMonthStart },
          status: 'COMPLETED',
        },
        _sum: { totalAmount: true },
      }),

      // Current month unique customers
      prisma.booking.findMany({
        where: {
          businessId,
          createdAt: { gte: currentMonthStart },
        },
        select: { customerId: true },
        distinct: ['customerId'],
      }),

      // Total bookings
      prisma.booking.count({
        where: { businessId },
      }),

      // Total revenue
      prisma.booking.aggregate({
        where: {
          businessId,
          status: 'COMPLETED',
        },
        _sum: { totalAmount: true },
      }),

      // Average rating
      prisma.review.aggregate({
        where: { businessId },
        _avg: { rating: true },
      }),

      // Completed bookings for completion rate
      prisma.booking.count({
        where: {
          businessId,
          status: 'COMPLETED',
        },
      }),

      // Total unique customers
      prisma.booking.findMany({
        where: { businessId },
        select: { customerId: true },
        distinct: ['customerId'],
      }),
    ]);

    // Fetch previous month data for comparison
    const [
      previousBookings,
      previousRevenue,
      previousCustomers,
    ] = await Promise.all([
      // Previous month bookings count
      prisma.booking.count({
        where: {
          businessId,
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
      }),

      // Previous month revenue
      prisma.booking.aggregate({
        where: {
          businessId,
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
          status: 'COMPLETED',
        },
        _sum: { totalAmount: true },
      }),

      // Previous month unique customers
      prisma.booking.findMany({
        where: {
          businessId,
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
        select: { customerId: true },
        distinct: ['customerId'],
      }),
    ]);

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number): string => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const change = ((current - previous) / previous) * 100;
      return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
    };

    // Calculate completion rate
    const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

    // Calculate average response time (mock data for now - you can implement actual tracking)
    const responseTime = 15; // minutes

    const stats = {
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalBookings,
      totalCustomers: totalCustomersCount.length,
      avgRating: avgRating._avg.rating || 0,
      completionRate,
      responseTime,
      revenueChange: calculateChange(
        currentRevenue._sum.totalAmount || 0,
        previousRevenue._sum.totalAmount || 0
      ),
      bookingsChange: calculateChange(currentBookings, previousBookings),
      customersChange: calculateChange(
        currentCustomers.length,
        previousCustomers.length
      ),
      ratingChange: '+0.1', // Mock data - you can calculate actual rating change
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error fetching business stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
