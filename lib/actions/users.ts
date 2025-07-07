'use server';

import { handleMissingArguments, handlePrismaErrors } from "@/middleware/erroHandler";
import prisma from "@/utils/prisma";

/**
 * Get a user by their ID
 */
export async function getUserById(userId: string) {
  const missingArgs = await handleMissingArguments({ userId });
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

/**
 * Get all users with optional role filter
 */
export async function getAllUsers(role: string) {
  const missingArgs = await handleMissingArguments({ role });
  if (missingArgs) return missingArgs;

  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

/**
 * Create a new user
 */
export async function createUser(data: any) {
  const missingArgs = await handleMissingArguments(data);
  if (missingArgs) return missingArgs;

  try {
    const user = await prisma.user.create({
      data,
    });
    return user;
  } catch (error) {
    return await handlePrismaErrors(error);
  }
}

/**
 * Update a user by ID
 */
export async function updateUser(userId: string, data: any) {
  const missingArgs = await handleMissingArguments({ userId, ...data });
  if (missingArgs) return missingArgs;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });
    return user;
  } catch (error) {
    return await handlePrismaErrors(error);
  }
}

/**
 * Delete a user by ID
 */
export async function deleteUser(userId: string) {
  const missingArgs = await handleMissingArguments({ userId });
  if (missingArgs) return missingArgs;

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return { message: "User deleted successfully" };
  } catch (error) {
    return await handlePrismaErrors(error);
  }
}

/**
 * Get a user's profile by ID
 */
export async function getUserProfile(userId: string) {
  const missingArgs = await handleMissingArguments({ userId });
  if (missingArgs) return missingArgs;

  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });
    return profile;
  } catch (error) {
    return await handlePrismaErrors(error);
  }
}
