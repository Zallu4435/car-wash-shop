'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminLoginSchema } from '@/schemas/admin/auth';
import { useLoginWithCredentials } from '@/api/domains/auth/queries';
import { useAuth } from '@/context/AuthContext';
import { AdminRoutes } from '@/lib/constants/routes';
import Loading from '@/components/shared/display/Loading';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{ identifier: string; password: string }>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  const watchedIdentifier = watch('identifier');
  const isEmail = watchedIdentifier?.includes('@');

  const loginMutation = useLoginWithCredentials();

  const onLogin = ({ identifier, password }: { identifier: string; password: string }) => {
    setServerError(null);
    loginMutation.mutate(
      { identifier, password },
      {
        onSuccess: (data) => {
          setServerError(null);
          if (data.user.role !== 'admin') {
            toast.error('You do not have admin access');
            return;
          }
          // Set auth in context
          setAuth({ user: data.user, token: data.token });
          toast.success('Login successful!');
          const next = searchParams.get('next');
          router.push(next || AdminRoutes.DASHBOARD);
        },
        onError: (err: any) => {
          console.log(err);
          
          const apiMessage = err?.data?.message || err?.message || 'Login failed';
          setServerError(apiMessage);
          toast.error(apiMessage);
        },
      }
    );
  };

  if (loginMutation.isPending) {
    return <Loading text="Logging in..." />;
  }

  // Keep the form visible on error and show inline message instead of full-page error

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8 sm:py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-none hover:shadow-none">
          <CardHeader className="text-center space-y-1.5 sm:space-y-2 pb-4 sm:pb-6">
            <div className="flex items-center justify-center gap-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Admin Login</CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm px-2">
              Enter your email or phone number and password to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit(onLogin)} className="space-y-4 sm:space-y-5">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="identifier" className="text-xs sm:text-sm">
                  Email or Phone Number
                </Label>
                <div className="relative">
                  {isEmail ? (
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  ) : (
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  )}
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Enter email or phone number"
                    {...register('identifier')}
                    className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    autoFocus
                  />
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Enter your registered email address or phone number
                </p>
                {errors.identifier && (
                  <p className="text-xs text-red-500">{errors.identifier.message}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    className="pl-10 pr-10 h-11 sm:h-12 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Button
                  type="submit"
                  className="w-full h-11 sm:h-12 text-sm sm:text-base border-2"
                  size="lg"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? 'Logging in...' : 'Login to Dashboard'}
                </Button>

                {serverError && (
                  <p className="text-sm sm:text-base text-red-500 text-center">{serverError}</p>
                )}

                <div className="text-center">
                  <Link
                    href={AdminRoutes.FORGOT_PASSWORD || '/admin/auth/forgot-password'}
                    className="text-[10px] sm:text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
