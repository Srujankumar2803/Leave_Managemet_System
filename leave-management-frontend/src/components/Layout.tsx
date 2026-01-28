import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Main layout component that wraps all pages
 * Dark sidebar + white navbar + subtle background for content area
 * Footer stays at bottom of viewport or content, whichever is lower
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
        
        {/* Scrollable content wrapper with footer */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Page content - increased padding for breathing room */}
          <main className="flex-1 p-8">
            <Outlet />
          </main>
          
          {/* Footer - always at bottom */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
