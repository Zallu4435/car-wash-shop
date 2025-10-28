'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Key,
  Lock,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
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

export default function SecurityPage() {
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password changed successfully!');
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(
      twoFactorEnabled
        ? 'Two-factor authentication disabled'
        : 'Two-factor authentication enabled'
    );
  };

  const handleLogoutSession = (sessionId: string) => {
    toast.success('Session terminated successfully');
  };

  const handleLogoutAllSessions = () => {
    toast.success('All other sessions terminated successfully');
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(false);
    toast.error('Account deletion initiated. Please check your email.');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Responsive */}
      <section className="bg-gradient-to-br from-red-500/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <Button asChild variant="ghost" className="mb-3 sm:mb-4 h-9 sm:h-10">
            <Link href="/profile">
              <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Back to Profile</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-red-100 dark:bg-red-950/30 rounded-lg sm:rounded-xl flex-shrink-0">
              <Shield className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                Security Settings
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
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
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-xs sm:text-sm">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        required
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-xs sm:text-sm">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        required
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
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Password must be at least 8 characters with uppercase, lowercase, and numbers
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
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
                  </div>

                  <Button type="submit" className="w-full h-10 sm:h-11 text-xs sm:text-sm">
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card className="border-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start gap-2">
                  <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg flex-shrink-0">
                    <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg">Two-Factor Authentication</CardTitle>
                        <CardDescription className="text-xs sm:text-sm mt-0.5 sm:mt-1">
                          Add an extra layer of security to your account
                        </CardDescription>
                      </div>
                      <Badge variant={twoFactorEnabled ? 'success' : 'outline'} className="text-xs flex-shrink-0">
                        {twoFactorEnabled ? (
                          <>
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Enabled
                          </>
                        ) : (
                          'Disabled'
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground mb-1">
                      Enhanced Account Security
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      When enabled, you'll need to enter a code from your phone in addition to your password
                    </p>
                  </div>
                </div>

                <div className="flex items-start sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base text-foreground">Enable 2FA</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Protect your account with 2FA</p>
                  </div>
                  <Switch checked={twoFactorEnabled} onCheckedChange={handleEnable2FA} className="flex-shrink-0" />
                </div>

                {twoFactorEnabled && (
                  <Button variant="outline" className="w-full h-10 sm:h-11 text-xs sm:text-sm">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Manage 2FA Settings
                  </Button>
                )}
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
                    className="w-full sm:w-auto h-9 text-xs sm:text-sm flex-shrink-0"
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
                      <div
                        className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                          session.current ? 'bg-primary/10' : 'bg-background'
                        }`}
                      >
                        <Monitor
                          className={`h-4 w-4 sm:h-5 sm:w-5 ${
                            session.current ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        />
                      </div>
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
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 w-full sm:w-auto h-9 text-xs sm:text-sm flex-shrink-0"
                      >
                        Logout
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-2 border-red-200 dark:border-red-900/50">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start gap-2">
                  <div className="p-1.5 sm:p-2 bg-red-100 dark:bg-red-950/30 rounded-lg flex-shrink-0">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg text-red-600 dark:text-red-400">
                      Danger Zone
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-0.5 sm:mt-1">
                      Irreversible actions for your account
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900/50">
                  <p className="text-xs sm:text-sm font-medium text-red-900 dark:text-red-200 mb-1">
                    Delete Account
                  </p>
                  <p className="text-[10px] sm:text-xs text-red-700 dark:text-red-300 mb-3 sm:mb-4">
                    Once you delete your account, there is no going back. All your data will be
                    permanently removed.
                  </p>
                  
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="h-9 sm:h-10 text-xs sm:text-sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">Are you absolutely sure?</DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm">
                          This action cannot be undone. This will permanently delete your account and
                          remove all your data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteDialog(false)}
                          className="h-10 sm:h-11 text-xs sm:text-sm"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          className="h-10 sm:h-11 text-xs sm:text-sm"
                        >
                          Yes, Delete My Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
