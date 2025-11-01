'use client';

import Confirmation from '@/components/shared/display/Confirmation';
import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';

export default function PaymentReceiptPage() {
  const searchParams = useSearchParams();
  const service = searchParams?.get('service'); // e.g., "true" if coming from a service booking
  const isService = service === 'true';
  
  // Get ID based on type - serviceId for bookings, orderId for orders
  const serviceId = searchParams?.get('serviceId');
  const orderId = searchParams?.get('orderId');
  const displayId = isService ? serviceId : orderId;

  return (
    <Confirmation
      icon={<CheckCircle className="text-green-600 w-10 h-10" />}
      title={isService ? 'Booking Confirmed!' : 'Thank you for your purchase!'}
      message={isService
        ? 'Your service has been successfully booked.'
        : 'Your order has been placed. You’ll receive updates soon.'}
      details={displayId ? `${isService ? 'Booking' : 'Order'} ID: ${displayId}` : undefined}
      primaryAction={{
        label: isService ? 'View My Bookings' : 'Track Order',
        href: ROUTES.CUSTOMER.ORDERS,
      }}
      secondaryAction={{
        label: 'Go Home',
        href: ROUTES.CUSTOMER.HOME,
      }}
    />
  );
}
