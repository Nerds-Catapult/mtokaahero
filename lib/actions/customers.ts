import { ErrorHandlerService } from "@/middleware/erroHandler";
import prisma from "@/utils/prisma";

export class CustomerService {
  static async getCustomerById(customerId: string) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments({ customerId });
    if (missingArgs) return missingArgs;

    try {
      const customer = await prisma.customer.findUnique({
        where: { userId: customerId },
        include: { vehicles: true },
      });
      return customer;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async getAllCustomers() {
    try {
      const customers = await prisma.customer.findMany({
        include: { user: true },
      });
      return customers;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async createCustomer(data: any) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments(data);
    if (missingArgs) return missingArgs;

    try {
      const customer = await prisma.customer.create({
        data,
      });
      return customer;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async updateCustomer(customerId: string, data: any) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments({ customerId, ...data });
    if (missingArgs) return missingArgs;

    try {
      const customer = await prisma.customer.update({
        where: { userId: customerId },
        data,
      });
      return customer;
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }

  static async deleteCustomer(customerId: string) {
    const missingArgs = await ErrorHandlerService.handleMissingArguments({ customerId });
    if (missingArgs) return missingArgs;

    try {
      await prisma.customer.delete({
        where: { userId: customerId },
      });
      return { message: "Customer deleted successfully" };
    } catch (error) {
      return await ErrorHandlerService.handlePrismaErrors(error);
    }
  }
}
