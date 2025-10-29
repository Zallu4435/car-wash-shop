export interface AuthUser {
    id: string;
    phone: string;
    name: string;
    email?: string;
    role: 'customer' | 'staff' | 'admin';
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
    refreshToken?: string;
  }
  
  export interface MessageResponse {
    message: string;
  }
  