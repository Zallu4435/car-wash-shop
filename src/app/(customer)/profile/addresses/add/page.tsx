'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Home, Building2, MapPinned } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function AddAddressPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Address added successfully!');
    router.push('/profile/addresses');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <Button
            variant="ghost"
            onClick={() => router.push('/profile/addresses')}
            className="mb-4 hover:bg-muted"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Addresses
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Add New Address</h1>
              <p className="text-muted-foreground mt-1">Save a new delivery address</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPinned className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Address Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Address Label */}
                  <div className="space-y-2">
                    <Label htmlFor="label">Address Label</Label>
                    <Input
                      id="label"
                      placeholder="e.g., Home, Office, Parents' House"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Give this address a memorable name
                    </p>
                  </div>

                  {/* Address Type Quick Select */}
                  <div className="space-y-2">
                    <Label>Quick Select</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="flex items-center gap-3 p-4 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <Home className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">Home</span>
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-3 p-4 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <Building2 className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">Office</span>
                      </button>
                    </div>
                  </div>

                  {/* Complete Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Complete Address</Label>
                    <Textarea
                      id="address"
                      placeholder="House/Flat No., Street, Area, Locality, City, State, Pincode"
                      rows={4}
                      required
                    />
                  </div>

                  {/* Landmark */}
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                    <Input
                      id="landmark"
                      placeholder="e.g., Near Metro Station, Behind Shopping Mall"
                    />
                  </div>

                  {/* Default Address Toggle */}
                  <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                    <div>
                      <Label htmlFor="default" className="cursor-pointer">
                        Set as default address
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Use this address for all future orders
                      </p>
                    </div>
                    <Switch id="default" />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full shadow-lg" size="lg">
                    Save Address
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
