import { User, UserRole } from '../App';
import { api } from './api';

// Re-export types if needed by other components
export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  clubId?: string;
  department?: string;
}

export interface LoginData {
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

// Signup
export async function signup(data: SignupData): Promise<AuthResponse> {
  try {
    const response = await api.register({
      email: data.email,
      password: data.password,
      name: data.fullName,
      role: data.role || 'student',
      department: data.department
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Signup failed');
    }

    return {
      user: response.data,
      session: {
        access_token: response.data.token,
        refresh_token: response.data.token, // Mock refresh token
        expires_at: Date.now() + 3600000
      }
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    throw error;
  }
}

// Login
export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await api.login({
      email: data.email,
      password: data.password,
      role: data.role || 'student' // Default, backend/mock handles role check usually, or we pass it if UI allows
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Login failed');
    }

    return {
      user: response.data,
      session: {
        access_token: response.data.token,
        refresh_token: response.data.token,
        expires_at: Date.now() + 3600000
      }
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
}

// Logout
export async function logout(): Promise<void> {
  try {
    await api.logout();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Get current session
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.getCurrentUser();
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}

// Get auth token
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}
