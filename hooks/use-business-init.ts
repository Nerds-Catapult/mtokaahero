import { useAuth } from '@/hooks/use-auth';
import { useBusinessStore } from '@/lib/stores/business-store';
import { useEffect } from 'react';

/**
 * Hook to automatically fetch business data when user logs in
 * Should be used in the main app layout or dashboard
 */
export function useBusinessInit() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { fetchBusinessData, clearAll, business } = useBusinessStore();

  useEffect(() => {
    if (isAuthenticated && user?.id && !business && !isLoading) {
      // Only fetch if we don't already have business data
      fetchBusinessData(user.id);
    } else if (!isAuthenticated && !isLoading) {
      // Clear business data when user logs out
      clearAll();
    }
  }, [isAuthenticated, user?.id, fetchBusinessData, clearAll, business, isLoading]);

  return {
    isBusinessLoaded: !!business,
    userId: user?.id,
  };
}
