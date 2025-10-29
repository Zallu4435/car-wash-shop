'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileImage, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminPosterList, useDeletePoster } from '@/api/domains/admin-marketing/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';

export default function PostersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: postersData, isLoading, error, refetch } = useAdminPosterList();
  const deletePosterMutation = useDeletePoster();

  const posters = postersData || [];

  const handleDelete = async (posterId: string) => {
    if (confirm('Are you sure you want to delete this poster?')) {
      await deletePosterMutation.mutateAsync(posterId);
    }
  };

  if (isLoading) {
    return <Loading text="Loading posters..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load posters" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPosters = posters.filter(poster => {
    const matchesSearch = poster.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && poster.active) ||
      (statusFilter === 'inactive' && !poster.active);
    return matchesSearch && matchesStatus;
  });

  const activePosters = posters.filter(p => p.active).length;
  const totalViews = posters.reduce((sum, p) => sum + p.views, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Marketing Posters
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Upload and display promotional posters
          </p>
        </div>
        <Button onClick={() => router.push('/admin/marketing/posters/new')} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Create Poster
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {[
          { icon: FileImage, color: 'blue', label: 'Total Posters', value: posters.length },
          { icon: FileImage, color: 'green', label: 'Active Posters', value: activePosters, isHighlight: true },
          { icon: Eye, color: 'purple', label: 'Total Views', value: totalViews.toLocaleString() },
        ].map((stat, index) => (
          <Card key={index} className={`border-2 ${index === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className={`p-2 sm:p-3 bg-${stat.color}-100 dark:bg-${stat.color}-950/30 rounded-lg sm:rounded-xl flex-shrink-0`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                </div>
              </div>
              <p className={`text-2xl sm:text-3xl font-bold ${stat.isHighlight ? `text-${stat.color}-600 dark:text-${stat.color}-400` : 'text-foreground'}`}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Posters List */}
      <Card className="border-2">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <FileImage className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Posters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search posters..."
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

          {/* Posters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredPosters.map((poster) => (
              <Card key={poster.id} className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-4 sm:p-5">
                  <div className="mb-3 sm:mb-4">
                    <div className="w-full h-32 sm:h-40 bg-muted rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                      <FileImage className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                          {poster.title}
                        </h3>
                        <Badge variant="outline" className="text-xs mt-0.5 sm:mt-1">
                          {poster.location}
                        </Badge>
                      </div>
                      <Badge variant={poster.active ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                        {poster.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">
                    <p>From: {poster.startDate}</p>
                    <p>To: {poster.endDate}</p>
                  </div>

                  <div className="p-2.5 sm:p-3 bg-muted rounded-lg mb-3 sm:mb-4">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Views</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      {poster.views.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-9 text-xs sm:text-sm"
                      onClick={() => router.push(`/admin/marketing/posters/${poster.id}/edit`)}
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
        </CardContent>
      </Card>
    </div>
  );
}
