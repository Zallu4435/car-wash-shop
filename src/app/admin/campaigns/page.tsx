'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Plus, Edit, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { AdminRoutes } from '@/lib/constants/routes';
import { useState, useMemo } from 'react';
import { useAdminCampaignList, useDeleteCampaign } from '@/api/domains/admin-marketing/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { StatCard } from '@/components/admin/StatCard';
import { Pagination } from '@/components/admin/Pagination';
import { TransactionCard } from '@/components/admin/TransactionCard';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';
import { IndianRupee, Users, Target } from 'lucide-react';

export default function CampaignsPage() {
  const router = useRouter();
  const deleteConfirmation = useConfirmation();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Combine search and filters for API
  const filters = useMemo(() => ({
    search: search || undefined,
    status: filterValues.status || undefined,
    page,
    pageSize,
  }), [search, filterValues, page, pageSize]);

  const { data: campaignsData, isLoading, error, refetch } = useAdminCampaignList(filters);
  const deleteCampaignMutation = useDeleteCampaign();

  const campaigns = campaignsData?.data || [];
  const totalItems = campaignsData?.total || 0;
  const totalPages = campaignsData?.totalPages || 0;
  const filteredCampaigns = campaigns; // Already filtered by API

  const handleDelete = async (campaignId: string, campaignTitle: string) => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Campaign?',
      description: 'This will permanently delete this campaign and all associated data. This action cannot be undone.',
      confirmText: 'Yes, Delete Campaign',
      cancelText: 'Cancel',
      itemName: campaignTitle,
    });

    if (confirmed) {
      await deleteCampaignMutation.mutateAsync(campaignId);
      toast.success(`Campaign "${campaignTitle}" has been deleted`);
    }
  };

  if (isLoading) {
    return <Loading text="Loading campaigns..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load campaigns" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalBudget = campaigns.reduce((sum: number, c: any) => sum + (c.budget || 0), 0);
  const totalConversions = campaigns.reduce((sum: number, c: any) => sum + (c.conversions || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-2 text-green-600 dark:text-green-400';
      case 'scheduled':
        return 'border-2 text-blue-600 dark:text-blue-400';
      case 'completed':
        return 'border-2 text-gray-600 dark:text-gray-400';
      default:
        return 'border-2';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Marketing Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Create and manage marketing campaigns
          </p>
        </div>
        <Button onClick={() => router.push(AdminRoutes.CAMPAIGN_NEW)} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Megaphone}
          label="Total Campaigns"
          value={totalItems}
          change="+9.3%"
          trend="up"
          description="All campaigns"
        />
        
        <StatCard
          icon={TrendingUp}
          label="Active"
          value={activeCampaigns}
          valueClassName="text-primary"
          change="+14.5%"
          trend="up"
          description="Currently running"
        />
        
        <StatCard
          icon={Calendar}
          label="Total Budget"
          value={`₹${(totalBudget / 1000).toFixed(0)}K`}
          change="+22.1%"
          trend="up"
          description="Allocated budget"
        />
        
        <StatCard
          icon={TrendingUp}
          label="Conversions"
          value={totalConversions}
          change="+16.8%"
          trend="up"
          description="Total conversions"
        />
      </div>

      {/* Campaigns List */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Megaphone className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">All Campaigns</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <SearchFilter
            searchPlaceholder="Search campaigns by name..."
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
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {/* Campaigns Grid */}
          {filteredCampaigns.length === 0 ? (
            <EmptyState
              icon={Megaphone}
              title="No campaigns found"
              description={search ? "Try adjusting your search or filters" : "No campaigns created yet"}
              action={
                !search && (
                  <Button onClick={() => router.push(AdminRoutes.CAMPAIGN_NEW)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Campaign
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredCampaigns.map((campaign: any) => (
                <TransactionCard
                  key={campaign.id}
                  id={campaign.id}
                  icon={Megaphone}
                  layout="vertical"
                  primaryBadge={{
                    label: campaign.type,
                    variant: 'outline',
                  }}
                  statusBadge={{
                    label: campaign.status,
                    className: `${getStatusColor(campaign.status)} capitalize`,
                  }}
                  title={campaign.name}
                  subtitle={campaign.type}
                  description={`${campaign.startDate} to ${campaign.endDate}`}
                  infoBoxes={[
                    {
                      icon: IndianRupee,
                      label: 'Budget',
                      value: `₹${(campaign.budget / 1000).toFixed(0)}K`,
                    },
                    {
                      icon: Users,
                      label: 'Reach',
                      value: (campaign.impressions || 0).toLocaleString(),
                    },
                    {
                      icon: Target,
                      label: 'Conversions',
                      value: campaign.conversions,
                      valueClassName: 'text-green-600 dark:text-green-400',
                    },
                  ]}
                  actionButtons={[
                    {
                      label: 'Edit',
                      icon: Edit,
                      onClick: () => router.push(`${AdminRoutes.CAMPAIGNS}/${campaign.id}/edit`),
                      hideTextOnMobile: true,
                    },
                    {
                      label: '',
                      icon: Trash2,
                      onClick: () => handleDelete(campaign.id, campaign.name),
                      disabled: deleteCampaignMutation.isPending,
                      className: 'text-destructive hover:bg-destructive/10 flex-initial px-3',
                    },
                  ]}
                />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {filteredCampaigns.length > 0 && (
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

      {/* Confirmation Dialog */}
      <deleteConfirmation.ConfirmDialog />
    </div>
  );
}
