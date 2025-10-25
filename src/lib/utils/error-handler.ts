export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: any): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error.response) {
    return error.response.data?.message || 'An error occurred';
  }

  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

export const logError = (error: any, context?: string): void => {
  console.error(`[Error${context ? ` in ${context}` : ''}]:`, error);
};
