'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/schemas/customer/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Mail, Lock, Eye, EyeOff, UserPlus, Droplet, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { useRegister, useSendRegistrationOtp } from '@/api/domains/auth/queries';
import { CustomerRoutes } from '@/lib/constants/routes';

type Step = 'form' | 'otp';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterInput | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const registerMutation = useRegister();
  const sendOtpMutation = useSendRegistrationOtp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleFormSubmit = (data: RegisterInput) => {
    setFormData(data);
    sendOtpMutation.mutate(data.email, {
      onSuccess: () => {
        toast.success('OTP sent to your email!');
        setStep('otp');
        setCountdown(60);
        // Focus first OTP input
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Failed to send OTP');
      },
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus the appropriate input after paste
    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    if (!formData) {
      toast.error('Form data missing. Please try again.');
      setStep('form');
      return;
    }

    registerMutation.mutate(
      { ...formData, otp: otpCode },
      {
        onSuccess: () => {
          toast.success('Registration successful!');
          router.push(CustomerRoutes.HOME);
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Registration failed');
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (countdown > 0 || !formData) return;

    sendOtpMutation.mutate(formData.email, {
      onSuccess: () => {
        toast.success('OTP resent to your email!');
        setCountdown(60);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Failed to resend OTP');
      },
    });
  };

  const handleBackToForm = () => {
    setStep('form');
    setOtp(['', '', '', '', '', '']);
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-8 sm:py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
              <KeyRound className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Verify Your Email</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
              We sent a 6-digit code to <span className="font-medium text-foreground">{formData?.email}</span>
            </p>
          </div>

          <Card className="border-2">
            <CardHeader className="text-center space-y-1.5 sm:space-y-2 pb-4 sm:pb-6">
              <div className="flex items-center justify-center gap-2">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Enter OTP</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                Enter the verification code to complete registration
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 sm:px-6">
              <div className="space-y-6">
                {/* OTP Input */}
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold border-2 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-background"
                    />
                  ))}
                </div>

                {/* Resend */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Resend code in <span className="font-medium text-foreground">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      disabled={sendOtpMutation.isPending}
                      className="text-sm text-primary hover:underline font-medium disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Verify Button */}
                <Button
                  onClick={handleVerifyOtp}
                  className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base border-2"
                  size="lg"
                  disabled={registerMutation.isPending || otp.join('').length !== 6}
                >
                  {registerMutation.isPending ? 'Verifying...' : 'Verify & Create Account'}
                </Button>

                {/* Back Button */}
                <Button
                  variant="ghost"
                  onClick={handleBackToForm}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Registration Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8 sm:py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <Droplet className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Join Eazy Wash</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
            Start your car care journey today
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center space-y-1.5 sm:space-y-2 pb-4 sm:pb-6">
            <div className="flex items-center justify-center gap-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Create Account</CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              Enter your details to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3.5 sm:space-y-4">
              {/* Name */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="name" className="text-xs sm:text-sm">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...register('name')}
                    className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    error={errors.name?.message}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register('email')}
                    className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    error={errors.email?.message}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    {...register('phone')}
                    className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    error={errors.phone?.message}
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    {...register('password')}
                    className="pl-10 pr-10 h-11 sm:h-12 text-sm sm:text-base"
                    error={errors.password?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    {...register('confirmPassword')}
                    className="pl-10 pr-10 h-11 sm:h-12 text-sm sm:text-base"
                    error={errors.confirmPassword?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-muted border-2 border-border rounded-lg sm:rounded-xl p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs font-semibold text-foreground mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                  <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                  Password Requirements:
                </p>
                <ul className="text-[10px] sm:text-xs text-muted-foreground space-y-0.5 sm:space-y-1">
                  <li className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                    <span>At least 8 characters</span>
                  </li>
                  <li className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                    <span>One uppercase & one lowercase letter</span>
                  </li>
                  <li className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                    <span>One number & one special character (@$!%*?&#)</span>
                  </li>
                </ul>
              </div>

              <div className="pt-1 sm:pt-2">
                <Button
                  type="submit"
                  className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base border-2"
                  size="lg"
                  disabled={sendOtpMutation.isPending}
                >
                  {sendOtpMutation.isPending ? 'Sending OTP...' : 'Continue'}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 sm:space-y-4 px-4 sm:px-6">
            <Separator />
            <div className="text-center text-xs sm:text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href={CustomerRoutes.LOGIN} className="text-primary hover:underline font-semibold">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
