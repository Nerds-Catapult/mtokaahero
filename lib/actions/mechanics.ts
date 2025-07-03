import { ErrorHandlerService } from "@/middleware/erroHandler";
import prisma from "@/utils/prisma";

export class MechanicService {
  static async getMechanicById(mechanicId: string) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments({
      mechanicId,
    });
    if (missingArgs) return missingArgs;

    try {
      const mechanic = await prisma.business.findUnique({
        where: { id: mechanicId },
        include: { services: true, reviews: true },
      });
      return mechanic;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async getAllMechanics() {
    try {
      const mechanics = await prisma.business.findMany({
        where: { businessType: "FREELANCE_MECHANIC" },
      });
      return mechanics;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async createMechanic(data: any) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments(data);
    if (missingArgs) return missingArgs;

    try {
      const mechanic = await prisma.business.create({
        data,
      });
      return mechanic;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async updateMechanic(mechanicId: string, data: any) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments({
      mechanicId,
      ...data,
    });
    if (missingArgs) return missingArgs;

    try {
      const mechanic = await prisma.business.update({
        where: { id: mechanicId },
        data,
      });
      return mechanic;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async deleteMechanic(mechanicId: string) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments({
      mechanicId,
    });
    if (missingArgs) return missingArgs;

    try {
      await prisma.business.delete({
        where: { id: mechanicId },
      });
      return { message: "Mechanic deleted successfully" };
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }
}
