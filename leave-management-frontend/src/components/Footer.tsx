/**
 * Footer component - displayed on all authenticated pages
 * Enterprise-style footer with copyright, product info, and version
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
          {/* Left - Copyright */}
          <div className="flex items-center gap-1">
            <span>© {currentYear} Leave Management System</span>
          </div>

          {/* Center - Product Type */}
          <div className="flex items-center gap-4">
            <span className="text-gray-500">Internal HR Tool</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <div className="hidden sm:flex items-center gap-4">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-700 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-700 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Terms of Use
              </a>
            </div>
          </div>

          {/* Right - Version */}
          <div className="flex items-center">
            <span className="text-gray-500">Version: v1.0.0</span>
          </div>
        </div>

        {/* Mobile links - shown below on small screens */}
        <div className="flex sm:hidden items-center justify-center gap-4 mt-2 pt-2 border-t border-gray-200">
          <a
            href="#"
            className="text-gray-500 hover:text-gray-700 text-xs transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-gray-700 text-xs transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Terms of Use
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
