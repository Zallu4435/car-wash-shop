'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Mail, Lock, Eye, EyeOff, UserPlus, Droplet, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { VehicleSelectionModal } from '@/components/shared/selectors/VehicleSelectionModal';

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name is too long')
      .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number').length(10, 'Phone must be 10 digits'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain uppercase letter')
      .regex(/[a-z]/, 'Password must contain lowercase letter')
      .regex(/[0-9]/, 'Password must contain number')
      .regex(/[@$!%*?&#]/, 'Password must contain special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

interface Vehicle {
  id: string;
  type: 'car' | 'bike';
  category: string;
  brand: string;
  model: string;
  year: string;
  plateNumber?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Registration successful!');
      setShowVehicleModal(true);
    }, 1500);
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    console.log('Selected vehicle:', vehicle);
    toast.success('Vehicle added successfully!');
    router.push('/');
  };

  const handleSkipVehicle = () => {
    toast.info('You can add your vehicle later from your profile');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8 sm:py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <Droplet className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Join CarWash</h1>
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 sm:space-y-4">
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
                  Email <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span>
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
                  className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base" 
                  size="lg" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 sm:space-y-4 px-4 sm:px-6">
            <Separator />
            <div className="text-center text-xs sm:text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/auth/login" className="text-primary hover:underline font-semibold">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Vehicle Selection Modal */}
      <VehicleSelectionModal
        isOpen={showVehicleModal}
        onClose={handleSkipVehicle}
        onSelect={handleVehicleSelect}
      />
    </div>
  );
}
