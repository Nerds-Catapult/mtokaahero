import { ErrorHandlerService } from "@/middleware/erroHandler";
import prisma from "@/utils/prisma";
import { TruthProtocolService } from "../truthProtocols";
import { Business } from "@/lib/generated/prisma";
import { ErrorResponse } from "@/types/errors";

export class SharedFunctionsService {
  constructor() {}

  static async createBooking(businessId: string, bookingData: any) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments({
      businessId,
      ...bookingData,
    });
    if (missingArgs) return missingArgs;

    const businessValidation = await TruthProtocolService.validateBusinessid(
      businessId
    );
    if (businessValidation instanceof Error) {
      return { error: "Business not found", statusCode: 404 };
    }
    try {
      const booking = await prisma.booking.create({
        data: {
          ...bookingData,
          businessId,
        },
      });
      return booking;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }
  static async getMyBusinesses(
    userId: string
  ): Promise<Business[] | ErrorResponse> {
    const missingArgs = await ErrorHandlerService.handleMissingArguments({
      userId,
    });
    if (missingArgs)
      return { ...(missingArgs as unknown as ErrorResponse), statusCode: 400 };
    try {
      const businesses = await prisma.business.findMany({
        where: { ownerId: userId },
        include: { services: true, reviews: true },
      });

      if (!businesses || businesses.length === 0) {
        return { error: "No businesses found for this user", statusCode: 404 };
      }
      return businesses;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }
}
