import Loader from "@/components/Loader/Loader";
import { useAuth } from "@/context/AuthContext";
import { useMyProject } from "@/hooks/useMyProject";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isLoadingUser } = useAuth();
  const { data, isLoading, error } = useMyProject();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (!isLoadingUser && !user) {
      navigate("/login");
    }
  }, [user, isLoadingUser, navigate]);

  if (isLoadingUser || isLoading) return <Loader />;

  if (error?.response?.status === 401) {
    logout();
    navigate("/");
    return null;
  }

  if (user?.role === "admin") return <AdminDashboard onLogout={handleLogout} />;
  if (user?.role === "student")
    return <StudentDashboard hasProject={data?.exists} onLogout={handleLogout} />;

  return (
    <div className="relative text-center mt-16 text-muted-foreground">
      Unauthorized role
    </div>
  );
};

export default Dashboard;
