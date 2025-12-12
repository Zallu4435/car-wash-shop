'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ActiveStatusField } from '@/components/shared/form/ActiveStatusField';
import { ArrowLeft, Save, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { staffEditSchema, StaffEditFormInput } from '@/schemas/admin/staff';
import { AdminRoutes } from '@/lib/constants/routes';
import { useAdminStaffDetail, useUpdateStaff } from '@/api/domains/admin-staff/queries';

export default function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: staffMember, isLoading } = useAdminStaffDetail(id);
  const updateStaff = useUpdateStaff();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<StaffEditFormInput>({
    resolver: zodResolver(staffEditSchema) as any,
    defaultValues: {
      active: true,
    },
  });

  useEffect(() => {
    if (staffMember) {
      reset({
        name: staffMember.name,
        phone: staffMember.phone,
        email: staffMember.email,
        active: staffMember.status === 'active',
      });
    }
  }, [staffMember, reset]);

  const isSubmitting = updateStaff.isPending;

  const onSubmit = async (data: StaffEditFormInput) => {
    try {
      const updateData: any = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.active ? 'active' : 'suspended',
      };

      // Only include password if it's provided and not empty
      if (data.password && data.password.trim() !== '') {
        updateData.password = data.password;
      }

      await updateStaff.mutateAsync({ staffId: id, input: updateData });
      router.push(AdminRoutes.STAFF_DETAIL(id));
    } catch (error: any) {
      // Error is already handled by the mutation hook
      console.error('Failed to update staff:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading staff details...</p>
      </div>
    );
  }

  if (!staffMember) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Staff member not found</p>
        <Button onClick={() => router.push(AdminRoutes.STAFF)}>Back to Staff</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.STAFF_DETAIL(id))} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Staff Details
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 md:p-3 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20 flex-shrink-0">
              <Save className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg md:text-xl">Edit Staff Member</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Staff ID: {id}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
              <Input
                id="phone"
                placeholder="9876543210"
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm">Email <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
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

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-xs sm:text-sm">New Password <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional - leave blank to keep current password)</span></Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password (min 8 characters)"
                  className="h-9 sm:h-10 text-xs sm:text-sm pl-10"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
              {!errors.password && (
                <p className="text-[10px] sm:text-xs text-muted-foreground">Min 8 characters with uppercase, lowercase & number</p>
              )}
            </div>

            <ActiveStatusField
              control={control}
              description="Staff member can receive jobs"
            />

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-9 sm:h-10 text-xs sm:text-sm border-2"
                onClick={() => router.push(AdminRoutes.STAFF)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 h-10 sm:h-11 text-xs sm:text-sm border-2" disabled={isSubmitting}>
                <Save className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {isSubmitting ? 'Updating...' : 'Update Staff Member'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
