'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { staffSchema, StaffFormInput } from '@/schemas/admin/staff';

export default function NewStaffPage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormInput>({
    resolver: zodResolver(staffSchema) as any,
    defaultValues: {
      active: true,
    },
  });

  const onSubmit = async (data: StaffFormInput) => {
    try {
      console.log('Staff data:', data);
      toast.success('Staff member added successfully!');
      router.push('/admin/staff');
    } catch (error) {
      toast.error('Failed to add staff member');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/staff')} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Staff
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Add New Staff Member</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Enter staff details below</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g., Rahul Kumar"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="9876543210"
                maxLength={10}
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.phone.message}</p>
              )}
              {!errors.phone && (
                <p className="text-xs text-muted-foreground">Enter 10-digit mobile number</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="rahul@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
              {!errors.password && (
                <p className="text-xs text-muted-foreground">Min 8 characters with uppercase, lowercase & number</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="role">
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
                <p className="text-xs text-red-600 dark:text-red-400">{errors.role.message}</p>
              )}
            </div>

            {/* Service Area */}
            <div className="space-y-2">
              <Label htmlFor="serviceArea">Service Area</Label>
              <Input
                id="serviceArea"
                placeholder="e.g., Bandra, Khar"
                {...register('serviceArea')}
              />
              {errors.serviceArea && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.serviceArea.message}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-1">Staff member can receive jobs</p>
              </div>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full shadow-lg" size="lg" disabled={isSubmitting}>
              <UserPlus className="mr-2 h-5 w-5" />
              {isSubmitting ? 'Adding...' : 'Add Staff Member'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
