'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Search, 
  Eye,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { getMockData } from '@/lib/api/mockData';

export default function RequestsPage() {
  const router = useRouter();
  const bookings = getMockData.bookings();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter(b => 
    b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const inProgressCount = bookings.filter(b => b.status === 'in-progress').length;
  const completedToday = bookings.filter(b => b.status === 'completed').length;

  const statusVariants = {
    pending: 'secondary' as const,
    'in-progress': 'default' as const,
    completed: 'default' as const,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Service Requests</h1>
        <p className="text-muted-foreground mt-1">Manage service bookings and assignments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{bookings.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-primary">{pendingCount}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{inProgressCount}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-primary">{completedToday}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>All Service Bookings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by booking ID, customer name, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Bookings Grid */}
          <div className="space-y-3">
            {filteredBookings.map((booking) => {
              const statusVariant = statusVariants[booking.status as keyof typeof statusVariants] || 'secondary';
              return (
                <Card key={booking.id} className="border-2 border-border hover:shadow-lg transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-primary/10 rounded-xl">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono">{booking.id}</Badge>
                            <Badge variant={statusVariant}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="font-semibold text-foreground">{booking.customer.name}</p>
                          <p className="text-sm text-muted-foreground">{booking.service}</p>
                        </div>
                      </div>

                      {/* Middle Section */}
                      <div className="hidden md:flex items-center gap-6">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                          <p className="font-semibold text-foreground">{booking.date}</p>
                          <p className="text-sm text-muted-foreground">{booking.time}</p>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/admin/requests/${booking.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
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
