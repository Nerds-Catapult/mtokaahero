'use server';
import { handleMissingArguments, handlePrismaErrors } from "@/middleware/erroHandler";
import prisma from "@/utils/prisma";

/**
 * Get a garage by its ID
 */
export async function getGarageById(garageId: string) {
  const missingArgs = await handleMissingArguments({ garageId });
  if (missingArgs) return missingArgs;

  try {
    const garage = await prisma.business.findUnique({
      where: { id: garageId },
      include: { services: true, reviews: true },
    });
    return garage;
  } catch (error) {
    return await handlePrismaErrors(error);
  }
}

/**
 * Get all garages
 */
export async function getAllGarages() {
  try {
    const garages = await prisma.business.findMany({
      where: { businessType: "GARAGE" },
    });
    return garages;
  } catch (error) {
    return await handlePrismaErrors(error);
  }
}

/**
 * Create a new garage
 */
export async function createGarage(data: any) {
  const missingArgs = await handleMissingArguments(data);
  if (missingArgs) return missingArgs;

  try {
    const garage = await prisma.business.create({
      data,
    });
    return garage;
  } catch (error) {
    return await handlePrismaErrors(error);
  }
}

/**
 * Update a garage by ID
 */
export async function updateGarage(garageId: string, data: any) {
  const missingArgs = await handleMissingArguments({ garageId, ...data });
  if (missingArgs) return missingArgs;

  try {
    const garage = await prisma.business.update({
      where: { id: garageId },
      data,
    });
    return garage;
  } catch (error) {
    return await handlePrismaErrors(error);
  }
}

/**
 * Delete a garage by ID
 */
export async function deleteGarage(garageId: string) {
  const missingArgs = await handleMissingArguments({ garageId });
  if (missingArgs) return missingArgs;

  try {
    await prisma.business.delete({
      where: { id: garageId },
    });
    return { message: "Garage deleted successfully" };
  } catch (error) {
    return await handlePrismaErrors(error);
  }
}
