'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Car, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const carBrands = [
  { value: 'toyota', label: 'Toyota' },
  { value: 'honda', label: 'Honda' },
  { value: 'maruti', label: 'Maruti Suzuki' },
  { value: 'hyundai', label: 'Hyundai' },
  { value: 'tata', label: 'Tata' },
  { value: 'mahindra', label: 'Mahindra' },
  { value: 'kia', label: 'Kia' },
  { value: 'mg', label: 'MG Motor' },
];

export default function AddVehiclePage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Vehicle added successfully!');
    router.push('/profile/vehicles');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <Button
            variant="ghost"
            onClick={() => router.push('/profile/vehicles')}
            className="mb-4 hover:bg-muted"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vehicles
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Add New Vehicle</h1>
              <p className="text-muted-foreground mt-1">Register your vehicle for easy booking</p>
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
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Vehicle Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Brand Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="brand">Vehicle Brand</Label>
                    <Select required>
                      <SelectTrigger id="brand">
                        <SelectValue placeholder="Select your vehicle brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {carBrands.map((brand) => (
                          <SelectItem key={brand.value} value={brand.value}>
                            {brand.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Model */}
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="e.g., Camry, City, Swift"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the exact model name of your vehicle
                    </p>
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <Label htmlFor="year">Manufacturing Year</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="year"
                        type="number"
                        placeholder="2023"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Plate Number */}
                  <div className="space-y-2">
                    <Label htmlFor="plate">
                      Registration Number <span className="text-xs text-muted-foreground">(Optional)</span>
                    </Label>
                    <Input
                      id="plate"
                      placeholder="MH12AB1234"
                      className="font-mono uppercase"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your vehicle's registration number without spaces
                    </p>
                  </div>

                  {/* Info Box */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>Note:</strong> Adding vehicle details helps us provide personalized service recommendations and faster booking experience.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full shadow-lg" size="lg">
                    Add Vehicle
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
