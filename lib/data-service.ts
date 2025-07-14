import prisma from '@/utils/prisma';

// Use Prisma generated types with includes
type ServiceWithBusiness = Awaited<ReturnType<typeof prisma.service.findMany>>[0] & {
  business: Awaited<ReturnType<typeof prisma.business.findUnique>>;
};

type ProductWithBusiness = Awaited<ReturnType<typeof prisma.product.findMany>>[0] & {
  business: Awaited<ReturnType<typeof prisma.business.findUnique>>;
};

type BusinessWithLocation = Awaited<ReturnType<typeof prisma.business.findMany>>[0] & {
  addresses: any[];
  services: any[];
  products: any[];
};

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getFeaturedServices(limit: number = 6, userLat?: number, userLon?: number): Promise<ServiceWithBusiness[]> {
  try {
    const services = await prisma.service.findMany({
      where: {
        status: 'AVAILABLE',
        business: {
          isActive: true,
          isVerified: true,
        },
      },
      include: {
        business: {
          include: {
            addresses: {
              include: {
                address: true,
              },
            },
          },
        },
      },
      orderBy: [
        { business: { rating: 'desc' } },
        { business: { totalReviews: 'desc' } },
      ],
      take: limit * 2, // Get more to filter by location
    });

    // If user location is provided, sort by distance
    if (userLat && userLon) {
      const servicesWithDistance = services
        .map(service => {
          const primaryAddress = service.business.addresses.find(addr => addr.isPrimary)?.address ||
                                service.business.addresses[0]?.address;
          
          if (!primaryAddress?.latitude || !primaryAddress?.longitude) {
            return { service, distance: Infinity };
          }

          const distance = calculateDistance(
            userLat,
            userLon,
            primaryAddress.latitude,
            primaryAddress.longitude
          );

          return { service, distance };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit)
        .map(item => item.service);

      return servicesWithDistance;
    }

    return services.slice(0, limit);
  } catch (error) {
    console.error('Error fetching featured services:', error);
    return [];
  }
}

export async function getFeaturedProducts(limit: number = 6, userLat?: number, userLon?: number): Promise<ProductWithBusiness[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'AVAILABLE',
        stock: { gt: 0 },
        business: {
          isActive: true,
          isVerified: true,
        },
      },
      include: {
        business: {
          include: {
            addresses: {
              include: {
                address: true,
              },
            },
          },
        },
      },
      orderBy: [
        { business: { rating: 'desc' } },
        { business: { totalReviews: 'desc' } },
      ],
      take: limit * 2,
    });

    // If user location is provided, sort by distance
    if (userLat && userLon) {
      const productsWithDistance = products
        .map(product => {
          const primaryAddress = product.business.addresses.find(addr => addr.isPrimary)?.address ||
                                product.business.addresses[0]?.address;
          
          if (!primaryAddress?.latitude || !primaryAddress?.longitude) {
            return { product, distance: Infinity };
          }

          const distance = calculateDistance(
            userLat,
            userLon,
            primaryAddress.latitude,
            primaryAddress.longitude
          );

          return { product, distance };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit)
        .map(item => item.product);

      return productsWithDistance;
    }

    return products.slice(0, limit);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function getFeaturedBusinesses(limit: number = 6, userLat?: number, userLon?: number): Promise<BusinessWithLocation[]> {
  try {
    const businesses = await prisma.business.findMany({
      where: {
        isActive: true,
        isVerified: true,
      },
      include: {
        addresses: {
          include: {
            address: true,
          },
        },
        services: {
          where: { status: 'AVAILABLE' },
          take: 5,
          select: {
            id: true,
            title: true,
            price: true,
            category: true,
          },
        },
        products: {
          where: { 
            status: 'AVAILABLE',
            stock: { gt: 0 },
          },
          take: 5,
          select: {
            id: true,
            name: true,
            price: true,
            category: true,
          },
        },
      },
      orderBy: [
        { rating: 'desc' },
        { totalReviews: 'desc' },
      ],
      take: limit * 2,
    });

    // If user location is provided, sort by distance
    if (userLat && userLon) {
      const businessesWithDistance = businesses
        .map(business => {
          const primaryAddress = business.addresses.find(addr => addr.isPrimary)?.address ||
                                business.addresses[0]?.address;
          
          if (!primaryAddress?.latitude || !primaryAddress?.longitude) {
            return { business, distance: Infinity };
          }

          const distance = calculateDistance(
            userLat,
            userLon,
            primaryAddress.latitude,
            primaryAddress.longitude
          );

          return { business, distance };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit)
        .map(item => item.business);

      return businessesWithDistance;
    }

    return businesses.slice(0, limit);
  } catch (error) {
    console.error('Error fetching featured businesses:', error);
    return [];
  }
}

export async function searchServices(query: string, category?: string, userLat?: number, userLon?: number): Promise<ServiceWithBusiness[]> {
  try {
    const whereCondition: any = {
      status: 'AVAILABLE',
      business: {
        isActive: true,
      },
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ],
    };

    if (category) {
      whereCondition.category = { contains: category, mode: 'insensitive' };
    }

    const services = await prisma.service.findMany({
      where: whereCondition,
      include: {
        business: {
          include: {
            addresses: {
              include: {
                address: true,
              },
            },
          },
        },
      },
      orderBy: [
        { business: { rating: 'desc' } },
      ],
    });

    // Sort by distance if location provided
    if (userLat && userLon) {
      return services
        .map(service => {
          const primaryAddress = service.business.addresses.find(addr => addr.isPrimary)?.address ||
                                service.business.addresses[0]?.address;
          
          if (!primaryAddress?.latitude || !primaryAddress?.longitude) {
            return { service, distance: Infinity };
          }

          const distance = calculateDistance(
            userLat,
            userLon,
            primaryAddress.latitude,
            primaryAddress.longitude
          );

          return { service, distance };
        })
        .sort((a, b) => a.distance - b.distance)
        .map(item => item.service);
    }

    return services;
  } catch (error) {
    console.error('Error searching services:', error);
    return [];
  }
}
