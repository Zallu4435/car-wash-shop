export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
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
  