'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, FileImage, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function NewPosterPage() {
  const router = useRouter();
  const [active, setActive] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        toast.success('Image uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Poster created successfully!');
    router.push('/admin/marketing/posters');
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/marketing/posters')}>
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
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Input id="title" placeholder="Summer Special" required />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Display Location</Label>
              <Select required>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home Page</SelectItem>
                  <SelectItem value="services">Services Page</SelectItem>
                  <SelectItem value="products">Products Page</SelectItem>
                  <SelectItem value="about">About Page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" required />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-1">Poster is visible on the website</p>
              </div>
              <Switch id="active" checked={active} onCheckedChange={setActive} />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full shadow-lg" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Poster
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
