'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Phone, Mail, MapPin, Star, Briefcase, IndianRupee, Calendar, Ban, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';
import { DangerZone } from '@/components/admin/DangerZone';
import { AdminRoutes } from '@/lib/constants/routes';

const staffMember = {
  id: 'staff_001',
  name: 'Rahul Kumar',
  phone: '+91 98765 43210',
  email: 'rahul@example.com',
  role: 'Senior Detailer',
  area: 'Bandra, Khar',
  active: true,
  joinedDate: '2024-06-15',
  completedJobs: 156,
  rating: 4.8,
  totalEarnings: 125600,
};

const recentJobs = [
  { id: 'BK045', customer: 'Amit Shah', service: 'Premium Wash', date: '2025-10-24', amount: 499, status: 'completed' },
  { id: 'BK044', customer: 'Priya Kumar', service: 'Interior Detailing', date: '2025-10-23', amount: 699, status: 'completed' },
  { id: 'BK043', customer: 'Rahul Verma', service: 'Full Detailing', date: '2025-10-22', amount: 1299, status: 'completed' },
];

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const blockConfirmation = useConfirmation();
  const deleteConfirmation = useConfirmation();

  const handleBlockClick = async () => {
    const confirmed = await blockConfirmation.confirm({
      type: 'block',
      title: 'Block Staff Member?',
      description: 'This staff member will be blocked from accepting new jobs. They will not be able to access their account until unblocked.',
      confirmText: 'Yes, Block Staff',
      cancelText: 'Cancel',
      itemName: staffMember.name,
    });

    if (confirmed) {
      // TODO: Implement block staff API
      toast.success(`Staff member "${staffMember.name}" has been blocked`);
    }
  };

  const handleDeleteClick = async () => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Staff Member?',
      description: 'This will permanently delete this staff member and all associated data. This action cannot be undone.',
      confirmText: 'Yes, Delete Staff',
      cancelText: 'Cancel',
      itemName: staffMember.name,
    });

    if (confirmed) {
      // TODO: Implement delete staff API
      toast.success(`Staff member "${staffMember.name}" has been deleted`);
      router.push(AdminRoutes.STAFF);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.STAFF)} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Staff
        </Button>
        <Button onClick={() => router.push(AdminRoutes.STAFF_EDIT(id))} className="h-9 sm:h-10 text-xs sm:text-sm border-2">
          <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Edit Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 items-start">
        {/* Staff Info */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Profile Card */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 flex-shrink-0">
                    <Briefcase className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl mb-1">{staffMember.name}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground">{staffMember.role}</p>
                  </div>
                </div>
                <Badge variant={staffMember.active ? 'default' : 'secondary'} className="text-xs sm:text-sm mx-auto sm:mx-0 w-fit">
                  {staffMember.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">{staffMember.phone}</p>
                </div>

                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{staffMember.email}</p>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Service Area</p>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground">{staffMember.area}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Joined Date</p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">{staffMember.joinedDate}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Rating</p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">⭐ {staffMember.rating}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Jobs */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Recent Jobs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-muted rounded-xl hover:shadow-sm transition-shadow">
                    <div>
                      <Badge variant="outline" className="font-mono mb-2">{job.id}</Badge>
                      <p className="font-semibold text-foreground">{job.customer}</p>
                      <p className="text-sm text-muted-foreground">{job.service}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {job.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">₹{job.amount}</p>
                      <Badge variant="default" className="text-xs mt-1">Completed</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="xl:col-span-1 space-y-4 sm:space-y-6">
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="p-2.5 sm:p-3 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                    <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Jobs</p>
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">{staffMember.completedJobs}</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5 sm:mt-1">Completed</p>
                </div>

                <div className="p-2.5 sm:p-3 md:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                    <IndianRupee className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-primary flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Earned</p>
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary">₹{(staffMember.totalEarnings / 1000).toFixed(0)}K</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5 sm:mt-1">Lifetime</p>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                  <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Avg Rating</p>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-foreground">⭐ {staffMember.rating}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Based on {staffMember.completedJobs} reviews</p>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <DangerZone
            description="Irreversible actions that affect this staff member"
            actions={[
              {
                title: 'Block Staff Member',
                description: 'Prevent staff from accepting new jobs',
                buttonText: 'Block',
                buttonIcon: Ban,
                onClick: handleBlockClick,
                variant: 'outline',
                buttonClassName: 'border-orange-300 dark:border-orange-800 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30',
              },
              {
                title: 'Delete Staff Member',
                description: 'Permanently remove staff member from system',
                buttonText: 'Delete',
                buttonIcon: Trash2,
                onClick: handleDeleteClick,
              },
            ]}
          />
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <blockConfirmation.ConfirmDialog />
      <deleteConfirmation.ConfirmDialog />
    </div>
  );
}
