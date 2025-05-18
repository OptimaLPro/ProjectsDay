import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Edit, Link2, LogOut, Plus } from "lucide-react";
import { Link } from "react-router";
import UnassignProjectButton from "./UnassignProjectButton";

const StudentDashboard = ({ hasProject, onLogout }) => {
  const { user } = useAuth();

  const links = !hasProject
    ? [
        {
          href: "/dashboard/add-project",
          label: "Add Project",
          description: "Start a new project from scratch.",
          icon: <Plus className="w-8 h-8 mb-2 text-primary" />,
        },
        {
          href: "/dashboard/assign-project",
          label: "Assign Project",
          description: "Join an existing project.",
          icon: <Link2 className="w-8 h-8 mb-2 text-green-600" />,
        },
      ]
    : [
        {
          href: "/dashboard/update-project",
          label: "Update Project",
          description: "Edit your current project's details.",
          icon: <Edit className="w-8 h-8 mb-2 text-primary" />,
        },
      ];

  return (
    <div className="relative max-w-6xl mx-auto mt-5">
      <main className="container px-5 mx-auto lg:px-4">
        <h1 className="mb-12 text-3xl font-bold text-center">
          Student Dashboard
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-3">
          {links.map(({ href, label, icon, description }) => (
            <Link to={href} key={href}>
              <Card className="p-6 transition-all duration-300 border shadow-xl hover:scale-105 hover:shadow-2xl backdrop-blur-md bg-white/40 border-white/30">
                <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="flex items-center justify-center mb-2 h-14">
                    {icon}
                  </div>
                  <CardTitle className="mb-1 text-lg font-semibold">
                    {label}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}

          {hasProject && <UnassignProjectButton />}

          <Link to="/dashboard/edit-profile">
            <Card className="p-6 transition-all duration-300 border shadow-xl hover:scale-105 hover:shadow-2xl backdrop-blur-md bg-white/40 border-white/30">
              <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="flex items-center justify-center mb-2 h-14">
                  <img
                    src={user.image || "/images/default.jpg"}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover shadow-lg border-[1px] border-gray-300"
                  />
                </div>
                <CardTitle className="mb-1 text-lg font-semibold">
                  Edit Profile
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Update your photo and details.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="flex justify-center my-12">
          <Button variant="outline" className="gap-2" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
