'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Phone, MapPin, Truck, FileText, Mail, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AdminRoutes } from '@/lib/constants/routes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const order = {
  id: 'ORD001',
  customer: { name: 'John Doe', phone: '+91 98765 43210', email: 'john@example.com' },
  items: [
    { id: 'prod_001', name: 'Premium Car Shampoo', quantity: 2, price: 299, total: 598 },
    { id: 'prod_002', name: 'Microfiber Cloth Set', quantity: 1, price: 199, total: 199 },
  ],
  orderDate: '2025-10-20',
  amount: 797,
  discount: 100,
  deliveryFee: 0,
  finalAmount: 697,
  paymentMethod: 'Online',
  address: '123, MG Road, Bandra West, Mumbai, Maharashtra - 400050',
  status: 'processing',
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [status, setStatus] = useState(order.status);

  const handleStatusUpdate = (newStatus: string) => {
    setStatus(newStatus);
    toast.success(`Order status updated to ${newStatus}`);
  };

  const statusColors = {
    processing: { bgColor: 'bg-blue-100 dark:bg-blue-950/30', color: 'text-blue-600 dark:text-blue-400' },
    confirmed: { bgColor: 'bg-green-100 dark:bg-green-950/30', color: 'text-green-600 dark:text-green-400' },
    shipped: { bgColor: 'bg-purple-100 dark:bg-purple-950/30', color: 'text-purple-600 dark:text-purple-400' },
    delivered: { bgColor: 'bg-green-100 dark:bg-green-950/30', color: 'text-green-600 dark:text-green-400' },
    cancelled: { bgColor: 'bg-red-100 dark:bg-red-950/30', color: 'text-red-600 dark:text-red-400' },
  };

  const currentStatusStyle = statusColors[status as keyof typeof statusColors] || statusColors.processing;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.ORDERS)} className="h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Order Info */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm sm:text-base lg:text-lg truncate">Order #{order.id}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Placed on {order.orderDate}</p>
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  className={`text-xs sm:text-sm flex-shrink-0 border-2 capitalize ${currentStatusStyle.color}`}
                >
                  {status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Customer Info */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <h3 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 text-foreground">Customer Details</h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="font-semibold text-sm sm:text-base text-foreground">{order.customer.name}</p>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{order.customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{order.customer.email}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Items */}
              <div>
                <h3 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-foreground">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Order Items
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs sm:text-sm lg:text-base text-foreground truncate">{item.name}</p>
                        <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="text-sm sm:text-base lg:text-lg font-bold text-primary flex-shrink-0">₹{item.total}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Delivery Address */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <h3 className="font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-foreground">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Delivery Address
                </h3>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">{order.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Update Order Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Select value={status} onValueChange={handleStatusUpdate}>
                <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="force-sheet-bg border-2 rounded-lg">
                  <SelectItem value="processing" className="text-xs sm:text-sm rounded-md">Processing</SelectItem>
                  <SelectItem value="confirmed" className="text-xs sm:text-sm rounded-md">Confirmed</SelectItem>
                  <SelectItem value="shipped" className="text-xs sm:text-sm rounded-md">Shipped</SelectItem>
                  <SelectItem value="out-for-delivery" className="text-xs sm:text-sm rounded-md">Out for Delivery</SelectItem>
                  <SelectItem value="delivered" className="text-xs sm:text-sm rounded-md">Delivered</SelectItem>
                  <SelectItem value="cancelled" className="text-xs sm:text-sm rounded-md">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-2 border-border rounded-lg sm:rounded-xl lg:sticky lg:top-24">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <CardTitle className="text-sm sm:text-base lg:text-lg">Order Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2 sm:space-y-2.5">
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground flex-shrink-0">₹{order.amount}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between gap-2 text-xs sm:text-sm">
                    <span className="text-green-600 dark:text-green-400">Discount</span>
                    <span className="font-semibold text-green-600 dark:text-green-400 flex-shrink-0">-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className={`font-semibold flex-shrink-0 ${order.deliveryFee === 0 ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                    {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-foreground">Total</span>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary flex-shrink-0" />
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">{order.finalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-muted rounded-lg border-2 border-border">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Payment Method</p>
                <p className="font-semibold text-xs sm:text-sm text-foreground">{order.paymentMethod}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg"
                  onClick={() => router.push(AdminRoutes.ORDER_INVOICE(id))}
                >
                  <FileText className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Generate Invoice
                </Button>
                <Button variant="outline" className="w-full h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
                  <Phone className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Contact Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
