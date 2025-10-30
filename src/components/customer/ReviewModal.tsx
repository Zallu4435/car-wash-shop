'use client';

import { useState, useEffect } from 'react';
import { X, Star, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RatingWidget } from '@/components/shared/display/RatingWidget';
import { useSubmitReview, useUpdateReview } from '@/api/domains/reviews/queries';
import type { Review } from '@/api/domains/reviews/fetchers';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  bookingId?: string;
  productId?: string;
  serviceId?: string;
  itemName: string;
  isService?: boolean;
  existingReview?: Review | null;
}

export function ReviewModal({
  isOpen,
  onClose,
  orderId,
  bookingId,
  productId,
  serviceId,
  itemName,
  isService = false,
  existingReview,
}: ReviewModalProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const submitReviewMutation = useSubmitReview();
  const updateReviewMutation = useUpdateReview();

  // Check if dark mode is active
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Reset form when modal opens/closes or existing review changes
  useEffect(() => {
    if (isOpen) {
      setRating(existingReview?.rating || 0);
      setComment(existingReview?.comment || '');
      setShowSuccess(false);
    }
  }, [isOpen, existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      return;
    }

    const reviewData = {
      orderId,
      bookingId,
      productId,
      serviceId,
      rating,
      comment: comment.trim(),
    };

    if (existingReview) {
      // Update existing review
      await updateReviewMutation.mutateAsync({
        reviewId: existingReview.id,
        input: reviewData,
      });
    } else {
      // Submit new review
      await submitReviewMutation.mutateAsync(reviewData);
    }

    setShowSuccess(true);
    setTimeout(() => {
      onClose();
      setShowSuccess(false);
    }, 2000);
  };

  if (!isOpen) return null;

  const isLoading = submitReviewMutation.isPending || updateReviewMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-lg rounded-xl sm:rounded-2xl shadow-2xl border-2 border-border animate-slide-up max-h-[90vh] overflow-y-auto ${isDark ? '!bg-gray-900' : '!bg-white'}`}>
        {/* Header */}
        <div className={`sticky top-0 border-b border-border px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-10 ${isDark ? '!bg-gray-900' : '!bg-white'}`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {existingReview ? 'Update Your Review' : 'Rate Your Experience'}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {itemName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Success State */}
        {showSuccess ? (
          <div className="px-4 sm:px-6 py-12 sm:py-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mb-4 sm:mb-6 animate-scale-in">
              <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
              Thank You!
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Your review has been {existingReview ? 'updated' : 'submitted'} successfully
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
            {/* Rating */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="text-sm sm:text-base font-medium">
                How would you rate this {isService ? 'service' : 'product'}?
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-muted rounded-xl">
                <RatingWidget rating={rating} onChange={setRating} size="lg" />
                {rating > 0 && (
                  <span className="text-base sm:text-lg font-semibold text-primary">
                    {rating}.0
                  </span>
                )}
              </div>
              {rating > 0 && (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {rating === 5 && '⭐ Excellent!'}
                  {rating === 4 && '😊 Great!'}
                  {rating === 3 && '👍 Good'}
                  {rating === 2 && '😐 Fair'}
                  {rating === 1 && '😞 Poor'}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="comment" className="text-sm sm:text-base font-medium">
                Share your experience (Optional)
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Tell us more about your experience with this ${isService ? 'service' : 'product'}...`}
                rows={5}
                className="resize-none text-sm sm:text-base"
              />
              <p className="text-xs text-muted-foreground">
                {comment.length}/500 characters
              </p>
            </div>

            {/* Info Box */}
            <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg sm:rounded-xl">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                💡 Your review helps other customers make informed decisions and helps us improve our services.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-11 sm:h-12"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 sm:h-12 shadow-lg"
                disabled={rating === 0 || isLoading}
              >
                {isLoading ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {existingReview ? 'Update Review' : 'Submit Review'}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
