import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * Main layout component that wraps all pages
 * Contains sidebar, navbar, and main content area
 */
const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - fixed width */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <Navbar />
        
        {/* Page content */} 
        {/*  Outlet renders the matched child route component */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
