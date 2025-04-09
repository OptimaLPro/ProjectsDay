import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Edit, LogOut, Plus } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useMyProject } from "@/hooks/useMyProject";
import Loader from "@/components/Loader/Loader";

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

  if (isLoadingUser || isLoading) {
    return <Loader />;
  }

  if (error?.response?.status === 401) {
    logout();
    navigate("/");
    return null;
  }

  if (user?.role === "admin") {
    return (
      <div className="bg-background mt-5 max-w-[90%] mx-auto">
        <main className="container mx-auto px-5 lg:px-4 relative">
          <div className="flex flex-col md:items-center justify-between mb-8 gap-4">
            <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
            <div className="flex gap-3 flex-col justify-center items-center mt-12">
              <Link to="/dashboard/auth-users">
                <Button className="gap-2">Manage Users</Button>
              </Link>
              <Link to="/dashboard/update-projects">
                <Button className="gap-2">Update Projects</Button>
              </Link>
              <Link to="/dashboard/change-yearbook">
                <Button className="gap-2">Change Yearbook</Button>
              </Link>
              <Link to="/dashboard/manage-internships">
                <Button className="gap-2">Manage Internships</Button>
              </Link>
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <div>Logout</div>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (user?.role === "student") {
    return (
      <div className="bg-background mt-5 max-w-[90%] mx-auto">
        <main className="container mx-auto px-5 lg:px-4 relative">
          <div className="flex flex-col md:items-center justify-between mb-8 gap-4">
            <h1 className="text-2xl font-bold text-center">
              Student Dashboard
            </h1>

            <div className="flex gap-3 flex-col justify-center items-center mt-12">
              {!data?.exists ? (
                <Link to="/dashboard/add-project">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Project
                  </Button>
                </Link>
              ) : (
                <Link to={`/dashboard/update-project`}>
                  <Button className="gap-2">
                    <Edit className="h-4 w-4" />
                    <div>Update Project</div>
                  </Button>
                </Link>
              )}

              <Button
                variant="outline"
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <div>Logout</div>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="text-center mt-16 text-muted-foreground">
      Unauthorized role
    </div>
  );
};

export default Dashboard;
