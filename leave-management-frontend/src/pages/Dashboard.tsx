import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../store';
import dashboardService, {
  type EmployeeDashboard,
  type ManagerDashboard,
  type AdminDashboard,
} from '../api/dashboardService';
import axios from 'axios';

/**
 * Dashboard page - role-based landing page
 * Shows different content based on user role (EMPLOYEE, MANAGER, ADMIN)
 */
const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role;

  // Employee dashboard state
  const [employeeDashboard, setEmployeeDashboard] = useState<EmployeeDashboard | null>(null);
  // Manager dashboard state
  const [managerDashboard, setManagerDashboard] = useState<ManagerDashboard | null>(null);
  // Admin dashboard state
  const [adminDashboard, setAdminDashboard] = useState<AdminDashboard | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    /**
     * Fetch dashboard data based on user role
     */
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError('');

      try {
        if (role === 'EMPLOYEE') {
          const data = await dashboardService.getEmployeeDashboard();
          setEmployeeDashboard(data);
        } else if (role === 'MANAGER') {
          const data = await dashboardService.getManagerDashboard();
          setManagerDashboard(data);
        } else if (role === 'ADMIN') {
          const data = await dashboardService.getAdminDashboard();
          setAdminDashboard(data);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load dashboard data');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [role]);

  /**
   * Format date to readable string
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  /**
   * Get status badge color
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      {/* Employee Dashboard */}
      {role === 'EMPLOYEE' && employeeDashboard && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Leaves</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {employeeDashboard.pendingLeavesCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approved Leaves</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {employeeDashboard.approvedLeavesCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Balance Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Balance</h2>
            {employeeDashboard.remainingLeaveSummary.length === 0 ? (
              <p className="text-gray-600">No leave balances available</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {employeeDashboard.remainingLeaveSummary.map((balance, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900">{balance.leaveTypeName}</p>
                    <div className="mt-2">
                      <span className="text-2xl font-semibold text-indigo-600">
                        {balance.remainingDays}
                      </span>
                      <span className="text-sm text-gray-600"> / {balance.maxDaysPerYear} days</span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${(balance.remainingDays / balance.maxDaysPerYear) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Leaves */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Leaves</h2>
            {employeeDashboard.recentLeaves.length === 0 ? (
              <p className="text-gray-600">No recent leaves</p>
            ) : (
              <div className="space-y-3">
                {employeeDashboard.recentLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{leave.leaveTypeName}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)} ({leave.totalDays}{' '}
                        days)
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}
                    >
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link
                to="/leaves/my-leaves"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View all leaves →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Manager Dashboard */}
      {role === 'MANAGER' && managerDashboard && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {managerDashboard.pendingApprovalsCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approved Today</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {managerDashboard.approvedTodayCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Decisions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Decisions</h2>
            {managerDashboard.recentDecisions.length === 0 ? (
              <p className="text-gray-600">No recent decisions</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Employee
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Leave Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Period
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {managerDashboard.recentDecisions.map((decision) => (
                      <tr key={decision.leaveId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {decision.employeeName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {decision.leaveTypeName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(decision.startDate)} - {formatDate(decision.endDate)} (
                          {decision.totalDays} days)
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(decision.status)}`}
                          >
                            {decision.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4">
              <Link
                to="/approvals"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View all pending approvals →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      {role === 'ADMIN' && adminDashboard && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-semibold text-gray-900">{adminDashboard.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Leave Types</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {adminDashboard.leaveTypesCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {adminDashboard.totalLeaveRequests}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Users by Role Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600">Employees</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {adminDashboard.usersByRole.employees}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600">Managers</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {adminDashboard.usersByRole.managers}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {adminDashboard.usersByRole.admins}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/users"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Manage Users
              </Link>
              <Link
                to="/admin/leave-policies"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Manage Leave Policies
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
