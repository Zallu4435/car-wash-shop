'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Save, Percent } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSettingsPage() {
  const [codEnabled, setCodEnabled] = useState(true);
  const [advanceEnabled, setAdvanceEnabled] = useState(true);
  const [advancePercent, setAdvancePercent] = useState('30');

  const handleSave = () => {
    toast.success('Payment settings saved!');
  };

  const balancePercent = 100 - parseInt(advancePercent || '0');

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Payment Settings</h1>
        <p className="text-muted-foreground mt-1">Configure payment methods and options</p>
      </div>

      {/* Form */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-xl">
              <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle>Payment Configuration</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Set up payment rules and options</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="advancePercent">Advance Payment Percentage (%)</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="advancePercent" 
                type="number" 
                min="0" 
                max="100"
                value={advancePercent}
                onChange={(e) => setAdvancePercent(e.target.value)}
                className="pl-10" 
              />
            </div>
            <p className="text-xs text-muted-foreground">Percentage to be paid upfront for service bookings</p>
          </div>

          {/* Preview Breakdown */}
          <div className="p-4 bg-muted rounded-xl">
            <p className="text-xs text-muted-foreground mb-3">Payment Breakdown (for ₹1000 order)</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <p className="text-xs text-green-900 dark:text-green-100 mb-1">Advance</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">₹{parseInt(advancePercent || '0') * 10}</p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <p className="text-xs text-orange-900 dark:text-orange-100 mb-1">Balance</p>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">₹{balancePercent * 10}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="enableCod" className="cursor-pointer">Enable COD</Label>
                <p className="text-xs text-muted-foreground mt-1">Allow Cash on Delivery payments</p>
              </div>
              <Switch id="enableCod" checked={codEnabled} onCheckedChange={setCodEnabled} />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="enableAdvance" className="cursor-pointer">Enable Advance Payments</Label>
                <p className="text-xs text-muted-foreground mt-1">Allow partial upfront payments</p>
              </div>
              <Switch id="enableAdvance" checked={advanceEnabled} onCheckedChange={setAdvanceEnabled} />
            </div>
          </div>

          <Separator />

          {/* Info Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Payment Options Summary</p>
            <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <p>• {codEnabled ? '✓' : '✗'} Cash on Delivery: {codEnabled ? 'Enabled' : 'Disabled'}</p>
              <p>• {advanceEnabled ? '✓' : '✗'} Advance Payments: {advanceEnabled ? 'Enabled' : 'Disabled'} ({advancePercent}%)</p>
              <p>• Online payments via Stripe/Razorpay</p>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full shadow-lg" size="lg">
            <Save className="mr-2 h-5 w-5" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
