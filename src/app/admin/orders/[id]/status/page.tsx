'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Truck, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { AdminRoutes } from '@/lib/constants/routes';

const statusOptions = [
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400', icon: '⏳' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400', icon: '✅' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400', icon: '📦' },
  { value: 'out-for-delivery', label: 'Out for Delivery', color: 'bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400', icon: '🚚' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400', icon: '✓' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400', icon: '✕' },
];

export default function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [status, setStatus] = useState('processing');
  const [notes, setNotes] = useState('');

  const currentStatus = statusOptions.find(s => s.value === status);

  const handleUpdate = () => {
    toast.success('Order status updated successfully!');
    router.push(AdminRoutes.ORDER_DETAIL(id));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.ORDER_DETAIL(id))} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Order
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Update Order Status</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Order ID: {id}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status Display */}
          <div className="p-4 bg-muted rounded-xl">
            <p className="text-sm text-muted-foreground mb-2">Current Status</p>
            <Badge className={currentStatus?.color}>
              <span className="mr-2">{currentStatus?.icon}</span>
              {currentStatus?.label}
            </Badge>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <Label>Select New Status</Label>
            <RadioGroup value={status} onValueChange={setStatus}>
              {statusOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    status === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted'
                  }`}
                  onClick={() => setStatus(option.value)}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {option.value === 'processing' && 'Order is being prepared'}
                        {option.value === 'confirmed' && 'Order confirmed and ready'}
                        {option.value === 'shipped' && 'Order has been shipped'}
                        {option.value === 'out-for-delivery' && 'Order is out for delivery'}
                        {option.value === 'delivered' && 'Order delivered successfully'}
                        {option.value === 'cancelled' && 'Order has been cancelled'}
                      </p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              Additional Notes <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Add notes about the status update (e.g., tracking number, delivery partner, etc.)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              These notes will be visible in the order history
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Note:</strong> Customer will be notified via SMS/Email about this status update.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => router.push(AdminRoutes.ORDER_DETAIL(id))}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              className="flex-1 shadow-lg"
            >
              <Save className="mr-2 h-5 w-5" />
              Update Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
