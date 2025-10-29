'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image, Plus, Search, Eye, Edit, Trash2, TrendingUp, MousePointer } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminBannerList, useDeleteBanner } from '@/api/domains/admin-marketing/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';

export default function BannersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: bannersData, isLoading, error, refetch } = useAdminBannerList();
  const deleteBannerMutation = useDeleteBanner();

  const banners = bannersData || [];

  const handleDelete = async (bannerId: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      await deleteBannerMutation.mutateAsync(bannerId);
    }
  };

  if (isLoading) {
    return <Loading text="Loading banners..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load banners" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && banner.status === 'active') ||
      (statusFilter === 'inactive' && banner.status === 'inactive');
    return matchesSearch && matchesStatus;
  });

  const activeBanners = banners.filter(b => b.status === 'active').length;
  const inactiveBanners = banners.filter(b => b.status === 'inactive').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Marketing Banners
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Manage promotional banners and ads
          </p>
        </div>
        <Button onClick={() => router.push('/admin/marketing/banners/new')} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Create Banner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: Image, label: 'Total Banners', value: banners.length },
          { icon: TrendingUp, label: 'Active Banners', value: activeBanners },
          { icon: MousePointer, label: 'Inactive Banners', value: inactiveBanners },
          { icon: Eye, label: 'Total', value: banners.length },
        ].map((stat, index) => (
          <Card key={index} className="border-2 border-border">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Banners List */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Image className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Banners</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search banners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 h-10 sm:h-11 text-xs sm:text-sm"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 h-10 sm:h-11 text-xs sm:text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Banners Grid */}
          <div className="space-y-2.5 sm:space-y-3">
            {filteredBanners.map((banner) => {
              const ctr = banner.clicks && banner.impressions ? ((banner.clicks / banner.impressions) * 100).toFixed(2) : '0.00';
              return (
                <Card key={banner.id} className="border-2 border-border hover:shadow-lg transition-all">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                          <Image className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                            <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                              {banner.title}
                            </h3>
                            <Badge variant="outline" className="capitalize text-xs flex-shrink-0">
                              {banner.position}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            Displaying on: {banner.pages}
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                            {banner.startDate} to {banner.endDate}
                          </p>
                        </div>
                      </div>
                      <Badge variant={banner.status === 'active' ? 'default' : 'secondary'} className="text-xs w-fit">
                        {banner.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Views</p>
                        <p className="text-base sm:text-lg font-bold text-foreground">
                          {(banner.impressions || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Clicks</p>
                        <p className="text-base sm:text-lg font-bold text-foreground">
                          {(banner.clicks || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">CTR</p>
                        <p className="text-base sm:text-lg font-bold text-primary">{ctr}%</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 h-9 text-xs sm:text-sm"
                        onClick={() => router.push(`/admin/marketing/banners/${banner.id}/edit`)}
                      >
                        <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline">Edit</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 px-3"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
