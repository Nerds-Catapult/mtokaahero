import { DollarSign, Calendar, CheckCircle, Star } from 'lucide-react';

// Static data that doesn't need to be in the database
export const stats = [
  { value: "500+", label: "Verified Professionals" },
  { value: "10,000+", label: "Happy Customers" },
  { value: "50+", label: "Cities Covered" },
  { value: "24/7", label: "Emergency Support" },
];

export const serviceCategories = [
  {
    id: 'oil-change',
    name: 'Oil Change',
    icon: 'wrench',
    description: 'Regular oil change and filter replacement'
  },
  {
    id: 'brake-repair',
    name: 'Brake Repair',
    icon: 'disc',
    description: 'Brake pad replacement and brake system maintenance'
  },
  {
    id: 'engine-diagnostics',
    name: 'Engine Diagnostics',
    icon: 'search',
    description: 'Computer diagnostics and engine troubleshooting'
  },
  {
    id: 'tire-service',
    name: 'Tire Service',
    icon: 'circle',
    description: 'Tire installation, balancing, and alignment'
  },
  {
    id: 'battery-service',
    name: 'Battery Service',
    icon: 'battery',
    description: 'Battery testing, replacement, and charging'
  },
  {
    id: 'transmission',
    name: 'Transmission',
    icon: 'settings',
    description: 'Transmission repair and maintenance'
  }
];

export const businessTypes = {
  GARAGE: 'Garage',
  FREELANCE_MECHANIC: 'Mechanic',
  SPARE_PARTS_SHOP: 'Parts Shop'
};

export const bookingStatuses = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

export const paymentStatuses = {
  PENDING: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded'
};

// Mock recent bookings for fallback
export const recentBookings = [
  {
    id: '1',
    customerName: 'John Doe',
    service: 'Oil Change',
    businessName: 'Quick Lube Auto',
    date: '2024-01-15',
    time: '10:00',
    status: 'confirmed' as const,
    price: 45.00,
    location: 'Downtown, Nairobi'
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    service: 'Brake Repair',
    businessName: 'Metro Garage',
    date: '2024-01-16',
    time: '14:30',
    status: 'pending' as const,
    price: 120.00,
    location: 'Westlands, Nairobi'
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    service: 'Engine Diagnosis',
    businessName: 'Express Auto',
    date: '2024-01-14',
    time: '09:00',
    status: 'completed' as const,
    price: 80.00,
    location: 'Karen, Nairobi'
  }
];

// Mock customers data for fallback
export const customers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+254700000001',
    totalBookings: 5,
    totalSpent: 450.00,
    lastVisit: '2024-01-10',
    status: 'active',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com', 
    phone: '+254700000002',
    totalBookings: 3,
    totalSpent: 320.00,
    lastVisit: '2024-01-08',
    status: 'active',
    rating: 4.5
  }
];

// Mock reviews data for fallback
export const allReviews = [
  {
    id: '1',
    customerName: 'John Doe',
    service: 'Oil Change',
    rating: 5,
    comment: 'Excellent service!',
    date: '2024-01-10',
    status: 'published',
    response: 'Thank you for your feedback!',
    responseDate: '2024-01-11'
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    service: 'Brake Repair',
    rating: 4,
    comment: 'Good work, but took longer than expected.',
    date: '2024-01-08',
    status: 'published',
    response: null,
    responseDate: null
  }
];

// Dashboard data for service provider
export const dashboardData = {
  mechanic: [
    {
      title: 'Total Revenue',
      value: '$15,420',
      change: '+12%',
      trend: 'up' as const,
      icon: DollarSign
    },
    {
      title: 'Active Bookings',
      value: '23',
      change: '+5%',
      trend: 'up' as const,
      icon: Calendar
    },
    {
      title: 'Completed Services',
      value: '156',
      change: '+8%',
      trend: 'up' as const,
      icon: CheckCircle
    },
    {
      title: 'Customer Rating',
      value: '4.8',
      change: '+0.2',
      trend: 'up' as const,
      icon: Star
    }
  ],
  garage: [
    {
      title: 'Total Revenue',
      value: '$32,840',
      change: '+18%',
      trend: 'up' as const,
      icon: DollarSign
    },
    {
      title: 'Active Bookings',
      value: '45',
      change: '+12%',
      trend: 'up' as const,
      icon: Calendar
    },
    {
      title: 'Completed Services',
      value: '234',
      change: '+15%',
      trend: 'up' as const,
      icon: CheckCircle
    },
    {
      title: 'Customer Rating',
      value: '4.7',
      change: '+0.1',
      trend: 'up' as const,
      icon: Star
    }
  ]
};

export const recentReviews = [
  {
    id: '1',
    customerName: 'John Doe',
    rating: 5,
    comment: 'Excellent service!',
    date: '2024-01-10'
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    rating: 4,
    comment: 'Good work!',
    date: '2024-01-08'
  }
];

export const chartData = {
  revenue: [
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 1400 },
    { month: 'Mar', revenue: 1100 },
    { month: 'Apr', revenue: 1600 },
    { month: 'May', revenue: 1800 },
    { month: 'Jun', revenue: 2000 }
  ],
  bookings: [
    { month: 'Jan', bookings: 45 },
    { month: 'Feb', bookings: 52 },
    { month: 'Mar', bookings: 48 },
    { month: 'Apr', bookings: 61 },
    { month: 'May', bookings: 58 },
    { month: 'Jun', bookings: 67 }
  ]
};
