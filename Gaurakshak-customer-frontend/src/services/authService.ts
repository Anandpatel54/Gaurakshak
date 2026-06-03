import axios from 'axios';
import { API_BASE_URL } from '@/constants/siteConfig';

const hasBrowserStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  city?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  token: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
};

const authService = {
  // Signup - Creates a new customer account
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/customer/signup`, data);
      
      if (hasBrowserStorage() && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data.data;
    } catch (error) {
      throw getErrorMessage(error, 'Signup failed');
    }
  },

  // Login - Customer login with email and password
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/customer/login`, data);
      
      if (hasBrowserStorage() && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data.data;
    } catch (error) {
      throw getErrorMessage(error, 'Login failed');
    }
  },

  // Logout - Clear user session
  logout: () => {
    if (!hasBrowserStorage()) return;

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    if (!hasBrowserStorage()) return null;

    const user = localStorage.getItem('user');
    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (!hasBrowserStorage()) return false;

    return !!localStorage.getItem('token');
  },

  // Get token
  getToken: (): string | null => {
    if (!hasBrowserStorage()) return null;

    return localStorage.getItem('token');
  },
};

export default authService;
