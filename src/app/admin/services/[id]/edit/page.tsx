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
import { ArrowLeft, Save, Car, Clock, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

// Mock data
const mockService = {
  name: 'Premium Wash',
  categoryId: 'cat_ext',
  description: 'Complete exterior wash with foam, high-pressure rinse, and tire cleaning',
  price: 499,
  duration: 30,
  active: true,
};

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [name, setName] = useState(mockService.name);
  const [category, setCategory] = useState(mockService.categoryId);
  const [description, setDescription] = useState(mockService.description);
  const [price, setPrice] = useState(mockService.price.toString());
  const [duration, setDuration] = useState(mockService.duration.toString());
  const [active, setActive] = useState(mockService.active);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Service updated successfully!');
    router.push('/admin/services');
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/services')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
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
              <CardTitle>Edit Service</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Service ID: {id}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
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
                  <SelectItem value="cat_ext">Exterior Wash</SelectItem>
                  <SelectItem value="cat_int">Interior Detailing</SelectItem>
                  <SelectItem value="cat_full">Complete Detailing</SelectItem>
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

            {/* Price & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {active ? 'Service is available for booking' : 'Service is hidden'}
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
                onClick={() => router.push('/admin/services')}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 shadow-lg">
                <Save className="mr-2 h-5 w-5" />
                Update Service
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
