import { useState, useEffect } from 'react';
import { getMyLeaveRequests, getLeaveBalances } from '../api/leaveService';
import type { LeaveRequest, LeaveBalance } from '../api/leaveService';
import axios from 'axios';

/**
 * My Leaves page - view user's leave history
 */
const MyLeaves = () => {
  // State
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBalances, setIsLoadingBalances] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch leave requests and balances on mount
  useEffect(() => {
    fetchMyLeaves();
    fetchBalances();
  }, []);

  const fetchMyLeaves = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await getMyLeaveRequests();
      setLeaves(data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to load leave requests');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBalances = async () => {
    setIsLoadingBalances(true);
    
    try {
      const data = await getLeaveBalances();
      setBalances(data);
    } catch (err) {
      console.error('Failed to load leave balances:', err);
    } finally {
      setIsLoadingBalances(false);
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

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    
    switch (status) {
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'APPROVED':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'REJECTED':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Leaves</h1>
        <p className="text-gray-600 mt-1">View your leave request history and balances</p>
      </div>

      {/* Leave Balance Cards */}
      {!isLoadingBalances && balances.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {balances.map((balance) => (
            <div 
              key={balance.leaveTypeId} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-600">
                    {balance.leaveTypeName}
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      {balance.remainingDays}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      / {balance.maxDaysPerYear} days
                    </span>
                  </div>
                </div>
                <div className={`mt-1 px-2 py-1 rounded text-xs font-medium ${
                  balance.remainingDays === 0 
                    ? 'bg-red-100 text-red-800' 
                    : balance.remainingDays < balance.maxDaysPerYear * 0.3
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {balance.remainingDays === 0 
                    ? 'Exhausted' 
                    : balance.remainingDays < balance.maxDaysPerYear * 0.3
                    ? 'Low'
                    : 'Available'
                  }
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      balance.remainingDays === 0 
                        ? 'bg-red-500' 
                        : balance.remainingDays < balance.maxDaysPerYear * 0.3
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${(balance.remainingDays / balance.maxDaysPerYear) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading Balances */}
      {isLoadingBalances && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-600 text-sm">Loading leave balances...</p>
        </div>
      )}

      {/* Content Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        
        {/* Loading State */}
        {isLoading && (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Loading your leave requests...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            <button
              onClick={fetchMyLeaves}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No leaves applied yet</h3>
            <p className="mt-2 text-gray-600">Your leave request history will appear here</p>
          </div>
        )}

        {/* Leave Requests Table */}
        {!isLoading && !error && leaves.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(leave.status)}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(leave.appliedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Card */}
      {!isLoading && !error && leaves.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Total Requests</div>
            <div className="text-2xl font-semibold text-gray-900 mt-1">
              {leaves.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-semibold text-yellow-600 mt-1">
              {leaves.filter(l => l.status === 'PENDING').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Approved</div>
            <div className="text-2xl font-semibold text-green-600 mt-1">
              {leaves.filter(l => l.status === 'APPROVED').length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLeaves;
