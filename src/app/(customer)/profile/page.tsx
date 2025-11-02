'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AvatarUploader } from '@/components/shared/media/AvatarUploader';
import { Separator } from '@/components/ui/separator';
import Loading from '@/components/shared/display/Loading';
import { User, Mail, Phone, MapPin, Car, LogOut, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/api/domains/auth/queries';
import { useUpdateProfile } from '@/api/domains/profile/queries';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileEditSchema, ProfileEditInput } from '@/schemas/customer/profile';
import { CustomerRoutes } from '@/lib/constants/routes';

export default function ProfilePage() {
  const router = useRouter();
  const [avatar, setAvatar] = useState<string>('');

  // API calls
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();

  // Form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileEditInput>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  // Update form data when user data loads
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setAvatar('');
    }
  }, [user, reset]);

  const handleAvatarUpload = (file: File) => {
    // In production, upload to server
    toast.success('Profile picture updated!');
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    toast.success('Profile picture removed');
  };

  const onSubmit = (data: ProfileEditInput) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Profile updated successfully!');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to update profile');
      },
    });
  };

  // Loading state
  if (userLoading) {
    return <Loading text="Loading profile..." fullScreen={true} size="lg" />;
  }

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header - Responsive */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
              <User className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                My Profile
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                Manage your account information
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <Button
                variant="outline"
                className="h-auto py-3 sm:py-4 w-full flex flex-col items-center justify-center gap-1.5 sm:gap-2"
                onClick={() => router.push(CustomerRoutes.ADDRESSES)}
              >
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-[10px] sm:text-xs md:text-sm">Addresses</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-3 sm:py-4 w-full flex flex-col items-center justify-center gap-1.5 sm:gap-2"
                onClick={() => router.push(CustomerRoutes.VEHICLES)}
              >
                <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-[10px] sm:text-xs md:text-sm">Vehicles</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-3 sm:py-4 w-full flex flex-col items-center justify-center gap-1.5 sm:gap-2"
                onClick={() => router.push(CustomerRoutes.PROFILE_SECURITY)}
              >
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-[10px] sm:text-xs md:text-sm">Security</span>
              </Button>
            </div>

            {/* Avatar Section */}
            <Card className="border-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Profile Picture</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <AvatarUploader
                  currentAvatar={avatar}
                  onUpload={handleAvatarUpload}
                  onRemove={handleRemoveAvatar}
                  size="lg"
                />
              </CardContent>
            </Card>

            {/* Profile Information */}
            <Card className="border-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Personal Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm">Full Name</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Enter your full name"
                      className="h-10 sm:h-11"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="Enter your email"
                      className="h-10 sm:h-11"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs sm:text-sm">Phone</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="Enter your phone number"
                      className="h-10 sm:h-11"
                      disabled
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.phone.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Contact support to change phone number</p>
                  </div>

                  <Separator />

                  <Button 
                    type="submit" 
                    className="w-full shadow-lg border-2 h-11 sm:h-12 text-sm sm:text-base" 
                    size="lg"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Logout Button */}
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-2 h-11 sm:h-12 text-sm sm:text-base"
              onClick={() => {
                toast.success('Logged out successfully');
                router.push(CustomerRoutes.LOGIN);
              }}
            >
              <LogOut className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Logout
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
