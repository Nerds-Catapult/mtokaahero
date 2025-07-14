export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  location: boolean;
  timestamp: number;
  version: string;
}

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  location: boolean;
}

export type CookieCategory = keyof CookiePreferences;

export const COOKIE_CONSENT_VERSION = '1.0';
export const COOKIE_CONSENT_KEY = 'mtokaa_cookie_consent';

export const COOKIE_DESCRIPTIONS = {
  necessary: {
    title: 'Strictly Necessary Cookies',
    description: 'These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.',
    examples: ['Authentication tokens', 'Session management', 'Security preferences'],
    canDisable: false
  },
  analytics: {
    title: 'Analytics Cookies',
    description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
    examples: ['Page views', 'User behavior', 'Performance metrics'],
    canDisable: true
  },
  marketing: {
    title: 'Marketing Cookies',
    description: 'These cookies are used to deliver advertisements more relevant to you and your interests.',
    examples: ['Ad personalization', 'Conversion tracking', 'Social media integration'],
    canDisable: true
  },
  location: {
    title: 'Location Cookies',
    description: 'These cookies help us provide location-based services such as finding nearby garages and mechanics.',
    examples: ['Geolocation data', 'Preferred locations', 'Distance calculations'],
    canDisable: true
  }
};

export class CookieManager {
  private static instance: CookieManager;
  private consent: CookieConsent | null = null;
  private listeners: Array<(consent: CookieConsent) => void> = [];

  static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager();
    }
    return CookieManager.instance;
  }

  constructor() {
    this.loadConsent();
  }

  hasConsent(): boolean {
    return this.consent !== null;
  }

  getConsent(): CookieConsent | null {
    return this.consent;
  }

  hasCategory(category: CookieCategory): boolean {
    if (!this.consent) return false;
    return this.consent[category];
  }

  setConsent(preferences: CookiePreferences): void {
    const consent: CookieConsent = {
      ...preferences,
      necessary: true, // Always true
      timestamp: Date.now(),
      version: COOKIE_CONSENT_VERSION
    };

    this.consent = consent;
    this.saveConsent(consent);
    this.notifyListeners(consent);
  }

  updateConsent(updates: Partial<CookiePreferences>): void {
    if (!this.consent) return;

    const updatedConsent: CookieConsent = {
      ...this.consent,
      ...updates,
      necessary: true, // Always true
      timestamp: Date.now()
    };

    this.consent = updatedConsent;
    this.saveConsent(updatedConsent);
    this.notifyListeners(updatedConsent);
  }

  revokeConsent(): void {
    if (this.consent) {
      this.setConsent({
        necessary: true,
        analytics: false,
        marketing: false,
        location: false
      });
    }
  }

  addConsentListener(listener: (consent: CookieConsent) => void): void {
    this.listeners.push(listener);
  }

  removeConsentListener(listener: (consent: CookieConsent) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private loadConsent(): void {
    try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return;
        }

        const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!stored) return;

        const consent = JSON.parse(stored) as CookieConsent;

        // Check if consent is still valid (version match and not too old)
        const isValidVersion = consent.version === COOKIE_CONSENT_VERSION;
        const isNotExpired = Date.now() - consent.timestamp < 365 * 24 * 60 * 60 * 1000; // 1 year

        if (isValidVersion && isNotExpired) {
            this.consent = consent;
        } else {
            // Clear invalid consent
            this.clearConsent();
        }
    } catch (error) {
      console.warn('Failed to load cookie consent:', error);
      this.clearConsent();
    }
  }

  private saveConsent(consent: CookieConsent): void {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
          return;
      }
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    } catch (error) {
      console.error('Failed to save cookie consent:', error);
    }
  }

  private clearConsent(): void {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
          return;
      }
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      this.consent = null;
    } catch (error) {
      console.warn('Failed to clear cookie consent:', error);
    }
  }

  private notifyListeners(consent: CookieConsent): void {
    this.listeners.forEach(listener => {
      try {
        listener(consent);
      } catch (error) {
        console.error('Error in consent listener:', error);
      }
    });
  }

  // Utility methods for analytics and marketing
  canTrackAnalytics(): boolean {
    return this.hasCategory('analytics');
  }

  canShowMarketing(): boolean {
    return this.hasCategory('marketing');
  }

  canUseLocation(): boolean {
    return this.hasCategory('location');
  }

  // GDPR compliance methods
  exportData(): object {
    return {
      consent: this.consent,
      stored_data: {
        cookies: this.getAllCookies(),
        localStorage: this.getLocalStorageData()
      }
    };
  }

  private getAllCookies(): Record<string, string> {
    const cookies: Record<string, string> = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name) {
        cookies[name] = value || '';
      }
    });
    return cookies;
  }

  private getLocalStorageData(): Record<string, string> {
    const data: Record<string, string> = {};
    try {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return data;
        }

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                data[key] = localStorage.getItem(key) || '';
            }
        }
    } catch (error) {
        console.warn('Failed to get localStorage data:', error);
    }
    return data;
  }
}
