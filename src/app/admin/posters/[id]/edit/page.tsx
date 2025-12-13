'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ActiveStatusField } from '@/components/shared/form/ActiveStatusField';
import { ArrowLeft, Save, Image as ImageIcon, X } from 'lucide-react';
import { AdminRoutes } from '@/lib/constants/routes';
import { toast } from 'sonner';
import { posterSchema, PosterFormInput } from '@/schemas/admin/poster';
import { useAdminPosterDetail, useUpdatePoster } from '@/api/domains/admin-marketing/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

export default function EditPosterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string>('');

  const { data: poster, isLoading, error, refetch } = useAdminPosterDetail(id);
  const updatePosterMutation = useUpdatePoster();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PosterFormInput>({
    resolver: zodResolver(posterSchema) as any,
    defaultValues: {
      active: true,
      showButton: false,
      headingColor: '#ffffff',
      descriptionColor: '#ffffff',
    },
  });

  const showButton = watch('showButton');
  const headingColor = watch('headingColor');
  const descriptionColor = watch('descriptionColor');

  // Populate form when poster data loads
  useEffect(() => {
    if (poster) {
      reset({
        title: poster.title || '',
        description: poster.description || '',
        image: poster.image || '',
        endDate: poster.endDate || '',
        headingColor: poster.headingColor || '#ffffff',
        descriptionColor: poster.descriptionColor || '#ffffff',
        showButton: poster.showButton || false,
        buttonText: poster.buttonText || '',
        buttonLink: poster.buttonLink || '',
        active: poster.active ?? true,
        displayOrder: poster.displayOrder || 0,
      });
      setUploadedImage(poster.image || '');
    }
  }, [poster, reset]);

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

  const onSubmit = async (data: PosterFormInput) => {
    try {
      await updatePosterMutation.mutateAsync({ posterId: id, input: data });
      router.push(AdminRoutes.POSTERS);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  if (isLoading) {
    return <Loading text="Loading poster..." />;
  }

  if (error) {
    return (
      <Error
        message="Failed to load poster"
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.POSTERS)} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Posters
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
              <CardTitle className="text-base sm:text-lg md:text-xl">Edit Poster</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Update poster details</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Poster Image */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="image" className="text-xs sm:text-sm">Poster Image *</Label>
              <div className="flex items-center gap-3 sm:gap-4">
                {uploadedImage ? (
                  <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-lg sm:rounded-xl overflow-hidden border-2 border-border group">
                    <img src={uploadedImage} alt="Poster" className="w-full h-full object-cover" />
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
                  <div className="w-full h-48 sm:h-56 md:h-64 bg-muted rounded-lg sm:rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                    <ImageIcon className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-muted-foreground" />
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
                  Upload Poster Image
                </div>
              </Label>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Recommended: 1200x600px or larger</p>
              {errors.image && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.image.message}</p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="title" className="text-xs sm:text-sm">Poster Title *</Label>
              <Input
                id="title"
                placeholder="Summer Special Offer"
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
                placeholder="Describe the offer or promotion..."
                rows={3}
                className="text-xs sm:text-sm resize-none"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* End Date & Display Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="endDate" className="text-xs sm:text-sm">End Date *</Label>
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
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="displayOrder" className="text-xs sm:text-sm">Display Order <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
                <Input
                  id="displayOrder"
                  type="number"
                  placeholder="0"
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                  {...register('displayOrder', { valueAsNumber: true })}
                />
                {errors.displayOrder && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.displayOrder.message}</p>
                )}
              </div>
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="headingColor" className="text-xs sm:text-sm">Heading Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="headingColor"
                    type="color"
                    value={headingColor || '#ffffff'}
                    onChange={(e) => setValue('headingColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border-2 border-border cursor-pointer"
                  />
                  <Input
                    type="text"
                    placeholder="#ffffff"
                    value={headingColor || '#ffffff'}
                    onChange={(e) => setValue('headingColor', e.target.value)}
                    className="h-9 sm:h-10 text-xs sm:text-sm flex-1"
                  />
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="descriptionColor" className="text-xs sm:text-sm">Description Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="descriptionColor"
                    type="color"
                    value={descriptionColor || '#ffffff'}
                    onChange={(e) => setValue('descriptionColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border-2 border-border cursor-pointer"
                  />
                  <Input
                    type="text"
                    placeholder="#ffffff"
                    value={descriptionColor || '#ffffff'}
                    onChange={(e) => setValue('descriptionColor', e.target.value)}
                    className="h-9 sm:h-10 text-xs sm:text-sm flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Show Button Checkbox */}
            <div className="flex items-center space-x-3 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
              <Controller
                name="showButton"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="showButton"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <div>
                <Label htmlFor="showButton" className="cursor-pointer text-xs sm:text-sm">Show Call-to-Action Button</Label>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Display a button on the poster for users to click</p>
              </div>
            </div>

            {/* Button Text & Link (Conditional) */}
            {showButton && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-lg sm:rounded-xl border-2 border-dashed border-border">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="buttonText" className="text-xs sm:text-sm">Button Text</Label>
                  <Input
                    id="buttonText"
                    placeholder="Book Now"
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                    {...register('buttonText')}
                  />
                  {errors.buttonText && (
                    <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.buttonText.message}</p>
                  )}
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="buttonLink" className="text-xs sm:text-sm">Button Link</Label>
                  <Input
                    id="buttonLink"
                    placeholder="/services"
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                    {...register('buttonLink')}
                  />
                  {errors.buttonLink && (
                    <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.buttonLink.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Active Status */}
            <ActiveStatusField
              control={control}
              description="Poster is visible on the landing page"
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full h-10 sm:h-11 text-xs sm:text-sm border-2" disabled={isSubmitting || updatePosterMutation.isPending}>
              <Save className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {isSubmitting || updatePosterMutation.isPending ? 'Updating...' : 'Update Poster'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
