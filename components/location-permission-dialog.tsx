"use client";

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CookieManager } from '@/lib/cookies';
import { LocationData, LocationPermission, LocationService } from '@/lib/location';
import {
    AlertTriangle,
    CheckCircle,
    Info,
    MapPin,
    Navigation,
    RefreshCw,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface LocationPermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationGranted?: (location: LocationData) => void;
  onLocationDenied?: () => void;
}

export function LocationPermissionDialog({ 
  isOpen, 
  onClose, 
  onLocationGranted, 
  onLocationDenied 
}: LocationPermissionDialogProps) {
  const [permission, setPermission] = useState<LocationPermission>({ granted: false, denied: false, prompt: true });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);

  const locationService = LocationService.getInstance();
  const cookieManager = CookieManager.getInstance();

  useEffect(() => {
    if (isOpen) {
      checkPermissionStatus();
    }
  }, [isOpen]);

  const checkPermissionStatus = async () => {
    try {
      const permissionStatus = await locationService.checkPermission();
      setPermission(permissionStatus);
      
      // If already granted, try to get current location
      if (permissionStatus.granted) {
        const existingLocation = locationService.getCurrentLocation();
        if (existingLocation) {
          setCurrentLocation(existingLocation);
        }
      }
    } catch (error) {
      console.error('Error checking permission:', error);
    }
  };

  const handleRequestLocation = async () => {
    setIsLoading(true);
    setError('');

    try {
      // First ensure location cookies are allowed
      if (!cookieManager.canUseLocation()) {
        cookieManager.updateConsent({ location: true });
      }

      const location = await locationService.requestLocation();
      setCurrentLocation(location);
      setPermission({ granted: true, denied: false, prompt: false });
      onLocationGranted?.(location);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setError(errorMessage);
      setPermission({ granted: false, denied: true, prompt: false });
      onLocationDenied?.();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDenyLocation = () => {
    setPermission({ granted: false, denied: true, prompt: false });
    onLocationDenied?.();
    onClose();
  };

  const handleRetry = () => {
    setError('');
    setPermission({ granted: false, denied: false, prompt: true });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Location Access</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Find the closest garages and mechanics near you
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Benefits Section */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
              <Navigation className="h-4 w-4 mr-2" />
              Why we need your location
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                Find nearby garages and mechanics
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                Show accurate distances and travel times
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                Get faster emergency assistance
              </li>
            </ul>
          </div>

          {/* Current Status */}
          {permission.granted && currentLocation && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>Location access granted</span>
                  <Badge variant="secondary" className="text-xs">
                    {currentLocation.city || 'Unknown City'}
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {permission.denied && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Location access was denied. You can still use the service by manually entering your location.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="h-7 text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Try Again
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Privacy Notice */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-gray-600 mt-0.5" />
              <div className="text-xs text-gray-600">
                <p className="font-medium mb-1">Privacy Notice</p>
                <p>
                  Your location data is stored locally on your device and used only to find nearby services. 
                  We do not share this information with third parties.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {permission.prompt && !permission.denied && (
              <Button
                onClick={handleRequestLocation}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Allow Location Access
                  </>
                )}
              </Button>
            )}

            {permission.granted && currentLocation && (
              <Button
                onClick={onClose}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Continue with Location
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleDenyLocation}
              className="w-full"
            >
              Continue Without Location
            </Button>
          </div>

          {/* Manual Location Option */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              You can also manually enter your location in the search bar
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
