'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Phone, Mail, Briefcase, IndianRupee, Calendar, Ban, Trash2, Banknote, Smartphone, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';
import { DangerZone } from '@/components/admin/DangerZone';
import { AdminRoutes } from '@/lib/constants/routes';
import { useAdminStaffDetail, useDeleteStaff, useUpdateStaffStatus, useStaffCollections, useMarkHandoverReceived } from '@/api/domains/admin-staff/queries';

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const blockConfirmation = useConfirmation();
  const deleteConfirmation = useConfirmation();
  const { data: staffMember, isLoading } = useAdminStaffDetail(id);
  const deleteStaff = useDeleteStaff();
  const updateStaffStatus = useUpdateStaffStatus();
  const { data: collectionsData, isLoading: isLoadingCollections } = useStaffCollections(id);
  const markHandover = useMarkHandoverReceived();
  const handoverConfirmation = useConfirmation();

  const handleDeleteClick = async () => {
    if (!staffMember) return;

    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Staff Member?',
      description: 'This will permanently delete this staff member and all associated data. This action cannot be undone.',
      confirmText: 'Yes, Delete Staff',
      cancelText: 'Cancel',
      itemName: staffMember.name,
    });

    if (confirmed) {
      await deleteStaff.mutateAsync(id);
      router.push(AdminRoutes.STAFF);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading staff details...</p>
      </div>
    );
  }

  if (!staffMember) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Staff member not found</p>
        <Button onClick={() => router.push(AdminRoutes.STAFF)}>Back to Staff</Button>
      </div>
    );
  }

  const recentJobs = staffMember.recentJobs || [];

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
                  </div>
                </div>
                <Badge variant={staffMember.status === 'active' ? 'default' : 'secondary'} className="text-xs sm:text-sm mx-auto sm:mx-0 w-fit">
                  {staffMember.status === 'active' ? 'Active' : 'Suspended'}
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

              <Separator />

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Joined Date</p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">{staffMember.joinedDate}</p>
                </div>
                {/* Rating removed */}
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
                        {new Date(job.date).toLocaleDateString()}
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

          {/* Collections / Cash Handover */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Collections</CardTitle>
                </div>
                {collectionsData?.summary && collectionsData.summary.pendingDays > 0 && (
                  <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                    {collectionsData.summary.pendingDays} pending
                  </Badge>
                )}
              </div>
              {collectionsData?.summary && collectionsData.summary.totalPending > 0 && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Total pending: <span className="font-semibold text-amber-600">₹{collectionsData.summary.totalPending.toLocaleString('en-IN')}</span>
                </p>
              )}
            </CardHeader>
            <CardContent>
              {isLoadingCollections ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : !collectionsData?.collections || collectionsData.collections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <IndianRupee className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No collections found</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {collectionsData.collections.map((collection) => (
                    <div
                      key={collection.date}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 ${collection.handoverStatus === 'received'
                        ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30'
                        : 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30'
                        }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-semibold">
                            {new Date(collection.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                          {collection.handoverStatus === 'received' ? (
                            <Badge variant="default" className="text-[10px] bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Received
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Banknote className="h-3 w-3" />
                            ₹{collection.cash.toLocaleString('en-IN')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Smartphone className="h-3 w-3" />
                            ₹{collection.online.toLocaleString('en-IN')}
                          </span>
                        </div>
                        {collection.receivedBy && (
                          <p className="text-[10px] text-muted-foreground mt-1">
                            By {collection.receivedBy} on {new Date(collection.receivedAt!).toLocaleDateString('en-IN')}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-lg font-bold text-primary">
                          ₹{collection.total.toLocaleString('en-IN')}
                        </p>
                        {collection.handoverStatus === 'pending' && (
                          <Button
                            size="sm"
                            onClick={async () => {
                              const confirmed = await handoverConfirmation.confirm({
                                title: 'Mark as Received',
                                description: `Confirm you have received ₹${collection.total.toLocaleString('en-IN')} from ${staffMember?.name} for ${new Date(collection.date).toLocaleDateString('en-IN')}?`,
                                confirmText: 'Yes, Received',
                                cancelText: 'Cancel',
                              });
                              if (confirmed) {
                                markHandover.mutate({ staffId: id, date: collection.date });
                              }
                            }}
                            disabled={markHandover.isPending}
                            className="h-8 text-xs"
                          >
                            {markHandover.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            Mark Received
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="xl:col-span-1 space-y-4 sm:space-y-6">
          {/* Performance card simplified – rating removed */}
          <DangerZone
            description="Irreversible actions that affect this staff member"
            actions={[
              {
                title: staffMember.status === 'active' ? 'Suspend Staff Member' : 'Activate Staff Member',
                description: staffMember.status === 'active'
                  ? 'Prevent staff from accepting new jobs'
                  : 'Reactivate staff member to accept new jobs',
                buttonText: staffMember.status === 'active' ? 'Suspend' : 'Activate',
                buttonIcon: Ban,
                onClick: async () => {
                  if (!staffMember) return;
                  const confirmed = await blockConfirmation.confirm({
                    type: staffMember.status === 'active' ? 'block' : 'default',
                    title: staffMember.status === 'active' ? 'Suspend Staff Member?' : 'Activate Staff Member?',
                    description: staffMember.status === 'active'
                      ? 'This staff member will be suspended and cannot accept new jobs.'
                      : 'This staff member will be reactivated and can accept new jobs.',
                    confirmText: staffMember.status === 'active' ? 'Yes, Suspend' : 'Yes, Activate',
                    cancelText: 'Cancel',
                    itemName: staffMember.name,
                  });
                  if (confirmed) {
                    await updateStaffStatus.mutateAsync({
                      staffId: id,
                      status: staffMember.status === 'active' ? 'suspended' : 'active'
                    });
                  }
                },
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
      <handoverConfirmation.ConfirmDialog />
    </div>
  );
}
