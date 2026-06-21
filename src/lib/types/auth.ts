export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  planTier: PlanTier;
  credits: number;
  company?: string;
  avatar?: string;
  phone?: string;
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';
export type PlanTier = 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  company?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
