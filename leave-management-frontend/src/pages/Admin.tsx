import { Link } from 'react-router-dom';

/**
 * Admin page - system configuration and user management
 * Landing page for admin section with navigation to admin features
 */
const Admin = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Management Card */}
        <Link
          to="/admin/users"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow hover:border-indigo-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
          </div>
          <p className="text-gray-600 text-sm">
            View all users and manage their roles and permissions
          </p>
        </Link>

        {/* Leave Policies Card */}
        <Link
          to="/admin/leave-policies"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow hover:border-indigo-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Leave Policies</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Configure leave types and annual limits
          </p>
        </Link>

        {/* System Settings Card */}
        <Link
          to="/admin/system-settings"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow hover:border-indigo-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚙️</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Configure organization-wide settings
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Admin;
