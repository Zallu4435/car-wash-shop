'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Package, MapPin, CreditCard, Calendar, FileText, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderTracker } from '@/components/customer/OrderTracker';
import { Separator } from '@/components/ui/separator';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const statusHistory = [
    { status: 'processing', timestamp: '2025-10-24, 10:00 AM', label: 'Order Placed' },
    { status: 'confirmed', timestamp: '2025-10-24, 10:15 AM', label: 'Order Confirmed' },
    { status: 'shipped', timestamp: '2025-10-24, 2:30 PM', label: 'Shipped' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8">
          <Link href="/orders">
            <Button variant="ghost" className="mb-4 hover:bg-muted">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Order Details</h1>
                <p className="text-muted-foreground mt-1">Order #{id}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Information */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Order Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                      </div>
                      <p className="font-semibold text-foreground">October 24, 2025</p>
                    </div>

                    <div className="p-4 bg-muted rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                      </div>
                      <p className="font-semibold text-foreground">Online Payment</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Order Items</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Item 1 */}
                    <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">Premium Car Shampoo</h3>
                        <p className="text-sm text-muted-foreground mt-1">Quantity: 2</p>
                        <p className="text-lg font-bold text-primary mt-2">₹598</p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">Microfiber Cloth Set</h3>
                        <p className="text-sm text-muted-foreground mt-1">Quantity: 1</p>
                        <p className="text-lg font-bold text-primary mt-2">₹199</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Price Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">₹797</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 dark:text-green-400">Discount</span>
                      <span className="font-medium text-green-600 dark:text-green-400">-₹100</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-lg text-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">₹697</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Delivery Address</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-xl">
                    <p className="font-semibold text-foreground mb-2">John Doe</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      123, MG Road, Bandra West<br />
                      Mumbai - 400050<br />
                      Maharashtra, India<br />
                      Phone: +91 98765 43210
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/orders/${id}/invoice`}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">
                  <Link href={`/orders/${id}/cancel`}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Order Tracker */}
            <div className="lg:col-span-1">
              <OrderTracker
                currentStatus="shipped"
                statusHistory={statusHistory}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
