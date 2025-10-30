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
import { ArrowLeft, Save, Folder } from 'lucide-react';
import { toast } from 'sonner';

// Mock data - replace with actual data fetching
const mockCategory = {
  name: 'Exterior Wash',
  type: 'service',
  description: 'Exterior cleaning services',
  active: true,
};

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [name, setName] = useState(mockCategory.name);
  const [type, setType] = useState(mockCategory.type);
  const [description, setDescription] = useState(mockCategory.description);
  const [active, setActive] = useState(mockCategory.active);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Category updated successfully!');
    router.push('/admin/categories');
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/categories')} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
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
              <CardTitle>Edit Category</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Category ID: {id}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Enter a descriptive name for the category</p>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Choose whether this category is for services or products</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">Add a detailed description of what this category includes</p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {active ? 'Category is visible and can be used' : 'Category is hidden'}
                </p>
              </div>
              <Switch id="active" checked={active} onCheckedChange={setActive} />
            </div>

            {/* Preview */}
            <div className="p-4 bg-primary/10 rounded-xl border-2 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Folder className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Preview</p>
                  <p className="font-semibold text-foreground">{name || 'Category Name'}</p>
                  <p className="text-xs text-muted-foreground capitalize">{type} Category</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> Changes will affect all services or products under this category.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 cursor-pointer"
                onClick={() => router.push('/admin/categories')}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 shadow-lg cursor-pointer">
                <Save className="mr-2 h-5 w-5" />
                Update Category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
