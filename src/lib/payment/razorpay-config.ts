// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  CURRENCY: 'INR',
  COMPANY_NAME: 'Car Wash Service',
  COMPANY_LOGO: '/logo.png',
  THEME_COLOR: '#3b82f6',
} as const;

// Razorpay Script URL
export const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

// Payment status mapping
export const RAZORPAY_STATUS = {
  SUCCESS: 'captured',
  FAILED: 'failed',
  PENDING: 'created',
  AUTHORIZED: 'authorized',
} as const;
