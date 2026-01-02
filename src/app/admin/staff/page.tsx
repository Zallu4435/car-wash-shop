'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  UserCog,
  Plus,
  Eye,
  Edit,
  Trash2,
  Briefcase,
  Ban,
  CheckCircle
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminStaffList, useDeleteStaff, useUpdateStaffStatus } from '@/api/domains/admin-staff/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { StatCard } from '@/components/admin/StatCard';
import { Pagination } from '@/components/admin/Pagination';
import { TransactionCard } from '@/components/admin/TransactionCard';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';
import { AdminRoutes } from '@/lib/constants/routes';
import { Star, Target } from 'lucide-react';

export default function StaffPage() {
  const router = useRouter();
  const blockConfirmation = useConfirmation();
  const deleteConfirmation = useConfirmation();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Combine search and filters for API
  const filters = useMemo(() => ({
    search: search || undefined,
    status: (filterValues.status as 'active' | 'inactive' | 'suspended' | undefined) || undefined,
    role: filterValues.role || undefined,
    page,
    limit: pageSize,
  }), [search, filterValues, page, pageSize]);

  const { data: staffData, isLoading, error, refetch } = useAdminStaffList(filters);
  const deleteStaffMutation = useDeleteStaff();
  const updateStatusMutation = useUpdateStaffStatus();

  const staff = staffData?.data || [];
  const totalItems = staffData?.total || 0;
  const totalPages = staffData?.totalPages || 0;
  const filteredStaff = staff; // Already filtered by API

  const handleDelete = async (staffId: string, staffName: string) => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Staff Member?',
      description: 'This will permanently delete this staff member and all associated data. This action cannot be undone.',
      confirmText: 'Yes, Delete Staff',
      cancelText: 'Cancel',
      itemName: staffName,
    });

    if (confirmed) {
      await deleteStaffMutation.mutateAsync(staffId);
      toast.success(`Staff member "${staffName}" has been deleted`);
    }
  };

  const handleToggleStatus = async (staffId: string, currentStatus: string, staffName: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    const action = newStatus === 'suspended' ? 'suspend' : 'activate';

    const confirmed = await blockConfirmation.confirm({
      type: newStatus === 'suspended' ? 'block' : 'warning',
      title: newStatus === 'suspended' ? 'Suspend Staff Member?' : 'Activate Staff Member?',
      description: newStatus === 'suspended'
        ? 'This staff member will be suspended and unable to accept new jobs until reactivated.'
        : 'This staff member will be reactivated and able to accept jobs again.',
      confirmText: newStatus === 'suspended' ? 'Yes, Suspend Staff' : 'Yes, Activate Staff',
      cancelText: 'Cancel',
      itemName: staffName,
    });

    if (confirmed) {
      await updateStatusMutation.mutateAsync({ staffId, status: newStatus });
    }
  };

  if (isLoading) {
    return <Loading text="Loading staff members..." />;
  }

  if (error) {
    return (
      <Error
        message="Failed to load staff members"
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Staff Members
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Manage your team and their performance
          </p>
        </div>
        <Button onClick={() => router.push(AdminRoutes.STAFF_NEW)} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add Staff
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          icon={UserCog}
          label="Total Staff"
          value={totalItems}
          change="+5.3%"
          trend="up"
          description="All staff members"
        />

        <StatCard
          icon={Briefcase}
          label="Active Members"
          value={staff.filter((s: any) => s.status === 'active').length}
          valueClassName="text-primary"
          change="+8.7%"
          trend="up"
          description="Currently active"
        />

        <StatCard
          icon={Briefcase}
          label="Total Jobs"
          value={staff.reduce((sum: number, s: any) => sum + (s.totalJobs || 0), 0)}
          change="+12.4%"
          trend="up"
          description="Completed jobs"
          className="xs:col-span-2 lg:col-span-1"
        />
      </div>

      {/* Search Bar */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <UserCog className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">All Staff Members</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <SearchFilter
            searchPlaceholder="Search staff by name or phone..."
            onSearchChange={setSearch}
            filterOptions={[
              {
                label: 'Status',
                value: 'status',
                options: [
                  { label: 'All Statuses', value: '' },
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ],
              },
              {
                label: 'Role',
                value: 'role',
                options: [
                  { label: 'All Roles', value: '' },
                  { label: 'Senior Technician', value: 'Senior Technician' },
                  { label: 'Technician', value: 'Technician' },
                  { label: 'Junior Technician', value: 'Junior Technician' },
                ],
              },
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {/* Staff Grid */}
          {filteredStaff.length === 0 ? (
            <EmptyState
              icon={UserCog}
              title="No staff members found"
              description={search ? "Try adjusting your search or filters" : "Add your first staff member to get started"}
              action={
                !search && (
                  <Button onClick={() => router.push(AdminRoutes.STAFF_NEW)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Staff Member
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {filteredStaff.map((member) => (
                <TransactionCard
                  key={member.id}
                  id={member.id}
                  icon={UserCog}
                  layout="vertical"
                  primaryBadge={{
                    label: member.role,
                    variant: 'outline',
                  }}
                  statusBadge={{
                    label: member.status === 'active' ? 'Active' : 'Inactive',
                    className: '',
                  }}
                  title={member.name}
                  subtitle={member.role}
                  description={`${member.phone} | ${member.area}`}
                  infoBoxes={[
                    {
                      icon: Target,
                      label: 'Completed Jobs',
                      value: member.totalJobs,
                    },
                  ]}
                  actionButtons={[
                    {
                      label: 'View',
                      icon: Eye,
                      onClick: () => router.push(AdminRoutes.STAFF_DETAIL(member.id)),
                      hideTextOnMobile: true,
                    },
                    {
                      label: 'Edit',
                      icon: Edit,
                      onClick: () => router.push(AdminRoutes.STAFF_EDIT(member.id)),
                      hideTextOnMobile: true,
                    },
                    {
                      label: '',
                      icon: member.status === 'suspended' ? CheckCircle : Ban,
                      onClick: () => handleToggleStatus(member.id, member.status, member.name),
                      disabled: updateStatusMutation.isPending,
                      className: member.status === 'suspended'
                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 flex-initial px-3'
                        : 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 flex-initial px-3',
                    },
                    {
                      label: '',
                      icon: Trash2,
                      onClick: () => handleDelete(member.id, member.name),
                      disabled: deleteStaffMutation.isPending,
                      className: 'text-destructive hover:bg-destructive/10 flex-initial px-3',
                    },
                  ]}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredStaff.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1); // Reset to first page when changing page size
              }}
              className="mt-4 sm:mt-6"
            />
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialogs */}
      <blockConfirmation.ConfirmDialog />
      <deleteConfirmation.ConfirmDialog />
    </div>
  );
}
