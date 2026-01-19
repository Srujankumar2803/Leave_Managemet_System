import axios from 'axios';

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

export default axiosClient;
