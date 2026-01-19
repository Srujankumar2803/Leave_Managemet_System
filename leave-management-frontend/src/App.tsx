import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';
import MyLeaves from './pages/MyLeaves';
import Approvals from './pages/Approvals';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';

/**
 * Root App component with routing configuration
 * Login and Register routes are standalone (not wrapped by Layout)
 * All dashboard routes are protected and use Layout wrapper
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes - standalone, no protection needed */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected dashboard routes - require authentication */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="apply-leave" element={<ApplyLeave />} />
          <Route path="my-leaves" element={<MyLeaves />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
