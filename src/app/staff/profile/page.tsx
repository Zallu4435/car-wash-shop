'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, MapPin, Star, Briefcase, Edit, LogOut, IndianRupee, TrendingUp, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function StaffProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account and view performance</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/staff/profile/edit')}>
          <Edit className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Edit Profile</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="border-2 border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Personal Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Picture */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg text-foreground">Rahul Kumar</p>
                  <p className="text-sm text-muted-foreground">Senior Detailer</p>
                </div>
              </div>

              <Separator />

              {/* Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                  </div>
                  <p className="font-semibold text-foreground">+91 98765 43210</p>
                </div>

                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                  </div>
                  <p className="font-semibold text-foreground">rahul@example.com</p>
                </div>
              </div>

              {/* Service Area */}
              <div className="p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Service Area</p>
                </div>
                <p className="font-semibold text-foreground">Bandra, Khar, Andheri West</p>
              </div>

              {/* Role */}
              <div className="p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Role & Status</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-sm">
                    Senior Detailer
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Briefcase className="h-5 w-5" />
                <span className="text-sm">View Jobs</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <IndianRupee className="h-5 w-5" />
                <span className="text-sm">Payments</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">History</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Performance Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Performance Stats */}
          <Card className="border-2 border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Total Jobs */}
              <div className="p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Jobs</p>
                </div>
                <p className="text-4xl font-bold text-foreground">156</p>
                <p className="text-xs text-muted-foreground mt-1">Completed successfully</p>
              </div>

              {/* Average Rating */}
              <div className="p-4 bg-primary/5 rounded-xl border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-primary" />
                  <p className="text-xs text-foreground uppercase tracking-wide">Avg Rating</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-4xl font-bold text-foreground">4.8</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
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
                <p className="text-xs text-muted-foreground mt-1">Based on 156 reviews</p>
              </div>

              {/* Total Earnings */}
              <div className="p-4 bg-primary/5 rounded-xl border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  <p className="text-xs text-foreground uppercase tracking-wide">Total Earnings</p>
                </div>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-6 w-6 text-primary" />
                  <p className="text-3xl font-bold text-foreground">1,25,600</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <div className="text-2xl">🏆</div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Top Performer</p>
                  <p className="text-xs text-muted-foreground">October 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <div className="text-2xl">⭐</div>
                <div>
                  <p className="font-semibold text-sm text-foreground">5-Star Expert</p>
                  <p className="text-xs text-muted-foreground">Excellent ratings</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <div className="text-2xl">🎯</div>
                <div>
                  <p className="font-semibold text-sm text-foreground">100+ Jobs</p>
                  <p className="text-xs text-muted-foreground">Milestone reached</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
