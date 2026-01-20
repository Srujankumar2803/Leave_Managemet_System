import { Link } from 'react-router-dom';

/**
 * Unauthorized page - displayed when user tries to access a route they don't have permission for
 * Simple, clean design matching the app's aesthetic
 */
const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="text-center px-4">
        {/* Error icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">🚫</span>
          </div>
        </div>

        {/* Error message */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Access Denied</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          You do not have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>

        {/* Action button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
