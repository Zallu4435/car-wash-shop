'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { AdminRoutes } from '@/lib/constants/routes';
import { useAdminOrderDetail, useUpdateOrderStatus } from '@/api/domains/admin-orders/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

const statusOptions = [
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400', icon: '⏳' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400', icon: '✅' },
  { value: 'packed', label: 'Packed', color: 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400', icon: '📦' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400', icon: '🚚' },
  { value: 'out-for-delivery', label: 'Out for Delivery', color: 'bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400', icon: '🚛' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400', icon: '✓' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400', icon: '✕' },
  { value: 'returned', label: 'Returned', color: 'bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400', icon: '↺' },
];

export default function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: order, isLoading, error, refetch } = useAdminOrderDetail(id);
  const { mutateAsync: updateStatus, isPending } = useUpdateOrderStatus();
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const status = pendingStatus ?? order?.status ?? 'processing';

  const currentStatus = statusOptions.find((s) => s.value === status);

  const handleUpdate = async () => {
    try {
      await updateStatus({
        orderId: id,
        input: { status, note: notes || undefined },
      });
      setPendingStatus(null);
      setNotes('');
      toast.success('Order status updated successfully!');
      router.push(AdminRoutes.ORDER_DETAIL(id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update order status';
      toast.error(message);
    }
  };

  if (isLoading) {
    return <Loading text="Loading order..." />;
  }

  if (error || !order) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    return (
      <Error
        message="Unable to load order"
        details={errorMessage}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.ORDER_DETAIL(id))} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Order
        </Button>
        <Badge variant="outline" className="font-mono">
          #{order.orderNumber}
        </Badge>
      </div>

      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Update Order Status</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Current status: {order.status.replace(/-/g, ' ')}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted rounded-xl">
            <p className="text-sm text-muted-foreground mb-2">Selected Status</p>
            <Badge className={currentStatus?.color}>
              <span className="mr-2">{currentStatus?.icon}</span>
              {currentStatus?.label}
            </Badge>
          </div>

          <div className="space-y-3">
            <Label>Select New Status</Label>
            <RadioGroup value={status} onValueChange={setPendingStatus}>
              {statusOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    status === option.value ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'
                  }`}
                  onClick={() => setPendingStatus(option.value)}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex items-center gap-3 flex-1 cursor-pointer">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {option.value.replace(/-/g, ' ')}
                      </p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              Additional Notes <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Add tracking details, delivery partner info, or any other message for this update"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Notes will be stored with the order and shared with the customer notification.
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Reminder:</strong> Customers receive instant notifications for every status update.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push(AdminRoutes.ORDER_DETAIL(id))}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} className="flex-1 shadow-lg" disabled={isPending}>
              <Save className="mr-2 h-5 w-5" />
              {isPending ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
