'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, Image as ImageIcon } from 'lucide-react';
import { AdminRoutes } from '@/lib/constants/routes';
import { toast } from 'sonner';

export default function NewBannerPage() {
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
    toast.success('Banner created successfully!');
    router.push(AdminRoutes.BANNERS);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.BANNERS)} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Banners
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
              <CardTitle>Create New Banner</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Add a promotional banner</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Banner Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Banner Image</Label>
              <div className="flex items-center gap-4">
                {uploadedImage ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-border">
                    <img src={uploadedImage} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
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
                  Upload Image
                </div>
              </Label>
            </div>

            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Banner Title</Label>
                <Input id="title" placeholder="Premium Wash - 20% Off" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                <Input id="subtitle" placeholder="Limited time offer" />
              </div>
            </div>

            {/* Position & Pages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select required>
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero (Top of page)</SelectItem>
                    <SelectItem value="middle">Middle Section</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Display On Pages</Label>
                <Input id="pages" placeholder="Home, Services" required />
              </div>
            </div>

            {/* CTA Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaText">Button Text (Optional)</Label>
                <Input id="ctaText" placeholder="Book Now" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaLink">Button Link (Optional)</Label>
                <Input id="ctaLink" placeholder="/services" />
              </div>
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
                <p className="text-xs text-muted-foreground mt-1">Banner is visible on the website</p>
              </div>
              <Switch id="active" checked={active} onCheckedChange={setActive} />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full shadow-lg" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Banner
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
