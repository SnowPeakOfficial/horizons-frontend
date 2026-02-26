/**
 * Auth Store - Zustand
 * Global authentication state management
 */

import { create } from 'zustand';
import authService from '../services/authService';
import type { User, LoginRequest, RegisterRequest } from '../types/api.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const message = error && typeof error === 'object' && 'message' in error
        ? String(error.message)
        : 'Login failed';
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: message,
      });
      throw error;
    }
  },

  register: async (userData: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(userData);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const message = error && typeof error === 'object' && 'message' in error
        ? String(error.message)
        : 'Registration failed';
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: message,
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  loadUser: async () => {
    const isAuthenticated = authService.isAuthenticated();
    if (!isAuthenticated) {
      set({ user: null, isAuthenticated: false });
      return;
    }
    try {
      // Fetch fresh user data from API (includes current tier)
      const user = await authService.getProfile();
      set({ user, isAuthenticated: true });
    } catch {
      // Fall back to cached localStorage data if API fails
      const user = authService.getCurrentUser();
      set({ user, isAuthenticated: !!user });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
