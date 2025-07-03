'use server';

import { Prisma, PrismaClient } from "@/lib/generated/prisma";


export class ErrorHandlerService {
    constructor(private prisma: PrismaClient) { }
    
    static async handlePrismaErrors(error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2002':
                    return { status: 409, message: 'Unique constraint failed' };
                case 'P2025':
                    return { status: 404, message: 'Record not found' };
                default:
                    return { status: 500, message: 'Database error occurred' };
            }
        } else if (error instanceof Prisma.PrismaClientValidationError) {
            return { status: 400, message: 'Validation error' };
        } else {
            return { status: 500, message: 'An unexpected error occurred' };
        }
    }


    static async handleMissingArguments(args: any) {
        if (!args || Object.keys(args).length === 0) {
            return { status: 400, message: 'Missing required arguments' };
        }
        return null;
    }
}