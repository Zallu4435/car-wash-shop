'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, Image as ImageIcon, X } from 'lucide-react';
import { AdminRoutes } from '@/lib/constants/routes';
import { toast } from 'sonner';
import { bannerSchema, BannerFormInput } from '@/schemas/admin/banner';

export default function NewBannerPage() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BannerFormInput>({
    resolver: zodResolver(bannerSchema) as any,
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

  const onSubmit = async (data: BannerFormInput) => {
    try {
      console.log('Banner data:', data);
      toast.success('Banner created successfully!');
      router.push(AdminRoutes.BANNERS);
    } catch (error) {
      toast.error('Failed to create banner');
    }
  };

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.BANNERS)} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Banners
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 md:p-3 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20 flex-shrink-0">
              <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg md:text-xl">Create New Banner</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Add a promotional banner</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Banner Image */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="image" className="text-xs sm:text-sm">Banner Image</Label>
              <div className="flex items-center gap-3 sm:gap-4">
                {uploadedImage ? (
                  <div className="relative w-full h-40 sm:h-48 rounded-lg sm:rounded-xl overflow-hidden border-2 border-border group">
                    <img src={uploadedImage} alt="Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-110 z-10"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3]" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-40 sm:h-48 bg-muted rounded-lg sm:rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                    <ImageIcon className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
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
            </div>

            {/* Title */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="title" className="text-xs sm:text-sm">Banner Title</Label>
              <Input 
                id="title" 
                placeholder="Premium Wash - 20% Off" 
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="description" className="text-xs sm:text-sm">Description <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
              <Textarea
                id="description"
                placeholder="Describe the banner offer..."
                rows={3}
                className="text-xs sm:text-sm resize-none"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Link & Display Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="link" className="text-xs sm:text-sm">Link URL <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
                <Input 
                  id="link" 
                  placeholder="https://example.com" 
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                  {...register('link')}
                />
                {errors.link && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.link.message}</p>
                )}
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="displayOrder" className="text-xs sm:text-sm">Display Order <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
                <Input 
                  id="displayOrder" 
                  type="number" 
                  placeholder="1" 
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                  {...register('displayOrder', { valueAsNumber: true })}
                />
                {errors.displayOrder && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.displayOrder.message}</p>
                )}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="startDate" className="text-xs sm:text-sm">Start Date <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
                <Input 
                  id="startDate" 
                  type="date" 
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                  {...register('startDate')}
                />
                {errors.startDate && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="endDate" className="text-xs sm:text-sm">End Date <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
                <Input 
                  id="endDate" 
                  type="date" 
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                  {...register('endDate')}
                />
                {errors.endDate && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
              <div className="min-w-0 flex-1 mr-3">
                <Label htmlFor="active" className="cursor-pointer text-xs sm:text-sm">Active Status</Label>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Banner is visible on the website</p>
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

            {errors.image && (
              <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.image.message}</p>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full h-10 sm:h-11 text-xs sm:text-sm border-2" disabled={isSubmitting}>
              <Plus className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {isSubmitting ? 'Creating...' : 'Create Banner'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
