'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Phone, Lock, LogIn, Mail, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { VehicleSelectionModal } from '@/components/shared/selectors/VehicleSelectionModal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailOnlySchema, otpOnlySchema } from '@/schemas/customer/auth';
import { useSendEmailOtp, useVerifyEmailOtp, useLoginWithCredentials } from '@/api/domains/auth/queries';
import Loading from '@/components/shared/display/Loading';
import { CustomerRoutes } from '@/lib/constants/routes';
import { z } from 'zod';

type LoginMode = 'email' | 'phone' | 'email-otp';
type Step = 'credentials' | 'otp';

const emailCredentialsSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const phoneCredentialsSchema = z.object({
  phone: z.string().min(10, 'Phone number is required').regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit phone'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>('email');
  const [step, setStep] = useState<Step>('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  // Email + Password form
  const {
    register: emailCredReg,
    handleSubmit: handleEmailCredSubmit,
    formState: { errors: emailCredErrors },
    getValues: getEmailCredValues,
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(emailCredentialsSchema),
    defaultValues: { email: '', password: '' },
  });

  // Phone + Password form
  const {
    register: phoneCredReg,
    handleSubmit: handlePhoneCredSubmit,
    formState: { errors: phoneCredErrors },
  } = useForm<{ phone: string; password: string }>({
    resolver: zodResolver(phoneCredentialsSchema),
    defaultValues: { phone: '', password: '' },
  });

  // Email for OTP form
  const {
    register: emailOtpReg,
    handleSubmit: handleEmailOtpSubmit,
    formState: { errors: emailOtpErrors },
    getValues: getEmailOtpValues,
  } = useForm<{ email: string }>({
    resolver: zodResolver(emailOnlySchema),
    defaultValues: { email: '' },
  });

  // OTP verification form
  const {
    register: otpReg,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    reset: resetOtpForm,
  } = useForm<{ otp: string }>({
    resolver: zodResolver(otpOnlySchema),
    defaultValues: { otp: '' },
  });

  const sendEmailOtpMutation = useSendEmailOtp();
  const verifyEmailOtpMutation = useVerifyEmailOtp();
  const loginWithCredentialsMutation = useLoginWithCredentials();

  const onEmailLogin = ({ email, password }: { email: string; password: string }) => {
    loginWithCredentialsMutation.mutate(
      { identifier: email, password },
      {
        onSuccess: () => {
          toast.success('Login successful!');
          router.push(CustomerRoutes.HOME);
        },
        onError: (err: any) => toast.error(err?.message || 'Invalid credentials'),
      }
    );
  };

  const onPhoneLogin = ({ phone, password }: { phone: string; password: string }) => {
    loginWithCredentialsMutation.mutate(
      { identifier: phone, password },
      {
        onSuccess: () => {
          toast.success('Login successful!');
          router.push(CustomerRoutes.HOME);
        },
        onError: (err: any) => toast.error(err?.message || 'Invalid credentials'),
      }
    );
  };

  const onSendOtp = ({ email }: { email: string }) => {
    sendEmailOtpMutation.mutate(email, {
      onSuccess: () => {
        toast.success('OTP sent to your email');
        setStep('otp');
      },
      onError: (err: any) => toast.error(err?.message || 'Failed to send OTP'),
    });
  };

  const onVerifyOtp = ({ otp }: { otp: string }) => {
    verifyEmailOtpMutation.mutate(
      { email: getEmailOtpValues('email'), otp },
      {
        onSuccess: () => toast.success('Login successful!'),
        onError: (err: any) => toast.error(err?.message || 'Invalid OTP'),
      }
    );
  };

  const handleVehicleSelect = (_vehicle: any) => {
    toast.success('Vehicle added successfully!');
    setShowVehicleModal(false);
    router.push(CustomerRoutes.HOME);
  };

  const handleSkipVehicle = () => {
    toast.info('You can add your vehicle later from your profile');
    setShowVehicleModal(false);
    router.push(CustomerRoutes.HOME);
  };

  const switchMode = (newMode: LoginMode) => {
    setMode(newMode);
    setStep('credentials');
    resetOtpForm();
  };

  const isLoading = sendEmailOtpMutation.isPending || verifyEmailOtpMutation.isPending || loginWithCredentialsMutation.isPending;

  if (isLoading) {
    return <Loading text={sendEmailOtpMutation.isPending ? 'Sending OTP...' : verifyEmailOtpMutation.isPending ? 'Verifying...' : 'Logging in...'} />;
  }

  return (
    <div className="flex items-center justify-center bg-background py-8 sm:py-12 px-4" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-none hover:shadow-none">
          <CardHeader className="text-center space-y-1.5 sm:space-y-2 pb-4 sm:pb-6">
            <div className="flex items-center justify-center gap-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Welcome Back</CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm px-2">
              {step === 'otp'
                ? `Enter OTP sent to ${getEmailOtpValues('email')}`
                : mode === 'email'
                  ? 'Sign in with your email and password'
                  : mode === 'phone'
                    ? 'Sign in with your phone and password'
                    : 'Sign in with email OTP'}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            {/* Email + Password (Default) */}
            {mode === 'email' && step === 'credentials' && (
              <form onSubmit={handleEmailCredSubmit(onEmailLogin)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...emailCredReg('email')}
                      className="pl-10 h-11 sm:h-12"
                      autoFocus
                    />
                  </div>
                  {emailCredErrors.email && <p className="text-xs text-red-500">{emailCredErrors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Your password"
                      {...emailCredReg('password')}
                      className="pl-10 pr-10 h-11 sm:h-12"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {emailCredErrors.password && <p className="text-xs text-red-500">{emailCredErrors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full h-11 sm:h-12 border-2" size="lg">
                  Login
                </Button>

                {/* Secondary Options */}
                <div className="flex justify-center gap-4 pt-2">
                  <button type="button" onClick={() => switchMode('phone')} className="text-xs text-muted-foreground hover:text-primary hover:underline">
                    Use phone instead
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button type="button" onClick={() => switchMode('email-otp')} className="text-xs text-muted-foreground hover:text-primary hover:underline">
                    Login with OTP
                  </button>
                </div>
              </form>
            )}

            {/* Phone + Password */}
            {mode === 'phone' && step === 'credentials' && (
              <form onSubmit={handlePhoneCredSubmit(onPhoneLogin)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      {...phoneCredReg('phone')}
                      className="pl-10 h-11 sm:h-12"
                      maxLength={10}
                      autoFocus
                    />
                  </div>
                  {phoneCredErrors.phone && <p className="text-xs text-red-500">{phoneCredErrors.phone.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Your password"
                      {...phoneCredReg('password')}
                      className="pl-10 pr-10 h-11 sm:h-12"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {phoneCredErrors.password && <p className="text-xs text-red-500">{phoneCredErrors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full h-11 sm:h-12 border-2" size="lg">
                  Login
                </Button>

                <div className="flex justify-center gap-4 pt-2">
                  <button type="button" onClick={() => switchMode('email')} className="text-xs text-muted-foreground hover:text-primary hover:underline">
                    Use email instead
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button type="button" onClick={() => switchMode('email-otp')} className="text-xs text-muted-foreground hover:text-primary hover:underline">
                    Login with OTP
                  </button>
                </div>
              </form>
            )}

            {/* Email OTP - Send */}
            {mode === 'email-otp' && step === 'credentials' && (
              <form onSubmit={handleEmailOtpSubmit(onSendOtp)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email-otp" className="text-xs sm:text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email-otp"
                      type="email"
                      placeholder="you@example.com"
                      {...emailOtpReg('email')}
                      className="pl-10 h-11 sm:h-12"
                      autoFocus
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">We'll send a 6-digit code to your email</p>
                  {emailOtpErrors.email && <p className="text-xs text-red-500">{emailOtpErrors.email.message}</p>}
                </div>

                <Button type="submit" className="w-full h-11 sm:h-12 border-2" size="lg">
                  Send OTP
                </Button>

                <div className="flex justify-center pt-2">
                  <button type="button" onClick={() => switchMode('email')} className="text-xs text-muted-foreground hover:text-primary hover:underline">
                    Login with password instead
                  </button>
                </div>
              </form>
            )}

            {/* OTP Verification */}
            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="otp" className="text-xs sm:text-sm">Enter OTP</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="••••••"
                      {...otpReg('otp')}
                      className="pl-10 h-11 sm:h-12 text-center text-lg tracking-widest font-semibold"
                      autoFocus
                      maxLength={6}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-muted-foreground">Didn't receive?</p>
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline"
                      onClick={() => sendEmailOtpMutation.mutate(getEmailOtpValues('email'), {
                        onSuccess: () => toast.success('OTP resent!'),
                        onError: (err: any) => toast.error(err?.message || 'Failed'),
                      })}
                    >
                      Resend
                    </button>
                  </div>
                  {otpErrors.otp && <p className="text-xs text-red-500">{otpErrors.otp.message}</p>}
                </div>

                <Button type="submit" className="w-full h-11 sm:h-12 border-2" size="lg">
                  Verify & Login
                </Button>

                <Button type="button" variant="outline" className="w-full h-10 border-2" onClick={() => setStep('credentials')}>
                  Change Email
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 px-4 sm:px-6">
            <Separator />
            <div className="text-center text-xs sm:text-sm space-y-2">
              <div>
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link href={CustomerRoutes.REGISTER} className="text-primary hover:underline font-semibold">
                  Register Now
                </Link>
              </div>
              <Link href={CustomerRoutes.AUTH_FORGOT_PASSWORD} className="text-muted-foreground hover:text-foreground underline text-[10px] sm:text-xs">
                Forgot Password?
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-[10px] sm:text-xs text-muted-foreground px-4">
            By continuing, you agree to our{' '}
            <Link href={CustomerRoutes.TERMS} className="text-primary hover:underline">Terms</Link>{' '}
            and{' '}
            <Link href={CustomerRoutes.PRIVACY} className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>

      <VehicleSelectionModal isOpen={showVehicleModal} onClose={handleSkipVehicle} onSelect={handleVehicleSelect} />
    </div>
  );
}
