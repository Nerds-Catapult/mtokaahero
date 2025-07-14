import { Prisma } from "@/lib/generated/prisma";
import { z } from "zod";

export type AuthError = {
  message: string;
  code: string;
  statusCode: number;
  field?: string;
};

/**
 * Handles authentication-related errors and converts them to user-friendly messages
 */
export function handleAuthError(error: any): AuthError {
  console.error("Auth Error:", error);

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const firstError = error.errors[0];
    return {
      message: firstError.message,
      code: "VALIDATION_ERROR",
      statusCode: 400,
      field: firstError.path.join("."),
    };
  }

  // Handle Prisma constraint errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        // Unique constraint violation
        const target = error.meta?.target as string[] | undefined;
        const field = target?.[0] || "field";
        
        let message = "This information is already in use";
        if (field === "email") {
          message = "An account with this email address already exists";
        } else if (field === "phone") {
          message = "An account with this phone number already exists";
        }
        
        return {
          message,
          code: "DUPLICATE_FIELD",
          statusCode: 409,
          field,
        };
      }
      
      case "P2025": {
        // Record not found
        return {
          message: "User not found",
          code: "USER_NOT_FOUND",
          statusCode: 404,
        };
      }
      
      case "P2003": {
        // Foreign key constraint violation
        return {
          message: "Invalid reference data provided",
          code: "INVALID_REFERENCE",
          statusCode: 400,
        };
      }
      
      default: {
        return {
          message: "Database operation failed",
          code: "DATABASE_ERROR",
          statusCode: 500,
        };
      }
    }
  }

  // Handle bcrypt errors
  if (error.message?.includes("bcrypt")) {
    return {
      message: "Password processing failed",
      code: "PASSWORD_ERROR",
      statusCode: 500,
    };
  }

  // Handle network/connection errors
  if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
    return {
      message: "Service temporarily unavailable",
      code: "SERVICE_UNAVAILABLE",
      statusCode: 503,
    };
  }

  // Handle authentication-specific errors
  if (error.message?.includes("Invalid credentials") || error.message?.includes("password")) {
    return {
      message: "Invalid email or password",
      code: "INVALID_CREDENTIALS",
      statusCode: 401,
    };
  }

  // Default fallback
  return {
    message: "An unexpected error occurred. Please try again.",
    code: "INTERNAL_ERROR",
    statusCode: 500,
  };
}

/**
 * Common authentication validation schemas
 */
export const authSchemas = {
  signup: z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    firstName: z.string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters"),
    lastName: z.string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters"),
    phone: z.string()
      .optional()
      .refine((val) => !val || /^\+?[\d\s\-\(\)]+$/.test(val), "Please enter a valid phone number"),
    role: z.enum(["CUSTOMER", "FREELANCE_MECHANIC", "GARAGE_OWNER", "SPAREPARTS_SHOP", "ADMIN"]).optional(),
  }),

  signin: z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
  }),

  resetPassword: z.object({
    email: z.string().email("Please enter a valid email address"),
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
};

/**
 * Validates user input and returns formatted errors
 */
export function validateAuthInput<T>(schema: z.ZodSchema<T>, data: any): { success: true; data: T } | { success: false; error: AuthError } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    return { success: false, error: handleAuthError(error) };
  }
}
