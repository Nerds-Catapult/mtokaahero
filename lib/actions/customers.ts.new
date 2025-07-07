'use server';
import { handleMissingArguments, handlePrismaErrors } from "@/middleware/erroHandler";
import prisma from "@/utils/prisma";

/**
 * Get a customer by their ID
 */
export async function getCustomerById(customerId: string) {
  const missingArgs = await handleMissingArguments({ customerId });
  if (missingArgs) return missingArgs;

  try {
    const customer = await prisma.customer.findUnique({
      where: { userId: customerId },
      include: { vehicles: true },
    });
    return customer;
  } catch (error) {
    return await handlePrismaErrors(error);
  }
}

/**
 * Get all customers
 */
export async function getAllCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      include: { user: true },
    });
    return customers;
  } catch (error) {
    return await handlePrismaErrors(error);
  }
}

/**
 * Create a new customer
 */
export async function createCustomer(data: any) {
  const missingArgs = await handleMissingArguments(data);
  if (missingArgs) return missingArgs;

  try {
    const customer = await prisma.customer.create({
      data,
    });
    return customer;
  } catch (error) {
    return await handlePrismaErrors(error);
  }
}

/**
 * Update a customer by ID
 */
export async function updateCustomer(customerId: string, data: any) {
  const missingArgs = await handleMissingArguments({ customerId, ...data });
  if (missingArgs) return missingArgs;

  try {
    const customer = await prisma.customer.update({
      where: { userId: customerId },
      data,
    });
    return customer;
  } catch (error) {
    return await handlePrismaErrors(error);
  }
}

/**
 * Delete a customer by ID
 */
export async function deleteCustomer(customerId: string) {
  const missingArgs = await handleMissingArguments({ customerId });
  if (missingArgs) return missingArgs;

  try {
    await prisma.customer.delete({
      where: { userId: customerId },
    });
    return { message: "Customer deleted successfully" };
  } catch (error) {
    return await handlePrismaErrors(error);
  }
}
