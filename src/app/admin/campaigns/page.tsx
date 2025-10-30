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

export default function CampaignsPage() {
  const router = useRouter();
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

  const handleDelete = async (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      await deleteCampaignMutation.mutateAsync(campaignId);
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
        return 'bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400';
      case 'scheduled':
        return 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400';
      case 'completed':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
      default:
        return '';
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
        <Button onClick={() => router.push(AdminRoutes.CAMPAIGN_NEW)} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
      <Card className="border-2">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Megaphone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Campaigns</CardTitle>
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
              <Card key={campaign.id} className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                        <Megaphone className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                          <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                            {campaign.name}
                          </h3>
                          <Badge variant="outline" className="text-xs flex-shrink-0">{campaign.type}</Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {campaign.startDate} to {campaign.endDate}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(campaign.status)} text-xs capitalize w-fit`}>
                      {campaign.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Budget</p>
                      <p className="text-base sm:text-lg font-bold text-foreground">
                        ₹{(campaign.budget / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Reach</p>
                      <p className="text-base sm:text-lg font-bold text-foreground">
                        {(campaign.impressions || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-[10px] sm:text-xs text-green-900 dark:text-green-100 mb-0.5 sm:mb-1">
                        Conversions
                      </p>
                      <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                        {campaign.conversions}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-9 text-xs sm:text-sm"
                      onClick={() => router.push(`${AdminRoutes.CAMPAIGNS}/${campaign.id}/edit`)}
                    >
                      <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-9 px-3"
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
    </div>
  );
}
