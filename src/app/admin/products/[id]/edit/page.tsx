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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ActiveStatusField } from '@/components/shared/form/ActiveStatusField';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { productSchema, ProductFormInput } from '@/schemas/admin/product';
import { AdminRoutes } from '@/lib/constants/routes';
import { useAdminProductDetail, useUpdateProduct, useAdminCategoryList } from '@/api/domains/admin-catalog/queries';

// Removed mocks; using real API via queries

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState('');
  const { data: productDetail } = useAdminProductDetail(id);
  const updateProduct = useUpdateProduct();
  const { data: categoriesResponse } = useAdminCategoryList({ type: 'product', status: 'active' });
  const productCategories = categoriesResponse?.data || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      active: true,
      featured: false,
      comingSoon: false,
    },
  });

  useEffect(() => {
    const product: any = productDetail;
    if (product && product.id) {
      // Extract category ID - handle both object and string formats
      let categoryValue = '';
      if (product.categoryId) {
        // Handle if categoryId is an object
        if (typeof product.categoryId === 'object' && product.categoryId !== null) {
          categoryValue = product.categoryId._id || product.categoryId.id || '';
        } else {
          categoryValue = String(product.categoryId);
        }
      } else if (product.category) {
        // Category might be an object with _id or id, or a string
        if (typeof product.category === 'object' && product.category !== null) {
          categoryValue = product.category._id || product.category.id || '';
        } else {
          categoryValue = String(product.category);
        }
      }

      // If categories are already loaded, try to map category name to ID
      if (productCategories.length > 0 && categoryValue) {
        // Check if categoryValue is already a valid ID
        const foundById = productCategories.find(cat => cat.id === categoryValue);
        if (!foundById) {
          // If not found by ID, try to find by name (in case categoryValue is a name string)
          const matchingCategory = productCategories.find(cat => cat.name === categoryValue);
          if (matchingCategory) {
            categoryValue = matchingCategory.id;
          }
        }
      }

      // Set each field individually to ensure all fields update
      if (product.name != null) setValue('name', product.name);
      if (product.description != null) setValue('description', product.description);
      if (categoryValue) setValue('category', categoryValue);
      if (product.price != null) setValue('price', Number(product.price));
      if (product.stock != null) setValue('stock', Number(product.stock));
      if (product.sku != null) setValue('sku', product.sku);
      if (product.comparePrice != null) setValue('comparePrice', Number(product.comparePrice));
      if (product.isAvailable != null) {
        setValue('active', Boolean(product.isAvailable));
      } else if (product.active != null) {
        setValue('active', Boolean(product.active));
      }
      if (product.featured != null) setValue('featured', Boolean(product.featured));
      if (product.comingSoon != null) setValue('comingSoon', Boolean(product.comingSoon));
      if (product.image) {
        setValue('images', [product.image]);
        setUploadedImage(product.image);
      }
    }
  }, [productDetail, setValue, productCategories]);

  // Update category field when categories are loaded (if category wasn't set correctly initially)
  useEffect(() => {
    const product: any = productDetail;
    if (product && productCategories.length > 0) {
      // Extract category ID - handle both object and string formats
      let categoryValue: string = '';
      if (product.categoryId) {
        categoryValue = product.categoryId;
      } else if (product.category) {
        if (typeof product.category === 'object' && product.category !== null) {
          categoryValue = product.category._id || product.category.id || '';
        } else {
          categoryValue = product.category;
        }
      }

      // If category is a name string, try to find the matching category ID
      if (categoryValue) {
        const foundById = productCategories.find(cat => cat.id === categoryValue);
        if (!foundById) {
          const matchingCategory = productCategories.find(cat => cat.name === categoryValue);
          if (matchingCategory) {
            setValue('category', matchingCategory.id);
          }
        } else {
          // Ensure the category is set even if it's already correct
          setValue('category', categoryValue);
        }
      }
    }
  }, [productDetail, productCategories, setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);
        setValue('images', [imageUrl]);
        toast.success('Image updated successfully');
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
      await updateProduct.mutateAsync({ productId: id, input: data as any });
      toast.success('Product updated successfully!');
      router.push(AdminRoutes.PRODUCTS);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update product');
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
            <Save className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm sm:text-base lg:text-lg">Edit Product</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Product ID: {id}</p>
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
                      Change Image
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
                placeholder="e.g., Car Shampoo"
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={productCategories.length === 0}>
                    <SelectTrigger id="category" className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
                      <SelectValue placeholder={productCategories.length === 0 ? "No categories available" : "Select category"} />
                    </SelectTrigger>
                    <SelectContent className="force-sheet-bg border-2 rounded-lg">
                      {productCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="text-xs sm:text-sm rounded-md">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {productCategories.length === 0 && (
                <p className="text-xs text-muted-foreground">Please create a category first before editing products.</p>
              )}
              {errors.category && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.category.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="description" className="text-xs sm:text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the product..."
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

            {/* Active & Coming Soon Status */}
            <div className="space-y-2 sm:space-y-3">
              <ActiveStatusField
                control={control}
                description="Product is visible in the store"
              />

              <div className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <div className="min-w-0 flex-1">
                  <Label htmlFor="comingSoon" className="cursor-pointer text-xs sm:text-sm font-medium">Coming Soon</Label>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Product is visible but not purchasable</p>
                </div>
                <Controller
                  name="comingSoon"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="comingSoon"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg"
                onClick={() => router.push(AdminRoutes.PRODUCTS)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg" disabled={isSubmitting || updateProduct.isPending}>
                <Save className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {isSubmitting || updateProduct.isPending ? 'Updating...' : 'Update Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
