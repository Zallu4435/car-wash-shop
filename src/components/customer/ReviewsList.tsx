'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Review } from '@/api/domains/reviews/fetchers';

interface ReviewsListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  productName?: string;
  serviceName?: string;
}

const REVIEWS_PER_PAGE = 5;

export function ReviewsList({
  reviews,
  averageRating,
  totalReviews,
  productName,
  serviceName,
}: ReviewsListProps) {
  const [sortBy, setSortBy] = useState('recent');
  const [displayedCount, setDisplayedCount] = useState(REVIEWS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(r => r.rating === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'highest') {
      return b.rating - a.rating;
    } else if (sortBy === 'lowest') {
      return a.rating - b.rating;
    }
    return 0;
  });

  const displayedReviews = sortedReviews.slice(0, displayedCount);
  const hasMore = displayedCount < sortedReviews.length;

  // Load more reviews
  const loadMoreReviews = () => {
    setIsLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + REVIEWS_PER_PAGE, sortedReviews.length));
      setIsLoadingMore(false);
    }, 300);
  };

  // Reset displayed count when sort changes
  useEffect(() => {
    setDisplayedCount(REVIEWS_PER_PAGE);
  }, [sortBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="border-2">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <CardTitle className="text-base sm:text-lg">
            Customer Reviews & Ratings
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left: Average Rating */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-6 lg:p-8 bg-gradient-to-br from-primary/5 to-background rounded-xl border border-border">
            <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-3">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm sm:text-base text-muted-foreground text-center">
              Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Right: Rating Breakdown */}
          <div className="lg:col-span-3 flex flex-col justify-center space-y-3 lg:space-y-4 lg:px-4">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center justify-end gap-1 w-12 flex-shrink-0">
                  <span className="text-sm font-medium text-foreground">{rating}</span>
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden min-w-0">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-10 text-right font-medium flex-shrink-0">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Sort and Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-semibold text-foreground text-sm sm:text-base">
            All Reviews ({totalReviews})
          </h3>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48 h-9 text-xs sm:text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="highest">Highest Rating</SelectItem>
              <SelectItem value="lowest">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reviews List */}
        {displayedReviews.length > 0 ? (
          <>
            <div className="space-y-4">
              {displayedReviews.map((review, index) => (
              <div key={review.id}>
                <div className="space-y-3">
                  {/* Review Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm sm:text-base font-semibold text-primary">
                          {review.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-foreground truncate">
                          {review.userName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Verified Badge (optional) */}
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      Verified
                    </Badge>
                  </div>

                  {/* Review Content */}
                  {review.comment && (
                    <p className="text-sm sm:text-base text-foreground leading-relaxed pl-0 sm:pl-[60px]">
                      {review.comment}
                    </p>
                  )}

                  {/* Review Images (if any) */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pl-0 sm:pl-[60px]">
                      {review.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Review image ${idx + 1}`}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-border"
                        />
                      ))}
                    </div>
                  )}

                  {/* Helpful Actions */}
                  <div className="flex items-center gap-3 pl-0 sm:pl-[60px]">
                    <span className="text-xs text-muted-foreground">Was this helpful?</span>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                      <ThumbsUp className="h-3 w-3" />
                      Yes
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                      <ThumbsDown className="h-3 w-3" />
                      No
                    </Button>
                  </div>
                </div>

                {index < displayedReviews.length - 1 && <Separator className="mt-4" />}
              </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-6 border-t border-border mt-6">
                <Button
                  variant="outline"
                  onClick={loadMoreReviews}
                  disabled={isLoadingMore}
                  className="min-w-[200px] h-11 text-sm font-medium"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Reviews
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({sortedReviews.length - displayedCount} remaining)
                      </span>
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* End of Reviews Message */}
            {!hasMore && displayedReviews.length > 0 && (
              <div className="flex justify-center items-center py-6 border-t border-border mt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <Star className="h-6 w-6 text-primary fill-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    That's all!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    You've seen all {sortedReviews.length} {sortedReviews.length === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">No reviews yet</p>
            <p className="text-xs text-muted-foreground">
              Be the first to review this {serviceName ? 'service' : 'product'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
