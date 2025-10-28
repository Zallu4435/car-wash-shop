'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Megaphone, Plus, Search, Edit, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const campaigns = [
  { 
    id: 'camp_001', 
    name: 'Diwali Sale 2025', 
    type: 'Discount', 
    startDate: '2025-10-20', 
    endDate: '2025-11-05', 
    status: 'active',
    budget: 50000,
    reach: 15000,
    conversions: 245
  },
  { 
    id: 'camp_002', 
    name: 'New Year Special', 
    type: 'Promotion', 
    startDate: '2025-12-25', 
    endDate: '2026-01-07', 
    status: 'scheduled',
    budget: 75000,
    reach: 0,
    conversions: 0
  },
  { 
    id: 'camp_003', 
    name: 'Summer Sale 2025', 
    type: 'Discount', 
    startDate: '2025-08-01', 
    endDate: '2025-08-31', 
    status: 'completed',
    budget: 60000,
    reach: 25000,
    conversions: 890
  },
];

export default function CampaignsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);

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
        <Button onClick={() => router.push('/admin/marketing/campaigns/new')} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: Megaphone, color: 'blue', label: 'Total Campaigns', value: campaigns.length },
          { icon: TrendingUp, color: 'green', label: 'Active', value: activeCampaigns, isHighlight: true },
          { icon: Calendar, color: 'purple', label: 'Total Budget', value: `₹${(totalBudget / 1000).toFixed(0)}K` },
          { icon: TrendingUp, color: 'orange', label: 'Conversions', value: totalConversions },
        ].map((stat, index) => (
          <Card key={index} className="border-2">
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
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
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
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campaigns Grid */}
          <div className="space-y-2.5 sm:space-y-3">
            {filteredCampaigns.map((campaign) => (
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
                        {campaign.reach.toLocaleString()}
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
                      onClick={() => router.push(`/admin/marketing/campaigns/${campaign.id}/edit`)}
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
