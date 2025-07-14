import { LocationData } from './location';

export interface ServiceLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state?: string;
  type: 'garage' | 'mechanic' | 'parts';
  rating: number;
  reviews: number;
  services: string[];
  priceRange: string;
  isOpen?: boolean;
  distance?: number;
}

export interface NearbyServicesOptions {
  maxDistance?: number; // in kilometers
  limit?: number;
  serviceType?: 'garage' | 'mechanic' | 'parts';
  sortBy?: 'distance' | 'rating' | 'reviews';
}

export class ProximityService {
  private static instance: ProximityService;

  static getInstance(): ProximityService {
    if (!ProximityService.instance) {
      ProximityService.instance = new ProximityService();
    }
    return ProximityService.instance;
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
      Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  findNearbyServices(
    userLocation: LocationData,
    services: ServiceLocation[],
    options: NearbyServicesOptions = {}
  ): ServiceLocation[] {
    const {
      maxDistance = 50, // 50km default
      limit = 20,
      serviceType,
      sortBy = 'distance'
    } = options;

    // Filter by service type if specified
    const filteredServices = serviceType 
      ? services.filter(service => service.type === serviceType)
      : services;

    // Calculate distances and filter by max distance
    const servicesWithDistance = filteredServices
      .map(service => ({
        ...service,
        distance: this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          service.latitude,
          service.longitude
        )
      }))
      .filter(service => service.distance <= maxDistance);

    // Sort by specified criteria
    servicesWithDistance.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return a.distance - b.distance;
      }
    });

    // Apply limit
    return servicesWithDistance.slice(0, limit);
  }

  formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  }

  getEstimatedTravelTime(distance: number, mode: 'driving' | 'walking' = 'driving'): string {
    const speed = mode === 'driving' ? 40 : 5; // km/h
    const timeInHours = distance / speed;
    const timeInMinutes = Math.round(timeInHours * 60);
    
    if (timeInMinutes < 60) {
      return `${timeInMinutes} min`;
    }
    
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  groupServicesByDistance(services: ServiceLocation[]): {
    nearby: ServiceLocation[];      // < 5km
    moderate: ServiceLocation[];    // 5-15km
    far: ServiceLocation[];         // 15-50km
  } {
    return services.reduce(
      (groups, service) => {
        const distance = service.distance || 0;
        if (distance < 5) {
          groups.nearby.push(service);
        } else if (distance < 15) {
          groups.moderate.push(service);
        } else {
          groups.far.push(service);
        }
        return groups;
      },
      { nearby: [], moderate: [], far: [] } as {
        nearby: ServiceLocation[];
        moderate: ServiceLocation[];
        far: ServiceLocation[];
      }
    );
  }

  getServiceDensity(userLocation: LocationData, services: ServiceLocation[], radius: number = 10): {
    totalServices: number;
    servicesByType: Record<string, number>;
    averageDistance: number;
  } {
    const nearbyServices = this.findNearbyServices(userLocation, services, { maxDistance: radius });
    
    const servicesByType = nearbyServices.reduce((acc, service) => {
      acc[service.type] = (acc[service.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageDistance = nearbyServices.length > 0
      ? nearbyServices.reduce((sum, service) => sum + (service.distance || 0), 0) / nearbyServices.length
      : 0;

    return {
      totalServices: nearbyServices.length,
      servicesByType,
      averageDistance
    };
  }

  // Mock data for testing - replace with real API calls
  getMockServices(): ServiceLocation[] {
    return [
      {
        id: '1',
        name: 'Downtown Auto Repair',
        latitude: -1.2921,
        longitude: 36.8219,
        address: '123 Kenyatta Avenue, Nairobi',
        city: 'Nairobi',
        state: 'Nairobi County',
        type: 'garage',
        rating: 4.5,
        reviews: 128,
        services: ['Oil Change', 'Brake Repair', 'Engine Diagnostics'],
        priceRange: '50-200',
        isOpen: true
      },
      {
        id: '2',
        name: 'Mobile Mechanic Joe',
        latitude: -1.3031,
        longitude: 36.8331,
        address: 'Westlands, Nairobi',
        city: 'Nairobi',
        state: 'Nairobi County',
        type: 'mechanic',
        rating: 4.8,
        reviews: 89,
        services: ['Mobile Repair', 'Emergency Service', 'Tire Change'],
        priceRange: '30-150',
        isOpen: true
      },
      {
        id: '3',
        name: 'Auto Parts Plus',
        latitude: -1.2864,
        longitude: 36.8172,
        address: 'Industrial Area, Nairobi',
        city: 'Nairobi',
        state: 'Nairobi County',
        type: 'parts',
        rating: 4.2,
        reviews: 156,
        services: ['Spare Parts', 'Accessories', 'Delivery'],
        priceRange: '10-500',
        isOpen: true
      }
    ];
  }
}
