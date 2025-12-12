export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string; // For error responses, message is at the root level
  error?: {
    message: string;
    code?: string;
    field?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
