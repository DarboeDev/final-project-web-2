export interface User {
  _id?: string;
  fullName: string;
  email: string;
  role: 'admin' | 'project_manager' | 'team_member';
  department?: string;
  profilePicture?: string;
  isActive?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role?: string;
  department?: string;
}
