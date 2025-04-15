import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Edit, Link2, LogOut, Plus, User } from "lucide-react";
import { Link } from "react-router";
import UnassignProjectButton from "./UnassignProjectButton";

const StudentDashboard = ({ hasProject, onLogout }) => {
  const links = !hasProject
    ? [
        {
          href: "/dashboard/add-project",
          label: "Add Project",
          icon: <Plus className="h-8 w-8 mb-2 text-primary" />,
        },
        {
          href: "/dashboard/assign-project",
          label: "Assign Project",
          icon: <Link2 className="h-8 w-8 mb-2 text-green-600" />,
        },
      ]
    : [
        {
          href: "/dashboard/update-project",
          label: "Update Project",
          icon: <Edit className="h-8 w-8 mb-2 text-primary" />,
        },
      ];

  return (
    <div className="mt-5 max-w-6xl mx-auto relative">
      <main className="container mx-auto px-5 lg:px-4">
        <h1 className="text-3xl font-bold text-center mb-12">
          Student Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
          {links.map(({ href, label, icon }) => (
            <Link to={href} key={href}>
              <Card className="hover:scale-105 duration-300 p-6 shadow-xl hover:shadow-2xl backdrop-blur-md bg-white/40 border border-white/30 transition-all">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                  {icon}
                  <CardTitle className="text-lg font-semibold">
                    {label}
                  </CardTitle>
                </CardContent>
              </Card>
            </Link>
          ))}

          {hasProject && <UnassignProjectButton />}

          <Link to="/dashboard/edit-profile">
            <Card className="hover:scale-105 duration-300 p-6 shadow-xl hover:shadow-2xl backdrop-blur-md bg-white/40 border border-white/30 transition-all">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                <User className="h-8 w-8 mb-2 text-primary" />
                <CardTitle className="text-lg font-semibold">
                  Edit Profile
                </CardTitle>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="flex justify-center my-12">
          <Button variant="outline" className="gap-2" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
