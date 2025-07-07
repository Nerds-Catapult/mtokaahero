'use server';
import { Business } from '@/lib/generated/prisma';
import { handlePrismaErrors, handleMissingArguments } from '@/middleware/erroHandler';
import prisma from '@/utils/prisma';
import { validateBusinessId } from '../truthProtocols';

// Define consistent response types
export type ServiceResponse<T> = {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code: number;
        details?: any;
    };
};

/**
 * Creates a standard success response
 */
export function createSuccessResponse<T>(data: T): ServiceResponse<T> {
    return {
        success: true,
        data,
    };
}

/**
 * Creates a standard error response
 */
export function createErrorResponse(message: string, code: number = 400, details?: any): ServiceResponse<any> {
    return {
        success: false,
        error: {
            message,
            code,
            details,
        },
    };
}

/**
 * Validates required arguments
 */
export function validateArgs(args: Record<string, any>): ServiceResponse<null> | null {
    for (const [key, value] of Object.entries(args)) {
        if (value === undefined || value === null) {
            return createErrorResponse(`Missing required argument: ${key}`, 400);
        }
    }
    return null;
}

/**
 * Creates a booking for a business
 */
export async function createBooking(businessId: string, bookingData: any): Promise<ServiceResponse<any>> {
    // Validate required arguments
    const validation = validateArgs({
        businessId,
        ...bookingData,
    });

    if (validation) return validation;

    try {
        // Validate business existence
        const businessValidation = await validateBusinessId(businessId);
        if (businessValidation instanceof Error) {
            return createErrorResponse('Business not found', 404);
        }

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                ...bookingData,
                businessId,
            },
        });

        return createSuccessResponse(booking);
    } catch (error) {
        const prismaError = await handlePrismaErrors(error);
        return createErrorResponse(
            prismaError.message || 'Failed to create booking',
            prismaError.statusCode || 500,
            prismaError.error,
        );
    }
}

/**
 * Gets businesses owned by a user
 */
export async function getMyBusinesses(userId: string): Promise<ServiceResponse<Business | null>> {
    // Validate required arguments
    const validation = validateArgs({ userId });
    if (validation) return validation;

    try {
        // Find business
        const business = await prisma.business.findUnique({
            where: { ownerId: userId },
            include: { services: true, reviews: true },
        });

        if (!business) {
            return createErrorResponse('No businesses found for this user', 404);
        }

        return createSuccessResponse(business);
    } catch (error) {
        const prismaError = await handlePrismaErrors(error);
        return createErrorResponse(
            prismaError.message || 'Failed to fetch businesses',
            prismaError.statusCode || 500,
            prismaError.error,
        );
    }
}

/**
 * Gets a business by ID with services and reviews
 */
export async function getBusinessById(businessId: string): Promise<ServiceResponse<Business | null>> {
    // Validate required arguments
    const validation = validateArgs({ businessId });
    if (validation) return validation;

    try {
        const business = await prisma.business.findUnique({
            where: { id: businessId },
            include: { services: true, reviews: true },
        });

        if (!business) {
            return createErrorResponse('Business not found', 404);
        }

        return createSuccessResponse(business);
    } catch (error) {
        const prismaError = await handlePrismaErrors(error);
        return createErrorResponse(
            prismaError.message || 'Failed to fetch business',
            prismaError.statusCode || 500,
            prismaError.error,
        );
    }
}

/**
 * Updates a business by ID
 */
export async function updateBusiness(businessId: string, data: any): Promise<ServiceResponse<Business | null>> {
    // Validate required arguments
    const validation = validateArgs({ businessId, ...data });
    if (validation) return validation;

    try {
        const business = await prisma.business.update({
            where: { id: businessId },
            data,
        });

        return createSuccessResponse(business);
    } catch (error) {
        const prismaError = await handlePrismaErrors(error);
        return createErrorResponse(
            prismaError.message || 'Failed to update business',
            prismaError.statusCode || 500,
            prismaError.error,
        );
    }
}

/**
 * Gets all bookings for a business
 */
export async function getBusinessBookings(businessId: string): Promise<ServiceResponse<any>> {
    // Validate required arguments
    const validation = validateArgs({ businessId });
    if (validation) return validation;

    try {
        const bookings = await prisma.booking.findMany({
            where: { businessId },
            include: {
                customer: {
                    include: { user: true },
                },
                service: true,
            },
        });

        return createSuccessResponse(bookings);
    } catch (error) {
        const prismaError = await handlePrismaErrors(error);
        return createErrorResponse(
            prismaError.message || 'Failed to fetch bookings',
            prismaError.statusCode || 500,
            prismaError.error,
        );
    }
}

/**
 * Updates a booking status
 */
export async function updateBookingStatus(bookingId: string, status: string): Promise<ServiceResponse<any>> {
    // Validate required arguments
    const validation = validateArgs({ bookingId, status });
    if (validation) return validation;

    try {
        const booking = await prisma.booking.update({
            where: { id: bookingId },
            data: { status: status as any },
        });

        return createSuccessResponse(booking);
    } catch (error) {
        const prismaError = await handlePrismaErrors(error);
        return createErrorResponse(
            prismaError.message || 'Failed to update booking status',
            prismaError.statusCode || 500,
            prismaError.error,
        );
    }
}

/**
 * Gets all services for a business
 */
export async function getBusinessServices(businessId: string): Promise<ServiceResponse<any>> {
    // Validate required arguments
    const validation = validateArgs({ businessId });
    if (validation) return validation;

    try {
        const services = await prisma.service.findMany({
            where: { businessId },
        });

        return createSuccessResponse(services);
    } catch (error) {
        const prismaError = await handlePrismaErrors(error);
        return createErrorResponse(
            prismaError.message || 'Failed to fetch services',
            prismaError.statusCode || 500,
            prismaError.error,
        );
    }
}
