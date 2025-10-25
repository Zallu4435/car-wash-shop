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

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
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
      toast.success('Login successful!');
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Droplet className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">CarWash App</h1>
          <p className="text-muted-foreground mt-2">Your trusted car care partner</p>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <LogIn className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
            </div>
            <CardDescription>
              {step === 'phone' 
                ? 'Enter your phone number to continue' 
                : `Enter OTP sent to +91 ${phone}`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 'phone' ? (
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="pl-10"
                      autoFocus
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">We'll send you a 6-digit OTP</p>
                </div>

                <Button type="submit" className="w-full shadow-lg" size="lg" disabled={isLoading}>
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="pl-10 text-center text-xl tracking-widest font-semibold"
                      autoFocus
                      required
                      maxLength={6}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">Didn't receive OTP?</p>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="text-xs h-auto p-0"
                      onClick={() => toast.success('OTP resent!')}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button type="submit" className="w-full shadow-lg" size="lg" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify & Login'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setStep('phone');
                      setOtp('');
                    }}
                  >
                    Change Phone Number
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <div className="text-center text-sm space-y-2">
              <div>
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link href="/auth/register" className="text-primary hover:underline font-semibold">
                  Register Now
                </Link>
              </div>
              <div>
                <Link href="/auth/forgot-password" className="text-muted-foreground hover:text-foreground underline text-xs">
                  Forgot Password?
                </Link>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
