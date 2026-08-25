import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function ProtectedCustomerRoute() {
  const { isAuthenticated, isCustomer } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!isCustomer) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedCustomerRoute;