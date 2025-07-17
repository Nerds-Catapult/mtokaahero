import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface BusinessStats {
  totalRevenue: number;
  totalBookings: number;
  totalCustomers: number;
  avgRating: number;
  completionRate: number;
  responseTime: number;
  revenueChange: string;
  bookingsChange: string;
  customersChange: string;
  ratingChange: string;
}

export interface ChartDataPoint {
  month: string;
  revenue?: number;
  bookings?: number;
  value?: number;
}

export interface BusinessChartData {
  revenue: ChartDataPoint[];
  bookings: ChartDataPoint[];
}

export interface Business {
  id: string;
  businessName: string;
  businessType: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  yearsInBusiness: number | null;
  createdAt: string;
  updatedAt: string;
}

interface BusinessState {
  // Current business data
  business: Business | null;
  
  // Business stats
  stats: BusinessStats | null;
  
  // Chart data
  chartData: BusinessChartData | null;
  
  // Loading states
  isLoadingBusiness: boolean;
  isLoadingStats: boolean;
  isLoadingChartData: boolean;
  
  // Error states
  businessError: string | null;
  statsError: string | null;
  chartDataError: string | null;
  
  // Last fetch times
  lastBusinessFetch: number | null;
  lastStatsFetch: number | null;
  lastChartDataFetch: number | null;
  
  // Actions
  setBusinessData: (business: Business) => void;
  setStats: (stats: BusinessStats) => void;
  setChartData: (chartData: BusinessChartData) => void;
  setLoadingBusiness: (loading: boolean) => void;
  setLoadingStats: (loading: boolean) => void;
  setLoadingChartData: (loading: boolean) => void;
  setBusinessError: (error: string | null) => void;
  setStatsError: (error: string | null) => void;
  setChartDataError: (error: string | null) => void;
  
  // Async actions
  fetchBusinessData: (userId: string) => Promise<void>;
  fetchStats: (businessId: string) => Promise<void>;
  fetchChartData: (businessId: string) => Promise<void>;
  refreshData: (userId: string) => Promise<void>;
  
  // Clear functions
  clearBusiness: () => void;
  clearStats: () => void;
  clearChartData: () => void;
  clearAll: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useBusinessStore = create<BusinessState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        business: null,
        stats: null,
        chartData: null,
        isLoadingBusiness: false,
        isLoadingStats: false,
        isLoadingChartData: false,
        businessError: null,
        statsError: null,
        chartDataError: null,
        lastBusinessFetch: null,
        lastStatsFetch: null,
        lastChartDataFetch: null,

        // Setters
        setBusinessData: (business) => set({ business, lastBusinessFetch: Date.now() }),
        setStats: (stats) => set({ stats, lastStatsFetch: Date.now() }),
        setChartData: (chartData) => set({ chartData, lastChartDataFetch: Date.now() }),
        setLoadingBusiness: (isLoadingBusiness) => set({ isLoadingBusiness }),
        setLoadingStats: (isLoadingStats) => set({ isLoadingStats }),
        setLoadingChartData: (isLoadingChartData) => set({ isLoadingChartData }),
        setBusinessError: (businessError) => set({ businessError }),
        setStatsError: (statsError) => set({ statsError }),
        setChartDataError: (chartDataError) => set({ chartDataError }),

        // Async actions
        fetchBusinessData: async (userId: string) => {
          const state = get();
          
          // Check cache
          if (state.business && state.lastBusinessFetch && 
              Date.now() - state.lastBusinessFetch < CACHE_DURATION) {
            return;
          }

          set({ isLoadingBusiness: true, businessError: null });

          try {
            const response = await fetch(`/api/business/my-business?userId=${userId}`);
            
            if (!response.ok) {
              throw new Error('Failed to fetch business data');
            }

            const data = await response.json();
            set({ 
              business: data.business, 
              lastBusinessFetch: Date.now(),
              isLoadingBusiness: false 
            });

            // Auto-fetch stats if we have business data
            if (data.business?.id) {
              get().fetchStats(data.business.id);
              get().fetchChartData(data.business.id);
            }
          } catch (error) {
            set({ 
              businessError: error instanceof Error ? error.message : 'Unknown error',
              isLoadingBusiness: false 
            });
          }
        },

        fetchStats: async (businessId: string) => {
          const state = get();
          
          // Check cache
          if (state.stats && state.lastStatsFetch && 
              Date.now() - state.lastStatsFetch < CACHE_DURATION) {
            return;
          }

          set({ isLoadingStats: true, statsError: null });

          try {
            const response = await fetch(`/api/business/stats?businessId=${businessId}`);
            
            if (!response.ok) {
              throw new Error('Failed to fetch business stats');
            }

            const data = await response.json();
            set({ 
              stats: data.stats, 
              lastStatsFetch: Date.now(),
              isLoadingStats: false 
            });
          } catch (error) {
            set({ 
              statsError: error instanceof Error ? error.message : 'Unknown error',
              isLoadingStats: false 
            });
          }
        },

        fetchChartData: async (businessId: string) => {
          const state = get();
          
          // Check cache
          if (state.chartData && state.lastChartDataFetch && 
              Date.now() - state.lastChartDataFetch < CACHE_DURATION) {
            return;
          }

          set({ isLoadingChartData: true, chartDataError: null });

          try {
            const response = await fetch(`/api/business/chart-data?businessId=${businessId}`);
            
            if (!response.ok) {
              throw new Error('Failed to fetch chart data');
            }

            const data = await response.json();
            set({ 
              chartData: data.chartData, 
              lastChartDataFetch: Date.now(),
              isLoadingChartData: false 
            });
          } catch (error) {
            set({ 
              chartDataError: error instanceof Error ? error.message : 'Unknown error',
              isLoadingChartData: false 
            });
          }
        },

        refreshData: async (userId: string) => {
          // Clear cache and force refresh
          set({ 
            lastBusinessFetch: null, 
            lastStatsFetch: null,
            businessError: null,
            statsError: null
          });
          
          await get().fetchBusinessData(userId);
        },

        // Clear functions
        clearBusiness: () => set({ 
          business: null, 
          lastBusinessFetch: null, 
          businessError: null,
          isLoadingBusiness: false 
        }),
        
        clearStats: () => set({ 
          stats: null, 
          lastStatsFetch: null, 
          statsError: null,
          isLoadingStats: false 
        }),
        
        clearChartData: () => set({ 
          chartData: null, 
          lastChartDataFetch: null, 
          chartDataError: null,
          isLoadingChartData: false 
        }),
        
        clearAll: () => set({
          business: null,
          stats: null,
          chartData: null,
          isLoadingBusiness: false,
          isLoadingStats: false,
          isLoadingChartData: false,
          businessError: null,
          statsError: null,
          chartDataError: null,
          lastBusinessFetch: null,
          lastStatsFetch: null,
          lastChartDataFetch: null,
        }),
      }),
      {
        name: 'business-store',
        partialize: (state) => ({
          business: state.business,
          stats: state.stats,
          chartData: state.chartData,
          lastBusinessFetch: state.lastBusinessFetch,
          lastStatsFetch: state.lastStatsFetch,
          lastChartDataFetch: state.lastChartDataFetch,
        }),
      }
    ),
    {
      name: 'business-store',
    }
  )
);
