import { UserRole } from '@/lib/constants/status';

export interface AuthUser {
    id: string;
    phone: string;
    name: string;
    email?: string;
    role: UserRole;
    avatar?: string;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface RegisterInput {
    phone: string;
    name: string;
    email?: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface LoginInput {
    phone: string;
    otp: string;
  }
  
  export interface OtpResponse {
    message: string;
  }
  
  export interface AuthResponse {
    user: AuthUser;
    token: string;
  }
  
  export interface MessageResponse {
    message: string;
  }
  