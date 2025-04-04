import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log(user, allowedRoles);

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};