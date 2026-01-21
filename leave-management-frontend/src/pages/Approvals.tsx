import { useState, useEffect } from 'react';
import { getPendingLeaves, approveLeave, rejectLeave } from '../api/managerService';
import type { PendingLeave } from '../api/managerService';
import axios from 'axios';

/**
 * Approvals page - for managers to approve/reject leave requests
 */
const Approvals = () => {
  // State
  const [leaves, setLeaves] = useState<PendingLeave[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Fetch pending leaves on mount
  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const fetchPendingLeaves = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await getPendingLeaves();
      setLeaves(data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to load pending leaves');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle approve
  const handleApprove = async (leaveId: number) => {
    setProcessingIds(prev => new Set(prev).add(leaveId));
    setError('');
    setSuccessMessage('');
    
    try {
      const result = await approveLeave(leaveId);
      setSuccessMessage(result.message);
      
      // Remove from list
      setLeaves(prev => prev.filter(leave => leave.id !== leaveId));
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to approve leave');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(leaveId);
        return newSet;
      });  // comment out finally block still it works , look more in chatGPT
    }
  };

  // Handle reject
  const handleReject = async (leaveId: number) => {
    setProcessingIds(prev => new Set(prev).add(leaveId));
    setError('');
    setSuccessMessage('');
    
    try {
      const result = await rejectLeave(leaveId);
      setSuccessMessage(result.message);
      
      // Remove from list
      setLeaves(prev => prev.filter(leave => leave.id !== leaveId));
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to reject leave');
      } else {
        setError('An unexpected error occurred');
      }
    // } finally {
    //   setProcessingIds(prev => {
    //     const newSet = new Set(prev);
    //     newSet.delete(leaveId);
    //     return newSet;
    //   });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Leave Approvals</h1>
        <p className="text-gray-600 mt-1">Review and approve pending leave requests</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Content Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        
        {/* Loading State */}
        {isLoading && (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Loading pending leave requests...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && leaves.length === 0 && (
          <div className="p-12 text-center">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No pending approvals</h3>
            <p className="mt-2 text-gray-600">All leave requests have been processed</p>
          </div>
        )}

        {/* Leave Requests Table */}
        {!isLoading && !error && leaves.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.map((leave) => {
                  const isProcessing = processingIds.has(leave.id);
                  
                  return (
                    <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {leave.employeeName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {leave.employeeEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {leave.leaveTypeName}
                        </div>
                        {leave.reason && (
                          <div className="text-sm text-gray-500 mt-1">
                            {leave.reason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(leave.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(leave.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="font-medium">{leave.totalDays}</span> {leave.totalDays === 1 ? 'day' : 'days'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(leave.appliedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleApprove(leave.id)}
                            disabled={isProcessing}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                          >
                            {isProcessing ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(leave.id)}
                            disabled={isProcessing}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                          >
                            {isProcessing ? 'Processing...' : 'Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Card */}
      {!isLoading && !error && leaves.length > 0 && (
        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg 
              className="h-5 w-5 text-indigo-600 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span className="text-sm text-indigo-800">
              <strong>{leaves.length}</strong> {leaves.length === 1 ? 'request' : 'requests'} pending your approval
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;
