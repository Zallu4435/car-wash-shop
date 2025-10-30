'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function NewCouponPage() {
  const router = useRouter();
  const [active, setActive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Coupon created successfully!');
    router.push('/admin/coupons');
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/coupons')} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Coupons
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Create New Coupon</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Add a new discount coupon</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Coupon Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                placeholder="e.g., SAVE100"
                className="font-mono uppercase"
                required
              />
              <p className="text-xs text-muted-foreground">Use uppercase letters and numbers only</p>
            </div>

            {/* Discount Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Discount Type</Label>
              <Select required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Discount Value */}
            <div className="space-y-2">
              <Label htmlFor="value">Discount Value</Label>
              <Input
                id="value"
                type="number"
                placeholder="100"
                required
              />
              <p className="text-xs text-muted-foreground">Amount in ₹ or percentage value</p>
            </div>

            {/* Min Order Value */}
            <div className="space-y-2">
              <Label htmlFor="minOrder">Minimum Order Value (₹)</Label>
              <Input
                id="minOrder"
                type="number"
                placeholder="500"
                required
              />
            </div>

            {/* Usage Limit */}
            <div className="space-y-2">
              <Label htmlFor="limit">Usage Limit</Label>
              <Input
                id="limit"
                type="number"
                placeholder="1000"
                required
              />
              <p className="text-xs text-muted-foreground">Total number of times this coupon can be used</p>
            </div>

            {/* Valid Until */}
            <div className="space-y-2">
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                required
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-1">Coupon is available for use</p>
              </div>
              <Switch id="active" checked={active} onCheckedChange={setActive} />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full shadow-lg" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Coupon
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
