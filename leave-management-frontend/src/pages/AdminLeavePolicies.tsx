import { useState, useEffect } from 'react';
import adminService, { type LeaveType, type CreateLeaveTypeRequest } from '../api/adminService';
import axios from 'axios';

/**
 * Admin Leave Policies Management Page
 * Allows admins to view, create, update, and delete leave types
 * Component state is LOCAL - not in Redux
 */
const AdminLeavePolicies = () => {
  // State for leave types list
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // State for add form
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newLeaveType, setNewLeaveType] = useState<CreateLeaveTypeRequest>({
    name: '',
    maxDaysPerYear: 0,
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // State for inline editing
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // State for delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  /**
   * Fetch leave types on component mount
   */
  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  /**
   * Fetch all leave types from backend
   */
  const fetchLeaveTypes = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await adminService.getAllLeaveTypes();
      setLeaveTypes(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          setError('Access denied. Admin privileges required.');
        } else {
          setError('Failed to load leave types. Please try again.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Show success message and auto-hide after 3 seconds
   */
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  /**
   * Handle adding a new leave type
   */
  const handleAddLeaveType = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLeaveType.name.trim()) {
      setError('Leave type name is required');
      return;
    }
    
    if (newLeaveType.maxDaysPerYear < 1 || newLeaveType.maxDaysPerYear > 365) {
      setError('Max days per year must be between 1 and 365');
      return;
    }

    setIsAdding(true);
    setError('');

    try {
      const created = await adminService.createLeaveType({
        name: newLeaveType.name.trim(),
        maxDaysPerYear: newLeaveType.maxDaysPerYear,
      });

      setLeaveTypes([...leaveTypes, created].sort((a, b) => a.name.localeCompare(b.name)));
      setNewLeaveType({ name: '', maxDaysPerYear: 0 });
      setShowAddForm(false);
      showSuccess(`Leave type "${created.name}" created successfully`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to create leave type');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsAdding(false);
    }
  };

  /**
   * Start inline editing for a leave type
   */
  const startEditing = (leaveType: LeaveType) => {
    setEditingId(leaveType.id);
    setEditValue(leaveType.maxDaysPerYear);
    setError('');
  };

  /**
   * Cancel inline editing
   */
  const cancelEditing = () => {
    setEditingId(null);
    setEditValue(0);
  };

  /**
   * Save edited leave type
   */
  const handleSaveEdit = async (id: number) => {
    if (editValue < 1 || editValue > 365) {
      setError('Max days per year must be between 1 and 365');
      return;
    }

    const leaveType = leaveTypes.find(lt => lt.id === id);
    if (!leaveType || leaveType.maxDaysPerYear === editValue) {
      cancelEditing();
      return;
    }

    setIsUpdating(true);
    setError('');

    try {
      const updated = await adminService.updateLeaveType(id, { maxDaysPerYear: editValue });

      setLeaveTypes(leaveTypes.map(lt => (lt.id === id ? updated : lt)));
      cancelEditing();
      showSuccess(`"${updated.name}" updated successfully. Leave balances have been adjusted.`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to update leave type');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handle delete confirmation
   */
  const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
    setError('');
  };

  /**
   * Cancel delete confirmation
   */
  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  /**
   * Confirm and execute delete
   */
  const confirmDelete = async () => {
    if (!deleteConfirmId) return;

    const leaveType = leaveTypes.find(lt => lt.id === deleteConfirmId);
    setIsDeleting(true);
    setError('');

    try {
      await adminService.deleteLeaveType(deleteConfirmId);

      setLeaveTypes(leaveTypes.filter(lt => lt.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      showSuccess(`"${leaveType?.name}" deleted successfully`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to delete leave type');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Leave Policies</h1>
          <p className="text-gray-600 mt-1">Configure leave types and annual limits</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setError('');
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          Add Leave Type
        </button>
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

      {/* Add Leave Type Form */}
      {showAddForm && (
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Leave Type</h2>
          <form onSubmit={handleAddLeaveType} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type Name
              </label>
              <input
                type="text"
                id="name"
                value={newLeaveType.name}
                onChange={(e) => setNewLeaveType({ ...newLeaveType, name: e.target.value })}
                placeholder="e.g., Casual Leave"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isAdding}
              />
            </div>
            <div className="w-full sm:w-48">
              <label htmlFor="maxDays" className="block text-sm font-medium text-gray-700 mb-1">
                Max Days Per Year
              </label>
              <input
                type="number"
                id="maxDays"
                value={newLeaveType.maxDaysPerYear || ''}
                onChange={(e) =>
                  setNewLeaveType({ ...newLeaveType, maxDaysPerYear: parseInt(e.target.value) || 0 })
                }
                placeholder="e.g., 12"
                min={1}
                max={365}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isAdding}
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={isAdding}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
              >
                {isAdding ? 'Adding...' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewLeaveType({ name: '', maxDaysPerYear: 0 });
                  setError('');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "
              {leaveTypes.find((lt) => lt.id === deleteConfirmId)?.name}"? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Loading leave types...</span>
        </div>
      ) : leaveTypes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No leave types configured yet.</p>
          <p className="text-gray-500 text-sm mt-1">Click "Add Leave Type" to create one.</p>
        </div>
      ) : (
        /* Leave types table */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max Days Per Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveTypes.map((leaveType) => (
                <tr key={leaveType.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{leaveType.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === leaveType.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                          min={1}
                          max={365}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          disabled={isUpdating}
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(leaveType.id)}
                          disabled={isUpdating}
                          className="text-indigo-600 hover:text-indigo-800 disabled:text-indigo-400"
                          title="Save"
                        >
                          {isUpdating ? '...' : '✓'}
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={isUpdating}
                          className="text-gray-500 hover:text-gray-700"
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                        {leaveType.maxDaysPerYear} days
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startEditing(leaveType)}
                        disabled={editingId !== null || isDeleting}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(leaveType.id)}
                        disabled={editingId !== null || isDeleting}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-1">Note</h4>
        <p className="text-sm text-blue-700">
          When you update the max days per year, all employee leave balances will be automatically
          adjusted. If the limit is increased, the difference is added. If decreased, balances are
          capped at the new limit.
        </p>
      </div>
    </div>
  );
};

export default AdminLeavePolicies;
