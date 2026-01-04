'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, KeyRound, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailOnlySchema, otpOnlySchema, resetPasswordSchema } from '@/schemas/customer/auth';
import { z } from 'zod';
import { useSendPasswordResetOTP, useResetPasswordWithOTP } from '@/api/domains/auth/queries';
import { CustomerRoutes } from '@/lib/constants/routes';
import Loading from '@/components/shared/display/Loading';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'identifier' | 'otp' | 'reset'>('identifier');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register: emailRegister,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
    getValues: getEmail,
    reset: resetEmail,
  } = useForm<{ email: string }>({
    resolver: zodResolver(emailOnlySchema),
    defaultValues: { email: '' },
  });

  const {
    register: otpRegister,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    getValues: getOtp,
    reset: resetOtp,
  } = useForm<{ otp: string }>({
    resolver: zodResolver(otpOnlySchema),
    defaultValues: { otp: '' },
  });

  const {
    register: resetRegister,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
  } = useForm<{ password: string; confirmPassword: string }>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const sendOtpMutation = useSendPasswordResetOTP();
  const resetPasswordMutation = useResetPasswordWithOTP();

  const watchedEmail = identifier || getEmail('email');

  const onSendOtp = ({ email }: { email: string }) => {
    setIdentifier(email);
    setErrorMessage('');
    sendOtpMutation.mutate(email, {
      onSuccess: () => {
        toast.success('OTP sent to your email!');
        setStep('otp');
      },
      onError: (err: any) => {
        const errorMsg = err?.data?.message || 'Failed to send OTP';
        const lower = errorMsg.toLowerCase();
        if (
          lower.includes('password not set') ||
          lower.includes('alternative login') ||
          lower.includes('account not found') ||
          lower.includes('not found')
        ) {
          if (lower.includes('account not found') || lower.includes('not found')) {
            setErrorMessage('No account found with this email');
          } else {
            setErrorMessage(errorMsg);
          }
        } else {
          toast.error(errorMsg);
        }
      },
    });
  };

  const onVerifyOtp = ({ otp }: { otp: string }) => {
    // Move to password reset step
    setErrorMessage('');
    setStep('reset');
  };

  const onResetPassword = ({ password, confirmPassword }: { password: string; confirmPassword: string }) => {
    const currentEmail = getEmail('email');
    const otp = getOtp('otp');

    if (!otp || otp.length !== 6) {
      toast.error('Please enter the OTP first');
      setStep('otp');
      return;
    }

    setErrorMessage('');
    resetPasswordMutation.mutate(
      {
        identifier: currentEmail,
        otp,
        newPassword: password,
      },
      {
        onSuccess: () => {
          toast.success('Password reset successful! Please login.');
          router.push(CustomerRoutes.LOGIN);
        },
        onError: (err: any) => {
          const errorMsg = err?.message || 'Failed to reset password';
          // Check for specific error about password not set
          if (errorMsg.includes('Password not set') || errorMsg.includes('alternative login')) {
            setErrorMessage(errorMsg);
            setStep('identifier');
          } else if (errorMsg.includes('OTP') || errorMsg.includes('Invalid') || errorMsg.includes('expired')) {
            setErrorMessage(errorMsg);
            setStep('otp');
          } else {
            toast.error(errorMsg);
          }
        },
      }
    );
  };

  if (sendOtpMutation.isPending || resetPasswordMutation.isPending) {
    return (
      <Loading
        text={sendOtpMutation.isPending ? 'Sending OTP...' : 'Resetting password...'}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8 sm:py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="border-2 relative">
          <CardHeader className="text-center space-y-1.5 sm:space-y-2 pb-4 sm:pb-6">

            <div className="flex items-center justify-center gap-2 pt-10 sm:pt-12">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <KeyRound className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Forgot Password</CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm px-2">
              {step === 'identifier' && 'Enter your email to reset password'}
              {step === 'otp' && `Enter OTP sent to ${watchedEmail || 'your email'}`}
              {step === 'reset' && 'Create a new password'}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            {step === 'identifier' && (
              <form onSubmit={handleEmailSubmit(onSendOtp)} className="space-y-4 sm:space-y-5">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...emailRegister('email')}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        setErrorMessage('');
                        emailRegister('email').onChange(e);
                      }}
                      className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                      autoFocus
                    />
                  </div>
                  {emailErrors.email && (
                    <p className="text-xs text-red-500">{emailErrors.email.message}</p>
                  )}
                  {errorMessage && (
                    <p className="text-xs text-red-500">{errorMessage}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base border-2"
                  size="lg"
                  disabled={sendOtpMutation.isPending}
                >
                  {sendOtpMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="space-y-4 sm:space-y-5">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="otp" className="text-xs sm:text-sm">Enter OTP</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      {...otpRegister('otp')}
                      onChange={(e) => {
                        setErrorMessage('');
                        otpRegister('otp').onChange(e);
                      }}
                      className="pl-10 h-11 sm:h-12 text-center text-lg sm:text-2xl tracking-[0.3em] sm:tracking-[0.5em] font-bold"
                      autoFocus
                      maxLength={6}
                    />
                  </div>
                  {otpErrors.otp && <p className="text-xs text-red-500">{otpErrors.otp.message}</p>}
                  {errorMessage && (
                    <p className="text-xs text-red-500">{errorMessage}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Didn't receive OTP?
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="text-[10px] sm:text-xs h-auto p-0"
                      onClick={() => {
                        handleEmailSubmit(onSendOtp)();
                      }}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Button
                    type="submit"
                    className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base border-2"
                    size="lg"
                  >
                    Verify OTP
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 sm:h-11 text-xs sm:text-sm border-2"
                    onClick={() => {
                      setStep('identifier');
                      resetOtp();
                      setErrorMessage('');
                    }}
                  >
                    Change Email
                  </Button>
                </div>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handleResetSubmit(onResetPassword)} className="space-y-3.5 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="newPassword" className="text-xs sm:text-sm">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      {...resetRegister('password')}
                      className="pl-10 pr-10 h-11 sm:h-12 text-sm sm:text-base"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                  {resetErrors.password && <p className="text-xs text-red-500">{resetErrors.password.message}</p>}
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      {...resetRegister('confirmPassword')}
                      className="pl-10 pr-10 h-11 sm:h-12 text-sm sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                  {resetErrors.confirmPassword && <p className="text-xs text-red-500">{resetErrors.confirmPassword.message}</p>}
                </div>

                {errorMessage && (
                  <div className="pt-2">
                    <p className="text-xs text-red-500">{errorMessage}</p>
                  </div>
                )}

                <div className="pt-2 sm:pt-3">
                  <Button
                    type="submit"
                    className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base border-2"
                    size="lg"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? 'Resetting Password...' : 'Reset Password'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
