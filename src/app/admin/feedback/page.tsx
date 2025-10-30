'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  AlertCircle, 
  Lightbulb,
  Users
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminFeedbackList } from '@/api/domains/admin-support/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { Pagination } from '@/components/admin/Pagination';

export default function AdminFeedbackPage() {
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Combine search and filters for API
  const filters = useMemo(() => ({
    search: search || undefined,
    rating: filterValues.rating || undefined,
    page,
    pageSize,
  }), [search, filterValues, page, pageSize]);

  const { data: feedbackData, isLoading, error, refetch } = useAdminFeedbackList(filters);

  const feedback = feedbackData?.data || [];
  const totalItems = feedbackData?.total || 0;
  const totalPages = feedbackData?.totalPages || 0;
  const filteredFeedback = feedback; // Already filtered by API

  if (isLoading) {
    return <Loading text="Loading feedback..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load feedback" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const avgRating = feedback.length > 0 
    ? (feedback.reduce((sum: number, item: any) => sum + (item.rating || 0), 0) / feedback.length).toFixed(1)
    : '0.0';
  const compliments = feedback.filter((f: any) => f.rating === 5).length;
  const suggestions = feedback.filter((f: any) => f.rating === 4).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Compliment':
        return <ThumbsUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case 'Suggestion':
        return <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case 'Bug':
        return <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      default:
        return <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Compliment':
        return {
          backgroundColor: 'hsl(160 60% 45% / 0.1)',
          color: 'hsl(160 60% 45%)',
          borderColor: 'hsl(160 60% 45% / 0.3)'
        };
      case 'Suggestion':
        return {
          backgroundColor: 'hsl(221 83% 53% / 0.1)',
          color: 'hsl(221 83% 53%)',
          borderColor: 'hsl(221 83% 53% / 0.3)'
        };
      case 'Bug':
        return {
          backgroundColor: 'hsl(0 63% 55% / 0.1)',
          color: 'hsl(0 63% 55%)',
          borderColor: 'hsl(0 63% 55% / 0.3)'
        };
      default:
        return {
          backgroundColor: 'hsl(var(--muted))',
          color: 'hsl(var(--muted-foreground))',
          borderColor: 'hsl(var(--border))'
        };
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Customer Feedback
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Monitor and respond to customer feedback
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: MessageSquare, color: 'hsl(221 83% 53%)', label: 'Total Feedback', value: totalItems },
          { icon: Star, color: 'hsl(43 74% 66%)', label: 'Avg Rating', value: `${avgRating} ⭐` },
          { icon: ThumbsUp, color: 'hsl(160 60% 45%)', label: 'Compliments', value: compliments, isHighlight: true },
          { icon: Lightbulb, color: 'hsl(280 65% 60%)', label: 'Suggestions', value: suggestions },
        ].map((stat, index) => (
          <Card key={index} className="border-2 border-border">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0" style={{ backgroundColor: `${stat.color} / 0.1` }}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: stat.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                </div>
              </div>
              <p className={`text-2xl sm:text-3xl font-bold ${stat.isHighlight ? '' : 'text-foreground'}`} style={stat.isHighlight ? { color: stat.color } : {}}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feedback List */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 rounded-lg" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <CardTitle className="text-base sm:text-lg">Recent Feedback</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <SearchFilter
            searchPlaceholder="Search feedback by customer or message..."
            onSearchChange={setSearch}
            filterOptions={[
              {
                label: 'Rating',
                value: 'rating',
                options: [
                  { label: 'All Ratings', value: '' },
                  { label: '5 Stars', value: '5' },
                  { label: '4 Stars', value: '4' },
                  { label: '3 Stars & Below', value: '3' },
                ],
              },
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {/* Feedback Items */}
          {filteredFeedback.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No feedback found"
              description={search ? "Try adjusting your search or filters" : "No feedback received yet"}
            />
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              {filteredFeedback.map((item) => (
                  <Card key={item.id} className="border-2 border-border hover:shadow-lg transition-all">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start justify-between mb-2.5 sm:mb-3 flex-wrap gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div 
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                          >
                            <Users className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(var(--primary))' }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm sm:text-base text-foreground truncate">{item.customerName}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Booking #{item.bookingId}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant={item.status === 'resolved' ? 'default' : item.status === 'reviewed' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {item.status}
                          </Badge>
                          <span className="text-[10px] sm:text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-foreground mb-2.5 sm:mb-3">{item.comment || 'No comment provided'}</p>

                      <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                              style={{
                                fill: i < item.rating ? 'hsl(43 74% 66%)' : 'transparent',
                                color: i < item.rating ? 'hsl(43 74% 66%)' : 'hsl(var(--muted-foreground) / 0.3)'
                              }}
                            />
                          ))}
                          <span className="text-xs sm:text-sm font-semibold text-foreground ml-1.5 sm:ml-2">{item.rating}/5</span>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm">
                          <MessageSquare className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="hidden xs:inline">Reply</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {filteredFeedback.length > 0 && (
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
