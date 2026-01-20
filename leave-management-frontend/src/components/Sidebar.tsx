import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import type { Role } from '../types/roles';

/**
 * Navigation item interface with role-based access control
 */
interface NavItem {
  path: string;
  label: string;
  icon: string;
  allowedRoles: Role[];
}

/**
 * Navigation items configuration with role-based access
 * Each item defines which roles can see it in the sidebar
 */
const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: '📊', allowedRoles: ['EMPLOYEE', 'MANAGER', 'ADMIN'] },
  { path: '/apply-leave', label: 'Apply Leave', icon: '📝', allowedRoles: ['EMPLOYEE'] },
  { path: '/my-leaves', label: 'My Leaves', icon: '📋', allowedRoles: ['EMPLOYEE'] },
  { path: '/approvals', label: 'Approvals', icon: '✓', allowedRoles: ['MANAGER'] },
  { path: '/admin', label: 'Admin', icon: '⚙', allowedRoles: ['ADMIN'] },
];

/**
 * Sidebar component with dark theme navigation
 * Uses slate-900 background for premium feel with subtle interaction states
 * Renders menu items based on user role
 */
const Sidebar = () => {
  const userRole = useAppSelector((state) => state.auth.user?.role);

  // Filter navigation items based on user role
  const visibleNavItems = navItems.filter((item) => 
    userRole && item.allowedRoles.includes(userRole)
  );

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800">
      {/* Brand section - slightly larger for prominence */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-white tracking-tight">Leave Management</h2>
      </div>
      
      {/* Navigation links - increased spacing for better readability */}
      <nav className="p-4 space-y-2">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              /* Active state: left border + subtle background tint (enterprise-style indicator) */
              /* Hover state: slight background lift without being flashy */
              `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all relative ${
                isActive
                  ? 'bg-slate-800 text-white border-l-4 border-indigo-600 pl-3'
                  : 'text-gray-300 hover:bg-slate-800 hover:text-white border-l-4 border-transparent'
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
