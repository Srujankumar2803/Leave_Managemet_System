import axiosInstance from './axiosClient';

// ========================
// TYPE DEFINITIONS
// ========================

export type LeaveType = {
  id: number;
  name: string;
  maxDaysPerYear: number;
};

export type ApplyLeaveRequest = {
  leaveTypeId: number;
  startDate: string; // ISO format: YYYY-MM-DD
  endDate: string;   // ISO format: YYYY-MM-DD
  reason?: string;
};

export type LeaveRequest = {
  id: number;
  userId: number;
  userName: string;
  leaveTypeId: number;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
};

export type LeaveBalance = {
  leaveTypeId: number;
  leaveTypeName: string;
  remainingDays: number;
  maxDaysPerYear: number;
};

export type ApplyLeaveResponse = {
  message: string;
  data: LeaveRequest;
};

// ========================
// API METHODS
// ========================

/**
 * Apply for leave
 * POST /api/leave/apply
 */
export const applyLeave = async (request: ApplyLeaveRequest): Promise<ApplyLeaveResponse> => {
  const response = await axiosInstance.post<ApplyLeaveResponse>('/leave/apply', request);
  return response.data;
};

/**
 * Get current user's leave requests
 * GET /api/leave/my-requests
 */
export const getMyLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const response = await axiosInstance.get<{ data: LeaveRequest[] }>('/leave/my-requests');
  return response.data.data;
};

/**
 * Get current user's leave balances
 * GET /api/leave/balances
 */
export const getLeaveBalances = async (): Promise<LeaveBalance[]> => {
  const response = await axiosInstance.get<{ data: LeaveBalance[] }>('/leave/balances');
  return response.data.data;
};

/**
 * Get all available leave types
 * GET /api/leave/types
 */
export const getLeaveTypes = async (): Promise<LeaveType[]> => {
  const response = await axiosInstance.get<{ data: LeaveType[] }>('/leave/types');
  return response.data.data;
};

// ========================
// TEMPORARY MOCK DATA
// ========================
// Using mock data since leave types API endpoint is not yet created
export const mockLeaveTypes: LeaveType[] = [
  { id: 1, name: 'Casual Leave', maxDaysPerYear: 12 },
  { id: 2, name: 'Sick Leave', maxDaysPerYear: 10 },
  { id: 3, name: 'Earned Leave', maxDaysPerYear: 15 },
];
