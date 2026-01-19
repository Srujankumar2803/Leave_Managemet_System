/**
 * API request and response types
 * These interfaces match the backend DTOs exactly for type safety
 */

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Authentication response from backend
 * Returned after successful login or registration
 */
export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}

/**
 * Error response from backend
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
