export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
}

export interface LocationPermission {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
}

export class LocationService {
  private static instance: LocationService;
  private currentLocation: LocationData | null = null;
  private watchId: number | null = null;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async checkPermission(): Promise<LocationPermission> {
    if (!navigator.geolocation) {
      return { granted: false, denied: true, prompt: false };
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return {
        granted: permission.state === 'granted',
        denied: permission.state === 'denied',
        prompt: permission.state === 'prompt'
      };
    } catch (error) {
      console.warn('Permission query not supported:', error);
      return { granted: false, denied: false, prompt: true };
    }
  }

  async requestLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          // Try to get address details using reverse geocoding
          try {
            const address = await this.reverseGeocode(locationData.latitude, locationData.longitude);
            Object.assign(locationData, address);
          } catch (error) {
            console.warn('Reverse geocoding failed:', error);
          }

          this.currentLocation = locationData;
          this.saveLocationToStorage(locationData);
          resolve(locationData);
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  async reverseGeocode(lat: number, lng: number): Promise<Partial<LocationData>> {
    try {
      // Using a free geocoding service (you might want to replace with your preferred service)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();
      return {
        city: data.city || data.locality,
        state: data.principalSubdivision,
        country: data.countryName,
        address: data.display_name || `${data.city}, ${data.principalSubdivision}`
      };
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return {};
    }
  }

  startWatchingLocation(callback: (location: LocationData) => void): void {
    if (!navigator.geolocation) return;

    const options = {
      enableHighAccuracy: false,
      timeout: 30000,
      maximumAge: 600000 // 10 minutes
    };

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        try {
          const address = await this.reverseGeocode(locationData.latitude, locationData.longitude);
          Object.assign(locationData, address);
        } catch (error) {
          console.warn('Reverse geocoding failed in watch:', error);
        }

        this.currentLocation = locationData;
        this.saveLocationToStorage(locationData);
        callback(locationData);
      },
      (error) => {
        console.warn('Location watching error:', error);
      },
      options
    );
  }

  stopWatchingLocation(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  getCurrentLocation(): LocationData | null {
    if (!this.currentLocation) {
      this.currentLocation = this.loadLocationFromStorage();
    }
    return this.currentLocation;
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
    return R * c; // Distance in kilometers
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private saveLocationToStorage(location: LocationData): void {
    try {
      localStorage.setItem('mtokaa_user_location', JSON.stringify({
        ...location,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to save location to storage:', error);
    }
  }

  private loadLocationFromStorage(): LocationData | null {
    try {
      const stored = localStorage.getItem('mtokaa_user_location');
      if (!stored) return null;

      const data = JSON.parse(stored);
      const isExpired = Date.now() - data.timestamp > 3600000; // 1 hour

      if (isExpired) {
        localStorage.removeItem('mtokaa_user_location');
        return null;
      }

      const { timestamp, ...location } = data;
      return location;
    } catch (error) {
      console.warn('Failed to load location from storage:', error);
      return null;
    }
  }

  clearStoredLocation(): void {
    try {
      localStorage.removeItem('mtokaa_user_location');
      this.currentLocation = null;
    } catch (error) {
      console.warn('Failed to clear stored location:', error);
    }
  }
}
