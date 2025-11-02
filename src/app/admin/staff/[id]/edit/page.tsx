'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { staffEditSchema, StaffEditFormInput } from '@/schemas/admin/staff';

export default function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffEditFormInput>({
    resolver: zodResolver(staffEditSchema) as any,
    defaultValues: {
      active: true,
    },
  });

  useEffect(() => {
    // TODO: Fetch staff data from API
    reset({
      name: 'Rahul Kumar',
      phone: '9876543210',
      email: 'rahul@example.com',
      role: 'technician',
      serviceArea: 'Bandra, Khar',
      active: true,
    });
  }, [id, reset]);

  const onSubmit = async (data: StaffEditFormInput) => {
    try {
      console.log('Updating staff:', id, data);
      toast.success('Staff updated successfully!');
      router.push('/admin/staff');
    } catch (error) {
      toast.error('Failed to update staff');
    }
  };

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(`/admin/staff/${id}`)} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
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
              <Label htmlFor="role" className="text-xs sm:text-sm">Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="role" className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="serviceArea" className="text-xs sm:text-sm">Service Area</Label>
              <Input
                id="serviceArea"
                placeholder="e.g., Bandra, Khar"
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('serviceArea')}
              />
              {errors.serviceArea && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.serviceArea.message}</p>
              )}
            </div>

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

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 h-9 sm:h-10 text-xs sm:text-sm border-2"
                onClick={() => router.push('/admin/staff')}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 shadow-lg h-10 sm:h-11 text-xs sm:text-sm border-2" disabled={isSubmitting}>
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
