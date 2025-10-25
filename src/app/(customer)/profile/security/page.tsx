'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
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

  // Mock active sessions
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
      {/* Header */}
      <section className="bg-gradient-to-br from-red-500/5 to-background border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/profile">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-950/30 rounded-xl">
              <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Security Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your account security and privacy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Password Change */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password regularly to keep your account secure</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter current password"
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
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters with uppercase, lowercase, and numbers
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Confirm new password"
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

                  <Button type="submit" className="w-full">
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                    <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </div>
                  <Badge variant={twoFactorEnabled ? 'success' : 'outline'}>
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                  <Lock className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Enhanced Account Security
                    </p>
                    <p className="text-xs text-muted-foreground">
                      When enabled, you'll need to enter a code from your phone in addition to your password
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">Protect your account with 2FA</p>
                  </div>
                  <Switch checked={twoFactorEnabled} onCheckedChange={handleEnable2FA} />
                </div>

                {twoFactorEnabled && (
                  <Button variant="outline" className="w-full">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Manage 2FA Settings
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Login Alerts */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-950/30 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <CardTitle>Login Alerts</CardTitle>
                    <CardDescription>Get notified of suspicious login attempts</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts for new device logins
                    </p>
                  </div>
                  <Switch
                    checked={loginAlertsEnabled}
                    onCheckedChange={setLoginAlertsEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 dark:bg-green-950/30 rounded-lg">
                      <Monitor className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle>Active Sessions</CardTitle>
                      <CardDescription>Manage devices where you're logged in</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogoutAllSessions}
                    disabled={activeSessions.filter((s) => !s.current).length === 0}
                  >
                    Logout All Others
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-start justify-between p-4 rounded-lg border-2 ${
                      session.current
                        ? 'bg-primary/5 border-primary/20'
                        : 'bg-muted border-border'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          session.current ? 'bg-primary/10' : 'bg-background'
                        }`}
                      >
                        <Monitor
                          className={`h-5 w-5 ${
                            session.current ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{session.device}</p>
                          {session.current && (
                            <Badge variant="success" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {session.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {session.lastActive}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">IP: {session.ip}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLogoutSession(session.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
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
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 dark:bg-red-950/30 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions for your account</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900/50">
                  <p className="text-sm font-medium text-red-900 dark:text-red-200 mb-1">
                    Delete Account
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300 mb-4">
                    Once you delete your account, there is no going back. All your data will be
                    permanently removed.
                  </p>
                  
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your account and
                          remove all your data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
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
