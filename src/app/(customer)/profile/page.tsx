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
                className="h-auto py-3 sm:py-4 flex flex-col items-center justify-center gap-1.5 sm:gap-2"
                onClick={() => router.push('/profile/addresses')}
              >
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-[10px] sm:text-xs md:text-sm">Addresses</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-3 sm:py-4 flex flex-col items-center justify-center gap-1.5 sm:gap-2"
                onClick={() => router.push('/profile/vehicles')}
              >
                <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-[10px] sm:text-xs md:text-sm">Vehicles</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-3 sm:py-4 flex flex-col items-center justify-center gap-1.5 sm:gap-2"
                onClick={() => router.push('/profile/security')}
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
                <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm">Full Name</Label>
                    <Input
                      id="name"
                      defaultValue="John Doe"
                      required
                      placeholder="Enter your full name"
                      className="h-10 sm:h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john@example.com"
                      required
                      placeholder="Enter your email"
                      className="h-10 sm:h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs sm:text-sm">Phone</Label>
                    <Input
                      id="phone"
                      defaultValue="+91 98765 43210"
                      required
                      placeholder="Enter your phone number"
                      className="h-10 sm:h-11"
                    />
                  </div>

                  <Separator />

                  <Button type="submit" className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base" size="lg">
                    Save Changes
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
                router.push('/auth/login');
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
