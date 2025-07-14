"use client";

import { CookieConsent, CookieManager } from '@/lib/cookies';
import { LocationData, LocationService } from '@/lib/location';
import { createContext, useContext, useEffect, useState } from 'react';

interface ConsentContextType {
  cookieConsent: CookieConsent | null;
  hasLocationPermission: boolean;
  currentLocation: LocationData | null;
  updateCookieConsent: (consent: Partial<CookieConsent>) => void;
  requestLocation: () => Promise<LocationData | null>;
  canUseAnalytics: boolean;
  canUseMarketing: boolean;
  canUseLocation: boolean;
}

const ConsentContext = createContext<ConsentContextType | null>(null);

interface ConsentProviderProps {
  children: React.ReactNode;
}

export function ConsentProvider({ children }: ConsentProviderProps) {
  const [cookieConsent, setCookieConsent] = useState<CookieConsent | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const cookieManager = CookieManager.getInstance();
  const locationService = LocationService.getInstance();

  useEffect(() => {
    // Initialize consent state
    const existingConsent = cookieManager.getConsent();
    setCookieConsent(existingConsent);

    // Listen for consent changes
    const handleConsentChange = (consent: CookieConsent) => {
      setCookieConsent(consent);
      
      // Handle location permission changes
      if (consent.location && !hasLocationPermission) {
        checkLocationPermission();
      } else if (!consent.location && hasLocationPermission) {
        setHasLocationPermission(false);
        setCurrentLocation(null);
        locationService.clearStoredLocation();
      }
    };

    cookieManager.addConsentListener(handleConsentChange);

    // Check initial location permission
    if (existingConsent?.location) {
      checkLocationPermission();
    }

    // Load existing location if available
    const existingLocation = locationService.getCurrentLocation();
    if (existingLocation) {
      setCurrentLocation(existingLocation);
    }

    return () => {
      cookieManager.removeConsentListener(handleConsentChange);
    };
  }, []);

  const checkLocationPermission = async () => {
    try {
      const permission = await locationService.checkPermission();
      setHasLocationPermission(permission.granted);
      
      if (permission.granted) {
        const location = locationService.getCurrentLocation();
        if (location) {
          setCurrentLocation(location);
        }
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
    }
  };

  const updateCookieConsent = (updates: Partial<CookieConsent>) => {
    cookieManager.updateConsent(updates);
  };

  const requestLocation = async (): Promise<LocationData | null> => {
    try {
      const location = await locationService.requestLocation();
      setCurrentLocation(location);
      setHasLocationPermission(true);
      return location;
    } catch (error) {
      console.error('Error requesting location:', error);
      setHasLocationPermission(false);
      return null;
    }
  };

  const value: ConsentContextType = {
    cookieConsent,
    hasLocationPermission,
    currentLocation,
    updateCookieConsent,
    requestLocation,
    canUseAnalytics: cookieConsent?.analytics ?? false,
    canUseMarketing: cookieConsent?.marketing ?? false,
    canUseLocation: cookieConsent?.location ?? false,
  };

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}
