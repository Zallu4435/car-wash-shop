import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/types/api';
import { getAccessToken, setAccessToken as setGlobalAccessToken } from '@/state/authState';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    // Attempt cookie-based refresh once on 401, then retry the original request
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        if (newAccessToken) {
          setGlobalAccessToken(newAccessToken);
          return apiClient(originalRequest);
        }
      } catch (_) {
        // ignore and fall through to logout handling
      }
    }

    // On unauthorized (after failed refresh), clear token and redirect to login
    if (error.response?.status === 401) {
      setGlobalAccessToken(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject({
      message: errorMessage,
      code: error.response?.status,
      data: error.response?.data,
    });
  }
);
