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
import { ArrowLeft, Plus, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { productSchema, ProductFormInput } from '@/schemas/admin/product';
import { AdminRoutes } from '@/lib/constants/routes';

export default function NewProductPage() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      active: true,
      featured: false,
      images: [],
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);
        setValue('images', [imageUrl]);
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage('');
    setValue('images', []);
    toast.success('Image removed');
  };

  const onSubmit = async (data: ProductFormInput) => {
    try {
      console.log('Product data:', data);
      toast.success('Product added successfully!');
      router.push(AdminRoutes.PRODUCTS);
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.PRODUCTS)} className="h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Products
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm sm:text-base lg:text-lg">Add New Product</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Add a new product to your inventory</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Product Image */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="image" className="text-xs sm:text-sm font-medium">Product Image</Label>
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4">
                {uploadedImage ? (
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg sm:rounded-xl overflow-hidden border-2 border-border flex-shrink-0 group">
                    <img src={uploadedImage} alt="Product" className="w-full h-full object-cover" />
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

            {/* Product Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm font-medium">Product Name</Label>
              <Input
                id="name"
                placeholder="e.g., Premium Car Shampoo"
                className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="category" className="text-xs sm:text-sm font-medium">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="category" className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="force-sheet-bg border-2 rounded-lg">
                      <SelectItem value="cat_clean" className="text-xs sm:text-sm rounded-md">Cleaning Products</SelectItem>
                      <SelectItem value="cat_care" className="text-xs sm:text-sm rounded-md">Car Care</SelectItem>
                      <SelectItem value="cat_accessories" className="text-xs sm:text-sm rounded-md">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.category.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="description" className="text-xs sm:text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the product features and benefits..."
                rows={4}
                className="text-xs sm:text-sm border-2 rounded-lg resize-none"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="price" className="text-xs sm:text-sm font-medium">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="299"
                  className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg"
                  {...register('price', { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.price.message}</p>
                )}
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="stock" className="text-xs sm:text-sm font-medium">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="50"
                  className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg"
                  {...register('stock', { valueAsNumber: true })}
                />
                {errors.stock && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.stock.message}</p>
                )}
              </div>
            </div>

            {/* SKU & Compare Price */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="sku" className="text-xs sm:text-sm font-medium">SKU <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
                <Input
                  id="sku"
                  placeholder="PROD-001"
                  className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg"
                  {...register('sku')}
                />
                {errors.sku && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.sku.message}</p>
                )}
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="comparePrice" className="text-xs sm:text-sm font-medium">Compare Price (₹) <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
                <Input
                  id="comparePrice"
                  type="number"
                  placeholder="399"
                  className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg"
                  {...register('comparePrice', { valueAsNumber: true })}
                />
                {errors.comparePrice && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.comparePrice.message}</p>
                )}
              </div>
            </div>

            {/* Active & Featured Status */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <div className="min-w-0 flex-1">
                  <Label htmlFor="active" className="cursor-pointer text-xs sm:text-sm font-medium">Active Status</Label>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Product is visible in the store</p>
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
              
              <div className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <div className="min-w-0 flex-1">
                  <Label htmlFor="featured" className="cursor-pointer text-xs sm:text-sm font-medium">Featured Product</Label>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Show in featured section</p>
                </div>
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="featured"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            {errors.images && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.images.message}</p>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base border-2 rounded-lg" disabled={isSubmitting}>
              <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
