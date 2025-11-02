'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { TransactionCard } from '@/components/admin/TransactionCard';
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
      <div className="flex flex-wrap gap-2 border-b border-border">
        <Button
          variant={activeTab === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('all')}
          className="rounded-b-none h-9 sm:h-10 text-xs sm:text-sm border-2"
        >
          <MessageSquare className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">All Feedback</span>
          <span className="xs:hidden">All</span>
        </Button>
        <Button
          variant={activeTab === 'services' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('services')}
          className="rounded-b-none h-9 sm:h-10 text-xs sm:text-sm border-2"
        >
          <ShoppingBag className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Service Reviews</span>
          <span className="xs:hidden">Services</span>
        </Button>
        <Button
          variant={activeTab === 'products' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('products')}
          className="rounded-b-none h-9 sm:h-10 text-xs sm:text-sm border-2"
        >
          <Package className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Product Reviews</span>
          <span className="xs:hidden">Products</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">Recent Feedback</CardTitle>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredFeedback.map((item) => {
                const isBlocked = blockedFeedback.has(item.id);
                const feedbackIcon = item.feedbackType === 'product' ? Package : ShoppingBag;
                const feedbackDate = new Date(item.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                });
                const starRating = Array.from({ length: 5 }).map((_, i) => (
                  i < item.rating ? '⭐' : '☆'
                )).join('');
                
                return (
                  <TransactionCard
                    key={item.id}
                    id={item.id}
                    icon={Users}
                    layout="vertical"
                    primaryBadge={{
                      label: item.feedbackType === 'product' ? 'Product' : 'Service',
                      variant: 'outline',
                    }}
                    statusBadge={{
                      label: isBlocked ? 'Blocked' : item.status,
                      className: isBlocked ? 'border-2 text-destructive' : '',
                    }}
                    title={item.customerName}
                    subtitle={`${starRating} ${item.rating}.0 | ${feedbackDate}`}
                    description={item.comment || 'No comment provided'}
                    infoBoxes={[
                      {
                        icon: Star,
                        label: 'Rating',
                        value: `${item.rating}.0`,
                        valueClassName: 'text-orange-500',
                      },
                    ]}
                    actionButtons={[
                      {
                        label: 'Helpful',
                        icon: ThumbsUp,
                        onClick: () => handleMarkHelpful(item.id),
                        variant: 'outline',
                        hideTextOnMobile: true,
                      },
                      {
                        label: 'Report',
                        icon: Flag,
                        onClick: () => handleReportFeedback(item.id, item.customerName),
                        variant: 'outline',
                        hideTextOnMobile: true,
                      },
                      {
                        label: 'Reply',
                        icon: MessageSquare,
                        onClick: () => {},
                        variant: 'outline',
                        hideTextOnMobile: true,
                      },
                      {
                        label: isBlocked ? 'Unblock' : 'Block',
                        icon: isBlocked ? CheckCircle : Ban,
                        onClick: () => isBlocked 
                          ? handleUnblockFeedback(item.id, item.customerName)
                          : handleBlockFeedback(item.id, item.customerName),
                        className: isBlocked 
                          ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20' 
                          : 'text-destructive hover:bg-destructive/10',
                        hideTextOnMobile: true,
                      },
                    ]}
                  />
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
