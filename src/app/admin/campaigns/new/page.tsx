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
import { ArrowLeft, Plus, Megaphone } from 'lucide-react';
import { AdminRoutes } from '@/lib/constants/routes';
import { toast } from 'sonner';
import { campaignSchema, CampaignFormInput } from '@/schemas/admin/campaign';

export default function NewCampaignPage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormInput>({
    resolver: zodResolver(campaignSchema) as any,
    defaultValues: {
      active: true,
    },
  });

  const onSubmit = async (data: CampaignFormInput) => {
    try {
      console.log('Campaign data:', data);
      toast.success('Campaign created successfully!');
      router.push(AdminRoutes.CAMPAIGNS);
    } catch (error) {
      toast.error('Failed to create campaign');
    }
  };

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.CAMPAIGNS)} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Campaigns
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
              <CardTitle className="text-base sm:text-lg md:text-xl">Create New Campaign</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Launch a marketing campaign</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Campaign Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">Campaign Name</Label>
              <Input 
                id="name" 
                placeholder="Diwali Sale 2025" 
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Type */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="type" className="text-xs sm:text-sm">Campaign Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="type" className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Campaign</SelectItem>
                      <SelectItem value="sms">SMS Campaign</SelectItem>
                      <SelectItem value="notification">Push Notification</SelectItem>
                      <SelectItem value="banner">Banner Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.type.message}</p>
              )}
            </div>

            {/* Target Audience */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="targetAudience" className="text-xs sm:text-sm">Target Audience</Label>
              <Controller
                name="targetAudience"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="targetAudience" className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="active">Active Customers</SelectItem>
                      <SelectItem value="inactive">Inactive Customers</SelectItem>
                      <SelectItem value="new">New Customers</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.targetAudience && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.targetAudience.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="description" className="text-xs sm:text-sm">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your campaign..."
                rows={4}
                className="text-xs sm:text-sm resize-none"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Budget */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="budget" className="text-xs sm:text-sm">Budget (₹) <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
              <Input 
                id="budget" 
                type="number" 
                placeholder="50000" 
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('budget', { valueAsNumber: true })}
              />
              {errors.budget && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.budget.message}</p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="startDate" className="text-xs sm:text-sm">Start Date</Label>
                <Input 
                  id="startDate" 
                  type="date" 
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                  {...register('startDate')}
                />
                {errors.startDate && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="endDate" className="text-xs sm:text-sm">End Date</Label>
                <Input 
                  id="endDate" 
                  type="date" 
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                  {...register('endDate')}
                />
                {errors.endDate && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
              <div className="min-w-0 flex-1 mr-3">
                <Label htmlFor="active" className="cursor-pointer text-xs sm:text-sm">Active Status</Label>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Campaign is active and running</p>
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

            {/* Submit Button */}
            <Button type="submit" className="w-full shadow-lg h-10 sm:h-11 text-xs sm:text-sm border-2" disabled={isSubmitting}>
              <Plus className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {isSubmitting ? 'Creating...' : 'Create Campaign'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
