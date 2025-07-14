"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { COOKIE_DESCRIPTIONS, CookieCategory, CookieManager, CookiePreferences } from '@/lib/cookies';
import {
    BarChart3,
    ChevronDown,
    ChevronUp,
    Cookie,
    MapPin,
    Settings,
    Shield,
    Target,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface CookieConsentBannerProps {
  onAcceptAll?: () => void;
  onRejectAll?: () => void;
  onCustomize?: () => void;
}

export function CookieConsentBanner({ onAcceptAll, onRejectAll, onCustomize }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    location: false
  });

  const cookieManager = CookieManager.getInstance();

  useEffect(() => {
    // Show banner if consent hasn't been given
    if (!cookieManager.hasConsent()) {
      setIsVisible(true);
    }
  }, [cookieManager]);

  const handleAcceptAll = () => {
    const allEnabled: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      location: true
    };
    
    cookieManager.setConsent(allEnabled);
    setIsVisible(false);
    onAcceptAll?.();
  };

  const handleRejectAll = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      location: false
    };
    
    cookieManager.setConsent(necessaryOnly);
    setIsVisible(false);
    onRejectAll?.();
  };

  const handleSavePreferences = () => {
    cookieManager.setConsent(preferences);
    setIsVisible(false);
    onCustomize?.();
  };

  const updatePreference = (category: CookieCategory, enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: category === 'necessary' ? true : enabled
    }));
  };

  const getCategoryIcon = (category: CookieCategory) => {
    switch (category) {
      case 'necessary':
        return <Shield className="h-4 w-4" />;
      case 'analytics':
        return <BarChart3 className="h-4 w-4" />;
      case 'marketing':
        return <Target className="h-4 w-4" />;
      case 'location':
        return <MapPin className="h-4 w-4" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
      <div className="container mx-auto p-4">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cookie className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Cookie Preferences</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRejectAll}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              We use cookies to enhance your experience, provide personalized content, and help us find the best services near you.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!showDetails ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Location Services</h4>
                      <p className="text-sm text-blue-700">
                        Allow location access to find nearby garages, mechanics, and spare parts shops for faster service.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full justify-between"
                >
                  <span className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Customize Cookie Settings
                  </span>
                  {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAcceptAll}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Accept All Cookies
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRejectAll}
                    className="flex-1"
                  >
                    Reject Non-Essential
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {(Object.keys(COOKIE_DESCRIPTIONS) as CookieCategory[]).map((category) => {
                  const desc = COOKIE_DESCRIPTIONS[category];
                  const isEnabled = preferences[category];
                  
                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getCategoryIcon(category)}
                          <div>
                            <Label className="text-sm font-medium flex items-center gap-2">
                              {desc.title}
                              {!desc.canDisable && (
                                <Badge variant="secondary" className="text-xs">Required</Badge>
                              )}
                            </Label>
                            <p className="text-xs text-gray-600">{desc.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(checked) => updatePreference(category, checked)}
                          disabled={!desc.canDisable}
                        />
                      </div>
                      
                      <div className="ml-7 text-xs text-gray-500">
                        <span className="font-medium">Examples: </span>
                        {desc.examples.join(', ')}
                      </div>
                      
                      {category !== 'location' && <Separator />}
                    </div>
                  );
                })}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={handleSavePreferences}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Save Preferences
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDetails(false)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
