import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { applyLeave, getLeaveTypes } from '../api/leaveService';
import type { ApplyLeaveRequest, LeaveType } from '../api/leaveService';
import axios from 'axios';

interface FormData {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface ValidationErrors {
  leaveTypeId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Apply Leave page - form to submit leave requests
 */
const ApplyLeave = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  // UI state
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);

  // Fetch leave types on mount
  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    setIsLoadingTypes(true);
    try {
      const types = await getLeaveTypes();
      setLeaveTypes(types);
    } catch (error) {
      console.error('Failed to load leave types:', error);
      setApiError('Failed to load leave types');
    } finally {
      setIsLoadingTypes(false);
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.leaveTypeId) {
      newErrors.leaveTypeId = 'Please select a leave type';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after or equal to start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear messages
    setApiError('');
    setSuccessMessage('');
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const request: ApplyLeaveRequest = {
        leaveTypeId: parseInt(formData.leaveTypeId),
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason || undefined,
      };

      const response = await applyLeave(request);
      
      // Success
      setSuccessMessage(response.message || 'Leave request submitted successfully');
      
      // Clear form
      setFormData({
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        reason: '',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/leaves/my-leaves');
      }, 2000);

    } catch (error) {
      // Handle errors
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.message || 'Failed to submit leave request';
        setApiError(message);
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Apply for Leave</h1>
        <p className="text-gray-600 mt-1">Submit your leave request for approval</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Leave Type */}
          <div>
            <label htmlFor="leaveTypeId" className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type <span className="text-red-500">*</span>
            </label>
            <select
              id="leaveTypeId"
              name="leaveTypeId"
              value={formData.leaveTypeId}
              onChange={handleChange}
              disabled={isLoadingTypes}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.leaveTypeId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">{isLoadingTypes ? 'Loading...' : 'Select leave type'}</option>
              {leaveTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.maxDaysPerYear} days/year)
                </option>
              ))}
            </select>
            {errors.leaveTypeId && (
              <p className="text-red-600 text-sm mt-1">{errors.leaveTypeId}</p>
            )}
          </div>

          {/* Date Range Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason (Optional)
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={4}
              placeholder="Enter reason for leave..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Error Message */}
          {apiError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{apiError}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
