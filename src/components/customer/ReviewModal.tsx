'use client';

// @ts-nocheck
import { useState, useEffect } from 'react';
import { X, Star, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RatingWidget } from '@/components/shared/display/RatingWidget';
import { useSubmitReview, useUpdateReview } from '@/api/domains/reviews/queries';
import type { Review } from '@/api/domains/reviews/fetchers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitReviewSchema, SubmitReviewInput } from '@/schemas/customer/review';

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const submitReviewMutation = useSubmitReview();
  const updateReviewMutation = useUpdateReview();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SubmitReviewInput>({
    resolver: zodResolver(submitReviewSchema) as any,
    defaultValues: {
      rating: existingReview?.rating || 0,
      comment: existingReview?.comment || '',
      orderId,
      bookingId,
      productId,
      serviceId,
    },
  });

  const rating = watch('rating');
  const comment = watch('comment');

  // Handle mounting for animation
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Small delay to trigger animation
      setTimeout(() => {
        setShowContent(true);
      }, 10);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open and prevent layout shift
  useEffect(() => {
    if (isOpen) {
      // Get scrollbar width before hiding it
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Prevent scroll and add padding to compensate for scrollbar
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  // Handle unmounting after animation
  const handleTransitionEnd = () => {
    if (!isOpen) {
      setMounted(false);
    }
  };

  // Reset form when modal opens/closes or existing review changes
  useEffect(() => {
    if (isOpen) {
      reset({
        rating: existingReview?.rating || 0,
        comment: existingReview?.comment || '',
        orderId,
        bookingId,
        productId,
        serviceId,
      });
      setShowSuccess(false);
    }
  }, [isOpen, existingReview, reset, orderId, bookingId, productId, serviceId]);

  const onSubmit = async (data: SubmitReviewInput) => {
    const reviewData = {
      orderId: data.orderId,
      bookingId: data.bookingId,
      productId: data.productId,
      serviceId: data.serviceId,
      rating: data.rating,
      comment: data.comment.trim(),
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

  if (!mounted && !isOpen) return null;

  const isLoading = submitReviewMutation.isPending || updateReviewMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={`relative w-full max-w-lg rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl border-2 border-border max-h-[92vh] sm:max-h-[90vh] overflow-y-auto force-sheet-bg transition-all duration-500 ease-in-out ${
          showContent 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Header */}
        <div className="sticky top-0 border-b border-border px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 flex items-center justify-between z-10 bg-muted/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate">
                {existingReview ? 'Update Your Review' : 'Rate Your Experience'}
              </h2>
              <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground truncate">
                {itemName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Success State */}
        {showSuccess ? (
          <div className="px-3 sm:px-4 lg:px-6 py-10 sm:py-12 lg:py-16 flex flex-col items-center justify-center text-center">
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
          <form onSubmit={handleSubmit(onSubmit)} className="px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Rating */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="text-xs sm:text-sm lg:text-base font-medium">
                How would you rate this {isService ? 'service' : 'product'}?
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 p-3 sm:p-4 lg:p-5 bg-muted rounded-lg sm:rounded-xl">
                <RatingWidget rating={rating} onChange={(val) => setValue('rating', val)} size="lg" />
                {rating > 0 && (
                  <span className="text-sm sm:text-base lg:text-lg font-semibold text-primary">
                    {rating}.0
                  </span>
                )}
              </div>
              {errors.rating && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.rating.message}</p>
              )}
              {rating > 0 && !errors.rating && (
                <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
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
              <Label htmlFor="comment" className="text-xs sm:text-sm lg:text-base font-medium">
                Share your experience
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                id="comment"
                {...register('comment')}
                placeholder={`Tell us more about your experience with this ${isService ? 'service' : 'product'}...`}
                rows={4}
                className="resize-none text-xs sm:text-sm lg:text-base"
              />
              {errors.comment && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.comment.message}</p>
              )}
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {comment?.length || 0}/500 • Min 10 characters
              </p>
            </div>

            {/* Info Box */}
            <div className="p-2.5 sm:p-3 lg:p-4 bg-primary/5 border border-primary/20 rounded-lg sm:rounded-xl">
              <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground leading-relaxed">
                💡 Your review helps other customers make informed decisions and helps us improve our services.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 sm:h-11 lg:h-12 text-xs sm:text-sm border-2"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 sm:h-11 lg:h-12 shadow-lg text-xs sm:text-sm border-2"
                disabled={rating === 0 || isLoading}
              >
                {isLoading ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
