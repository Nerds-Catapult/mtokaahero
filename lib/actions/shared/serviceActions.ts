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
}
