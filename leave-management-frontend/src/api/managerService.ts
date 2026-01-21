import axiosClient from './axiosClient';

/**
 * Pending leave interface for manager view
 */
export interface PendingLeave {
  id: number;
  userId: number;
  employeeName: string;
  employeeEmail: string;
  leaveTypeId: number;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string | null;
  appliedAt: string;
}

/**
 * Approval response interface
 */
export interface ApprovalResponse {
  leaveId: number;
  status: string;
  message: string;
}

/**
 * Manager API service
 * Handles manager-only operations (leave approval workflow)
 */

/**
 * Get all pending leave requests
 * GET /api/manager/leaves/pending
 * @returns Promise with array of pending leaves
 */
export const getPendingLeaves = async (): Promise<PendingLeave[]> => {
  const response = await axiosClient.get<{ data: PendingLeave[] }>('/manager/leaves/pending');
  return response.data.data;
};

/**
 * Approve a leave request
 * PUT /api/manager/leaves/{leaveId}/approve
 * @param leaveId - ID of leave request to approve
 * @returns Promise with approval response
 */
export const approveLeave = async (leaveId: number): Promise<ApprovalResponse> => {
  const response = await axiosClient.put<{ message: string; data: ApprovalResponse }>(
    `/manager/leaves/${leaveId}/approve`
  );
  return response.data.data;
};

/**
 * Reject a leave request and rollback balance
 * PUT /api/manager/leaves/{leaveId}/reject
 * @param leaveId - ID of leave request to reject
 * @returns Promise with rejection response
 */
export const rejectLeave = async (leaveId: number): Promise<ApprovalResponse> => {
  const response = await axiosClient.put<{ message: string; data: ApprovalResponse }>(
    `/manager/leaves/${leaveId}/reject`
  );
  return response.data.data;
};

const managerService = {
  getPendingLeaves,
  approveLeave,
  rejectLeave,
};

export default managerService;
