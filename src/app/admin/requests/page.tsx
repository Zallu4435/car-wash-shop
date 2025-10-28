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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Service Requests
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Manage service bookings and assignments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Total Bookings
                </p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{bookings.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Pending</p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-primary">{pendingCount}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  In Progress
                </p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{inProgressCount}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Completed Today
                </p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-primary">{completedToday}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Service Bookings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              placeholder="Search by booking ID, customer name, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-11 text-xs sm:text-sm"
            />
          </div>

          {/* Bookings Grid */}
          <div className="space-y-2.5 sm:space-y-3">
            {filteredBookings.map((booking) => {
              const statusVariant = statusVariants[booking.status as keyof typeof statusVariants] || 'secondary';
              return (
                <Card key={booking.id} className="border-2 border-border hover:shadow-lg transition-all">
                  <CardContent className="p-3 sm:p-4 md:p-5">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {booking.id}
                            </Badge>
                            <Badge variant={statusVariant} className="text-xs capitalize">
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="font-semibold text-foreground truncate">
                            {booking.customer.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {booking.service}
                          </p>
                        </div>
                      </div>

                      {/* Middle Section */}
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                          <p className="font-semibold text-foreground">{booking.date}</p>
                          <p className="text-sm text-muted-foreground">{booking.time}</p>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/admin/requests/${booking.id}`)}
                          className="h-9 text-xs sm:text-sm"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>

                    {/* Mobile/Tablet Layout */}
                    <div className="md:hidden space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 sm:p-2.5 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                          <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {booking.id}
                            </Badge>
                            <Badge variant={statusVariant} className="text-xs capitalize">
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="font-semibold text-sm sm:text-base text-foreground truncate">
                            {booking.customer.name}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {booking.service}
                          </p>
                          <div className="mt-2 pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                              {booking.date} • {booking.time}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/admin/requests/${booking.id}`)}
                        className="w-full h-9 text-xs sm:text-sm"
                      >
                        <Eye className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        View Details
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
