import prisma from "@/utils/prisma";
import { ErrorHandlerService } from "@/middleware/erroHandler";
import { ErrorResponse } from "@/types/errors";
import { Business } from "../generated/prisma";


export class TruthProtocolService {
    static async validateBusinessid(businessId: string): Promise<Business | ErrorResponse> {
        const missingArgs = await ErrorHandlerService.handleMissingArguments({ businessId });
        if (missingArgs) return { ...missingArgs } as unknown as ErrorResponse;

        try {
            const business = await prisma.business.findUnique({
                where: { id: businessId },
            });
            if (!business) {
                return { error: "Business not found" };
            }
            return business;
        } catch (error) {
            return await ErrorHandlerService.handlePrismaErrors(error);
        }
    }
}