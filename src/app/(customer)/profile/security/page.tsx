'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Key,
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  Monitor,
  MapPin,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordInput } from '@/schemas/customer/profile';
import { useConfirmation } from '@/hooks/useConfirmation';
import { CustomerRoutes } from '@/lib/constants/routes';
import { DangerZone } from '@/components/admin/DangerZone';

export default function SecurityPage() {
  const router = useRouter();
  const { confirm, ConfirmDialog } = useConfirmation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);

  // Password change form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const [activeSessions] = useState([
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      lastActive: '2 minutes ago',
      current: true,
      ip: '103.xxx.xxx.xxx',
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'Mumbai, India',
      lastActive: '2 hours ago',
      current: false,
      ip: '103.xxx.xxx.xxx',
    },
    {
      id: '3',
      device: 'Chrome on Android',
      location: 'Delhi, India',
      lastActive: '1 day ago',
      current: false,
      ip: '122.xxx.xxx.xxx',
    },
  ]);

  const onPasswordChange = (data: ChangePasswordInput) => {
    // TODO: Call API to change password
    console.log('Password change data:', data);
    toast.success('Password changed successfully!');
    reset();
  };

  const handleLogoutSession = async (sessionId: string) => {
    const confirmed = await confirm({
      title: 'Logout Session?',
      description: "This will end the session on this device. You'll need to log in again to access your account from that device.",
      confirmText: 'Yes, Logout',
      cancelText: 'Cancel',
      type: 'warning',
    });

    if (confirmed) {
      // TODO: Call API to logout session
      toast.success('Session terminated successfully');
    }
  };

  const handleLogoutAllSessions = async () => {
    const confirmed = await confirm({
      title: 'Logout All Other Sessions?',
      description: "This will end all active sessions except your current one. You'll need to log in again on those devices.",
      confirmText: 'Yes, Logout All',
      cancelText: 'Cancel',
      type: 'warning',
    });

    if (confirmed) {
      // TODO: Call API to logout all sessions
      toast.success('All other sessions terminated successfully');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirm({
      title: 'Delete Account?',
      description: 'This action cannot be undone. This will permanently delete your account and remove all your data from our servers.',
      confirmText: 'Yes, Delete My Account',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (confirmed) {
      // TODO: Call API to delete account
      toast.error('Account deletion initiated. Please check your email.');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header Section */}
      <section className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container-custom py-4 sm:py-6">
          <Button asChild variant="ghost" className="mb-4 h-9 px-3 text-sm hover:bg-muted/80 transition-colors">
            <Link href={CustomerRoutes.PROFILE}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage your account security and privacy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {/* Password Change */}
            <Card className="border-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start gap-2">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Key className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg">Change Password</CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-0.5 sm:mt-1">
                      Update your password regularly to keep your account secure
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onPasswordChange)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-xs sm:text-sm">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        {...register('currentPassword')}
                        placeholder="Enter current password"
                        className="h-10 sm:h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-xs sm:text-sm">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        {...register('newPassword')}
                        placeholder="Enter new password"
                        className="h-10 sm:h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.newPassword.message}</p>
                    )}
                    {!errors.newPassword && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Password must be at least 8 characters with uppercase, lowercase, number, and special character
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        placeholder="Confirm new password"
                        className="h-10 sm:h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full border-2 h-10 sm:h-11 text-xs sm:text-sm">
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Login Alerts */}
            <Card className="border-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start gap-2">
                  <div className="p-1.5 sm:p-2 bg-yellow-100 dark:bg-yellow-950/30 rounded-lg flex-shrink-0">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg">Login Alerts</CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-0.5 sm:mt-1">
                      Get notified of suspicious login attempts
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base text-foreground">Email Notifications</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Receive alerts for new device logins
                    </p>
                  </div>
                  <Switch
                    checked={loginAlertsEnabled}
                    onCheckedChange={setLoginAlertsEnabled}
                    className="flex-shrink-0"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card className="border-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-950/30 rounded-lg flex-shrink-0">
                      <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg">Active Sessions</CardTitle>
                      <CardDescription className="text-xs sm:text-sm mt-0.5 sm:mt-1">
                        Manage devices where you're logged in
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogoutAllSessions}
                    disabled={activeSessions.filter((s) => !s.current).length === 0}
                    className="w-full sm:w-auto border-2 h-9 text-xs sm:text-sm flex-shrink-0"
                  >
                    Logout All Others
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-3 sm:p-4 rounded-lg border-2 ${
                      session.current
                        ? 'bg-primary/5 border-primary/20'
                        : 'bg-muted border-border'
                    }`}
                  >
                    <div className="flex gap-2 sm:gap-3 min-w-0 flex-1">
                      <Monitor
                        className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                          session.current ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm sm:text-base text-foreground">{session.device}</p>
                          {session.current && (
                            <Badge variant="success" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-[10px] sm:text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{session.location}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            {session.lastActive}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">
                          IP: {session.ip}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLogoutSession(session.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-2 w-full sm:w-auto h-9 text-xs sm:text-sm flex-shrink-0"
                      >
                        Logout
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <DangerZone
              title="Danger Zone"
              description="Irreversible actions for your account"
              actions={[
                {
                  title: 'Delete Account',
                  description: 'Once you delete your account, there is no going back. All your data will be permanently removed.',
                  buttonText: 'Delete Account',
                  buttonIcon: Trash2,
                  onClick: handleDeleteAccount,
                  variant: 'destructive',
                  buttonClassName: 'h-9 sm:h-10 text-xs sm:text-sm',
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Confirmation Dialog */}
      <ConfirmDialog />
    </div>
  );
}
