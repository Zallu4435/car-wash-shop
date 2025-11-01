'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ShoppingCart, ShoppingBag, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CartSummary } from '@/components/customer/CartSummary';
import { CouponInput } from '@/components/shared/forms/CouponInput';
import { useCart, useUpdateCartItem, useRemoveFromCart } from '@/api/domains/cart/queries';
import { useValidateCoupon } from '@/api/domains/orders/queries';
import Loading from '@/components/shared/display/Loading';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  // API calls
  const { data: cart, isLoading: cartLoading } = useCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  const validateCouponMutation = useValidateCoupon();

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const total = subtotal - discount;

  const updateQuantity = (id: string, change: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateCartItemMutation.mutate({
        itemId: id,
        input: { quantity: newQuantity }
      });
    }
  };

  const removeItem = (id: string) => {
    removeFromCartMutation.mutate(id);
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
      toast.error(error?.message || 'Failed to validate coupon');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setDiscount(0);
    toast.info('Coupon removed');
  };

  // Loading state
  if (cartLoading) {
    return <Loading text="Loading cart..." />;
  }

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header - Responsive */}
      <section className="border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <div className="flex items-center gap-2 sm:gap-3">
            <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">Shopping Cart</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow border-2 border-border">
                    <CardContent className="p-4 sm:p-5 md:p-6">
                      {/* Mobile Layout (stacked) */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        {/* Product Image */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                        </div>

                        {/* Product Details + Controls */}
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg text-foreground mb-1 line-clamp-2">
                                {item.product?.name || item.service?.name || 'Item'}
                              </h3>
                              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary">₹{item.price}</p>
                            </div>

                            {/* Remove Button - Desktop */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-red-50 dark:hover:bg-red-950/20 flex-shrink-0 hidden sm:flex"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
                            </Button>
                          </div>

                          {/* Quantity Controls + Remove Button (Mobile) */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 border-2"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                              <span className="w-10 sm:w-12 text-center font-bold text-sm sm:text-base lg:text-lg text-foreground">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 border-2"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                            </div>

                            {/* Remove Button - Mobile */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="sm:hidden text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 text-xs"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Item Subtotal */}
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border flex justify-between items-center">
                        <span className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">Item Subtotal</span>
                        <span className="font-semibold text-xs sm:text-sm lg:text-base text-foreground">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Coupon Section */}
                <Card className="border-2 border-border">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <h3 className="font-semibold text-xs sm:text-sm lg:text-base text-foreground">Apply Coupon</h3>
                    </div>
                    <CouponInput
                      onApply={handleApplyCoupon}
                      onRemove={handleRemoveCoupon}
                      appliedCoupon={appliedCoupon}
                      discount={discount}
                      isLoading={validateCouponMutation.isPending}
                      subtotal={subtotal}
                      minOrderAmount={100}
                      showLabel={false}
                      size="sm"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <CartSummary
                  subtotal={subtotal}
                  discount={discount}
                  total={total}
                  onCheckout={() => router.push('/checkout')}
                />
              </div>
            </div>
          ) : (
            <EmptyState
              icon={ShoppingCart}
              title="Your cart is empty"
              description="Add items to your cart to get started"
              action={
                <Button onClick={() => router.push('/products')} size="lg" className="h-10 sm:h-11 border-2">
                  <span className="text-xs sm:text-sm lg:text-base">Browse Products</span>
                </Button>
              }
            />
          )}
        </div>
      </section>
    </div>
  );
}
