/**
 * API Service - Axios configuration and interceptors
 * Handles all HTTP communication with the backend
 */

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types/api.types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('horizons_access_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401) {
      // Clear stored auth data
      localStorage.removeItem('horizons_access_token');
      localStorage.removeItem('horizons_user');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        statusCode: 0,
        message: 'Network error. Please check your connection.',
        error: 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
        path: error.config?.url || '',
      } as ApiError);
    }
    
    // Return formatted error
    return Promise.reject(error.response.data);
  }
);

export default api;

// Export for testing/debugging
export { API_BASE_URL };
