import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';
import MyLeaves from './pages/MyLeaves';
import Approvals from './pages/Approvals';
import Admin from './pages/Admin';
import AdminUsers from './pages/AdminUsers';
import AdminLeavePolicies from './pages/AdminLeavePolicies';
import AdminSystemSettings from './pages/AdminSystemSettings';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

/**
 * Root App component with routing configuration
 * Login and Register routes are standalone (not wrapped by Layout)
 * All dashboard routes are protected with role-based access control
 * for example below look into the Employee as the User 
 *  // // this is role based entry to the user, the element loaded with the help of this file,in order to go to this route, it is handled by the Sidebar.tsx
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes - standalone, no protection needed */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Unauthorized page - within Layout for consistent UI */}
        <Route
          path="/unauthorized"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Unauthorized />} />
        </Route>
        
        {/* Dashboard - accessible to all authenticated users */}
        <Route
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>

        {/* Employee routes - Apply Leave & My Leaves */}
        <Route
          path="/apply-leave"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>  
            
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ApplyLeave />} />
        </Route>

        {/* Leave Management Routes */}
        <Route
          path="/leaves/apply"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ApplyLeave />} />
        </Route>

        <Route
          path="/leaves/my-leaves"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MyLeaves />} />
        </Route>

        <Route
          path="/my-leaves"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MyLeaves />} />
        </Route>

        {/* Manager routes - Approvals */}
        <Route
          path="/approvals"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Approvals />} />
        </Route>

        {/* Admin routes - Admin panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Admin />} />
        </Route>

        {/* Admin Users Management - Admin only */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminUsers />} />
        </Route>

        {/* Admin Leave Policies Management - Admin only */}
        <Route
          path="/admin/leave-policies"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminLeavePolicies />} />
        </Route>

        {/* Admin System Settings - Admin only */}
        <Route
          path="/admin/system-settings"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminSystemSettings />} />
        </Route>

        {/* Profile - accessible to all authenticated users */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
        </Route>

        {/* Settings - accessible to all authenticated users */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
