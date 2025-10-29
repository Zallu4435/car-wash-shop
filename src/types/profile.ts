export interface UserProfile {
    id: string;
    name: string;
    email?: string;
    phone: string;
    avatar?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    preferences?: {
      notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
      };
      language: string;
    };
    createdAt: string;
    updatedAt: string;
  }
  
  export interface UpdateProfileInput {
    name?: string;
    email?: string;
    avatar?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    preferences?: {
      notifications?: {
        email?: boolean;
        sms?: boolean;
        push?: boolean;
      };
      language?: string;
    };
  }
  
  export interface ChangePasswordInput {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  