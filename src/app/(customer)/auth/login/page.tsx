'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Phone, Lock, LogIn, Mail, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react';
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
    <div className="flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 py-8 sm:py-12 px-4" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                <LogIn className="h-5 w-5 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            </div>
            <CardDescription className="text-sm">
              {step === 'otp'
                ? `Enter the code sent to ${getEmailOtpValues('email')}`
                : mode === 'email'
                  ? 'Sign in to your account'
                  : mode === 'phone'
                    ? 'Sign in with your phone number'
                    : 'Sign in with a one-time code'}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 space-y-5">
            {/* Back button when not on default mode */}
            {(mode !== 'email' || step === 'otp') && (
              <button
                type="button"
                onClick={() => { setMode('email'); setStep('credentials'); }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to email login
              </button>
            )}

            {/* Email + Password (Default) */}
            {mode === 'email' && step === 'credentials' && (
              <form onSubmit={handleEmailCredSubmit(onEmailLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...emailCredReg('email')}
                      className="pl-10 h-12 bg-muted/30 border-2 focus:bg-background transition-colors"
                      autoFocus
                    />
                  </div>
                  {emailCredErrors.email && <p className="text-xs text-destructive">{emailCredErrors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Link href={CustomerRoutes.AUTH_FORGOT_PASSWORD} className="text-xs text-primary hover:underline font-medium">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...emailCredReg('password')}
                      className="pl-10 pr-10 h-12 bg-muted/30 border-2 focus:bg-background transition-colors"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {emailCredErrors.password && <p className="text-xs text-destructive">{emailCredErrors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow" size="lg">
                  Sign In
                </Button>

                {/* Alternative Login Options */}
                <div className="relative py-4">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                    or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => switchMode('phone')}
                    className="h-11 gap-2 border-2 hover:bg-muted/50 hover:border-primary/50 transition-all"
                  >
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">Phone</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => switchMode('email-otp')}
                    className="h-11 gap-2 border-2 hover:bg-muted/50 hover:border-primary/50 transition-all"
                  >
                    <KeyRound className="h-4 w-4" />
                    <span className="text-sm">Email OTP</span>
                  </Button>
                </div>
              </form>
            )}

            {/* Phone + Password */}
            {mode === 'phone' && step === 'credentials' && (
              <form onSubmit={handlePhoneCredSubmit(onPhoneLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      {...phoneCredReg('phone')}
                      className="pl-10 h-12 bg-muted/30 border-2 focus:bg-background transition-colors"
                      maxLength={10}
                      autoFocus
                    />
                  </div>
                  {phoneCredErrors.phone && <p className="text-xs text-destructive">{phoneCredErrors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Link href={CustomerRoutes.AUTH_FORGOT_PASSWORD} className="text-xs text-primary hover:underline font-medium">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...phoneCredReg('password')}
                      className="pl-10 pr-10 h-12 bg-muted/30 border-2 focus:bg-background transition-colors"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {phoneCredErrors.password && <p className="text-xs text-destructive">{phoneCredErrors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow" size="lg">
                  Sign In
                </Button>
              </form>
            )}

            {/* Email OTP - Send */}
            {mode === 'email-otp' && step === 'credentials' && (
              <form onSubmit={handleEmailOtpSubmit(onSendOtp)} className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
                  <p className="text-sm text-foreground/80">
                    <span className="font-medium">Passwordless login:</span> We'll send a 6-digit code to your email.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-otp" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email-otp"
                      type="email"
                      placeholder="you@example.com"
                      {...emailOtpReg('email')}
                      className="pl-10 h-12 bg-muted/30 border-2 focus:bg-background transition-colors"
                      autoFocus
                    />
                  </div>
                  {emailOtpErrors.email && <p className="text-xs text-destructive">{emailOtpErrors.email.message}</p>}
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow" size="lg">
                  Send Code
                </Button>
              </form>
            )}

            {/* OTP Verification */}
            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="space-y-4">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    ✓ Code sent to <span className="font-medium">{getEmailOtpValues('email')}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">Enter 6-digit Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    {...otpReg('otp')}
                    className="h-14 text-center text-2xl tracking-[0.5em] font-mono bg-muted/30 border-2 focus:bg-background transition-colors"
                    autoFocus
                    maxLength={6}
                  />
                  {otpErrors.otp && <p className="text-xs text-destructive text-center">{otpErrors.otp.message}</p>}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Didn't receive code?</span>
                  <button
                    type="button"
                    className="text-primary hover:underline font-medium"
                    onClick={() => sendEmailOtpMutation.mutate(getEmailOtpValues('email'), {
                      onSuccess: () => toast.success('New code sent!'),
                      onError: (err: any) => toast.error(err?.message || 'Failed'),
                    })}
                  >
                    Resend Code
                  </button>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow" size="lg">
                  Verify & Sign In
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col pt-2 pb-6 px-6">
            <Separator className="mb-4" />
            <p className="text-sm text-center">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href={CustomerRoutes.REGISTER} className="text-primary hover:underline font-semibold">
                Create one
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing in, you agree to our{' '}
          <Link href={CustomerRoutes.TERMS} className="text-primary hover:underline">Terms</Link>{' '}
          and{' '}
          <Link href={CustomerRoutes.PRIVACY} className="text-primary hover:underline">Privacy Policy</Link>
        </p>
      </div>

      <VehicleSelectionModal isOpen={showVehicleModal} onClose={handleSkipVehicle} onSelect={handleVehicleSelect} />
    </div >
  );
}
