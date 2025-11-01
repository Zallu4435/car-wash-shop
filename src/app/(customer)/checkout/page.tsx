'use client';

// @ts-nocheck
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeliveryFeeNotice } from '@/components/customer/DeliveryFeeNotice';
import { PaymentOptionSelector } from '@/components/shared/pricing/PaymentOptionSelector';
import { PricingBreakdown } from '@/components/shared/pricing/PricingBreakdown';
import { MapPicker } from '@/components/shared/selectors/MapPicker';
import { ShoppingBag, MapPin, CreditCard, Lock, Tag, X } from 'lucide-react';
import { useCart } from '@/api/domains/cart/queries';
import { useAddresses } from '@/api/domains/addresses/queries';
import { useCreateCheckoutSession } from '@/api/domains/checkout/queries';
import { useValidateCoupon } from '@/api/domains/orders/queries';
import Loading from '@/components/shared/display/Loading';
import { toast } from 'sonner';
import { useConfirmation } from '@/hooks/useConfirmation';
import { AddressSelectionModal } from '@/components/customer/AddressSelectionModal';
import { CouponInput } from '@/components/shared/forms/CouponInput';
import { useRazorpay } from '@/hooks/useRazorpay';

export default function CheckoutPage() {
  const router = useRouter();
  const { confirm, ConfirmDialog } = useConfirmation();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  
  // Constants
  const MIN_ORDER_AMOUNT = 100;
  const FREE_DELIVERY_MIN = 500;
  const COD_FEE = 40;
  
  // API calls
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses();
  const createCheckoutSessionMutation = useCreateCheckoutSession();
  const validateCouponMutation = useValidateCoupon();

  // Razorpay integration
  const { processPayment, isLoading: isRazorpayLoading } = useRazorpay({
    onSuccess: async (response) => {
      setIsProcessingPayment(true);
      try {
        // TODO: Save payment details to database
        toast.success('Payment successful!');
        router.push(`/payment/receipt?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}`);
      } catch (error) {
        toast.error('Failed to process order');
      } finally {
        setIsProcessingPayment(false);
      }
    },
    onFailure: () => {
      toast.error('Payment failed. Please try again.');
      setIsProcessingPayment(false);
    },
    onDismiss: () => {
      setIsProcessingPayment(false);
    },
  });

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
  const subtotal = cart?.subtotal || 0;
  const deliveryFee = paymentMethod === 'cod' ? COD_FEE : 0;
  const finalAmount = subtotal - discount;
  const total = finalAmount + deliveryFee;
  
  // Validation checks
  const isMinimumOrderMet = subtotal >= MIN_ORDER_AMOUNT;
  const canPlaceOrder = selectedAddressId && cart && isMinimumOrderMet;

  // Set default address when addresses load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      // Find primary address or use first one
      const primaryAddress = addresses.find(addr => addr.isPrimary);
      setSelectedAddressId(primaryAddress?.id || addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  // Show warning if minimum order not met
  useEffect(() => {
    if (cart && !isMinimumOrderMet) {
      toast.warning(`Minimum order amount is ₹${MIN_ORDER_AMOUNT}. Current: ₹${subtotal}`);
    }
  }, [cart, isMinimumOrderMet, subtotal]);

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    toast.success('Delivery address updated');
  };

  const handleAddressAdded = () => {
    // Refresh will happen automatically via react-query
    // Select the newly added address (it will be the last one)
    setTimeout(() => {
      if (addresses.length > 0) {
        const newestAddress = addresses[addresses.length - 1];
        setSelectedAddressId(newestAddress.id);
        toast.success('Address added and selected for delivery');
      }
    }, 500);
  };

  const handlePlaceOrder = async () => {
    // Comprehensive validation checks
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      router.push('/cart');
      return;
    }

    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      setShowAddressModal(true);
      return;
    }

    if (!isMinimumOrderMet) {
      toast.error(`Minimum order amount is ₹${MIN_ORDER_AMOUNT}. Add ₹${MIN_ORDER_AMOUNT - subtotal} more to proceed.`);
      return;
    }

    // Validate payment method
    if (!paymentMethod || !['cod', 'online'].includes(paymentMethod)) {
      toast.error('Please select a valid payment method');
      return;
    }

    // Validate total amount
    if (total <= 0) {
      toast.error('Invalid order amount');
      return;
    }

    // Confirmation modal
    const orderSummary = `
      Order Amount: ₹${subtotal}
      ${discount > 0 ? `Discount: -₹${discount}` : ''}
      ${deliveryFee > 0 ? `Delivery Fee: +₹${deliveryFee}` : 'Free Delivery'}
      Total: ₹${total}
    `;

    const confirmed = await confirm({
      title: 'Confirm Your Order',
      description: `You are about to place an order for ₹${total}. ${paymentMethod === 'cod' ? 'You will pay cash on delivery.' : 'You will be redirected to the payment gateway.'}`,
      confirmText: paymentMethod === 'cod' ? 'Confirm Order (COD)' : 'Proceed to Payment',
      cancelText: 'Review Cart',
      type: 'info',
      itemName: `${cart.items.length} item${cart.items.length > 1 ? 's' : ''}`,
    });

    if (!confirmed) return;

    try {
      setIsProcessingPayment(true);

      // Handle COD payment
      if (paymentMethod === 'cod') {
        const tempBookingId = `temp_${Date.now()}`;
        
        const checkoutData = {
          bookingId: tempBookingId,
          paymentType: 'full' as 'full' | 'advance',
          amount: total,
        };

        createCheckoutSessionMutation.mutate(checkoutData, {
          onSuccess: () => {
            toast.success('Order placed successfully!');
            router.push(`/orders`);
          },
          onError: (error: any) => {
            toast.error(error?.message || 'Failed to place order. Please try again.');
          },
          onSettled: () => {
            setIsProcessingPayment(false);
          },
        });
        return;
      }

      // Handle Online payment with Razorpay
      if (paymentMethod === 'online') {
        // Get user details (in real app, fetch from auth context)
        const userEmail = 'customer@example.com'; // TODO: Get from auth
        const userName = 'Customer'; // TODO: Get from auth
        const userPhone = '+919876543210'; // TODO: Get from auth

        await processPayment({
          amount: total,
          description: `Order for ${cart.items.length} items`,
          orderId: `ORDER_${Date.now()}`,
          userEmail,
          userName,
          userPhone,
          notes: {
            items: cart.items.length.toString(),
            subtotal: subtotal.toString(),
            discount: discount.toString(),
            deliveryFee: deliveryFee.toString(),
            addressId: selectedAddressId,
          },
        });
      }
    } catch (error: any) {
      toast.error(error?.message || 'An unexpected error occurred');
      console.error('Checkout error:', error);
      setIsProcessingPayment(false);
    }
  };

  const handleApplyCoupon = async (code: string) => {
    try {
      const result = await validateCouponMutation.mutateAsync({
        code: code,
        amount: subtotal,
      });
      
      if (result.isValid) {
        setAppliedCoupon(code);
        setDiscount(result.discount);
        toast.success(`Coupon applied! You saved ₹${result.discount}`);
      } else {
        toast.error('Invalid or expired coupon code');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to validate coupon. Please try again.');
      console.error('Coupon validation error:', error);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setDiscount(0);
    toast.info('Coupon removed');
  };

  // Loading state
  if (cartLoading || addressesLoading) {
    return <Loading text="Loading checkout..." />;
  }

  // Redirect if cart is empty
  if (!cart || cart.items.length === 0) {
    toast.error('Your cart is empty');
    router.push('/cart');
    return null;
  }

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
                  {selectedAddress ? (
                    <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                      <p className="text-xs sm:text-sm text-foreground leading-relaxed break-words">
                        {selectedAddress.line1}, {selectedAddress.line2}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                      </p>
                      {selectedAddress.landmark && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Landmark: {selectedAddress.landmark}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl text-center">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        No address selected
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddressModal(true)}
                      className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm"
                    >
                      <MapPin className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Change Address
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setShowMapPicker(!showMapPicker)}
                      className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm"
                    >
                      <MapPin className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {showMapPicker ? 'Hide Map' : 'Pick on Map'}
                    </Button>
                  </div>
                  
                  {showMapPicker && (
                    <div className="mt-3 sm:mt-4">
                      <MapPicker
                        initialAddress={selectedAddress ? `${selectedAddress.line1}, ${selectedAddress.city}` : ''}
                        onLocationSelect={(location) => {
                          // In a real app, you'd create a new address here
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
                orderAmount={finalAmount}
                paymentMethod={paymentMethod}
                codFee={COD_FEE}
                freeDeliveryMin={FREE_DELIVERY_MIN}
              />
              
              {/* Minimum Order Warning */}
              {!isMinimumOrderMet && (
                <Card className="border-2 border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex-shrink-0">
                        <ShoppingBag className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-orange-900 dark:text-orange-200 mb-1">
                          Minimum Order Required
                        </p>
                        <p className="text-xs text-orange-700 dark:text-orange-300">
                          Add ₹{MIN_ORDER_AMOUNT - subtotal} more to your cart to place an order.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push('/services')}
                          className="mt-3 h-9 text-xs border-orange-300 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40"
                        >
                          Continue Shopping
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
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
                  {/* Coupon Code Section */}
                  <CouponInput
                    onApply={handleApplyCoupon}
                    onRemove={handleRemoveCoupon}
                    appliedCoupon={appliedCoupon}
                    discount={discount}
                    isLoading={validateCouponMutation.isPending}
                    subtotal={subtotal}
                    minOrderAmount={MIN_ORDER_AMOUNT}
                    size="md"
                  />

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
                    disabled={isProcessingPayment || isRazorpayLoading || !canPlaceOrder}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    {isProcessingPayment || isRazorpayLoading ? 'Processing...' : 'Place Order'}
                  </Button>
                  
                  {/* Validation Messages */}
                  {!selectedAddressId && (
                    <p className="text-xs text-red-600 dark:text-red-400 text-center">
                      Please select a delivery address
                    </p>
                  )}
                  {!isMinimumOrderMet && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 text-center">
                      Minimum order: ₹{MIN_ORDER_AMOUNT} (Add ₹{MIN_ORDER_AMOUNT - subtotal} more)
                    </p>
                  )}

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
                    disabled={isProcessingPayment || isRazorpayLoading || !canPlaceOrder}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    {isProcessingPayment || isRazorpayLoading ? 'Processing...' : `Place Order - ₹${total}`}
                  </Button>
                  
                  {/* Mobile Validation Messages */}
                  {!canPlaceOrder && (
                    <p className="text-xs text-center text-red-600 dark:text-red-400 mt-2">
                      {!selectedAddressId ? 'Select delivery address' : `Add ₹${MIN_ORDER_AMOUNT - subtotal} more`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Address Selection Modal */}
      <AddressSelectionModal
        open={showAddressModal}
        onOpenChange={setShowAddressModal}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelectAddress={handleSelectAddress}
        onAddressAdded={handleAddressAdded}
      />
      
      {/* Confirmation Dialog */}
      <ConfirmDialog />
    </div>
  );
}
