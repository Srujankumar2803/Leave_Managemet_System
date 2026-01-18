import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

/**
 * User interface - strongly typed user object
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
}

/**
 * Auth state interface - all authentication related state
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

/**
 * Auth slice - manages authentication state globally
 * Redux Toolkit automatically generates action creators
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Called when login is successful
     * Stores user data and token in Redux store
     */
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    
    /**
     * Logout action - clears all auth state
     */
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    
    /**
     * Force clear auth state (for error scenarios)
     */
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
});

// Export actions for use in components
export const { loginSuccess, logout, clearAuth } = authSlice.actions;

// Export reducer for store configuration
export default authSlice.reducer;
