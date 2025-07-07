import { ErrorHandlerService } from "@/middleware/erroHandler";
import prisma from "@/utils/prisma";
import { TruthProtocolService } from "../truthProtocols";

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
  static async getMyBusinesses(userId: string) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments({
      userId,
    });
    if (missingArgs) return missingArgs;
    try {
      const businesses = await prisma.business.findMany({
        where: { ownerId: userId },
        include: { services: true, reviews: true },
      });
      return businesses;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }
}
