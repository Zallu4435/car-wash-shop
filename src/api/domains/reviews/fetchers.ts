// Reviews/rating feature has been removed. This file is kept only to avoid import errors.
export interface ReviewInput {
  // intentionally empty – reviews disabled
}

export interface Review {
  // intentionally empty – reviews disabled
}

export const reviewFetchers = {
  async submitReview(): Promise<Review> {
    throw new Error('Reviews are disabled');
  },
  async getReviewByOrderId(): Promise<Review | null> {
    return null;
  },
  async getReviewByBookingId(): Promise<Review | null> {
    return null;
  },
  async updateReview(): Promise<Review> {
    throw new Error('Reviews are disabled');
  },
  async deleteReview(): Promise<{ message: string }> {
    return { message: 'Reviews are disabled' };
  },
  async getReviewsByProductId(): Promise<Review[]> {
    return [];
  },
  async getReviewsByServiceId(): Promise<Review[]> {
    return [];
  },
};
