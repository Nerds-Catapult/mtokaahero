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
}
