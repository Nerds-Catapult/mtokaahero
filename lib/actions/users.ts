'use server';

import prisma from "@/utils/prisma";
import { ErrorHandlerService } from "@/middleware/erroHandler";


export class UserService {
    constructor(
  ) {}

    static async getUserById(userId: string) {
      const missingArgs = await ErrorHandlerService.handleMissingArguments({ userId });
      if (missingArgs) return missingArgs;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

    static async getAllUsers(role: string) {
      const missingArgs = await ErrorHandlerService.handleMissingArguments({ role });
      if (missingArgs) return missingArgs;
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

    static async createUser(data: any) {
      const missingArgs = await ErrorHandlerService.handleMissingArguments(data);
      if (missingArgs) return missingArgs;

      try {
        const user = await prisma.user.create({
          data,
        });
        return user;
      } catch (error) {
        return await ErrorHandlerService.handlePrismaErrors(error);
      }
    }

    static async updateUser(userId: string, data: any) {
      const missingArgs = await ErrorHandlerService.handleMissingArguments({ userId, ...data });
      if (missingArgs) return missingArgs;

      try {
        const user = await prisma.user.update({
          where: { id: userId },
          data,
        });
        return user;
      } catch (error) {
        return await ErrorHandlerService.handlePrismaErrors(error);
      }
    }

    static async deleteUser(userId: string) {
      const missingArgs = await ErrorHandlerService.handleMissingArguments({ userId });
      if (missingArgs) return missingArgs;

      try {
        await prisma.user.delete({
          where: { id: userId },
        });
        return { message: "User deleted successfully" };
      } catch (error) {
        return await ErrorHandlerService.handlePrismaErrors(error);
      }
    }

    static async getUserProfile(userId: string) {
      const missingArgs = await ErrorHandlerService.handleMissingArguments({ userId });
      if (missingArgs) return missingArgs;

      try {
        const profile = await prisma.userProfile.findUnique({
          where: { userId },
        });
        return profile;
      } catch (error) {
        return await ErrorHandlerService.handlePrismaErrors(error);
      }
    }
}
