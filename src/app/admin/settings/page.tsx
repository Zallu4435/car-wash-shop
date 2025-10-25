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
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: 'hsl(221 83% 53% / 0.1)' }}
            >
              <Truck className="h-5 w-5" style={{ color: 'hsl(221 83% 53%)' }} />
            </div>
            <div>
              <CardTitle>Delivery Settings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Configure delivery fees and options</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="flex items-center justify-between p-5 bg-muted rounded-xl border border-border">
            <div className="flex-1 pr-4">
              <Label htmlFor="enableCod" className="cursor-pointer text-base font-semibold">
                Enable COD
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Allow customers to pay on delivery
              </p>
            </div>
            <Switch 
              id="enableCod" 
              checked={codEnabled} 
              onCheckedChange={setCodEnabled}
              className="flex-shrink-0" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: 'hsl(160 60% 45% / 0.1)' }}
            >
              <CreditCard className="h-5 w-5" style={{ color: 'hsl(160 60% 45%)' }} />
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

          <div className="flex items-center justify-between p-5 bg-muted rounded-xl border border-border">
            <div className="flex-1 pr-4">
              <Label htmlFor="enableAdvance" className="cursor-pointer text-base font-semibold">
                Allow Advance Payments
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Let customers pay partial amount upfront
              </p>
            </div>
            <Switch 
              id="enableAdvance" 
              checked={advancePaymentsEnabled} 
              onCheckedChange={setAdvancePaymentsEnabled}
              className="flex-shrink-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings Card */}
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: 'hsl(280 65% 60% / 0.1)' }}
            >
              <Settings className="h-5 w-5" style={{ color: 'hsl(280 65% 60%)' }} />
            </div>
            <div>
              <CardTitle>General Settings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Configure general application settings</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input id="taxRate" type="number" defaultValue="18" step="0.01" />
              <p className="text-xs text-muted-foreground">GST/Tax percentage for orders</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancellationWindow">Cancellation Window (hours)</Label>
              <Input id="cancellationWindow" type="number" defaultValue="24" />
              <p className="text-xs text-muted-foreground">Time limit for free cancellation</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-muted rounded-xl border border-border">
              <div className="flex-1 pr-4">
                <Label htmlFor="notifications" className="cursor-pointer text-base font-semibold">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Send email updates to customers
                </p>
              </div>
              <Switch id="notifications" defaultChecked className="flex-shrink-0" />
            </div>

            <div className="flex items-center justify-between p-5 bg-muted rounded-xl border border-border">
              <div className="flex-1 pr-4">
                <Label htmlFor="autoConfirm" className="cursor-pointer text-base font-semibold">
                  Auto-confirm Bookings
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically confirm new bookings
                </p>
              </div>
              <Switch id="autoConfirm" defaultChecked className="flex-shrink-0" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3 pb-6">
        <Button onClick={handleSave} size="lg" className="shadow-lg">
          <CheckCircle className="mr-2 h-5 w-5" />
          Save Settings
        </Button>
        <Button variant="outline" size="lg">
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
