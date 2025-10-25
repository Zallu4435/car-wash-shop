'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileImage, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';

const posters = [
  { 
    id: 'poster_001', 
    title: 'Summer Special', 
    location: 'Home Page', 
    startDate: '2025-10-20', 
    endDate: '2025-11-30', 
    active: true,
    views: 5678
  },
  { 
    id: 'poster_002', 
    title: 'New Products', 
    location: 'Products Page', 
    startDate: '2025-10-24', 
    endDate: '2025-12-31', 
    active: true,
    views: 3456
  },
  { 
    id: 'poster_003', 
    title: 'Winter Sale', 
    location: 'Home Page', 
    startDate: '2025-12-01', 
    endDate: '2026-01-31', 
    active: false,
    views: 0
  },
];

export default function PostersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Marketing Posters</h1>
          <p className="text-muted-foreground mt-1">Upload and display promotional posters</p>
        </div>
        <Button onClick={() => router.push('/admin/marketing/posters/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Poster
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-xl">
                <FileImage className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Posters</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{posters.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-xl">
                <FileImage className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Posters</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{activePosters}</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/30 rounded-xl">
                <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Posters List */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileImage className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>All Posters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posters..."
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

          {/* Posters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosters.map((poster) => (
              <Card key={poster.id} className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="mb-4">
                    <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center mb-3">
                      <FileImage className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-foreground">{poster.title}</h3>
                        <Badge variant="outline" className="text-xs mt-1">{poster.location}</Badge>
                      </div>
                      <Badge variant={poster.active ? 'default' : 'secondary'}>
                        {poster.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                    <p>From: {poster.startDate}</p>
                    <p>To: {poster.endDate}</p>
                  </div>

                  <div className="p-3 bg-muted rounded-lg mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Views</p>
                    <p className="text-2xl font-bold text-foreground">{poster.views.toLocaleString()}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`/admin/marketing/posters/${poster.id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="h-4 w-4" />
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
