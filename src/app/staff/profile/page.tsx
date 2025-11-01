'use client';

// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AvatarUploader } from '@/components/shared/media/AvatarUploader';
import { User, Phone, Mail, MapPin, Star, Briefcase, Edit, LogOut, IndianRupee, TrendingUp, CheckCircle, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useStaffProfile, useStaffLogout } from '@/api/domains/staff';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { StaffRoutes } from '@/lib/constants/routes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffProfileEditSchema, StaffProfileEditInput } from '@/schemas/staff/profile';

export default function StaffProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading, error } = useStaffProfile();
  const logoutMutation = useStaffLogout();
  
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<StaffProfileEditInput>({
    resolver: zodResolver(staffProfileEditSchema) as any,
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        phone: profile.phone || '',
        email: profile.email || '',
        area: profile.area || '',
      });
    }
  }, [profile, reset]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => toast.success('Logged out successfully'),
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatar('');
    // Reset form to original profile values
    reset({
      name: profile?.name || '',
      phone: profile?.phone || '',
      email: profile?.email || '',
      area: profile?.area || '',
    });
  };

  const handleAvatarUpload = (file: File) => {
    // Set the file in form
    setValue('avatar', file);
    toast.success('Profile picture updated!');
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    setValue('avatar', undefined);
    toast.success('Profile picture removed');
  };

  const onSubmit = (data: StaffProfileEditInput) => {
    // TODO: Call API to update profile
    console.log('Saving profile:', data);
    toast.success('Profile updated successfully!');
    setIsEditing(false);
    setAvatar('');
  };

  if (isLoading) {
    return <Loading text="Loading profile..." />;
  }

  if (error) {
    return <Error message="Failed to load profile" details={error?.message} />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            {isEditing ? 'Edit your profile information' : 'Manage your account and view performance'}
          </p>
        </div>
        {!isEditing ? (
          <Button 
            variant="outline" 
            onClick={handleEdit}
            className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2"
          >
            <Edit className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="sm:inline">Edit Profile</span>
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2"
            >
              <X className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit(onSubmit)}
              className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2"
            >
              <Save className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Section - Personal Info */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Profile Card */}
          <Card className="border-2 border-border">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Personal Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Profile Picture */}
              {isEditing ? (
                <div className="p-3 sm:p-4">
                  <AvatarUploader
                    currentAvatar={avatar || profile?.avatar}
                    onUpload={handleAvatarUpload}
                    onRemove={handleRemoveAvatar}
                    size="md"
                  />
                  {errors.avatar && (
                    <p className="text-xs text-red-600 dark:text-red-400 text-center mt-2">{errors.avatar.message}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img 
                      src={profile?.avatar || '/images/avatars/default-avatar.svg'} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/avatars/default-avatar.svg';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-base sm:text-lg text-foreground truncate">
                      {profile?.name ?? '—'}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {profile?.role ?? '—'}
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <Label className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                      Phone
                    </Label>
                  </div>
                  {isEditing ? (
                    <div className="space-y-1">
                      <Input
                        type="tel"
                        {...register('phone')}
                        className="h-9 text-sm"
                        placeholder="Enter phone number"
                        maxLength={10}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-600 dark:text-red-400">{errors.phone.message}</p>
                      )}
                    </div>
                  ) : (
                    <p className="font-semibold text-sm sm:text-base text-foreground">
                      {profile?.phone ?? '—'}
                    </p>
                  )}
                </div>

                <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <Label className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                      Email
                    </Label>
                  </div>
                  {isEditing ? (
                    <div className="space-y-1">
                      <Input
                        type="email"
                        {...register('email')}
                        className="h-9 text-sm"
                        placeholder="Enter email"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
                      )}
                    </div>
                  ) : (
                    <p className="font-semibold text-sm sm:text-base text-foreground break-all">
                      {profile?.email ?? '—'}
                    </p>
                  )}
                </div>
              </div>

              {/* Service Area */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <Label className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                    Service Area
                  </Label>
                </div>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input
                      {...register('area')}
                      className="h-9 text-sm"
                      placeholder="Enter service area"
                    />
                    {errors.area && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.area.message}</p>
                    )}
                  </div>
                ) : (
                  <p className="font-semibold text-sm sm:text-base text-foreground">
                    {profile?.area ?? '—'}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                    Role & Status
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default" className="text-xs sm:text-sm">
                    {profile?.role ?? '—'}
                  </Badge>
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2 border-border">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-sm sm:text-base lg:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                className="h-auto py-3 sm:py-4 flex-col gap-1.5 sm:gap-2 cursor-pointer border-2"
                onClick={() => router.push(StaffRoutes.JOBS)}
              >
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">View Jobs</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-3 sm:py-4 flex-col gap-1.5 sm:gap-2 cursor-pointer border-2"
                onClick={() => router.push(StaffRoutes.PAYMENTS)}
              >
                <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">Payments</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-3 sm:py-4 flex-col gap-1.5 sm:gap-2 cursor-pointer border-2"
                onClick={() => router.push(StaffRoutes.HISTORY)}
              >
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">History</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-3 sm:py-4 flex-col gap-1.5 sm:gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer border-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">Logout</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Performance Stats */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* Performance Stats */}
          <Card className="border-2 border-border">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5">
              {/* Total Jobs */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                    Total Jobs
                  </p>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-foreground">{profile?.totalJobs ?? 0}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  Completed successfully
                </p>
              </div>

              {/* Average Rating */}
              <div className="p-3 sm:p-4 bg-primary/5 rounded-lg sm:rounded-xl border-2 border-primary/20">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs text-foreground uppercase tracking-wide">
                    Avg Rating
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-3xl sm:text-4xl font-bold text-foreground">{profile?.avgRating ?? '—'}</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                          star <= 4
                            ? 'fill-amber-400 text-amber-400'
                            : star === 5
                            ? 'fill-amber-200 text-amber-200'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {profile?.totalReviews && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                    Based on {profile.totalReviews} reviews
                  </p>
                )}
              </div>

              {/* Total Earnings */}
              <div className="p-3 sm:p-4 bg-primary/5 rounded-lg sm:rounded-xl border-2 border-primary/20">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <IndianRupee className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs text-foreground uppercase tracking-wide">
                    Total Earnings
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{profile?.earnings?.toLocaleString?.() ?? 0}</p>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  Lifetime earnings
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          {profile?.achievements && profile.achievements.length > 0 && (
            <Card className="border-2 border-border">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-sm sm:text-base lg:text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 sm:space-y-3">
                {profile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-muted rounded-lg sm:rounded-xl">
                    <div className="text-xl sm:text-2xl flex-shrink-0">{achievement.icon}</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-xs sm:text-sm text-foreground truncate">
                        {achievement.label}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {achievement.value}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
