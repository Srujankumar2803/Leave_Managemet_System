import axiosClient from './axiosClient';

/**
 * Dashboard API interfaces
 */

// Employee Dashboard
export interface LeaveBalanceSummary {
  leaveTypeName: string;
  remainingDays: number;
  maxDaysPerYear: number;
}

export interface RecentLeave {
  id: number;   
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: string;
  appliedAt: string;
}

export interface EmployeeDashboard {
  pendingLeavesCount: number;
  approvedLeavesCount: number;
  remainingLeaveSummary: LeaveBalanceSummary[];
  recentLeaves: RecentLeave[];
}

// Manager Dashboard
export interface RecentDecision {
  leaveId: number;
  employeeName: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: string;
  decidedAt: string;
}

export interface ManagerDashboard {
  pendingApprovalsCount: number;
  approvedTodayCount: number;
  recentDecisions: RecentDecision[];
}

// Admin Dashboard
export interface UsersByRole {
  employees: number;
  managers: number;
  admins: number;
}

export interface AdminDashboard {
  totalUsers: number;
  usersByRole: UsersByRole;
  leaveTypesCount: number;
  totalLeaveRequests: number;
}

/**
 * Dashboard API service
 * Provides role-specific dashboard summary data
 */

/**
 * Get employee dashboard summary
 * @returns Promise with employee dashboard data
 */
export const getEmployeeDashboard = async (): Promise<EmployeeDashboard> => {
  const response = await axiosClient.get<EmployeeDashboard>('/dashboard/employee');
  return response.data;
};

/**
 * Get manager dashboard summary (manager only)
 * @returns Promise with manager dashboard data
 */
export const getManagerDashboard = async (): Promise<ManagerDashboard> => {
  const response = await axiosClient.get<ManagerDashboard>('/dashboard/manager');
  return response.data;
};

/**
 * Get admin dashboard summary (admin only)
 * @returns Promise with admin dashboard data
 */
export const getAdminDashboard = async (): Promise<AdminDashboard> => {
  const response = await axiosClient.get<AdminDashboard>('/dashboard/admin');
  return response.data;
};

const dashboardService = {
  getEmployeeDashboard,
  getManagerDashboard,
  getAdminDashboard,
};

export default dashboardService;
