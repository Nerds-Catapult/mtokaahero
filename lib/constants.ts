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
    serviceName: 'Oil Change',
    businessName: 'Quick Lube Auto',
    scheduledDate: '2024-01-15',
    scheduledTime: '10:00',
    status: 'CONFIRMED',
    price: 45.00,
    location: 'Downtown, Nairobi'
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    serviceName: 'Brake Repair',
    businessName: 'Metro Garage',
    scheduledDate: '2024-01-16',
    scheduledTime: '14:30',
    status: 'PENDING',
    price: 120.00,
    location: 'Westlands, Nairobi'
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
    serviceName: 'Oil Change',
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
    serviceName: 'Brake Repair',
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
  totalRevenue: 15420,
  monthlyGrowth: 12,
  totalBookings: 89,
  completedServices: 76,
  rating: 4.8,
  totalReviews: 156
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

export const chartData = [
  { name: 'Jan', value: 1200 },
  { name: 'Feb', value: 1400 },
  { name: 'Mar', value: 1100 },
  { name: 'Apr', value: 1600 },
  { name: 'May', value: 1800 },
  { name: 'Jun', value: 2000 }
];
