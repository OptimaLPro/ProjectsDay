import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router";
import Loader from "@/components/Loader/Loader";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoadingUser } = useAuth();
  const location = useLocation();

  if (isLoadingUser) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
