'use server';

import { ProductStatus } from '@/lib/generated/prisma';
import { handlePrismaErrors } from '@/middleware/erroHandler';
import prisma from '@/utils/prisma';

// Define types for product operations
export type ProductResponse<T> = {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code: number;
        details?: any;
    };
};

export type ProductInput = {
    name: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    sku: string;
    barcode?: string;
    images?: string[];
    status?: ProductStatus;
    category: string;
    subcategory?: string;
    brand?: string;
    model?: string;
    year?: number;
    partNumber?: string;
    compatibility?: string[];
    stock: number;
    minStock?: number;
    weight?: number;
    dimensions?: any;
    warranty?: string;
    tags?: string[];
};

/**
 * Creates a standard success response
 */
export async function createSuccessResponse<T>(data: T): Promise<ProductResponse<T>> {
    return {
        success: true,
        data,
    };
}

/**
 * Creates a standard error response
 */
export async function createErrorResponse(
    message: string,
    code: number = 400,
    details?: any,
): Promise<ProductResponse<any>> {
    return {
        success: false,
        error: {
            message,
            code,
            details,
        },
    };
}

/**
 * Validates required arguments based on the operation type
 */
export async function validateArgs(args: Record<string, any>, operation?: string): Promise<ProductResponse<any> | null> {
    // Define required fields based on operation
    let requiredFields: string[] = [];
    
    if (operation === 'createProduct') {
        requiredFields = ['businessId', 'name', 'description', 'price', 'sku', 'category', 'stock'];
    } else if (operation === 'updateProduct') {
        requiredFields = ['productId', 'businessId'];
    } else if (operation === 'deleteProduct') {
        requiredFields = ['productId', 'businessId'];
    } else if (operation === 'updateStock') {
        requiredFields = ['productId', 'businessId', 'stock'];
    } else {
        // Default: just check for businessId
        requiredFields = ['businessId'];
    }

    for (const field of requiredFields) {
        const value = args[field];
        if (value === undefined || value === null || value === '') {
            console.log(`❌ Validation failed - Missing required field: ${field} (operation: ${operation || 'default'})`);
            return createErrorResponse(`Missing required argument: ${field}`, 400);
        }
    }
    
    console.log(`✅ Validation passed for operation: ${operation || 'default'}`);
    return null;
}

/**
 * Get all products for a business (inventory management)
 */
export async function getBusinessProducts(businessId: string): Promise<ProductResponse<any[]>> {
    console.log('📦 Fetching products for business:', businessId);
    
    const validation = await validateArgs({ businessId });
    if (validation) {
        console.log('❌ Validation failed for getBusinessProducts');
        return validation;
    }

    try {
        // First check if business exists
        const business = await prisma.business.findUnique({
            where: { id: businessId },
        });
        
        if (!business) {
            console.log('❌ Business not found:', businessId);
            return createErrorResponse('Business not found', 404);
        }
        
        console.log('✅ Business found:', business.businessName);

        const products = await prisma.product.findMany({
            where: { businessId },
            include: {
                business: {
                    select: {
                        businessName: true,
                        businessType: true,
                    },
                },
                _count: {
                    select: {
                        orderItems: true,
                        reviews: true,
                        favorites: true,
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        console.log(`📊 Found ${products.length} products`);
        return createSuccessResponse(products);
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        const prismaError = await handlePrismaErrors(error);
        return createErrorResponse(
            prismaError.message || 'Failed to fetch products',
            prismaError.statusCode || 500,
            prismaError.error,
        );
    }
}

/**
 * Create a new product
 */
export async function createProduct(businessId: string, productData: ProductInput): Promise<ProductResponse<any>> {
    console.log('🔧 Creating product...');

    const validation = await validateArgs({ businessId, ...productData }, 'createProduct');
    if (validation) {
        console.log('❌ Validation failed');
        return validation;
    }

    try {
        // First, check if the business exists
        const business = await prisma.business.findUnique({
            where: { id: businessId },
        });

        if (!business) {
            console.log('📝 Setting up test business...');

            // Create a test user first
            let testUser;
            try {
                testUser = await prisma.user.findUnique({
                    where: { email: 'test@spareparts.com' },
                });

                if (!testUser) {
                    testUser = await prisma.user.create({
                        data: {
                            email: 'test@spareparts.com',
                            password: 'hashed_password', // In production, this should be properly hashed
                            firstName: 'Test',
                            lastName: 'Owner',
                            role: 'SPAREPARTS_SHOP',
                            isVerified: true,
                        },
                    });
                }
            } catch (userError) {
                console.error('❌ Error with test user:', userError);
                return createErrorResponse('Failed to setup test environment', 500);
            }

            // Create a test business
            try {
                await prisma.business.create({
                    data: {
                        id: businessId,
                        ownerId: testUser.id,
                        businessName: 'Test Spare Parts Shop',
                        businessType: 'SPAREPARTS_SHOP',
                        description: 'A test spare parts shop for development',
                        isVerified: true,
                        isActive: true,
                    },
                });
                console.log('✅ Test business created');
            } catch (businessError) {
                console.error('❌ Error creating test business:', businessError);
                return createErrorResponse('Failed to create test business', 500);
            }
        }

        // Check if SKU already exists
        const existingSku = await prisma.product.findUnique({
            where: { sku: productData.sku },
        });

        if (existingSku) {
            return createErrorResponse('A product with this SKU already exists', 409);
        }

        const product = await prisma.product.create({
            data: {
                businessId,
                ...productData,
                images: productData.images || [],
                compatibility: productData.compatibility || [],
                tags: productData.tags || [],
                status: productData.status || ProductStatus.AVAILABLE,
                minStock: productData.minStock || 0,
            },
            include: {
                business: {
                    select: {
                        businessName: true,
                        businessType: true,
                    },
                },
                _count: {
                    select: {
                        orderItems: true,
                        reviews: true,
                        favorites: true,
                    },
                },
            },
        });

        console.log('✅ Product created successfully');
        return createSuccessResponse(product);
    } catch (error) {
        console.error('❌ Error in createProduct:', error);
        const prismaError = await handlePrismaErrors(error);
        return createErrorResponse(
            prismaError.message || 'Failed to create product',
            prismaError.statusCode || 500,
            prismaError.error,
        );
    }
}

/**
 * Update a product
 */
export async function updateProduct(
    productId: string,
    businessId: string,
    productData: Partial<ProductInput>,
): Promise<ProductResponse<any>> {
    const validation = await validateArgs({ productId, businessId }, 'updateProduct');
    if (validation) return validation;

    try {
        // Verify the product belongs to the business
        const existingProduct = await prisma.product.findFirst({
            where: {
                id: productId,
                businessId,
            },
        });

        if (!existingProduct) {
            return createErrorResponse('Product not found or access denied', 404);
        }

        // Check SKU uniqueness if it's being updated
        if (productData.sku && productData.sku !== existingProduct.sku) {
            const existingSku = await prisma.product.findUnique({
                where: { sku: productData.sku },
            });

            if (existingSku) {
                return createErrorResponse('A product with this SKU already exists', 409);
            }
        }

        const product = await prisma.product.update({
            where: { id: productId },
            data: productData,
            include: {
                business: {
                    select: {
                        businessName: true,
                        businessType: true,
                    },
                },
                _count: {
                    select: {
                        orderItems: true,
                        reviews: true,
                        favorites: true,
                    },
                },
            },
        });

        return createSuccessResponse(product);
    } catch (error) {
        const prismaError = await handlePrismaErrors(error);
        return createErrorResponse(
            prismaError.message || 'Failed to update product',
            prismaError.statusCode || 500,
            prismaError.error,
        );
    }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string, businessId: string): Promise<ProductResponse<any>> {
    const validation = await validateArgs({ productId, businessId }, 'deleteProduct');
    if (validation) return validation;

    try {
        // Verify the product belongs to the business
        const existingProduct = await prisma.product.findFirst({
            where: {
                id: productId,
                businessId,
            },
        });

        if (!existingProduct) {
            return createErrorResponse('Product not found or access denied', 404);
        }

        await prisma.product.delete({
            where: { id: productId },
        });

        return createSuccessResponse({ id: productId });
    } catch (error) {
        const prismaError = await handlePrismaErrors(error);
        return createErrorResponse(
            prismaError.message || 'Failed to delete product',
            prismaError.statusCode || 500,
            prismaError.error,
        );
    }
}

/**
 * Update product stock
 */
export async function updateProductStock(
    productId: string,
    businessId: string,
    stock: number,
): Promise<ProductResponse<any>> {
    const validation = await validateArgs({ productId, businessId, stock }, 'updateStock');
    if (validation) return validation;

    try {
        // Verify the product belongs to the business
        const existingProduct = await prisma.product.findFirst({
            where: {
                id: productId,
                businessId,
            },
        });

        if (!existingProduct) {
            return createErrorResponse('Product not found or access denied', 404);
        }

        // Determine status based on stock level
        let status = existingProduct.status;
        if (stock === 0) {
            status = ProductStatus.OUT_OF_STOCK;
        } else if (status === ProductStatus.OUT_OF_STOCK && stock > 0) {
            status = ProductStatus.AVAILABLE;
        }

        const product = await prisma.product.update({
            where: { id: productId },
            data: {
                stock,
                status,
            },
            include: {
                business: {
                    select: {
                        businessName: true,
                        businessType: true,
                    },
                },
                _count: {
                    select: {
                        orderItems: true,
                        reviews: true,
                        favorites: true,
                    },
                },
            },
        });

        return createSuccessResponse(product);
    } catch (error) {
        const prismaError = await handlePrismaErrors(error);
        return createErrorResponse(
            prismaError.message || 'Failed to update product stock',
            prismaError.statusCode || 500,
            prismaError.error,
        );
    }
}

/**
 * Get low stock products for a business
 */
export async function getLowStockProducts(businessId: string): Promise<ProductResponse<any[]>> {
    console.log('⚠️ Fetching low stock products for:', businessId);
    
    const validation = await validateArgs({ businessId });
    if (validation) return validation;

    try {
        // Check if business exists first
        const business = await prisma.business.findUnique({
            where: { id: businessId },
        });
        
        if (!business) {
            console.log('❌ Business not found for low stock check');
            return createSuccessResponse([]); // Return empty array if business doesn't exist
        }

        const products = await prisma.product.findMany({
            where: {
                businessId,
                OR: [
                    {
                        stock: {
                            lte: prisma.product.fields.minStock,
                        },
                    },
                    {
                        status: ProductStatus.OUT_OF_STOCK,
                    },
                ],
            },
            include: {
                business: {
                    select: {
                        businessName: true,
                        businessType: true,
                    },
                },
            },
            orderBy: {
                stock: 'asc',
            },
        });

        console.log(`⚠️ Found ${products.length} low stock products`);
        return createSuccessResponse(products);
    } catch (error) {
        console.error('❌ Error fetching low stock products:', error);
        const prismaError = await handlePrismaErrors(error);
        return createErrorResponse(
            prismaError.message || 'Failed to fetch low stock products',
            prismaError.statusCode || 500,
            prismaError.error,
        );
    }
}

/**
 * Get product analytics for a business
 */
export async function getProductAnalytics(businessId: string): Promise<ProductResponse<any>> {
    console.log('📈 Fetching analytics for:', businessId);
    
    const validation = await validateArgs({ businessId });
    if (validation) return validation;

    try {
        // Check if business exists first
        const business = await prisma.business.findUnique({
            where: { id: businessId },
        });
        
        if (!business) {
            console.log('❌ Business not found for analytics');
            // Return default analytics if business doesn't exist
            return createSuccessResponse({
                totalProducts: 0,
                lowStockCount: 0,
                outOfStockCount: 0,
                availableCount: 0,
                totalInventoryValue: 0,
            });
        }

        const [totalProducts, lowStockCount, outOfStockCount] = await Promise.all([
            prisma.product.count({
                where: { businessId },
            }),
            prisma.product.count({
                where: {
                    businessId,
                    stock: {
                        lte: prisma.product.fields.minStock,
                    },
                    status: {
                        not: ProductStatus.OUT_OF_STOCK,
                    },
                },
            }),
            prisma.product.count({
                where: {
                    businessId,
                    status: ProductStatus.OUT_OF_STOCK,
                },
            }),
        ]);

        // Calculate total inventory value
        const products = await prisma.product.findMany({
            where: { businessId },
            select: { price: true, stock: true },
        });
        
        const totalInventoryValue = products.reduce((total, product) => {
            return total + (product.price * product.stock);
        }, 0);

        const analytics = {
            totalProducts,
            lowStockCount,
            outOfStockCount,
            availableCount: totalProducts - outOfStockCount,
            totalInventoryValue,
        };

        console.log('📊 Analytics result:', analytics);
        return createSuccessResponse(analytics);
    } catch (error) {
        console.error('❌ Error fetching analytics:', error);
        const prismaError = await handlePrismaErrors(error);
        return createErrorResponse(
            prismaError.message || 'Failed to fetch product analytics',
            prismaError.statusCode || 500,
            prismaError.error,
        );
    }
}
