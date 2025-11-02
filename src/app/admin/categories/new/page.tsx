'use client';

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
import { ArrowLeft, Plus, Folder } from 'lucide-react';
import { toast } from 'sonner';
import { categorySchema, CategoryFormInput } from '@/schemas/admin/category';

export default function NewCategoryPage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormInput>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      active: true,
    },
  });

  const icon = watch('icon');

  const onSubmit = async (data: CategoryFormInput) => {
    try {
      console.log('Category data:', data);
      toast.success('Category added successfully!');
      router.push('/admin/categories');
    } catch (error) {
      toast.error('Failed to add category');
    }
  };

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/categories')} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Categories
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
              <CardTitle className="text-base sm:text-lg md:text-xl">Add New Category</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Create a new category for services or products</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Category Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">Category Name</Label>
              <Input
                id="name"
                placeholder="e.g., Exterior Wash"
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Icon */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="icon" className="text-xs sm:text-sm">Icon Name</Label>
              <Input
                id="icon"
                placeholder="e.g., car, sparkles, droplet"
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('icon')}
              />
              {errors.icon && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.icon.message}</p>
              )}
              {!errors.icon && (
                <p className="text-[10px] sm:text-xs text-muted-foreground">Enter a Lucide icon name</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="description" className="text-xs sm:text-sm">
                Description <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe this category..."
                rows={4}
                className="text-xs sm:text-sm resize-none"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
              <div className="min-w-0 flex-1 mr-3">
                <Label htmlFor="active" className="cursor-pointer text-xs sm:text-sm">Active Status</Label>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Category is visible and can be used</p>
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

            {/* Preview */}
            {icon && (
              <div className="p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary rounded-lg flex-shrink-0">
                    <Folder className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Icon Preview</p>
                    <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{icon}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full shadow-lg h-10 sm:h-11 text-xs sm:text-sm border-2" disabled={isSubmitting}>
              <Plus className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {isSubmitting ? 'Adding...' : 'Add Category'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
