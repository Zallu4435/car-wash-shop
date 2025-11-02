'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  User,
  Lock,
  Mail,
  Phone,
  Camera,
  Save,
  ArrowLeft,
  Shield,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminRoutes } from '@/lib/constants/routes';
import {
  useAdminProfile,
  useUpdateAdminProfile,
  useChangePassword,
  useUploadAvatar,
} from '@/api/domains/admin-profile/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

type SettingsTab = 'profile' | 'security';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // API hooks
  const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useAdminProfile();
  const updateProfileMutation = useUpdateAdminProfile();
  const changePasswordMutation = useChangePassword();
  const uploadAvatarMutation = useUploadAvatar();

  // Profile state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Update profile data when loaded from API
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
      });
    }
  }, [profile]);

  // Log any errors for debugging
  useEffect(() => {
    if (profileError) {
      console.error('Profile error:', profileError);
    }
  }, [profileError]);

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User, description: 'Manage your profile information' },
    { id: 'security' as SettingsTab, label: 'Security', icon: Lock, description: 'Update your password and security settings' },
  ];

  const handleProfileUpdate = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      await uploadAvatarMutation.mutateAsync(file);
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      toast.error('Failed to upload profile picture');
    }
  };

  // Loading state
  if (profileLoading) {
    return <Loading text="Loading settings..." />;
  }

  // Error state
  if (profileError) {
    return <Error message="Failed to load profile" details={(profileError as any)?.message} onRetry={() => refetchProfile()} />;
  }

  // If profile is not loaded yet, show loading
  if (!profile) {
    return <Loading text="Loading profile..." />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-2 sm:space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1.5">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Sidebar Navigation - Horizontal on mobile, vertical on desktop */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-1 px-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 lg:w-full flex items-center lg:items-start gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all text-left border-2 ${
                    isActive
                      ? 'bg-primary/10 text-primary border-primary'
                      : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm whitespace-nowrap lg:whitespace-normal">{tab.label}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 hidden lg:block">
                      {tab.description}
                    </p>
                  </div>
                  {isActive && (
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 lg:mt-0.5" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4 sm:space-y-6">
              <Card className="border-2 border-border rounded-lg sm:rounded-xl">
                <CardHeader className="space-y-1 pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Profile Information</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Update your account profile information and email address
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Profile Picture Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-3 sm:p-4 bg-muted/30 rounded-lg sm:rounded-xl">
                    <div className="relative group">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center ring-2 sm:ring-4 ring-background overflow-hidden">
                        {profile?.avatar ? (
                          <img src={profile.avatar} alt={profileData.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                        )}
                      </div>
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors cursor-pointer"
                      >
                        <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </label>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-semibold text-base sm:text-lg">{profileData.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{profileData.role}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 h-8 text-xs border-2"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        disabled={uploadAvatarMutation.isPending}
                      >
                        <Camera className="mr-1.5 sm:mr-2 h-3 w-3" />
                        {uploadAvatarMutation.isPending ? 'Uploading...' : 'Change Photo'}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="name" className="text-xs sm:text-sm font-medium">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="pl-9 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="pl-9 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="phone" className="text-xs sm:text-sm font-medium">
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="pl-9 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="role" className="text-xs sm:text-sm font-medium">
                          Role
                        </Label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                          <Input
                            id="role"
                            value={profileData.role}
                            disabled
                            className="pl-9 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm bg-muted cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <Button variant="outline" onClick={() => router.push(AdminRoutes.DASHBOARD)} className="h-9 sm:h-10 text-xs sm:text-sm border-2">
                  Cancel
                </Button>
                <Button onClick={handleProfileUpdate} disabled={updateProfileMutation.isPending} className="h-9 sm:h-10 text-xs sm:text-sm border-2">
                  <Save className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-4 sm:space-y-6">
              <Card className="border-2 border-border rounded-lg sm:rounded-xl">
                <CardHeader className="space-y-1 pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Change Password</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Ensure your account is using a strong password to stay secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="currentPassword" className="text-xs sm:text-sm font-medium">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="pl-9 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
                        placeholder="Enter current password"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="newPassword" className="text-xs sm:text-sm font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="pl-9 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
                        placeholder="Enter new password"
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                      Must be at least 8 characters long
                    </p>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs sm:text-sm font-medium">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="pl-9 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                  className="h-9 sm:h-10 text-xs sm:text-sm border-2"
                >
                  Cancel
                </Button>
                <Button onClick={handlePasswordChange} disabled={changePasswordMutation.isPending} className="h-9 sm:h-10 text-xs sm:text-sm border-2">
                  <Lock className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
