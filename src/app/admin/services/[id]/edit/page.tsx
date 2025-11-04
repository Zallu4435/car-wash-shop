'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Car, Clock, IndianRupee, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { serviceSchema, ServiceFormInput } from '@/schemas/admin/service';
import { AdminRoutes } from '@/lib/constants/routes';

// Mock data
const mockService = {
  name: 'Premium Wash',
  categoryId: 'cat_ext',
  description: 'Complete exterior wash with foam, high-pressure rinse, and tire cleaning',
  price: 499,
  duration: 30,
  active: true,
};

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormInput>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: {
      active: true,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage('');
    toast.success('Image removed');
  };

  useEffect(() => {
    // TODO: Fetch service data from API
    reset({
      name: mockService.name,
      category: mockService.categoryId,
      description: mockService.description,
      price: mockService.price,
      duration: mockService.duration,
      active: mockService.active,
    });
  }, [id, reset]);

  const onSubmit = async (data: ServiceFormInput) => {
    try {
      console.log('Updating service:', id, data);
      toast.success('Service updated successfully!');
      router.push(AdminRoutes.SERVICES);
    } catch (error) {
      toast.error('Failed to update service');
    }
  };

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.SERVICES)} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Services
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 md:p-3 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20 flex-shrink-0">
              <Save className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg md:text-xl">Edit Service</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Service ID: {id}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Service Image */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="image" className="text-xs sm:text-sm font-medium">Service Image</Label>
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4">
                {uploadedImage ? (
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg sm:rounded-xl overflow-hidden border-2 border-border flex-shrink-0 group">
                    <img src={uploadedImage} alt="Service" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-110 z-10"
                      aria-label="Remove image"
                    >
                      <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[3]" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-lg sm:rounded-xl flex items-center justify-center border-2 border-dashed border-border flex-shrink-0">
                    <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 w-full xs:w-auto">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Label htmlFor="image" className="cursor-pointer">
                    <div className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-block border-2 border-primary">
                      Upload Image
                    </div>
                  </Label>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2">
                    Recommended: Square image, at least 500x500px
                  </p>
                </div>
              </div>
            </div>

            {/* Service Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">Service Name</Label>
              <Input
                id="name"
                placeholder="e.g., Premium Wash"
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="category" className="text-xs sm:text-sm">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="category" className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cat_ext">Exterior Wash</SelectItem>
                      <SelectItem value="cat_int">Interior Detailing</SelectItem>
                      <SelectItem value="cat_full">Complete Detailing</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.category.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="description" className="text-xs sm:text-sm">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the service..."
                rows={4}
                className="text-xs sm:text-sm resize-none"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="price" className="text-xs sm:text-sm">Price (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="299"
                    className="pl-9 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
                    {...register('price', { valueAsNumber: true })}
                  />
                </div>
                {errors.price && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.price.message}</p>
                )}
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="duration" className="text-xs sm:text-sm">Duration (minutes)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  <Input
                    id="duration"
                    type="number"
                    placeholder="30"
                    className="pl-9 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
                    {...register('duration', { valueAsNumber: true })}
                  />
                </div>
                {errors.duration && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.duration.message}</p>
                )}
              </div>
            </div>

            {/* Vehicle Type */}
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
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.vehicleType && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.vehicleType.message}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
              <div className="min-w-0 flex-1 mr-3">
                <Label htmlFor="active" className="cursor-pointer text-xs sm:text-sm">Active Status</Label>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                  Service is available for booking
                </p>
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

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 h-9 sm:h-10 text-xs sm:text-sm border-2"
                onClick={() => router.push(AdminRoutes.SERVICES)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 h-10 sm:h-11 text-xs sm:text-sm border-2" disabled={isSubmitting}>
                <Save className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {isSubmitting ? 'Updating...' : 'Update Service'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
