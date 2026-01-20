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

const adminService = {
  getAllUsers,
  updateUserRole,
};

export default adminService;
