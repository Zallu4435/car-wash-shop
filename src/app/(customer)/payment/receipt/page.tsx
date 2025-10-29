'use client';

import Confirmation from '@/components/shared/display/Confirmation';
import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function PaymentReceiptPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId');
  const service = searchParams?.get('service'); // e.g., "true" if coming from a service booking
  const isService = service === 'true';

  return (
    <Confirmation
      icon={<CheckCircle className="text-green-600 w-10 h-10" />}
      title={isService ? 'Booking Confirmed!' : 'Thank you for your purchase!'}
      message={isService
        ? 'Your service has been successfully booked.'
        : 'Your order has been placed. You’ll receive updates soon.'}
      details={orderId ? `Order/Booking ID: ${orderId}` : undefined}
      primaryAction={{
        label: isService ? 'Go to My Bookings' : 'Track Order',
        href: isService ? '/customer/bookings' : '/customer/orders',
      }}
      secondaryAction={{
        label: 'Go Home',
        href: '/',
      }}
    />
  );
}
