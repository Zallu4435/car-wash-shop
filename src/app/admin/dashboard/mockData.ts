import { OrderStatus, PaymentStatus } from '@/lib/constants/status';
import { BookingStatus } from '@/lib/constants/status';

// Mock Data for Dashboard

export const mockStats = {
    totalRevenue: 125000,
    revenueChange: 12.5, // percentage
    totalOrders: 154,
    ordersChange: 8.2,
    totalBookings: 89,
    bookingsChange: -2.4,
    totalCustomers: 210,
    customersChange: 5.1,
};

export const mockOrders = [
    {
        id: 'ORD-001',
        customer: 'John Doe',
        date: '2023-10-25T10:30:00',
        amount: 1200,
        status: 'delivered',
        paymentStatus: 'success',
        items: 3,
    },
    {
        id: 'ORD-002',
        customer: 'Jane Smith',
        date: '2023-10-25T11:15:00',
        amount: 850,
        status: 'processing',
        paymentStatus: 'success',
        items: 1,
    },
    {
        id: 'ORD-003',
        customer: 'Alice Johnson',
        date: '2023-10-24T14:20:00',
        amount: 2100,
        status: 'shipped',
        paymentStatus: 'success',
        items: 4,
    },
    {
        id: 'ORD-004',
        customer: 'Bob Brown',
        date: '2023-10-24T09:45:00',
        amount: 500,
        status: 'cancelled',
        paymentStatus: 'failed',
        items: 1,
    },
    {
        id: 'ORD-005',
        customer: 'Charlie Wilson',
        date: '2023-10-23T16:00:00',
        amount: 1500,
        status: 'delivered',
        paymentStatus: 'success',
        items: 2,
    },
    {
        id: 'ORD-006',
        customer: 'Diana Evans',
        date: '2023-10-23T12:30:00',
        amount: 3200,
        status: 'processing',
        paymentStatus: 'pending',
        items: 5,
    },
];

export const mockBookings = [
    {
        id: 'BKG-001',
        service: 'Premium Wash',
        customer: 'Michael Scott',
        date: '2023-10-26T10:00:00',
        amount: 500,
        status: 'confirmed',
        vehicle: 'Toyota Camry',
    },
    {
        id: 'BKG-002',
        service: 'Interior Cleaning',
        customer: 'Dwight Schrute',
        date: '2023-10-26T11:00:00',
        amount: 800,
        status: 'pending',
        vehicle: 'Ford F-150',
    },
    {
        id: 'BKG-003',
        service: 'Full Detailing',
        customer: 'Jim Halpert',
        date: '2023-10-25T14:00:00',
        amount: 1500,
        status: 'completed',
        vehicle: 'Honda Civic',
    },
    {
        id: 'BKG-004',
        service: 'Basic Wash',
        customer: 'Pam Beesly',
        date: '2023-10-25T15:30:00',
        amount: 300,
        status: 'cancelled',
        vehicle: 'Subaru Outback',
    },
    {
        id: 'BKG-005',
        service: 'Polishing',
        customer: 'Ryan Howard',
        date: '2023-10-24T09:00:00',
        amount: 600,
        status: 'completed',
        vehicle: 'BMW 3 Series',
    },
];

export const mockActivityData = [
    { name: 'Mon', product: 12, service: 8 },
    { name: 'Tue', product: 18, service: 12 },
    { name: 'Wed', product: 15, service: 10 },
    { name: 'Thu', product: 25, service: 15 },
    { name: 'Fri', product: 30, service: 20 },
    { name: 'Sat', product: 45, service: 28 },
    { name: 'Sun', product: 35, service: 22 },
];


export const mockOrderStatusData = [
    { name: 'Delivered', value: 400, color: '#10B981' },
    { name: 'Processing', value: 300, color: '#3B82F6' },
    { name: 'Shipped', value: 300, color: '#8B5CF6' },
    { name: 'Cancelled', value: 200, color: '#EF4444' },
];

export const mockBookingStatusData = [
    { name: 'Completed', value: 2400, color: '#10B981' },
    { name: 'Confirmed', value: 4567, color: '#3B82F6' },
    { name: 'Pending', value: 1398, color: '#F59E0B' },
    { name: 'Cancelled', value: 980, color: '#EF4444' },
];
