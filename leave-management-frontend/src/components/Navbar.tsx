import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';

/**
 * Top navigation bar with user profile from Redux
 * Uses global auth state for user data
 * Dropdown state remains local (UI state only)
 */
const Navbar = () => {
  // Local UI state - dropdown open/closed
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Global auth state from Redux
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  /**
   * Handle logout action
   * Clears Redux auth state and redirects to login
   */
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
      {/* Left section - page title with better hierarchy */}
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Dashboard</h1>
      </div>
      
      {/* Right section - user profile from Redux */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {/* User avatar with initials */}
          <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {user?.name.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U'}
            </span>
          </div>
          
          {/* User info from Redux state */}
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900">{user?.name || 'User'}</span>
            <span className="text-xs text-gray-500">{user?.role || 'Employee'}</span>
          </div>
          
          {/* Dropdown arrow */}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Profile
            </button>
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Settings
            </button>
            <hr className="my-2 border-gray-100" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
