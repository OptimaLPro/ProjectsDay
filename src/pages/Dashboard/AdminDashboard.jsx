import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  LogOut,
  Users,
  Wrench,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Trophy,
  MonitorPlay,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const links = [
  {
    href: "/dashboard/manage-yearbook",
    label: "Manage Yearbook",
    description: "Set and namage the active year.",
    icon: <CalendarDays className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/manage-internships",
    label: "Manage Internships",
    description: "Create and edit internship tracks.",
    icon: <GraduationCap className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/manage-instructors",
    label: "Manage Instructors",
    description: "Assign instructors to internships.",
    icon: <BookOpen className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/auth-users",
    label: "Manage Users",
    description: "View, add or edit user accounts.",
    icon: <Users className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/update-projects",
    label: "Manage Projects",
    description: "Edit submitted projects and teams.",
    icon: <Wrench className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/manage-awards",
    label: "Manage Awards",
    description: "Add or edit awards for projects.",
    icon: <Trophy className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/manage-homepage",
    label: "Manage Homepage",
    description: "Add or edit content for the homepage.",
    icon: <MonitorPlay className="w-8 h-8 mb-2 text-primary" />,
  },
];

const AdminDashboard = ({ onLogout }) => {
  return (
    <div className="relative max-w-6xl mx-auto mt-5">
      <main className="container px-5 mx-auto lg:px-4">
        <h1 className="mb-12 text-3xl font-bold text-center">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {links.map(({ href, label, icon, description }) => (
            <Link to={href} key={href}>
              <Card className="p-6 transition-all duration-300 border shadow-xl hover:scale-105 hover:shadow-2xl backdrop-blur-md bg-white/40 border-white/30">
                <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                  {icon}
                  <CardTitle className="mb-1 text-lg font-semibold">
                    {label}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
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

export default AdminDashboard;
