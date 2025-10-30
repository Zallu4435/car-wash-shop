'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  UserCog, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  MapPin,
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
import { AdminRoutes } from '@/lib/constants/routes';

export default function StaffPage() {
  const router = useRouter();
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

  const handleDelete = async (staffId: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      await deleteStaffMutation.mutateAsync(staffId);
    }
  };

  const handleToggleStatus = async (staffId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    const action = newStatus === 'suspended' ? 'suspend' : 'activate';
    if (confirm(`Are you sure you want to ${action} this staff member?`)) {
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
        <Button onClick={() => router.push(AdminRoutes.STAFF_NEW)} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add Staff
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
          className="sm:col-span-2 md:col-span-1"
        />
      </div>

      {/* Search Bar */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <UserCog className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Staff Members</CardTitle>
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
              <Card key={member.id} className="border-2 border-border hover:shadow-lg transition-all">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserCog className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                      {member.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{member.area}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted rounded-lg mb-3 sm:mb-4">
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Completed Jobs</p>
                      <p className="text-base sm:text-lg font-bold text-foreground">{member.totalJobs}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Rating</p>
                      <p className="text-base sm:text-lg font-bold text-foreground">⭐ {member.avgRating}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-9 text-xs sm:text-sm"
                      onClick={() => router.push(AdminRoutes.STAFF_DETAIL(member.id))}
                    >
                      <Eye className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">View</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-9 text-xs sm:text-sm"
                      onClick={() => router.push(AdminRoutes.STAFF_EDIT(member.id))}
                    >
                      <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={member.status === 'suspended' ? 'text-green-600 hover:text-green-600 hover:bg-green-50 h-9 px-3' : 'text-orange-600 hover:text-orange-600 hover:bg-orange-50 h-9 px-3'}
                      onClick={() => handleToggleStatus(member.id, member.status)}
                      disabled={updateStatusMutation.isPending}
                      title={member.status === 'suspended' ? 'Activate' : 'Suspend'}
                    >
                      {member.status === 'suspended' ? (
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      ) : (
                        <Ban className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 px-3"
                      onClick={() => handleDelete(member.id)}
                      disabled={deleteStaffMutation.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
    </div>
  );
}
