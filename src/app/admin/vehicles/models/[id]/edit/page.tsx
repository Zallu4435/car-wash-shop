'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Car, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { vehicleModelSchema, VehicleModelFormInput } from '@/schemas/admin/vehicle-model';

export default function EditVehicleModelPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [uploadedImage, setUploadedImage] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleModelFormInput>({
    resolver: zodResolver(vehicleModelSchema) as any,
    defaultValues: {
      active: true,
      popular: false,
    },
  });

  useEffect(() => {
    const fetchModel = async () => {
      try {
        // TODO: Replace with actual API call
        const existingData = {
          name: 'City',
          brand: 'honda',
          bodyType: 'sedan',
          vehicleType: '4-Wheeler' as const,
          year: 2024,
          fuelType: 'petrol' as const,
          image: '/images/vehicles/honda-city.jpg',
          active: true,
          popular: true,
        };
        
        if (existingData.image) {
          setUploadedImage(existingData.image);
        }
        reset(existingData);
      } catch (error) {
        toast.error('Failed to load vehicle model');
      }
    };

    fetchModel();
  }, [id, reset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);
        setValue('image', imageUrl);
        toast.success('Image uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: VehicleModelFormInput) => {
    try {
      console.log('Updating model:', id, data);
      toast.success('Vehicle model updated successfully!');
      router.push('/admin/vehicles/models');
    } catch (error) {
      toast.error('Failed to update vehicle model');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/vehicles/models')} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Models
        </Button>
      </div>

      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Edit Vehicle Model</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Update vehicle model details</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Model Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Model Image <span className="text-xs text-muted-foreground">(Optional)</span></Label>
              <div className="flex items-center gap-4">
                {uploadedImage ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-border">
                    <img src={uploadedImage} alt="Model" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Label htmlFor="image" className="cursor-pointer">
                    <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-block">
                      Change Image
                    </div>
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Model Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., City, Swift, Activa" 
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="brand">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="honda">Honda</SelectItem>
                        <SelectItem value="toyota">Toyota</SelectItem>
                        <SelectItem value="maruti">Maruti Suzuki</SelectItem>
                        <SelectItem value="hyundai">Hyundai</SelectItem>
                        <SelectItem value="hero">Hero</SelectItem>
                        <SelectItem value="bajaj">Bajaj</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.brand && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.brand.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bodyType">Body Type</Label>
                <Controller
                  name="bodyType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="bodyType">
                        <SelectValue placeholder="Select body type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="hatchback">Hatchback</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="scooty">Scooty</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.bodyType && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.bodyType.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Controller
                name="vehicleType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="vehicleType">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4-Wheeler">4-Wheeler</SelectItem>
                      <SelectItem value="2-Wheeler">2-Wheeler</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.vehicleType && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.vehicleType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                <Input 
                  id="year" 
                  type="number" 
                  placeholder="2024" 
                  {...register('year', { valueAsNumber: true })}
                />
                {errors.year && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.year.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                <Controller
                  name="fuelType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="fuelType">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="cng">CNG</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div>
                  <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                  <p className="text-xs text-muted-foreground mt-1">Model is available for selection</p>
                </div>
                <Controller
                  name="active"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div>
                  <Label htmlFor="popular" className="cursor-pointer">Popular Model</Label>
                  <p className="text-xs text-muted-foreground mt-1">Show in popular models section</p>
                </div>
                <Controller
                  name="popular"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="popular"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                onClick={() => router.push('/admin/vehicles/models')}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 shadow-lg" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
