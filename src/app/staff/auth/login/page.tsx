'use client';

// @ts-nocheck
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { useLogin } from '@/api/domains/auth/queries';
import { StaffRoutes } from '@/lib/constants/routes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffLoginSchema, StaffLoginInput } from '@/schemas/staff/auth';

export default function StaffLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffLoginInput>({
    resolver: zodResolver(staffLoginSchema) as any,
  });

  const onSubmit = (data: StaffLoginInput) => {
    loginMutation.mutate(
      { phone: data.phone, otp: data.otp },
      {
        onSuccess: (response) => {
          if (response.user.role !== 'staff') {
            toast.error('You do not have staff access');
            return;
          }
          const next = searchParams.get('next');
          router.push(next || StaffRoutes.DASHBOARD);
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Login failed');
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Staff Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  {...register('phone')}
                  className="pl-10"
                  maxLength={10}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="otp">One-Time Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-digit OTP"
                  {...register('otp')}
                  className="pl-10"
                  maxLength={6}
                />
              </div>
              {errors.otp && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.otp.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
