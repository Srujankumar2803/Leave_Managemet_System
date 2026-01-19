import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { store } from '../store';

/**
 * Axios client configuration for API requests
 * Base URL points to the backend API running on localhost:5062
 * All requests will have JSON content-type headers by default
 */
const axiosClient = axios.create({
  baseURL: 'http://localhost:5062/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

/**
 * Request interceptor - attaches JWT token to every request
 * Reads token from Redux store and adds Authorization header
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from Redux store
    const token = store.getState().auth.token;
    
    // If token exists, attach it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;

