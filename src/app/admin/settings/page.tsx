'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Truck, CreditCard, IndianRupee, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [codEnabled, setCodEnabled] = useState(true);
  const [advancePaymentsEnabled, setAdvancePaymentsEnabled] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your application settings</p>
      </div>

      {/* Delivery Settings */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
              <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>Delivery Settings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Configure delivery fees and options</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codFee">COD Delivery Fee (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="codFee" type="number" defaultValue="40" className="pl-10" />
              </div>
              <p className="text-xs text-muted-foreground">Fee charged for Cash on Delivery orders</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="freeDelivery">Free Delivery Minimum (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="freeDelivery" type="number" defaultValue="500" className="pl-10" />
              </div>
              <p className="text-xs text-muted-foreground">Minimum order value for free delivery</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
            <div>
              <Label htmlFor="enableCod" className="cursor-pointer">Enable COD</Label>
              <p className="text-xs text-muted-foreground mt-1">Allow customers to pay on delivery</p>
            </div>
            <Switch id="enableCod" checked={codEnabled} onCheckedChange={setCodEnabled} />
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-950/30 rounded-lg">
              <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle>Payment Settings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Configure payment options and rules</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="advancePercent">Advance Payment Percentage (%)</Label>
            <Input id="advancePercent" type="number" defaultValue="30" />
            <p className="text-xs text-muted-foreground">Percentage of total amount to be paid in advance</p>
          </div>

          <Separator />

          <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
            <div>
              <Label htmlFor="enableAdvance" className="cursor-pointer">Allow Advance Payments</Label>
              <p className="text-xs text-muted-foreground mt-1">Let customers pay partial amount upfront</p>
            </div>
            <Switch id="enableAdvance" checked={advancePaymentsEnabled} onCheckedChange={setAdvancePaymentsEnabled} />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button onClick={handleSave} size="lg" className="shadow-lg">
          <CheckCircle className="mr-2 h-5 w-5" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
