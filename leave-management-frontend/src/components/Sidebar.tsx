import { NavLink } from 'react-router-dom';

/**
 * Navigation items configuration
 */
const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/apply-leave', label: 'Apply Leave', icon: '📝' },
  { path: '/my-leaves', label: 'My Leaves', icon: '📋' },
  { path: '/approvals', label: 'Approvals', icon: '✓' },
  { path: '/admin', label: 'Admin', icon: '⚙' },
];

/**
 * Sidebar component with navigation links
 */
const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      {/* Logo/Brand section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Leave Management</h2>
      </div>
      
      {/* Navigation links */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path} /*unique key for each link*/
            to={item.path} /*indicates the target route*/
            end={item.path === '/'} /*exact match for root path*/
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
