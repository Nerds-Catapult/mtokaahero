"use server";
import { Prisma, PrismaClient } from "@/lib/generated/prisma";
import { ErrorResponse } from "@/types/errors";

export class ErrorHandlerService {
  constructor(private prisma: PrismaClient) {}

  static async handlePrismaErrors(error: any): Promise<ErrorResponse> {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return {
            statusCode: 409,
            message: "Unique constraint failed",
            error: error.message,
          };
        case "P2025":
          return {
            statusCode: 404,
            message: "Record not found",
            error: error.message,
          };
        default:
          return {
            statusCode: 500,
            message: "Database error occurred",
            error: error.message,
          };
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      return {
        statusCode: 400,
        message: "Validation error",
        error: error.message,
      };
    } else {
      return {
        statusCode: 500,
        message: "An unexpected error occurred",
        error: error.message,
      };
    }
  }

  static async handleMissingArguments(args: any) {
    if (!args || Object.keys(args).length === 0) {
      return { status: 400, message: "Missing required arguments" };
    }
    return null;
  }

  static async handleEntityNotFound(entityName: string, id: string) {
    return { status: 404, message: `${entityName} with ID ${id} not found` };
  }

  static async handleInvalidData(message: string) {
    return { status: 400, message };
  }
}
