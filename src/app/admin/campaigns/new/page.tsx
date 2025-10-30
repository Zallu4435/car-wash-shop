'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Megaphone } from 'lucide-react';
import { AdminRoutes } from '@/lib/constants/routes';
import { toast } from 'sonner';

export default function NewCampaignPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Campaign created successfully!');
    router.push(AdminRoutes.CAMPAIGNS);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.CAMPAIGNS)} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
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
              <CardTitle>Create New Campaign</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Launch a marketing campaign</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campaign Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input id="name" placeholder="Diwali Sale 2025" required />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Campaign Type</Label>
              <Select required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">Discount Campaign</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="seasonal">Seasonal Offer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your campaign..."
                rows={4}
              />
            </div>

            {/* Budget & Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input id="budget" type="number" placeholder="50000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount %</Label>
                <Input id="discount" type="number" placeholder="20" />
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

            {/* Submit Button */}
            <Button type="submit" className="w-full shadow-lg" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Campaign
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
