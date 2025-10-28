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
    <div className="space-y-4 sm:space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Configure your application settings
        </p>
      </div>

      {/* Delivery Settings */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3">
            <div 
              className="p-1.5 sm:p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: 'hsl(221 83% 53% / 0.1)' }}
            >
              <Truck className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(221 83% 53%)' }} />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg">Delivery Settings</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                Configure delivery fees and options
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="codFee" className="text-xs sm:text-sm">COD Delivery Fee (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input id="codFee" type="number" defaultValue="40" className="pl-9 sm:pl-10 h-10 sm:h-11 text-xs sm:text-sm" />
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Fee charged for Cash on Delivery orders
              </p>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="freeDelivery" className="text-xs sm:text-sm">Free Delivery Minimum (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input id="freeDelivery" type="number" defaultValue="500" className="pl-9 sm:pl-10 h-10 sm:h-11 text-xs sm:text-sm" />
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Minimum order value for free delivery
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 bg-muted rounded-lg sm:rounded-xl border border-border">
            <div className="flex-1 min-w-0">
              <Label htmlFor="enableCod" className="cursor-pointer text-sm sm:text-base font-semibold block">
                Enable COD
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
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
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3">
            <div 
              className="p-1.5 sm:p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: 'hsl(160 60% 45% / 0.1)' }}
            >
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(160 60% 45%)' }} />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg">Payment Settings</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                Configure payment options and rules
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="advancePercent" className="text-xs sm:text-sm">
              Advance Payment Percentage (%)
            </Label>
            <Input id="advancePercent" type="number" defaultValue="30" className="h-10 sm:h-11 text-xs sm:text-sm" />
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Percentage of total amount to be paid in advance
            </p>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 bg-muted rounded-lg sm:rounded-xl border border-border">
            <div className="flex-1 min-w-0">
              <Label htmlFor="enableAdvance" className="cursor-pointer text-sm sm:text-base font-semibold block">
                Allow Advance Payments
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
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
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3">
            <div 
              className="p-1.5 sm:p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: 'hsl(280 65% 60% / 0.1)' }}
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(280 65% 60%)' }} />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg">General Settings</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                Configure general application settings
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="taxRate" className="text-xs sm:text-sm">Tax Rate (%)</Label>
              <Input id="taxRate" type="number" defaultValue="18" step="0.01" className="h-10 sm:h-11 text-xs sm:text-sm" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                GST/Tax percentage for orders
              </p>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="cancellationWindow" className="text-xs sm:text-sm">
                Cancellation Window (hours)
              </Label>
              <Input id="cancellationWindow" type="number" defaultValue="24" className="h-10 sm:h-11 text-xs sm:text-sm" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Time limit for free cancellation
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 bg-muted rounded-lg sm:rounded-xl border border-border">
              <div className="flex-1 min-w-0">
                <Label htmlFor="notifications" className="cursor-pointer text-sm sm:text-base font-semibold block">
                  Email Notifications
                </Label>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                  Send email updates to customers
                </p>
              </div>
              <Switch id="notifications" defaultChecked className="flex-shrink-0" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 bg-muted rounded-lg sm:rounded-xl border border-border">
              <div className="flex-1 min-w-0">
                <Label htmlFor="autoConfirm" className="cursor-pointer text-sm sm:text-base font-semibold block">
                  Auto-confirm Bookings
                </Label>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                  Automatically confirm new bookings
                </p>
              </div>
              <Switch id="autoConfirm" defaultChecked className="flex-shrink-0" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pb-4 sm:pb-6">
        <Button onClick={handleSave} size="lg" className="shadow-lg h-11 sm:h-12 text-sm sm:text-base w-full sm:w-auto">
          <CheckCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Save Settings
        </Button>
        <Button variant="outline" size="lg" className="h-11 sm:h-12 text-sm sm:text-base w-full sm:w-auto">
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
