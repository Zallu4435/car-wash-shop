'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeliveryFeeNotice } from '@/components/customer/DeliveryFeeNotice';
import { PaymentOptionSelector } from '@/components/shared/pricing/PaymentOptionSelector';
import { PricingBreakdown } from '@/components/shared/pricing/PricingBreakdown';
import { MapPicker } from '@/components/shared/selectors/MapPicker';
import { ShoppingBag, MapPin, CreditCard, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online');
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('123, MG Road, Bandra West, Mumbai - 400050');
  
  const subtotal = 797;
  const discount = 100;
  const deliveryFee = paymentMethod === 'cod' ? 40 : 0;
  const total = subtotal - discount + deliveryFee;

  const handlePlaceOrder = () => {
    router.push('/payment/status?status=success');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Checkout</h1>
              <p className="text-muted-foreground mt-1">Complete your order</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address Card */}
              <Card className="border-2 border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Delivery Address</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-xl">
                    <p className="text-foreground leading-relaxed">{selectedAddress}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowMapPicker(!showMapPicker)}
                    className="w-full sm:w-auto"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {showMapPicker ? 'Hide Map' : 'Change Location'}
                  </Button>
                  
                  {showMapPicker && (
                    <MapPicker
                      initialAddress={selectedAddress}
                      onLocationSelect={(location) => {
                        setSelectedAddress(location.address);
                        setShowMapPicker(false);
                      }}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Payment Method Card */}
              <Card className="border-2 border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Payment Method</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <PaymentOptionSelector
                    value={paymentMethod}
                    onChange={(value) => setPaymentMethod(value as 'cod' | 'online')}
                    codFee={40}
                  />
                </CardContent>
              </Card>

              {/* Delivery Fee Notice */}
              <DeliveryFeeNotice
                orderAmount={subtotal - discount}
                paymentMethod={paymentMethod}
                codFee={40}
                freeDeliveryMin={500}
              />
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-2 border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Order Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <PricingBreakdown
                    subtotal={subtotal}
                    discount={discount}
                    deliveryFee={deliveryFee}
                    total={total}
                  />
                  <Button 
                    onClick={handlePlaceOrder} 
                    className="w-full shadow-lg" 
                    size="lg"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Place Order
                  </Button>

                  {/* Trust Info - UPDATED */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      <span>Secure payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      <span>Safe & encrypted checkout</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
