'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AvatarUploader } from '@/components/shared/media/AvatarUploader';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Car, LogOut, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [avatar, setAvatar] = useState<string>('');

  const handleAvatarUpload = (file: File) => {
    // In production, upload to server
    toast.success('Profile picture updated!');
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    toast.success('Profile picture removed');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground mt-1">Manage your account information</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => router.push('/profile/addresses')}
              >
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm">Addresses</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => router.push('/profile/vehicles')}
              >
                <Car className="h-5 w-5 text-primary" />
                <span className="text-sm">My Vehicles</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => router.push('/profile/security')}
              >
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">Security</span>
              </Button>
            </div>

            {/* Avatar Section */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Profile Picture</CardTitle>
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
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Personal Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      defaultValue="John Doe"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john@example.com"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      defaultValue="+91 98765 43210"
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <Separator />

                  <Button type="submit" className="w-full shadow-lg" size="lg">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Logout Button */}
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-2"
              onClick={() => {
                toast.success('Logged out successfully');
                router.push('/auth/login');
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
