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

export interface RecentBooking {
  id: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  price?: number;
}

export interface BusinessPerformance {
  customerSatisfaction: number;
  responseTime: string;
  completionRate: number;
  repeatCustomers: number;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'vip';
    totalBookings: number;
    totalSpent: number;
    rating: number;
    lastVisit: string;
    vehicles?: Array<{
        id: string;
        year: number;
        make: string;
        model: string;
        vin: string;
    }>;
}

export interface CustomerStats {
    total: number;
    active: number;
    totalSpent: number;
    avgRating: number;
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

    // Recent bookings
    recentBookings: RecentBooking[];

    // Business performance metrics
    performanceMetrics: BusinessPerformance | null;

    // Customers data
    customers: Customer[];
    customerStats: CustomerStats | null;

    // Loading states
    isLoadingBusiness: boolean;
    isLoadingStats: boolean;
    isLoadingChartData: boolean;
    isLoadingBookings: boolean;
    isLoadingPerformance: boolean;
    isLoadingCustomers: boolean;

    // Error states
    businessError: string | null;
    statsError: string | null;
    chartDataError: string | null;
    bookingsError: string | null;
    performanceError: string | null;
    customersError: string | null;

    // Last fetch times
    lastBusinessFetch: number | null;
    lastStatsFetch: number | null;
    lastChartDataFetch: number | null;
    lastBookingsFetch: number | null;
    lastPerformanceFetch: number | null;
    lastCustomersFetch: number | null;

    // Actions
    setBusinessData: (business: Business) => void;
    setStats: (stats: BusinessStats) => void;
    setChartData: (chartData: BusinessChartData) => void;
    setRecentBookings: (bookings: RecentBooking[]) => void;
    setPerformanceMetrics: (performance: BusinessPerformance) => void;
    setCustomers: (customers: Customer[]) => void;
    setCustomerStats: (stats: CustomerStats) => void;
    setLoadingBusiness: (loading: boolean) => void;
    setLoadingStats: (loading: boolean) => void;
    setLoadingChartData: (loading: boolean) => void;
    setLoadingBookings: (loading: boolean) => void;
    setLoadingPerformance: (loading: boolean) => void;
    setLoadingCustomers: (loading: boolean) => void;
    setBusinessError: (error: string | null) => void;
    setStatsError: (error: string | null) => void;
    setChartDataError: (error: string | null) => void;
    setBookingsError: (error: string | null) => void;
    setPerformanceError: (error: string | null) => void;
    setCustomersError: (error: string | null) => void;

    // Async actions
    fetchBusinessData: (userId: string) => Promise<void>;
    fetchStats: (businessId: string) => Promise<void>;
    fetchChartData: (businessId: string) => Promise<void>;
    fetchRecentBookings: (businessId: string) => Promise<void>;
    fetchPerformanceMetrics: (businessId: string) => Promise<void>;
    fetchCustomers: (businessId: string) => Promise<void>;
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
                recentBookings: [],
                performanceMetrics: null,
                customers: [],
                customerStats: null,
                isLoadingBusiness: false,
                isLoadingStats: false,
                isLoadingChartData: false,
                isLoadingBookings: false,
                isLoadingPerformance: false,
                isLoadingCustomers: false,
                businessError: null,
                statsError: null,
                chartDataError: null,
                bookingsError: null,
                performanceError: null,
                customersError: null,
                lastBusinessFetch: null,
                lastStatsFetch: null,
                lastChartDataFetch: null,
                lastBookingsFetch: null,
                lastPerformanceFetch: null,
                lastCustomersFetch: null,

                // Setters
                setBusinessData: business => set({ business, lastBusinessFetch: Date.now() }),
                setStats: stats => set({ stats, lastStatsFetch: Date.now() }),
                setChartData: chartData => set({ chartData, lastChartDataFetch: Date.now() }),
                setRecentBookings: recentBookings => set({ recentBookings, lastBookingsFetch: Date.now() }),
                setPerformanceMetrics: performanceMetrics =>
                    set({ performanceMetrics, lastPerformanceFetch: Date.now() }),
                setCustomers: customers => set({ customers, lastCustomersFetch: Date.now() }),
                setCustomerStats: customerStats => set({ customerStats }),
                setLoadingBusiness: isLoadingBusiness => set({ isLoadingBusiness }),
                setLoadingStats: isLoadingStats => set({ isLoadingStats }),
                setLoadingChartData: isLoadingChartData => set({ isLoadingChartData }),
                setLoadingBookings: isLoadingBookings => set({ isLoadingBookings }),
                setLoadingPerformance: isLoadingPerformance => set({ isLoadingPerformance }),
                setLoadingCustomers: isLoadingCustomers => set({ isLoadingCustomers }),
                setBusinessError: businessError => set({ businessError }),
                setStatsError: statsError => set({ statsError }),
                setChartDataError: chartDataError => set({ chartDataError }),
                setBookingsError: bookingsError => set({ bookingsError }),
                setPerformanceError: performanceError => set({ performanceError }),
                setCustomersError: customersError => set({ customersError }),

                // Async actions
                fetchBusinessData: async (userId: string) => {
                    const state = get();

                    // Check cache
                    if (
                        state.business &&
                        state.lastBusinessFetch &&
                        Date.now() - state.lastBusinessFetch < CACHE_DURATION
                    ) {
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
                            isLoadingBusiness: false,
                        });

                        // Auto-fetch stats if we have business data
                        if (data.business?.id) {
                            get().fetchStats(data.business.id);
                            get().fetchChartData(data.business.id);
                            get().fetchRecentBookings(data.business.id);
                            get().fetchPerformanceMetrics(data.business.id);
                            get().fetchCustomers(data.business.id);
                        }
                    } catch (error) {
                        set({
                            businessError: error instanceof Error ? error.message : 'Unknown error',
                            isLoadingBusiness: false,
                        });
                    }
                },

                fetchStats: async (businessId: string) => {
                    const state = get();

                    // Check cache
                    if (state.stats && state.lastStatsFetch && Date.now() - state.lastStatsFetch < CACHE_DURATION) {
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
                            isLoadingStats: false,
                        });
                    } catch (error) {
                        set({
                            statsError: error instanceof Error ? error.message : 'Unknown error',
                            isLoadingStats: false,
                        });
                    }
                },

                fetchChartData: async (businessId: string) => {
                    const state = get();

                    // Check cache
                    if (
                        state.chartData &&
                        state.lastChartDataFetch &&
                        Date.now() - state.lastChartDataFetch < CACHE_DURATION
                    ) {
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
                            isLoadingChartData: false,
                        });
                    } catch (error) {
                        set({
                            chartDataError: error instanceof Error ? error.message : 'Unknown error',
                            isLoadingChartData: false,
                        });
                    }
                },

                fetchRecentBookings: async (businessId: string) => {
                    const state = get();

                    // Check cache
                    if (
                        state.recentBookings.length > 0 &&
                        state.lastBookingsFetch &&
                        Date.now() - state.lastBookingsFetch < CACHE_DURATION
                    ) {
                        return;
                    }

                    set({ isLoadingBookings: true, bookingsError: null });

                    try {
                        const response = await fetch(`/api/business/bookings?businessId=${businessId}&limit=5`);

                        if (!response.ok) {
                            throw new Error('Failed to fetch recent bookings');
                        }

                        const data = await response.json();
                        set({
                            recentBookings: data.bookings,
                            lastBookingsFetch: Date.now(),
                            isLoadingBookings: false,
                        });
                    } catch (error) {
                        set({
                            bookingsError: error instanceof Error ? error.message : 'Unknown error',
                            isLoadingBookings: false,
                        });
                    }
                },

                fetchPerformanceMetrics: async (businessId: string) => {
                    const state = get();

                    // Check cache
                    if (
                        state.performanceMetrics &&
                        state.lastPerformanceFetch &&
                        Date.now() - state.lastPerformanceFetch < CACHE_DURATION
                    ) {
                        return;
                    }

                    set({ isLoadingPerformance: true, performanceError: null });

                    try {
                        const response = await fetch(`/api/business/performance?businessId=${businessId}`);

                        if (!response.ok) {
                            throw new Error('Failed to fetch performance metrics');
                        }

                        const data = await response.json();
                        set({
                            performanceMetrics: data.performance,
                            lastPerformanceFetch: Date.now(),
                            isLoadingPerformance: false,
                        });
                    } catch (error) {
                        set({
                            performanceError: error instanceof Error ? error.message : 'Unknown error',
                            isLoadingPerformance: false,
                        });
                    }
                },

                fetchCustomers: async (businessId: string) => {
                    const state = get();

                    // Check cache
                    if (
                        state.customers.length > 0 &&
                        state.lastCustomersFetch &&
                        Date.now() - state.lastCustomersFetch < CACHE_DURATION
                    ) {
                        return;
                    }

                    set({ isLoadingCustomers: true, customersError: null });

                    try {
                        const response = await fetch(`/api/business/customers?businessId=${businessId}`);

                        if (!response.ok) {
                            throw new Error('Failed to fetch customers');
                        }

                        const data = await response.json();
                        set({
                            customers: data.customers,
                            customerStats: data.stats,
                            lastCustomersFetch: Date.now(),
                            isLoadingCustomers: false,
                        });
                    } catch (error) {
                        set({
                            customersError: error instanceof Error ? error.message : 'Unknown error',
                            isLoadingCustomers: false,
                        });
                    }
                },

                refreshData: async (userId: string) => {
                    // Clear cache and force refresh
                    set({
                        lastBusinessFetch: null,
                        lastStatsFetch: null,
                        businessError: null,
                        statsError: null,
                    });

                    await get().fetchBusinessData(userId);
                },

                // Clear functions
                clearBusiness: () =>
                    set({
                        business: null,
                        lastBusinessFetch: null,
                        businessError: null,
                        isLoadingBusiness: false,
                    }),

                clearStats: () =>
                    set({
                        stats: null,
                        lastStatsFetch: null,
                        statsError: null,
                        isLoadingStats: false,
                    }),

                clearChartData: () =>
                    set({
                        chartData: null,
                        lastChartDataFetch: null,
                        chartDataError: null,
                        isLoadingChartData: false,
                    }),

                clearAll: () =>
                    set({
                        business: null,
                        stats: null,
                        chartData: null,
                        recentBookings: [],
                        performanceMetrics: null,
                        customers: [],
                        customerStats: null,
                        isLoadingBusiness: false,
                        isLoadingStats: false,
                        isLoadingChartData: false,
                        isLoadingBookings: false,
                        isLoadingPerformance: false,
                        isLoadingCustomers: false,
                        businessError: null,
                        statsError: null,
                        chartDataError: null,
                        bookingsError: null,
                        performanceError: null,
                        customersError: null,
                        lastBusinessFetch: null,
                        lastStatsFetch: null,
                        lastChartDataFetch: null,
                        lastBookingsFetch: null,
                        lastPerformanceFetch: null,
                        lastCustomersFetch: null,
                    }),
            }),
            {
                name: 'business-store',
                partialize: state => ({
                    business: state.business,
                    stats: state.stats,
                    chartData: state.chartData,
                    lastBusinessFetch: state.lastBusinessFetch,
                    lastStatsFetch: state.lastStatsFetch,
                    lastChartDataFetch: state.lastChartDataFetch,
                }),
            },
        ),
        {
            name: 'business-store',
        },
    ),
);
