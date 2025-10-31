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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, FileImage, Image as ImageIcon } from 'lucide-react';
import { AdminRoutes } from '@/lib/constants/routes';
import { toast } from 'sonner';
import { posterSchema, PosterFormInput } from '@/schemas/admin/poster';

export default function NewPosterPage() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PosterFormInput>({
    resolver: zodResolver(posterSchema) as any,
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

  const onSubmit = async (data: PosterFormInput) => {
    try {
      console.log('Poster data:', data);
      toast.success('Poster created successfully!');
      router.push(AdminRoutes.POSTERS);
    } catch (error) {
      toast.error('Failed to create poster');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.POSTERS)} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posters
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Create New Poster</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Upload a promotional poster</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Poster Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Poster Image</Label>
              <div className="flex items-center gap-4">
                {uploadedImage ? (
                  <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-border">
                    <img src={uploadedImage} alt="Poster" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
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
                <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-block">
                  Upload Poster Image
                </div>
              </Label>
              <p className="text-xs text-muted-foreground">Recommended: 1200x600px or larger</p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Poster Title</Label>
              <Input 
                id="title" 
                placeholder="Summer Special" 
                {...register('title')}
              />
              {errors.title && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-xs text-muted-foreground">(Optional)</span></Label>
              <Textarea
                id="description"
                placeholder="Describe the poster..."
                rows={3}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Link & Display Order */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="link">Link URL <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                <Input 
                  id="link" 
                  placeholder="https://example.com" 
                  {...register('link')}
                />
                {errors.link && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.link.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                <Input 
                  id="displayOrder" 
                  type="number" 
                  placeholder="1" 
                  {...register('displayOrder', { valueAsNumber: true })}
                />
                {errors.displayOrder && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.displayOrder.message}</p>
                )}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                <Input 
                  id="startDate" 
                  type="date" 
                  {...register('startDate')}
                />
                {errors.startDate && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                <Input 
                  id="endDate" 
                  type="date" 
                  {...register('endDate')}
                />
                {errors.endDate && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-1">Poster is visible on the website</p>
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

            {errors.image && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.image.message}</p>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full shadow-lg" size="lg" disabled={isSubmitting}>
              <Plus className="mr-2 h-5 w-5" />
              {isSubmitting ? 'Creating...' : 'Create Poster'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
