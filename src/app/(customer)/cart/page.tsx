'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ShoppingCart, ShoppingBag, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CartSummary } from '@/components/customer/CartSummary';
import { CouponInput } from '@/components/shared/pricing/CouponInput';

const mockCartItems = [
  { id: 'prod_001', name: 'Premium Car Shampoo', price: 299, quantity: 2, image: '' },
  { id: 'prod_002', name: 'Microfiber Cloth Set', price: 199, quantity: 1, image: '' },
];

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState(mockCartItems);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - discount;

  const updateQuantity = (id: string, change: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleApplyCoupon = (code: string) => {
    setAppliedCoupon(code);
    setDiscount(100);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setDiscount(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Responsive */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
              <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            </div>
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
                  <Card key={item.id} className="hover:shadow-lg transition-shadow border-2">
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
                              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-foreground mb-1 line-clamp-2">
                                {item.name}
                              </h3>
                              <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">₹{item.price}</p>
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
                                className="h-8 w-8 sm:h-9 sm:w-9"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                              <span className="w-10 sm:w-12 text-center font-bold text-base sm:text-lg text-foreground">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                            </div>

                            {/* Remove Button - Mobile */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="sm:hidden text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 h-8"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1.5" />
                              <span className="text-xs">Remove</span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Item Subtotal */}
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-muted-foreground">Item Subtotal</span>
                        <span className="font-semibold text-sm sm:text-base text-foreground">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Coupon Section */}
                <Card className="border-2">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                        <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base text-foreground">Apply Coupon</h3>
                    </div>
                    <CouponInput
                      onApply={handleApplyCoupon}
                      onRemove={handleRemoveCoupon}
                      appliedCode={appliedCoupon}
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
            // Empty Cart State - Responsive
            <div className="text-center py-12 sm:py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full mb-4 sm:mb-6">
                <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                Add items to your cart to get started
              </p>
              <Button onClick={() => router.push('/products')} size="lg" className="h-10 sm:h-11">
                <span className="text-sm sm:text-base">Browse Products</span>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
