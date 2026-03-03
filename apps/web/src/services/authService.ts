/**
 * Authentication Service
 * Handles login, register, and token management
 */

import api from './api';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '../types/api.types';

class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Store tokens
    if (response.data.accessToken) {
      localStorage.setItem('horizons_access_token', response.data.accessToken);
    }
    
    // Store user data
    if (response.data.user) {
      localStorage.setItem('horizons_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    
    // Store tokens
    if (response.data.accessToken) {
      localStorage.setItem('horizons_access_token', response.data.accessToken);
    }
    
    // Store user data
    if (response.data.user) {
      localStorage.setItem('horizons_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  /**
   * Logout - clear local storage
   */
  logout(): void {
    localStorage.removeItem('horizons_access_token');
    localStorage.removeItem('horizons_user');
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('horizons_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('horizons_access_token');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('horizons_access_token');
  }

  /**
   * Get current user profile from API
   */
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/users/me');
    
    // Update stored user data
    localStorage.setItem('horizons_user', JSON.stringify(response.data));
    
    return response.data;
  }

  /**
   * Update current user profile (name, timezone)
   */
  async updateProfile(data: { name?: string; timezone?: string }): Promise<User> {
    const response = await api.put<User>('/users/me', data);
    
    // Update stored user data
    localStorage.setItem('horizons_user', JSON.stringify(response.data));
    
    return response.data;
  }

  /**
   * Get user statistics (gardens count, flowers count, etc.)
   */
  async getUserStats(): Promise<{ gardenCount: number; flowerCount: number; bloomingFlowerCount: number; memberSince: string }> {
    const response = await api.get<{ gardenCount: number; flowerCount: number; bloomingFlowerCount: number; memberSince: string }>('/users/me/stats');
    return response.data;
  }
}

export default new AuthService();
