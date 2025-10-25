'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, Folder } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function NewCategoryPage() {
  const router = useRouter();
  const [active, setActive] = useState(true);
  const [type, setType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Category added successfully!');
    router.push('/admin/categories');
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/catalog/categories')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
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
              <CardTitle>Add New Category</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Create a new category for services or products</p>
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
                placeholder="e.g., Exterior Wash"
                required
              />
              <p className="text-xs text-muted-foreground">Enter a descriptive name for the category</p>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select category type" />
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
                placeholder="Describe this category..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">Add a detailed description of what this category includes</p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-1">Category is visible and can be used</p>
              </div>
              <Switch id="active" checked={active} onCheckedChange={setActive} />
            </div>

            {/* Preview */}
            {type && (
              <div className="p-4 bg-primary/10 rounded-xl border-2 border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <Folder className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Preview</p>
                    <p className="font-semibold text-foreground">
                      {type === 'service' ? 'Service Category' : 'Product Category'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full shadow-lg" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Category
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
