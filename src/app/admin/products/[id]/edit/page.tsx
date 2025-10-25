'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Package, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

// Mock data
const mockProduct = {
  name: 'Car Shampoo',
  categoryId: 'cat_clean',
  description: 'Premium car shampoo with advanced cleaning formula',
  price: 299,
  stock: 50,
  active: true,
  image: '',
};

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [name, setName] = useState(mockProduct.name);
  const [category, setCategory] = useState(mockProduct.categoryId);
  const [description, setDescription] = useState(mockProduct.description);
  const [price, setPrice] = useState(mockProduct.price.toString());
  const [stock, setStock] = useState(mockProduct.stock.toString());
  const [active, setActive] = useState(mockProduct.active);
  const [uploadedImage, setUploadedImage] = useState(mockProduct.image);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        toast.success('Image updated successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Product updated successfully!');
    router.push('/admin/products');
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/products')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Save className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Edit Product</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Product ID: {id}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="flex items-center gap-4">
                {uploadedImage ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-border">
                    <img src={uploadedImage} alt="Product" className="w-full h-full object-cover" />
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

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cat_clean">Cleaning Products</SelectItem>
                  <SelectItem value="cat_care">Car Care</SelectItem>
                  <SelectItem value="cat_accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {active ? 'Product is visible in the store' : 'Product is hidden'}
                </p>
              </div>
              <Switch id="active" checked={active} onCheckedChange={setActive} />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => router.push('/admin/products')}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 shadow-lg">
                <Save className="mr-2 h-5 w-5" />
                Update Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
