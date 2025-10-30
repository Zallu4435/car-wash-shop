import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { FAQ, FAQCategory } from '@/types/faq';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
const mockCategories: FAQCategory[] = [
  {
    id: 'general',
    name: 'General',
    icon: '📋',
    description: 'General questions about our services',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'booking',
    name: 'Booking & Scheduling',
    icon: '📅',
    description: 'Questions about booking and scheduling',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'payment',
    name: 'Payment & Pricing',
    icon: '💳',
    description: 'Questions about payment and pricing',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'service',
    name: 'Service Details',
    icon: '🧼',
    description: 'Questions about service details',
    order: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'account',
    name: 'Account & Profile',
    icon: '👤',
    description: 'Questions about account and profile',
    order: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockFAQs: FAQ[] = [
  // General
  { id: '1', question: 'What services do you offer?', answer: 'We offer a wide range of car wash and detailing services including exterior wash, interior cleaning, waxing, polishing, and premium detailing packages. We also provide bike washing and home cleaning services.', categoryId: 'general', order: 1, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', question: 'What are your operating hours?', answer: 'We operate from 8:00 AM to 8:00 PM, Monday through Sunday. You can book services online 24/7 through our website or mobile app.', categoryId: 'general', order: 2, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', question: 'Do you offer doorstep service?', answer: 'Yes! We provide doorstep car wash services. Simply select your preferred location during booking, and our team will come to you at the scheduled time.', categoryId: 'general', order: 3, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', question: 'How do I contact customer support?', answer: 'You can reach our customer support team through the Support page, call our hotline, or email us. We typically respond within 24 hours.', categoryId: 'general', order: 4, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  
  // Booking
  { id: '5', question: 'How do I book a service?', answer: 'Click on "Book Service" from the homepage, select your service type, choose your preferred service, select date and time, and complete the payment. You\'ll receive a confirmation immediately.', categoryId: 'booking', order: 1, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '6', question: 'Can I reschedule my booking?', answer: 'Yes, you can reschedule your booking up to 2 hours before the scheduled time. Go to "My Bookings" and click on the booking you want to reschedule.', categoryId: 'booking', order: 2, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '7', question: 'How far in advance can I book?', answer: 'You can book services up to 30 days in advance. We recommend booking at least 24 hours ahead for better slot availability.', categoryId: 'booking', order: 3, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '8', question: 'What if I need to cancel my booking?', answer: 'You can cancel your booking up to 2 hours before the scheduled time for a full refund. Cancellations made within 2 hours will incur a 20% cancellation fee.', categoryId: 'booking', order: 4, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  
  // Payment
  { id: '9', question: 'What payment methods do you accept?', answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets. You can also choose Cash on Delivery (COD) with a small additional fee.', categoryId: 'payment', order: 1, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '10', question: 'Is there a minimum order value?', answer: 'No, there is no minimum order value. However, some services may have specific pricing based on vehicle type and service complexity.', categoryId: 'payment', order: 2, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '11', question: 'Do you offer any discounts or promotions?', answer: 'Yes! We regularly offer seasonal discounts, first-time user offers, and loyalty rewards. Check our "Offers" section or subscribe to our newsletter for updates.', categoryId: 'payment', order: 3, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '12', question: 'How do refunds work?', answer: 'Refunds are processed within 5-7 business days to your original payment method. For COD orders, refunds are issued via bank transfer after verification.', categoryId: 'payment', order: 4, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  
  // Service
  { id: '13', question: 'How long does a typical car wash take?', answer: 'A basic exterior wash takes 20-30 minutes, while a complete interior and exterior service takes 45-60 minutes. Premium detailing can take 2-3 hours.', categoryId: 'service', order: 1, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '14', question: 'What products do you use?', answer: 'We use premium, eco-friendly cleaning products that are safe for your vehicle and the environment. All our products are pH-balanced and approved by automotive experts.', categoryId: 'service', order: 2, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '15', question: 'Do you wash bikes as well?', answer: 'Yes! We offer specialized bike washing services including chain cleaning, engine degreasing, and complete detailing for all types of motorcycles.', categoryId: 'service', order: 3, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '16', question: 'What if I\'m not satisfied with the service?', answer: 'Your satisfaction is our priority. If you\'re not happy with the service, contact us within 24 hours and we\'ll either redo the service or provide a full refund.', categoryId: 'service', order: 4, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  
  // Account
  { id: '17', question: 'How do I create an account?', answer: 'Click on "Sign Up" and enter your mobile number. You\'ll receive an OTP for verification. Complete your profile with basic details to start booking services.', categoryId: 'account', order: 1, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '18', question: 'Can I save multiple vehicles?', answer: 'Yes! You can add multiple vehicles to your profile. This makes it easier to book services for different vehicles without re-entering details each time.', categoryId: 'account', order: 2, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '19', question: 'How do I update my profile information?', answer: 'Go to "My Profile" from the menu, click "Edit Profile", update your information, and save changes. You can update your name, email, phone, and addresses.', categoryId: 'account', order: 3, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '20', question: 'Is my personal information secure?', answer: 'Absolutely! We use industry-standard encryption and security measures to protect your personal and payment information. We never share your data with third parties.', categoryId: 'account', order: 4, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const faqFetchers = {
  async getFAQCategories(): Promise<FAQCategory[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCategories.filter(cat => cat.isActive).sort((a, b) => a.order - b.order);
    }

    const { data } = await apiClient.get<ApiResponse<FAQCategory[]>>('/faq/categories');
    return data.data!;
  },

  async getFAQs(): Promise<FAQ[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockFAQs.filter(faq => faq.isActive).sort((a, b) => a.order - b.order);
    }

    const { data } = await apiClient.get<ApiResponse<FAQ[]>>('/faq');
    return data.data!;
  },

  async getFAQsByCategory(categoryId: string): Promise<FAQ[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockFAQs
        .filter(faq => faq.categoryId === categoryId && faq.isActive)
        .sort((a, b) => a.order - b.order);
    }

    const { data } = await apiClient.get<ApiResponse<FAQ[]>>(`/faq/category/${categoryId}`);
    return data.data!;
  },
};
