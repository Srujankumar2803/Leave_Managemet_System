import axiosClient from './axiosClient';

/**
 * User interface for admin user list
 */
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
}

/**
 * Request interface for updating user role
 */
export interface UpdateRoleRequest {
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
}

/**
 * Leave type interface for policy management
 */
export interface LeaveType {
  id: number;
  name: string;
  maxDaysPerYear: number;
}

/**
 * Request interface for creating a leave type
 */
export interface CreateLeaveTypeRequest {
  name: string;
  maxDaysPerYear: number;
}

/**
 * Request interface for updating a leave type
 */
export interface UpdateLeaveTypeRequest {
  maxDaysPerYear: number;
}

/**
 * Admin API service
 * Handles admin-only operations (user management)
 */

/**
 * Get all users (admin only)
 * @returns Promise with array of users
 */
export const getAllUsers = async (): Promise<AdminUser[]> => {
  const response = await axiosClient.get<AdminUser[]>('/admin/users');
  return response.data;
};

/**
 * Update user role (admin only)
 * @param userId - ID of user to update
 * @param role - New role to assign
 * @returns Promise with success message
 */
export const updateUserRole = async (userId: number, role: string): Promise<void> => {
  await axiosClient.put(`/admin/users/${userId}/role`, { role });
};

// ========================
// LEAVE POLICY API FUNCTIONS
// ========================

/**
 * Get all leave types (admin only)
 * @returns Promise with array of leave types
 */
export const getAllLeaveTypes = async (): Promise<LeaveType[]> => {
  const response = await axiosClient.get<LeaveType[]>('/admin/leave-types');
  return response.data;
};

/**
 * Create a new leave type (admin only)
 * @param data - Leave type data to create
 * @returns Promise with created leave type
 */
export const createLeaveType = async (data: CreateLeaveTypeRequest): Promise<LeaveType> => {
  const response = await axiosClient.post<LeaveType>('/admin/leave-types', data);
  return response.data;
};

/**
 * Update a leave type's max days per year (admin only)
 * @param id - ID of leave type to update
 * @param data - Updated leave type data
 * @returns Promise with updated leave type
 */
export const updateLeaveType = async (id: number, data: UpdateLeaveTypeRequest): Promise<LeaveType> => {
  const response = await axiosClient.put<LeaveType>(`/admin/leave-types/${id}`, data);
  return response.data;
};

/**
 * Delete a leave type (admin only)
 * @param id - ID of leave type to delete
 * @returns Promise with void
 */
export const deleteLeaveType = async (id: number): Promise<void> => {
  await axiosClient.delete(`/admin/leave-types/${id}`);
};

const adminService = {
  getAllUsers,
  updateUserRole,
  getAllLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
};

export default adminService;
