'use server';
import { handleMissingArguments, handlePrismaErrors } from '@/middleware/erroHandler';
import { ErrorResponse } from '@/types/errors';
import prisma from '@/utils/prisma';
import { Business } from '../generated/prisma';

/**
 * Validates that a business exists with the given ID
 */
export async function validateBusinessId(businessId: string): Promise<Business | ErrorResponse> {
    const missingArgs = await handleMissingArguments({ businessId });
    if (missingArgs) return { ...missingArgs } as unknown as ErrorResponse;

    try {
        const business = await prisma.business.findUnique({
            where: { id: businessId },
        });
        if (!business) {
            return { error: 'Business not found' };
        }
        return business;
    } catch (error) {
        return await handlePrismaErrors(error);
    }
}
