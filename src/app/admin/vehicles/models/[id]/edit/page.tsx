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
import { ArrowLeft, Save, Car, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { vehicleModelSchema, VehicleModelFormInput } from '@/schemas/admin/vehicle-model';
import { AdminRoutes } from '@/lib/constants/routes';

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

  const handleRemoveImage = () => {
    setUploadedImage('');
    setValue('image', '');
    toast.success('Image removed');
  };

  const onSubmit = async (data: VehicleModelFormInput) => {
    try {
      console.log('Updating model:', id, data);
      toast.success('Vehicle model updated successfully!');
      router.push(AdminRoutes.VEHICLE_MODELS);
    } catch (error) {
      toast.error('Failed to update vehicle model');
    }
  };

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6 pb-6">
      <div>
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.VEHICLE_MODELS)} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Models
        </Button>
      </div>

      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 md:p-3 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20 flex-shrink-0">
              <Save className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg md:text-xl">Edit Vehicle Model</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Update vehicle model details</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Model Image */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="image" className="text-xs sm:text-sm">Model Image <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
              <div className="flex items-center gap-3 sm:gap-4">
                {uploadedImage ? (
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg sm:rounded-xl overflow-hidden border-2 border-border group flex-shrink-0">
                    <img src={uploadedImage} alt="Model" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-110 z-10"
                      aria-label="Remove image"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4 stroke-[3]" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-lg sm:rounded-xl flex items-center justify-center border-2 border-dashed border-border flex-shrink-0">
                    <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Label htmlFor="image" className="cursor-pointer">
                    <div className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-block border-2 border-primary">
                      Change Image
                    </div>
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">Model Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., City, Swift, Activa" 
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="brand" className="text-xs sm:text-sm">Brand</Label>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="brand" className="h-9 sm:h-10 text-xs sm:text-sm">
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
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.brand.message}</p>
                )}
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="bodyType" className="text-xs sm:text-sm">Body Type</Label>
                <Controller
                  name="bodyType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="bodyType" className="h-9 sm:h-10 text-xs sm:text-sm">
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
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.bodyType.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="vehicleType" className="text-xs sm:text-sm">Vehicle Type</Label>
              <Controller
                name="vehicleType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="vehicleType" className="h-9 sm:h-10 text-xs sm:text-sm">
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
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.vehicleType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="year" className="text-xs sm:text-sm">Year <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
                <Input 
                  id="year" 
                  type="number" 
                  placeholder="2024" 
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                  {...register('year', { valueAsNumber: true })}
                />
                {errors.year && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.year.message}</p>
                )}
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="fuelType" className="text-xs sm:text-sm">Fuel Type <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
                <Controller
                  name="fuelType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="fuelType" className="h-9 sm:h-10 text-xs sm:text-sm">
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

            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <div className="min-w-0 flex-1 mr-3">
                  <Label htmlFor="active" className="cursor-pointer text-xs sm:text-sm">Active Status</Label>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Model is available for selection</p>
                </div>
                <Controller
                  name="active"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="flex-shrink-0"
                    />
                  )}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <div className="min-w-0 flex-1 mr-3">
                  <Label htmlFor="popular" className="cursor-pointer text-xs sm:text-sm">Popular Model</Label>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Show in popular models section</p>
                </div>
                <Controller
                  name="popular"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="popular"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="flex-shrink-0"
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 h-9 sm:h-10 text-xs sm:text-sm border-2" 
                onClick={() => router.push(AdminRoutes.VEHICLE_MODELS)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 h-10 sm:h-11 text-xs sm:text-sm border-2" disabled={isSubmitting}>
                <Save className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
