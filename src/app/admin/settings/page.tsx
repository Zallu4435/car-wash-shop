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
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1.5">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-primary/10 text-primary border-l-2 border-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{tab.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                      {tab.description}
                    </p>
                  </div>
                  {isActive && (
                    <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
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
            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader className="space-y-1">
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account profile information and email address
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture Section */}
                  <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-lg">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-background overflow-hidden">
                        {profile?.avatar ? (
                          <img src={profile.avatar} alt={profileData.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-12 w-12 text-primary" />
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
                        className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors cursor-pointer"
                      >
                        <Camera className="h-4 w-4" />
                      </label>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{profileData.name}</h3>
                      <p className="text-sm text-muted-foreground">{profileData.role}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 h-8 text-xs"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        disabled={uploadAvatarMutation.isPending}
                      >
                        <Camera className="mr-2 h-3 w-3" />
                        {uploadAvatarMutation.isPending ? 'Uploading...' : 'Change Photo'}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="pl-10 h-10"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="pl-10 h-10"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="pl-10 h-10"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium">
                          Role
                        </Label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="role"
                            value={profileData.role}
                            disabled
                            className="pl-10 h-10 bg-muted cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.push(AdminRoutes.DASHBOARD)}>
                  Cancel
                </Button>
                <Button onClick={handleProfileUpdate} disabled={updateProfileMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader className="space-y-1">
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Ensure your account is using a strong password to stay secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="pl-10 h-10"
                        placeholder="Enter current password"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="pl-10 h-10"
                        placeholder="Enter new password"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                      Must be at least 8 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="pl-10 h-10"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                >
                  Cancel
                </Button>
                <Button onClick={handlePasswordChange} disabled={changePasswordMutation.isPending}>
                  <Lock className="mr-2 h-4 w-4" />
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
