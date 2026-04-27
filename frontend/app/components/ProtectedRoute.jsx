import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute - Wraps pages that require login.
 * If the user is not logged in, redirects to /login and remembers the
 * original URL so they can be sent back after logging in.
 *
 * Optional `requiredRole` prop restricts access to a specific role.
 */
function ProtectedRoute({ children, requiredRole }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role")?.toLowerCase();
  const location = useLocation();

  // Not logged in → redirect to login, remember where they wanted to go
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Logged in but wrong role → redirect to their own dashboard
  if (requiredRole && role !== requiredRole) {
    const dashboard = role === "tutor" ? "/tutor-dashboard" : "/student-dashboard";
    return <Navigate to={dashboard} replace />;
  }

  return children;
}

export default ProtectedRoute;
