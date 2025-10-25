'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Truck, Save, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

export default function DeliveryFeesPage() {
  const handleSave = () => {
    toast.success('Delivery settings saved!');
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Delivery Fee Settings</h1>
        <p className="text-muted-foreground mt-1">Configure delivery charges and thresholds</p>
      </div>

      {/* Form */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-xl">
              <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>Delivery Configuration</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Set up delivery fees and rules</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="codFee">COD Delivery Fee (₹)</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="codFee" type="number" defaultValue="40" className="pl-10" />
            </div>
            <p className="text-xs text-muted-foreground">Additional fee for Cash on Delivery orders</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="standardFee">Standard Delivery Fee (₹)</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="standardFee" type="number" defaultValue="0" className="pl-10" />
            </div>
            <p className="text-xs text-muted-foreground">Base delivery fee for all orders</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="freeDeliveryMin">Free Delivery Minimum Order (₹)</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="freeDeliveryMin" type="number" defaultValue="500" className="pl-10" />
            </div>
            <p className="text-xs text-muted-foreground">Orders above this amount get free delivery</p>
          </div>

          <Separator />

          {/* Preview */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Preview</p>
            <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <p>• Orders below ₹500: Standard fee applies</p>
              <p>• Orders ₹500 and above: Free delivery</p>
              <p>• COD orders: Additional ₹40 fee</p>
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
