"use server";
import { Prisma, PrismaClient } from "@/lib/generated/prisma";
import { ErrorResponse } from "@/types/errors";

export class ErrorHandlerService {
    constructor(private prisma: PrismaClient) {}

    /**
     * Handles Prisma-specific errors and converts them to standard error responses
     */
    static async handlePrismaErrors(error: any): Promise<ErrorResponse> {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2002': {
                    const target = (error.meta?.target as string[]) || [];
                    return {
                        statusCode: 409,
                        message: `Unique constraint failed on field(s): ${target.join(', ') || 'unknown'}`,
                        error: error.message,
                    };
                }
                case 'P2025':
                    return {
                        statusCode: 404,
                        message: 'Record not found',
                        error: error.message,
                    };
                case 'P2003':
                    return {
                        statusCode: 400,
                        message: 'Foreign key constraint failed',
                        error: error.message,
                    };
                case 'P2016':
                    return {
                        statusCode: 400,
                        message: 'Query interpretation error',
                        error: error.message,
                    };
                default:
                    return {
                        statusCode: 500,
                        message: `Database error occurred: ${error.code}`,
                        error: error.message,
                    };
            }
        } else if (error instanceof Prisma.PrismaClientValidationError) {
            return {
                statusCode: 400,
                message: 'Validation error',
                error: error.message,
            };
        } else if (error instanceof Prisma.PrismaClientInitializationError) {
            return {
                statusCode: 500,
                message: 'Database connection error',
                error: error.message,
            };
        } else {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            return {
                statusCode: 500,
                message: 'An unexpected error occurred',
                error: errorMessage,
            };
        }
    }

    /**
     * Validates that all required arguments are present
     */
    static async handleMissingArguments(args: Record<string, any>): Promise<ErrorResponse | null> {
        if (!args || Object.keys(args).length === 0) {
            return {
                statusCode: 400,
                message: 'Missing required arguments',
                error: 'No arguments provided',
            };
        }

        // Check each argument to ensure it's not null or undefined
        for (const [key, value] of Object.entries(args)) {
            if (value === undefined || value === null) {
                return {
                    statusCode: 400,
                    message: `Missing required argument: ${key}`,
                    error: `${key} is required but was not provided`,
                };
            }
        }

        return null;
    }

    /**
     * Creates a standard error response for entity not found
     */
    static async handleEntityNotFound(entityName: string, id: string): Promise<ErrorResponse> {
        return {
            statusCode: 404,
            message: `${entityName} with ID ${id} not found`,
            error: `${entityName} not found`,
        };
    }

    /**
     * Creates a standard error response for invalid data
     */
    static async handleInvalidData(message: string, details?: any): Promise<ErrorResponse> {
        return {
            statusCode: 400,
            message,
            error: details || message,
        };
    }

    /**
     * Creates a generic error response
     */
    static async createErrorResponse(message: string, statusCode: number = 400, error?: any): Promise<ErrorResponse> {
        return {
            statusCode,
            message,
            error: error || message,
        };
    }
}
