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
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Shopping Cart</h1>
              <p className="text-muted-foreground mt-1">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow border-2">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="h-10 w-10 text-primary" />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-foreground mb-1">{item.name}</h3>
                          <p className="text-2xl font-bold text-primary">₹{item.price}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-bold text-lg text-foreground">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 hover:bg-red-50 dark:hover:bg-red-950/20 flex-shrink-0"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </Button>
                      </div>

                      {/* Subtotal for item */}
                      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Item Subtotal</span>
                        <span className="font-semibold text-foreground">₹{item.price * item.quantity}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Coupon Section */}
                <Card className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Tag className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">Apply Coupon</h3>
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
            // Empty Cart State
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Add items to your cart to get started</p>
              <Button onClick={() => router.push('/products')} size="lg">
                Browse Products
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
