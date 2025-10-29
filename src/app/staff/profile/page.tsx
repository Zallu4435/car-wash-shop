'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, MapPin, Star, Briefcase, Edit, LogOut, IndianRupee, TrendingUp, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useStaffProfile, useStaffLogout } from '@/api/domains/staff/staff-index';
import { StaffRoutes } from '@/lib/constants/routes';

export default function StaffProfilePage() {
  const router = useRouter();
  const { data: profile } = useStaffProfile();
  const logoutMutation = useStaffLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => toast.success('Logged out successfully'),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Manage your account and view performance
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push(`${StaffRoutes.PROFILE}/edit`)}
          className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
        >
          <Edit className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="sm:inline">Edit Profile</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Section - Personal Info */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Profile Card */}
          <Card className="border-2 border-border">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">Personal Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Profile Picture */}
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
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

              <Separator />

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                      Phone
                    </p>
                  </div>
                  <p className="font-semibold text-sm sm:text-base text-foreground">
                    {profile?.phone ?? '—'}
                  </p>
                </div>

                <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                      Email
                    </p>
                  </div>
                  <p className="font-semibold text-sm sm:text-base text-foreground break-all">
                    {profile?.email ?? '—'}
                  </p>
                </div>
              </div>

              {/* Service Area */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                    Service Area
                  </p>
                </div>
                <p className="font-semibold text-sm sm:text-base text-foreground">
                  {profile?.area ?? '—'}
                </p>
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
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 sm:gap-3">
              <Button variant="outline" className="h-auto py-3 sm:py-4 flex-col gap-1.5 sm:gap-2">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">View Jobs</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 sm:py-4 flex-col gap-1.5 sm:gap-2">
                <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">Payments</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 sm:py-4 flex-col gap-1.5 sm:gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">History</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-3 sm:py-4 flex-col gap-1.5 sm:gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">Performance</CardTitle>
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
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  Based on 156 reviews
                </p>
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
          <Card className="border-2 border-border">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-muted rounded-lg sm:rounded-xl">
                <div className="text-xl sm:text-2xl flex-shrink-0">🏆</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs sm:text-sm text-foreground truncate">
                    Top Performer
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    October 2025
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-muted rounded-lg sm:rounded-xl">
                <div className="text-xl sm:text-2xl flex-shrink-0">⭐</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs sm:text-sm text-foreground truncate">
                    5-Star Expert
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    Excellent ratings
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-muted rounded-lg sm:rounded-xl">
                <div className="text-xl sm:text-2xl flex-shrink-0">🎯</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs sm:text-sm text-foreground truncate">
                    100+ Jobs
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    Milestone reached
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
