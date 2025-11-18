'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { staffSchema, StaffFormInput } from '@/schemas/admin/staff';
import { AdminRoutes } from '@/lib/constants/routes';
import { useCreateStaff } from '@/api/domains/admin-staff/queries';

export default function NewStaffPage() {
  const router = useRouter();
  const createStaff = useCreateStaff();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StaffFormInput>({
    resolver: zodResolver(staffSchema) as any,
    defaultValues: {
      active: true,
    },
  });

  const isSubmitting = createStaff.isPending;

  const onSubmit = async (data: StaffFormInput) => {
    try {
      // Validate password is provided
      if (!data.password || data.password.trim() === '') {
        toast.error('Password is required');
        return;
      }

      // Map frontend form fields to backend API format
      const staffData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        status: data.active ? 'active' : 'suspended', // Map active to status (active or suspended)
      };

      await createStaff.mutateAsync(staffData);
      router.push(AdminRoutes.STAFF);
    } catch (error: any) {
      // Error is already handled by the mutation hook
      console.error('Failed to create staff:', error);
    }
  };

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.STAFF)} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Staff
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 md:p-3 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20 flex-shrink-0">
              <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg md:text-xl">Add New Staff Member</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Enter staff details below</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Full Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g., Rahul Kumar"
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
              <Input
                id="phone"
                placeholder="9876543210"
                maxLength={10}
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.phone.message}</p>
              )}
              {!errors.phone && (
                <p className="text-[10px] sm:text-xs text-muted-foreground">Enter 10-digit mobile number</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="rahul@example.com"
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
              {!errors.password && (
                <p className="text-[10px] sm:text-xs text-muted-foreground">Min 8 characters with uppercase, lowercase & number</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
              <div className="min-w-0 flex-1 mr-3">
                <Label htmlFor="active" className="cursor-pointer text-xs sm:text-sm">Active Status</Label>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Staff member can receive jobs</p>
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
            <Button type="submit" className="w-full h-10 sm:h-11 text-xs sm:text-sm border-2" disabled={isSubmitting}>
              <UserPlus className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {isSubmitting ? 'Adding...' : 'Add Staff Member'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
