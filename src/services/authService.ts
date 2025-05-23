import axios, { AxiosError, isAxiosError } from 'axios';
import axiosInstance from '../lib/axios';
import { config } from '../config';

// Mock user interface
export interface User {
  id: string;  // GUID from backend
  username: string;
  email: string;
}

// Mock user database
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'user1',
    email: 'user1@example.com',
  },
];

// Mock local storage key
const AUTH_TOKEN_KEY = 'weather_wise_auth_token';
const USER_DATA_KEY = 'weather_wise_user_data';

// Mock API delay
const MOCK_API_DELAY = 500;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

// Mock authentication service
export const authService = {
  // Check if user is logged in
  isAuthenticated(): boolean {
    return !!localStorage.getItem(config.auth.tokenKey);
  },

  // Get current user
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    return JSON.parse(userData);
  },

  // Mock login
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      console.log('axiosInstance');
      const { data } = await axiosInstance.post<AuthResponse>(
        '/api/Auth/login',
        credentials
      );
      console.log(data);
      localStorage.setItem(config.auth.tokenKey, data.tokens.accessToken);
      localStorage.setItem(config.auth.refreshTokenKey, data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw error;
    }
  },

  // Mock register
  async register(credentials: RegisterCredentials): Promise<User> {
    try {
      const { data } = await axiosInstance.post<AuthResponse>(
        '/api/Auth/register',
        credentials
      );

      localStorage.setItem(config.auth.tokenKey, data.tokens.accessToken);
      localStorage.setItem(config.auth.refreshTokenKey, data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
      throw error;
    }
  },

  // Mock logout
  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/api/Auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      localStorage.removeItem(config.auth.tokenKey);
      localStorage.removeItem(config.auth.refreshTokenKey);
      localStorage.removeItem('user');
    }
  },

  async refreshToken(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem(config.auth.refreshTokenKey);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { data } = await axiosInstance.post<AuthResponse>('/api/Auth/refresh', {
        refreshToken,
      });

      localStorage.setItem(config.auth.tokenKey, data.tokens.accessToken);
      localStorage.setItem(config.auth.refreshTokenKey, data.tokens.refreshToken);
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Token refresh failed');
      }
      throw error;
    }
  },
}; 