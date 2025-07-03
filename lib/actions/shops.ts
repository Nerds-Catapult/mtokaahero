import { ErrorHandlerService } from "@/middleware/erroHandler";
import prisma from "@/utils/prisma";

export class ShopService {
  static async getShopById(shopId: string) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments({
      shopId,
    });
    if (missingArgs) return missingArgs;

    try {
      const shop = await prisma.business.findUnique({
        where: { id: shopId },
        include: { products: true, reviews: true },
      });
      return shop;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async getAllShops() {
    try {
      const shops = await prisma.business.findMany({
        where: { businessType: "SPAREPARTS_SHOP" },
      });
      return shops;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async createShop(data: any) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments(data);
    if (missingArgs) return missingArgs;

    try {
      const shop = await prisma.business.create({
        data,
      });
      return shop;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async updateShop(shopId: string, data: any) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments({
      shopId,
      ...data,
    });
    if (missingArgs) return missingArgs;

    try {
      const shop = await prisma.business.update({
        where: { id: shopId },
        data,
      });
      return shop;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async deleteShop(shopId: string) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments({
      shopId,
    });
    if (missingArgs) return missingArgs;

    try {
      await prisma.business.delete({
        where: { id: shopId },
      });
      return { message: "Shop deleted successfully" };
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }
}
