'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { StaffRoutes } from '@/lib/constants/routes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffLoginSchema, StaffLoginInput } from '@/schemas/staff/auth';
import { useLoginWithCredentials } from '@/api/domains/auth/queries';

export default function StaffLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginWithCredentials();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffLoginInput>({
    resolver: zodResolver(staffLoginSchema) as any,
  });

  const onSubmit = (data: StaffLoginInput) => {
    loginMutation.mutate(
      { identifier: data.identifier, password: data.password },
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
              <Label htmlFor="identifier">Phone Number or Email</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder="9876543210 or staff@example.com"
                  {...register('identifier')}
                  className="pl-10"
                />
              </div>
              {errors.identifier && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.identifier.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register('password')}
                  className="pl-10"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full border-2" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
