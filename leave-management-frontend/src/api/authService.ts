import axiosClient from './axiosClient';
import type { LoginRequest, RegisterRequest, AuthResponse } from './types';

/**
 * Authentication API service
 * Handles all auth-related API calls to the backend
 */

/**
 * Login user with email and password
 * @param credentials - User email and password
 * @returns Promise with AuthResponse containing JWT token and user data
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>('/auth/login', credentials);
//   console.log('Login response data:', response);   
  return response.data;
};

/**
 * Register a new user
 * @param userData - User registration data (name, email, password)
 * @returns Promise with AuthResponse containing JWT token and user data
 */
export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>('/auth/register', userData);
  return response.data;
};

const authService = {
  login,
  register,
};

export default authService;
