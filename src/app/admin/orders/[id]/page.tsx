'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Phone, MapPin, Truck, FileText, Mail, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/orders')} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Placed on {order.orderDate}</p>
                  </div>
                </div>
                <Badge className={currentStatusStyle.bgColor}>
                  <span className={currentStatusStyle.color}>{status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              <div className="p-4 bg-muted rounded-xl">
                <h3 className="font-semibold mb-3 text-foreground">Customer Details</h3>
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">{order.customer.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{order.customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{order.customer.email}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                  <Package className="h-5 w-5" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="text-lg font-bold text-primary">₹{item.total}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Delivery Address */}
              <div className="p-4 bg-muted rounded-xl">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </h3>
                <p className="text-sm text-foreground leading-relaxed">{order.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Update Order Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Select value={status} onValueChange={handleStatusUpdate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-2 sticky top-24">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              <CardTitle>Order Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">₹{order.amount}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 dark:text-green-400">Discount</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className={`font-semibold ${order.deliveryFee === 0 ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                    {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="p-4 bg-primary/10 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-6 w-6 text-primary" />
                    <span className="text-2xl font-bold text-primary">{order.finalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                <p className="font-semibold text-foreground">{order.paymentMethod}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/admin/orders/${id}/invoice`)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
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
