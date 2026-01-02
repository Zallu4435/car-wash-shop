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
import { useAdminOrderDetail, useUpdateOrderStatus } from '@/api/domains/admin-orders/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import type { AdminOrderAddress } from '@/types/admin';

const statusColors: Record<string, { bgColor: string; color: string }> = {
  pending: { bgColor: 'bg-amber-100 dark:bg-amber-950/30', color: 'text-amber-600 dark:text-amber-400' },
  processing: { bgColor: 'bg-blue-100 dark:bg-blue-950/30', color: 'text-blue-600 dark:text-blue-400' },
  confirmed: { bgColor: 'bg-green-100 dark:bg-green-950/30', color: 'text-green-600 dark:text-green-400' },
  packed: { bgColor: 'bg-indigo-100 dark:bg-indigo-950/30', color: 'text-indigo-600 dark:text-indigo-400' },
  shipped: { bgColor: 'bg-purple-100 dark:bg-purple-950/30', color: 'text-purple-600 dark:text-purple-400' },
  'out-for-delivery': { bgColor: 'bg-orange-100 dark:bg-orange-950/30', color: 'text-orange-600 dark:text-orange-400' },
  delivered: { bgColor: 'bg-green-100 dark:bg-green-950/30', color: 'text-green-600 dark:text-green-400' },
  cancelled: { bgColor: 'bg-red-100 dark:bg-red-950/30', color: 'text-red-600 dark:text-red-400' },
  returned: { bgColor: 'bg-rose-100 dark:bg-rose-950/30', color: 'text-rose-600 dark:text-rose-400' },
};

const statusOptions = [
  { value: 'processing', label: 'Processing' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'packed', label: 'Packed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'out-for-delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
];

const formatCurrency = (value?: number) =>
  `₹${(value ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const formatAddress = (address?: AdminOrderAddress) => {
  if (!address) return 'Address not available';
  return [address.line1, address.line2, address.city, address.state, address.pincode].filter(Boolean).join(', ');
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: order, isLoading, error, refetch } = useAdminOrderDetail(id);
  const { mutateAsync: updateOrderStatus, isPending: isUpdating } = useUpdateOrderStatus();
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const status = pendingStatus ?? order?.status ?? 'processing';

  const handleStatusUpdate = async (newStatus: string) => {
    setPendingStatus(newStatus);
    try {
      await updateOrderStatus({ orderId: id, input: { status: newStatus } });
      setPendingStatus(null);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      setPendingStatus(null);
      const message = err instanceof Error ? err.message : 'Failed to update status';
      toast.error(message);
    }
  };

  if (isLoading) {
    return <Loading text="Loading order details..." />;
  }

  if (error || !order) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    return (
      <Error
        message="Failed to load order details"
        details={errorMessage}
        onRetry={() => refetch()}
      />
    );
  }

  const currentStatusStyle = statusColors[status] || statusColors.processing;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => router.push(AdminRoutes.ORDERS)}
          className="h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2"
        >
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Orders
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-2"
            onClick={() => router.push(AdminRoutes.ORDER_STATUS(id))}
          >
            Manage Status
          </Button>
          <Button
            variant="outline"
            className="border-2"
            onClick={() => router.push(AdminRoutes.ORDER_INVOICE(id))}
          >
            <FileText className="mr-2 h-4 w-4" />
            Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm sm:text-base lg:text-lg truncate">
                      Order #{order.orderNumber}
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs sm:text-sm flex-shrink-0 border-2 capitalize ${currentStatusStyle.color}`}
                >
                  {status.replace(/-/g, ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <h3 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 text-foreground">
                  Customer Details
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="font-semibold text-sm sm:text-base text-foreground">
                    {order.customer?.name || 'Guest user'}
                  </p>
                  {order.customer?.phone && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{order.customer.phone}</span>
                    </div>
                  )}
                  {order.customer?.email && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{order.customer.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-foreground">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Order Items
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {(order.items || []).map((item) => {
                    const total = item.subtotal ?? item.price * item.quantity;
                    return (
                      <div
                        key={`${item.id}-${item.productId}`}
                        className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs sm:text-sm lg:text-base text-foreground truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="text-sm sm:text-base lg:text-lg font-bold text-primary flex-shrink-0">
                          {formatCurrency(total)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <h3 className="font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-foreground">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Delivery Address
                </h3>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {formatAddress(order.deliveryAddress)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Quick Status Update</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {status === 'cancelled' || status === 'delivered' ? (
                <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-950/20 rounded-lg sm:rounded-xl border-2 border-red-200 dark:border-red-800">
                  <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                    This order has been {status}. Status changes are no longer allowed.
                  </p>
                </div>
              ) : (
                <>
                  <Select value={status} onValueChange={handleStatusUpdate} disabled={isUpdating}>
                    <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="force-sheet-bg border-2 rounded-lg">
                      {statusOptions.map((option) => (
                        <SelectItem
                          value={option.value}
                          key={option.value}
                          className="text-xs sm:text-sm rounded-md capitalize"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Need to add notes? Use the <strong>Manage Status</strong> action for a detailed update.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

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
                  <span className="font-semibold text-foreground flex-shrink-0">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between gap-2 text-xs sm:text-sm">
                    <span className="text-green-600 dark:text-green-400">Discount</span>
                    <span className="font-semibold text-green-600 dark:text-green-400 flex-shrink-0">
                      -{formatCurrency(order.discount)}
                    </span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between gap-2 text-xs sm:text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold text-foreground flex-shrink-0">
                      {formatCurrency(order.tax)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span
                    className={`font-semibold flex-shrink-0 ${(order.shippingFee || 0) === 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-foreground'
                      }`}
                  >
                    {(order.shippingFee || 0) === 0 ? 'FREE' : formatCurrency(order.shippingFee)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-foreground">Total</span>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary flex-shrink-0" />
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-muted rounded-lg border-2 border-border">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Payment Method</p>
                <p className="font-semibold text-xs sm:text-sm text-foreground capitalize">
                  {order.paymentMethod} ({order.paymentStatus})
                </p>
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
                {order.customer?.phone && (
                  <Button variant="outline" className="w-full h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
                    <Phone className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {order.customer.phone}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
