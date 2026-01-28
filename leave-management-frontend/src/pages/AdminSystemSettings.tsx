import { useState, useEffect } from 'react';
import adminService, { type SystemSetting } from '../api/adminService';
import axios from 'axios';

/**
 * System setting keys - matches backend constants
 */
const SETTING_KEYS = {
  COMPANY_NAME: 'CompanyName',
  LEAVE_YEAR_START_MONTH: 'LeaveYearStartMonth',
  MAX_CARRY_FORWARD_DAYS: 'MaxCarryForwardDays',
} as const;

/**
 * Month options for leave year start dropdown
 */
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

/**
 * Form state interface
 */
interface FormState {
  companyName: string;
  leaveYearStartMonth: string;
  maxCarryForwardDays: number;
}

/**
 * Admin System Settings Page
 * Allows admins to configure organization-wide settings
 * Uses local component state only (no Redux)
 */
const AdminSystemSettings = () => {
  // Form state
  const [formState, setFormState] = useState<FormState>({
    companyName: '',
    leaveYearStartMonth: 'January',
    maxCarryForwardDays: 0,
  });

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  /**
   * Fetch system settings on component mount
   */
  useEffect(() => {
    fetchSettings();
  }, []);

  /**
   * Fetch all system settings from backend
   */
  const fetchSettings = async () => {
    setIsLoading(true);
    setError('');
    try {
      const settings = await adminService.getSystemSettings();
      
      // Map settings to form state
      const settingsMap = new Map(settings.map(s => [s.key, s.value]));
      
      setFormState({
        companyName: settingsMap.get(SETTING_KEYS.COMPANY_NAME) || '',
        leaveYearStartMonth: settingsMap.get(SETTING_KEYS.LEAVE_YEAR_START_MONTH) || 'January',
        maxCarryForwardDays: parseInt(settingsMap.get(SETTING_KEYS.MAX_CARRY_FORWARD_DAYS) || '0', 10),
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          setError('Access denied. Admin privileges required.');
        } else {
          setError('Failed to load settings. Please try again.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate
    if (!formState.companyName.trim()) {
      setError('Company name is required');
      return;
    }

    if (formState.maxCarryForwardDays < 0 || formState.maxCarryForwardDays > 365) {
      setError('Max carry forward days must be between 0 and 365');
      return;
    }

    setIsSaving(true);

    try {
      // Build settings array
      const settings: SystemSetting[] = [
        { key: SETTING_KEYS.COMPANY_NAME, value: formState.companyName.trim() },
        { key: SETTING_KEYS.LEAVE_YEAR_START_MONTH, value: formState.leaveYearStartMonth },
        { key: SETTING_KEYS.MAX_CARRY_FORWARD_DAYS, value: formState.maxCarryForwardDays.toString() },
      ];

      await adminService.updateSystemSettings(settings);
      setSuccessMessage('Settings saved successfully');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          setError('Access denied. Admin privileges required.');
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Failed to save settings. Please try again.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle input changes
   */
  const handleChange = (field: keyof FormState, value: string | number) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    // Clear messages on change
    setError('');
    setSuccessMessage('');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure organization-wide settings</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-1">Configure organization-wide settings</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Settings form */}
      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Company Name */}
          <div>
            <label 
              htmlFor="companyName" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={formState.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter company name"
              maxLength={100}
            />
            <p className="mt-1 text-sm text-gray-500">
              The organization name displayed across the application
            </p>
          </div>

          {/* Leave Year Start Month */}
          <div>
            <label 
              htmlFor="leaveYearStartMonth" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Leave Year Start Month
            </label>
            <select
              id="leaveYearStartMonth"
              value={formState.leaveYearStartMonth}
              onChange={(e) => handleChange('leaveYearStartMonth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              The month when the leave year cycle begins
            </p>
          </div>

          {/* Max Carry Forward Days */}
          <div>
            <label 
              htmlFor="maxCarryForwardDays" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Max Carry Forward Days
            </label>
            <input
              type="number"
              id="maxCarryForwardDays"
              value={formState.maxCarryForwardDays}
              onChange={(e) => handleChange('maxCarryForwardDays', parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              min={0}
              max={365}
            />
            <p className="mt-1 text-sm text-gray-500">
              Maximum number of leave days employees can carry forward to the next year
            </p>
          </div>

          {/* Submit button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSystemSettings;
