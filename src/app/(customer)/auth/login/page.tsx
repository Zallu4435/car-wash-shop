'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Phone, Lock, LogIn, Droplet } from 'lucide-react';
import { toast } from 'sonner';
import { VehicleSelectionModal } from '@/components/shared/selectors/VehicleSelectionModal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneOnlySchema, otpOnlySchema } from '@/schemas/auth';
import { useSendOtp, useLogin } from '@/api/domains/auth/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [userVehicles, setUserVehicles] = useState<any[]>([]);

  // Phone Form
  const {
    register: phoneRegister,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
    getValues: getPhoneValue,
    reset: resetPhoneForm,
  } = useForm<{ phone: string }>({
    resolver: zodResolver(phoneOnlySchema),
    defaultValues: { phone: '' },
  });
  // OTP Form
  const {
    register: otpRegister,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    getValues: getOtpValue,
    reset: resetOtpForm,
  } = useForm<{ otp: string }>({
    resolver: zodResolver(otpOnlySchema),
    defaultValues: { otp: '' },
  });

  const sendOtpMutation = useSendOtp();
  const loginMutation = useLogin();

  const onSendOtp = ({ phone }: { phone: string }) => {
    sendOtpMutation.mutate(phone, {
      onSuccess: () => {
        toast.success('OTP sent to your phone');
        setStep('otp');
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Failed to send OTP');
      },
    });
  };

  const onVerifyOtp = ({ otp }: { otp: string }) => {
    loginMutation.mutate({ 
      phone: getPhoneValue('phone'), 
      otp 
    }, {
      onSuccess: () => {
        toast.success('Login successful!');
        router.push('/');
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Invalid OTP');
      },
    });
  };

  const handleVehicleSelect = (_vehicle: any) => {
    toast.success('Vehicle added successfully!');
    setShowVehicleModal(false);
    router.push('/');
  };

  const handleSkipVehicle = () => {
    toast.info('You can add your vehicle later from your profile');
    setShowVehicleModal(false);
    router.push('/');
  };

  // Loading: show global page spinner if OTP or Login is pending
  if (sendOtpMutation.isPending || loginMutation.isPending) {
    return <Loading text={sendOtpMutation.isPending ? 'Sending OTP...' : 'Verifying...'} />;
  }
  // Error: show page-level error for failed OTP send or login
  if (sendOtpMutation.isError) {
    return <Error message={sendOtpMutation.error?.message || 'Failed to send OTP'} onRetry={() => {
      // re-attempt submit with last entered phone
      handlePhoneSubmit(onSendOtp)();
    }} />;
  }
  if (loginMutation.isError) {
    return <Error message={loginMutation.error?.message || 'Invalid OTP'} onRetry={() => {
      // re-attempt submit with last entered OTP
      handleOtpSubmit(onVerifyOtp)();
    }} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8 sm:py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <Droplet className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">CarWash App</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
            Your trusted car care partner
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center space-y-1.5 sm:space-y-2 pb-4 sm:pb-6">
            <div className="flex items-center justify-center gap-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Welcome Back</CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm px-2">
              {step === 'phone' 
                ? 'Enter your phone number to continue' 
                : `Enter OTP sent to +91 ${getPhoneValue('phone')}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit(onSendOtp)} className="space-y-4 sm:space-y-5">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      {...phoneRegister('phone')}
                      className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                      autoFocus
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    We'll send you a 6-digit OTP
                  </p>
                  {phoneErrors.phone && <p className="text-xs text-red-500">{phoneErrors.phone.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base" 
                  size="lg" 
                  disabled={sendOtpMutation.isPending}
                >
                  {sendOtpMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="space-y-4 sm:space-y-5">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="otp" className="text-xs sm:text-sm">Enter OTP</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="••••••"
                      {...otpRegister('otp')}
                      className="pl-10 h-11 sm:h-12 text-center text-lg sm:text-xl tracking-widest font-semibold"
                      autoFocus
                      maxLength={6}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Didn't receive OTP?
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="text-[10px] sm:text-xs h-auto p-0"
                      onClick={() => toast.success('OTP resent!')}
                    >
                      Resend OTP
                    </Button>
                  </div>
                  {otpErrors.otp && <p className="text-xs text-red-500">{otpErrors.otp.message}</p>}
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base" 
                    size="lg" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? 'Verifying...' : 'Verify & Login'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 sm:h-11 text-xs sm:text-sm"
                    onClick={() => {
                      setStep('phone');
                      resetOtpForm();
                    }}
                  >
                    Change Phone Number
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 sm:space-y-4 px-4 sm:px-6">
            <Separator />
            <div className="text-center text-xs sm:text-sm space-y-2">
              <div>
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link 
                  href="/auth/register" 
                  className="text-primary hover:underline font-semibold"
                >
                  Register Now
                </Link>
              </div>
              <div>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-muted-foreground hover:text-foreground underline text-[10px] sm:text-xs"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Additional Info */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-[10px] sm:text-xs text-muted-foreground px-4">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
      <VehicleSelectionModal
        isOpen={showVehicleModal}
        onClose={handleSkipVehicle}
        onSelect={handleVehicleSelect}
      />
    </div>
  );
}
