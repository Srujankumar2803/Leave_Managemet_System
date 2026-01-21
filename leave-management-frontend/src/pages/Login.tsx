import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../store/authSlice';
import authService from '../api/authService';
import axios from 'axios';

/**
 * Login page component - standalone (not wrapped by Layout)
 * Enterprise-grade login UI with Redux integration
 * Form state stays LOCAL - only auth state goes to Redux
 */
const Login = () => {
  // Local form state - NOT in Redux (UI state only)
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /**
   * Handle form submission
   * Real login integration with backend API
   * Dispatches loginSuccess action to update Redux auth state
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call the real backend API
      const response = await authService.login({ email, password });

      // Map backend response to Redux User interface
      const user = {
        id: response.userId,
        name: response.name,
        email: response.email,
        role: response.role.toUpperCase() as 'EMPLOYEE' | 'MANAGER' | 'ADMIN',
      };

      // Dispatch to Redux - updates global auth state
      dispatch(loginSuccess({ user, token: response.token }));

      // Navigate to dashboard after successful login
      navigate('/');
    } catch (err) {
      // Handle errors gracefully
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Server responded with error
          const errorMessage = err.response.data?.message || 'Invalid email or password';
          setError(errorMessage);
        } else if (err.request) {
          // Request made but no response (network error)
          setError('Unable to connect to server. Please check if the backend is running.');
        } else {
          // Other errors
          setError('An unexpected error occurred. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Login card - centered, clean, with subtle shadow */}
      <div className="w-full max-w-md">
        {/* Brand/Header section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Leave Management</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login form card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                placeholder="you@company.com"
                disabled={isLoading}
              />
            </div>

            {/* Password input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                placeholder=""
                disabled={isLoading}
              />
            </div>

            {/* Login button with loading state */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  {/* Loading spinner placeholder */}
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Internal use only • Secure access required
        </p>
      </div>
    </div>
  );
};

export default Login;
