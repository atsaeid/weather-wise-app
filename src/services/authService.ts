// Mock user interface
export interface User {
  id: string;
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

// Mock authentication service
export const authService = {
  // Check if user is logged in
  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // Get current user
  getCurrentUser(): User | null {
    const userData = localStorage.getItem(USER_DATA_KEY);
    if (!userData) return null;
    return JSON.parse(userData);
  },

  // Mock login
  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

    // Check if user exists (in real app, would validate password too)
    const user = MOCK_USERS.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Store auth token and user data
    localStorage.setItem(AUTH_TOKEN_KEY, `mock-token-${user.id}`);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    
    return user;
  },

  // Mock register
  async register(credentials: RegisterCredentials): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

    // Check if user already exists
    if (MOCK_USERS.some(u => u.email === credentials.email)) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: User = {
      id: `${MOCK_USERS.length + 1}`,
      username: credentials.username,
      email: credentials.email,
    };

    // Add to mock database
    MOCK_USERS.push(newUser);

    // Store auth token and user data
    localStorage.setItem(AUTH_TOKEN_KEY, `mock-token-${newUser.id}`);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(newUser));

    return newUser;
  },

  // Mock logout
  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    
    // Remove auth token and user data
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }
}; 