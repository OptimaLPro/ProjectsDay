import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  LogOut,
  Users,
  Wrench,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Trophy,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const links = [
  {
    href: "/dashboard/auth-users",
    label: "Manage Users",
    icon: <Users className="h-8 w-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/update-projects",
    label: "Manage Projects",
    icon: <Wrench className="h-8 w-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/manage-instructors",
    label: "Manage Instructors",
    icon: <BookOpen className="h-8 w-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/manage-internships",
    label: "Manage Internships",
    icon: <GraduationCap className="h-8 w-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/manage-awards",
    label: "Manage Awards",
    icon: <Trophy className="h-8 w-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/change-yearbook",
    label: "Change Yearbook",
    icon: <CalendarDays className="h-8 w-8 mb-2 text-primary" />,
  },
];

const AdminDashboard = ({ onLogout }) => {
  return (
    <div className="mt-5 max-w-6xl mx-auto relative">
      <main className="container mx-auto px-5 lg:px-4">
        <h1 className="text-3xl font-bold text-center mb-12">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map(({ href, label, icon }) => (
            <Link to={href} key={href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                  {icon}
                  <CardTitle className="text-lg font-semibold">
                    {label}
                  </CardTitle>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button variant="outline" className="gap-2" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
