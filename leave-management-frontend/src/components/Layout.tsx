import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * Main layout component that wraps all pages
 * Dark sidebar + white navbar + subtle background for content area
 */
const Layout = () => {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - dark theme for contrast */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar - clean white */}
        <Navbar />
        
        {/* Page content - increased padding for breathing room */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
