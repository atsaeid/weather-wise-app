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
    const userData = localStorage.getItem(config.auth.tokenKey);
    if (!userData) return null;
    return JSON.parse(userData);
  },

  // Mock login
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await fetch(config.auth.endpoints.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    
    // Store tokens
    localStorage.setItem(config.auth.tokenKey, data.tokens.accessToken);
    localStorage.setItem(config.auth.refreshTokenKey, data.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data.user;
  },

  // Mock register
  async register(credentials: RegisterCredentials): Promise<User> {
    const response = await fetch(config.auth.endpoints.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    
    // Store tokens
    localStorage.setItem(config.auth.tokenKey, data.tokens.accessToken);
    localStorage.setItem(config.auth.refreshTokenKey, data.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data.user;
  },

  // Mock logout
  async logout(): Promise<void> {
    const token = localStorage.getItem(config.auth.tokenKey);
    
    if (token) {
      try {
        await fetch(config.auth.endpoints.logout, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }
    
    // Clear local storage regardless of API call result
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.refreshTokenKey);
    localStorage.removeItem('user');
  },

  async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem(config.auth.refreshTokenKey);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(config.auth.endpoints.refresh, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data: AuthResponse = await response.json();
    
    // Update tokens
    localStorage.setItem(config.auth.tokenKey, data.tokens.accessToken);
    localStorage.setItem(config.auth.refreshTokenKey, data.tokens.refreshToken);
  },
}; 