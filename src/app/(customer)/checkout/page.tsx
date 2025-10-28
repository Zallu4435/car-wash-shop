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
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header - Responsive */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
              <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                Checkout
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                Complete your order
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Delivery Address Card */}
              <Card className="border-2 border-border">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">Delivery Address</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed break-words">
                      {selectedAddress}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowMapPicker(!showMapPicker)}
                    className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
                  >
                    <MapPin className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {showMapPicker ? 'Hide Map' : 'Change Location'}
                  </Button>
                  
                  {showMapPicker && (
                    <div className="mt-3 sm:mt-4">
                      <MapPicker
                        initialAddress={selectedAddress}
                        onLocationSelect={(location) => {
                          setSelectedAddress(location.address);
                          setShowMapPicker(false);
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method Card */}
              <Card className="border-2 border-border">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                      <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">Payment Method</CardTitle>
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

            {/* Right Column - Order Summary (Desktop Sticky, Mobile Fixed) */}
            <div className="lg:col-span-1">
              {/* Desktop Version */}
              <Card className="hidden lg:block sticky top-24 border-2 border-border">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                      <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">Order Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <PricingBreakdown
                    subtotal={subtotal}
                    discount={discount}
                    deliveryFee={deliveryFee}
                    total={total}
                  />
                  <Button 
                    onClick={handlePlaceOrder} 
                    className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base" 
                    size="lg"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Place Order
                  </Button>

                  {/* Trust Info */}
                  <div className="pt-3 sm:pt-4 border-t border-border space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-primary flex-shrink-0" />
                      <span>Secure payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-primary flex-shrink-0" />
                      <span>Safe & encrypted checkout</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Fixed Bottom Bar */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
                <div className="bg-background/95 backdrop-blur-xl border-t-2 border-border shadow-2xl px-4 py-3">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">₹{total}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {deliveryFee > 0 ? `+₹${deliveryFee} delivery` : 'Free delivery'}
                      </p>
                      <p className="text-xs font-medium text-green-600">
                        Save ₹{discount}
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handlePlaceOrder} 
                    className="w-full shadow-lg h-12 text-sm font-semibold" 
                    size="lg"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Place Order - ₹{total}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
