'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Tag } from 'lucide-react';
import { toast } from 'sonner';

// Mock data - replace with actual data fetching
const mockCoupon = {
  code: 'FIRST20',
  type: 'percentage',
  value: 20,
  minOrderValue: 500,
  usageLimit: 1000,
  validUntil: '2025-12-31',
  active: true,
};

export default function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [code, setCode] = useState(mockCoupon.code);
  const [type, setType] = useState(mockCoupon.type);
  const [value, setValue] = useState(mockCoupon.value.toString());
  const [minOrder, setMinOrder] = useState(mockCoupon.minOrderValue.toString());
  const [usageLimit, setUsageLimit] = useState(mockCoupon.usageLimit.toString());
  const [validUntil, setValidUntil] = useState(mockCoupon.validUntil);
  const [active, setActive] = useState(mockCoupon.active);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Coupon updated successfully!');
    router.push('/admin/coupons');
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(`/admin/coupons/${id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Coupon Details
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Save className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Edit Coupon</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Coupon ID: {id}</p>
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
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="font-mono uppercase"
                required
              />
              <p className="text-xs text-muted-foreground">Use uppercase letters and numbers only</p>
            </div>

            {/* Discount Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Discount Type</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Discount Value */}
            <div className="space-y-2">
              <Label htmlFor="value">
                Discount Value {type === 'percentage' ? '(%)' : '(₹)'}
              </Label>
              <Input
                id="value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                {type === 'percentage' 
                  ? 'Enter percentage value (e.g., 20 for 20% off)' 
                  : 'Enter amount in rupees'}
              </p>
            </div>

            {/* Min Order Value */}
            <div className="space-y-2">
              <Label htmlFor="minOrder">Minimum Order Value (₹)</Label>
              <Input
                id="minOrder"
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Minimum cart value required to use this coupon
              </p>
            </div>

            {/* Usage Limit */}
            <div className="space-y-2">
              <Label htmlFor="limit">Usage Limit</Label>
              <Input
                id="limit"
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Total number of times this coupon can be used
              </p>
            </div>

            {/* Valid Until */}
            <div className="space-y-2">
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Coupon expiration date
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {active ? 'Coupon is available for use' : 'Coupon is disabled'}
                </p>
              </div>
              <Switch id="active" checked={active} onCheckedChange={setActive} />
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> Changes will be applied immediately. Make sure all information is correct before saving.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => router.push(`/admin/coupons/${id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 shadow-lg">
                <Save className="mr-2 h-5 w-5" />
                Update Coupon
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Preview</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-card rounded-xl border-2 border-primary">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Coupon Code</p>
                <p className="text-2xl font-mono font-bold text-foreground">{code || 'COUPON'}</p>
              </div>
              {active ? (
                <div className="px-3 py-1 bg-green-100 dark:bg-green-950/30 rounded-full">
                  <p className="text-xs font-semibold text-green-600 dark:text-green-400">Active</p>
                </div>
              ) : (
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Inactive</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Get{' '}
                <span className="font-bold text-primary">
                  {type === 'percentage' ? `${value}% OFF` : `₹${value} OFF`}
                </span>
                {' '}on orders above{' '}
                <span className="font-semibold">₹{minOrder}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Valid until {validUntil} • {usageLimit} uses available
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
