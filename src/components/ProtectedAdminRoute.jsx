import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function ProtectedAdminRoute() {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-box">
          <div className="auth-loading-spinner" />
          <p>Checking administrator access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (user.role !== "admin") {
    return <Navigate to="/customer" replace />;
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;