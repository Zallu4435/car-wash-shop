'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Lock, ArrowLeft, KeyRound, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp' | 'reset'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setStep('otp');
      toast.success('OTP sent to your phone');
      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setStep('reset');
      toast.success('OTP verified successfully');
      setIsLoading(false);
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      toast.success('Password reset successful! Please login.');
      router.push('/auth/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8 sm:py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="border-2 relative">
          <CardHeader className="text-center space-y-1.5 sm:space-y-2 pb-4 sm:pb-6">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="absolute top-3 sm:top-4 left-3 sm:left-4 h-8 sm:h-9">
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm">Back</span>
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-2 pt-10 sm:pt-12">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <KeyRound className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Forgot Password</CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm px-2">
              {step === 'phone' && 'Enter your phone number to reset password'}
              {step === 'otp' && `Enter OTP sent to +91 ${phone}`}
              {step === 'reset' && 'Create a new password'}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            {step === 'phone' && (
              <form onSubmit={handleSendOTP} className="space-y-4 sm:space-y-5">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base" 
                  size="lg" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-4 sm:space-y-5">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="otp" className="text-xs sm:text-sm">Enter OTP</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="pl-10 h-11 sm:h-12 text-center text-lg sm:text-2xl tracking-[0.3em] sm:tracking-[0.5em] font-bold"
                      autoFocus
                      required
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
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base" 
                    size="lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 sm:h-11 text-xs sm:text-sm"
                    onClick={() => setStep('phone')}
                  >
                    Change Phone Number
                  </Button>
                </div>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-3.5 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="newPassword" className="text-xs sm:text-sm">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 sm:h-12 text-sm sm:text-base"
                      autoFocus
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Must be at least 8 characters
                  </p>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 sm:h-12 text-sm sm:text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 sm:pt-3">
                  <Button 
                    type="submit" 
                    className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base" 
                    size="lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
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
