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
      router.push('/admin/staff');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button variant="ghost" onClick={() => router.push('/admin/staff')} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Staff
        </Button>
        <Button onClick={() => router.push(`/admin/staff/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{staffMember.name}</CardTitle>
                    <p className="text-muted-foreground mt-1">{staffMember.role}</p>
                  </div>
                </div>
                <Badge variant={staffMember.active ? 'default' : 'secondary'}>
                  {staffMember.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                  </div>
                  <p className="font-semibold text-foreground">{staffMember.phone}</p>
                </div>

                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                  </div>
                  <p className="font-semibold text-foreground">{staffMember.email}</p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Service Area</p>
                </div>
                <p className="font-semibold text-foreground">{staffMember.area}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Joined Date</p>
                  <p className="font-semibold text-foreground">{staffMember.joinedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rating</p>
                  <p className="font-semibold text-foreground">⭐ {staffMember.rating}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Jobs */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Recent Jobs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
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
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Jobs</p>
                </div>
                <p className="text-4xl font-bold text-foreground">{staffMember.completedJobs}</p>
                <p className="text-xs text-muted-foreground mt-1">Completed successfully</p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <p className="text-xs text-green-900 dark:text-green-100 uppercase tracking-wide">Earnings</p>
                </div>
                <p className="text-4xl font-bold text-foreground">₹{staffMember.totalEarnings.toLocaleString()}</p>
                <p className="text-xs text-green-900 dark:text-green-100 mt-1">Lifetime earnings</p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <p className="text-xs text-amber-900 dark:text-amber-100 uppercase tracking-wide">Avg Rating</p>
                </div>
                <p className="text-4xl font-bold text-foreground">⭐ {staffMember.rating}</p>
                <p className="text-xs text-amber-900 dark:text-amber-100 mt-1">Based on {staffMember.completedJobs} reviews</p>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-2 border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="text-lg">Danger Zone</CardTitle>
              <p className="text-sm text-muted-foreground">
                Irreversible actions that affect this staff member
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-foreground">Block Staff Member</p>
                  <p className="text-sm text-muted-foreground">
                    Prevent staff from accepting new jobs
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleBlockClick}
                  className="border-orange-300 dark:border-orange-800 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Block
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-foreground">Delete Staff Member</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently remove staff member from system
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <blockConfirmation.ConfirmDialog />
      <deleteConfirmation.ConfirmDialog />
    </div>
  );
}
