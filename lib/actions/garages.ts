import { ErrorHandlerService } from "@/middleware/erroHandler";
import prisma from "@/utils/prisma";

export class GarageService {
  static async getGarageById(garageId: string) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments({ garageId });
    if (missingArgs) return missingArgs;

    try {
      const garage = await prisma.business.findUnique({
        where: { id: garageId },
        include: { services: true, reviews: true },
      });
      return garage;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async getAllGarages() {
    try {
      const garages = await prisma.business.findMany({
        where: { businessType: "GARAGE" },
      });
      return garages;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async createGarage(data: any) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments(data);
    if (missingArgs) return missingArgs;

    try {
      const garage = await prisma.business.create({
        data,
      });
      return garage;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async updateGarage(garageId: string, data: any) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments({ garageId, ...data });
    if (missingArgs) return missingArgs;

    try {
      const garage = await prisma.business.update({
        where: { id: garageId },
        data,
      });
      return garage;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async deleteGarage(garageId: string) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments({ garageId });
    if (missingArgs) return missingArgs;

    try {
      await prisma.business.delete({
        where: { id: garageId },
      });
      return { message: "Garage deleted successfully" };
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }
}
