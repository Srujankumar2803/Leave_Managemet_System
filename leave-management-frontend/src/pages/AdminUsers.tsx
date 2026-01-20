import { useState, useEffect } from 'react';
import adminService, { type AdminUser } from '../api/adminService';
import axios from 'axios';

/**
 * Admin Users Management Page
 * Allows admins to view all users and update their roles
 * Component state is LOCAL - not in Redux
 */
const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  /**
   * Fetch all users on component mount
   */
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Fetch users from backend
   */
  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          setError('Access denied. Admin privileges required.');
        } else {
          setError('Failed to load users. Please try again.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle role update for a user
   */
  const handleRoleUpdate = async (userId: number, newRole: string) => {
    setUpdatingUserId(userId);
    setError('');
    setSuccessMessage('');
    
    try {
      await adminService.updateUserRole(userId, newRole);
      
      // Get username for success message
      const user = users.find(u => u.id === userId);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole as 'EMPLOYEE' | 'MANAGER' | 'ADMIN' } : user
      ));
      
      setSuccessMessage(`Role updated successfully for ${user?.name || 'user'}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to update role');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      ) : (
        /* Users table */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'MANAGER'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                        disabled={updatingUserId === user.id}
                        className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="EMPLOYEE">EMPLOYEE</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      {updatingUserId === user.id && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty state */}
          {users.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
