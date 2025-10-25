'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image, Plus, Search, Eye, Edit, Trash2, TrendingUp, MousePointer } from 'lucide-react';
import { useState } from 'react';

const banners = [
  {
    id: 'banner_001',
    title: 'Premium Wash - 20% Off',
    position: 'hero',
    pages: 'Home',
    startDate: '2025-10-20',
    endDate: '2025-11-30',
    impressions: 15234,
    clicks: 892,
    active: true,
  },
  {
    id: 'banner_002',
    title: 'New Product Alert',
    position: 'middle',
    pages: 'Home, Products',
    startDate: '2025-10-24',
    endDate: '2025-12-31',
    impressions: 8456,
    clicks: 234,
    active: true,
  },
  {
    id: 'banner_003',
    title: 'Summer Special Offer',
    position: 'hero',
    pages: 'Home',
    startDate: '2025-09-01',
    endDate: '2025-10-15',
    impressions: 25678,
    clicks: 1567,
    active: false,
  },
];

export default function BannersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && banner.active) ||
      (statusFilter === 'inactive' && !banner.active);
    return matchesSearch && matchesStatus;
  });

  const totalImpressions = banners.reduce((sum, b) => sum + b.impressions, 0);
  const totalClicks = banners.reduce((sum, b) => sum + b.clicks, 0);
  const avgCTR = ((totalClicks / totalImpressions) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Marketing Banners</h1>
          <p className="text-muted-foreground mt-1">Manage promotional banners and ads</p>
        </div>
        <Button onClick={() => router.push('/admin/marketing/banners/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Banner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Banners</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{banners.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalImpressions.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <MousePointer className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalClicks.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. CTR</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{avgCTR}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Banners List */}
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Image className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>All Banners</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search banners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
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
          <div className="space-y-3">
            {filteredBanners.map((banner) => {
              const ctr = ((banner.clicks / banner.impressions) * 100).toFixed(2);
              return (
                <Card key={banner.id} className="border-2 border-border hover:shadow-lg transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-primary/10 rounded-xl">
                          <Image className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-foreground">{banner.title}</h3>
                            <Badge variant="outline" className="capitalize text-xs">{banner.position}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Displaying on: {banner.pages}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {banner.startDate} to {banner.endDate}
                          </p>
                        </div>
                      </div>
                      <Badge variant={banner.active ? 'default' : 'secondary'}>
                        {banner.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Views</p>
                        <p className="text-lg font-bold text-foreground">{banner.impressions.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Clicks</p>
                        <p className="text-lg font-bold text-foreground">{banner.clicks.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">CTR</p>
                        <p className="text-lg font-bold text-primary">{ctr}%</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => router.push(`/admin/marketing/banners/${banner.id}/edit`)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
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
