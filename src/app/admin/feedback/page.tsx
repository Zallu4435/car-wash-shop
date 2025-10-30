'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  MessageSquare, 
  Users,
  Package,
  ShoppingBag,
  ThumbsUp,
  Flag,
  Ban,
  CheckCircle
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminFeedbackList } from '@/api/domains/admin-support/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { StatCard } from '@/components/admin/StatCard';
import { Pagination } from '@/components/admin/Pagination';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';

export default function AdminFeedbackPage() {
  const blockConfirmation = useConfirmation();
  const unblockConfirmation = useConfirmation();
  const reportConfirmation = useConfirmation();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<'all' | 'services' | 'products'>('all');
  const [blockedFeedback, setBlockedFeedback] = useState<Set<string>>(new Set());

  // Combine search and filters for API
  const filters = useMemo(() => ({
    search: search || undefined,
    rating: filterValues.rating || undefined,
    type: activeTab === 'all' ? undefined : activeTab === 'services' ? 'service' : 'product',
    page,
    pageSize,
  }), [search, filterValues, page, pageSize, activeTab]);

  const { data: feedbackData, isLoading, error, refetch } = useAdminFeedbackList(filters);
  
  // Fetch all feedback for stats (without type filter)
  const allFilters = useMemo(() => ({
    page: 1,
    pageSize: 1000, // Get all for stats calculation
  }), []);
  const { data: allFeedbackData } = useAdminFeedbackList(allFilters);

  const feedback = feedbackData?.data || [];
  const allFeedback = allFeedbackData?.data || [];
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

  // Calculate stats from all feedback (not filtered by tab)
  const avgRating = allFeedback.length > 0 
    ? (allFeedback.reduce((sum: number, item: any) => sum + (item.rating || 0), 0) / allFeedback.length).toFixed(1)
    : '0.0';
  const serviceFeedback = allFeedback.filter((item: any) => item.feedbackType === 'service').length;
  const productReviews = allFeedback.filter((item: any) => item.feedbackType === 'product').length;
  const totalAllFeedback = allFeedback.length;

  const handleBlockFeedback = async (feedbackId: string, feedbackAuthor: string) => {
    const confirmed = await blockConfirmation.confirm({
      type: 'block',
      title: 'Block Feedback?',
      description: 'This feedback will be hidden from public view. The user will not be notified.',
      confirmText: 'Yes, Block Feedback',
      cancelText: 'Cancel',
      itemName: `Feedback from ${feedbackAuthor}`,
    });

    if (confirmed) {
      setBlockedFeedback(prev => new Set(prev).add(feedbackId));
      toast.success('Feedback has been blocked');
      // TODO: Call API to block feedback
    }
  };

  const handleUnblockFeedback = async (feedbackId: string, feedbackAuthor: string) => {
    const confirmed = await unblockConfirmation.confirm({
      type: 'warning',
      title: 'Unblock Feedback?',
      description: 'This feedback will be visible to the public again.',
      confirmText: 'Yes, Unblock Feedback',
      cancelText: 'Cancel',
      itemName: `Feedback from ${feedbackAuthor}`,
    });

    if (confirmed) {
      setBlockedFeedback(prev => {
        const newSet = new Set(prev);
        newSet.delete(feedbackId);
        return newSet;
      });
      toast.success('Feedback has been unblocked');
      // TODO: Call API to unblock feedback
    }
  };

  const handleMarkHelpful = (feedbackId: string) => {
    // TODO: Call API to mark as helpful
    console.log('Mark helpful:', feedbackId);
  };

  const handleReportFeedback = async (feedbackId: string, feedbackAuthor: string) => {
    const confirmed = await reportConfirmation.confirm({
      type: 'warning',
      title: 'Report Feedback?',
      description: 'This will flag the feedback as inappropriate for review. The feedback will be reviewed by moderators.',
      confirmText: 'Yes, Report Feedback',
      cancelText: 'Cancel',
      itemName: `Feedback from ${feedbackAuthor}`,
    });

    if (confirmed) {
      toast.success('Feedback has been reported for review');
      // TODO: Call API to report feedback
      console.log('Report feedback:', feedbackId);
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <Button
          variant={activeTab === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('all')}
          className="rounded-b-none"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          All Feedback
        </Button>
        <Button
          variant={activeTab === 'services' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('services')}
          className="rounded-b-none"
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Service Reviews
        </Button>
        <Button
          variant={activeTab === 'products' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('products')}
          className="rounded-b-none"
        >
          <Package className="mr-2 h-4 w-4" />
          Product Reviews
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={MessageSquare}
          label="Total Feedback"
          value={totalAllFeedback}
          change="+13.2%"
          trend="up"
          description="All feedback"
        />
        
        <StatCard
          icon={ShoppingBag}
          label="Service Reviews"
          value={serviceFeedback}
          change="+15.8%"
          trend="up"
          description="Service feedback"
        />
        
        <StatCard
          icon={Package}
          label="Product Reviews"
          value={productReviews}
          valueClassName="text-primary"
          change="+18.3%"
          trend="up"
          description="Product feedback"
        />
        
        <StatCard
          icon={Star}
          label="Avg Rating"
          value={`${avgRating} ⭐`}
          change="+0.5"
          trend="up"
          description="Customer satisfaction"
        />
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
              {filteredFeedback.map((item) => {
                const isBlocked = blockedFeedback.has(item.id);
                return (
                  <Card key={item.id} className={`border-2 hover:shadow-lg transition-all ${isBlocked ? 'border-destructive/50 bg-destructive/5' : 'border-border'}`}>
                    <CardContent className="p-4 sm:p-5">
                      {/* Header with User Info and Badges */}
                      <div className="flex items-start justify-between mb-3 gap-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div 
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10"
                          >
                            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-sm sm:text-base text-foreground">{item.customerName}</p>
                              {isBlocked && (
                                <Badge variant="error" className="text-[10px] gap-1">
                                  <Ban className="h-2.5 w-2.5" />
                                  Blocked
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-[10px] gap-1">
                                {item.feedbackType === 'product' ? (
                                  <>
                                    <Package className="h-2.5 w-2.5" />
                                    Product
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag className="h-2.5 w-2.5" />
                                    Service
                                  </>
                                )}
                              </Badge>
                              <span className="text-[10px] sm:text-xs text-muted-foreground">
                                {new Date(item.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className="h-4 w-4"
                              fill={i < item.rating ? '#FFA500' : 'transparent'}
                              color={i < item.rating ? '#FFA500' : '#D1D5DB'}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-foreground">{item.rating}.0</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {item.status}
                        </Badge>
                      </div>

                      {/* Review Text */}
                      <p className="text-sm text-foreground mb-4 leading-relaxed">
                        {item.comment || 'No comment provided'}
                      </p>

                      {/* Booking Reference */}
                      {item.bookingId && (
                        <p className="text-xs text-muted-foreground mb-4">
                          Booking: <span className="font-medium">#{item.bookingId}</span>
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-border flex-wrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs gap-1.5"
                          onClick={() => handleMarkHelpful(item.id)}
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                          Helpful
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs gap-1.5"
                          onClick={() => handleReportFeedback(item.id, item.customerName)}
                        >
                          <Flag className="h-3.5 w-3.5" />
                          Report
                        </Button>

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs gap-1.5"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Reply
                        </Button>

                        <div className="ml-auto flex gap-2">
                          {isBlocked ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-xs gap-1.5 text-green-600 hover:text-green-600 hover:bg-green-50"
                              onClick={() => handleUnblockFeedback(item.id, item.customerName)}
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              Unblock
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleBlockFeedback(item.id, item.customerName)}
                            >
                              <Ban className="h-3.5 w-3.5" />
                              Block
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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

      {/* Confirmation Dialogs */}
      <blockConfirmation.ConfirmDialog />
      <unblockConfirmation.ConfirmDialog />
      <reportConfirmation.ConfirmDialog />
    </div>
  );
}
