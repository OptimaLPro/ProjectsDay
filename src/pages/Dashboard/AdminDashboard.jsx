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
    icon: <Users className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/update-projects",
    label: "Manage Projects",
    icon: <Wrench className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/manage-instructors",
    label: "Manage Instructors",
    icon: <BookOpen className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/manage-internships",
    label: "Manage Internships",
    icon: <GraduationCap className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/manage-awards",
    label: "Manage Awards",
    icon: <Trophy className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    href: "/dashboard/manage-yearbook",
    label: "Manage Yearbook",
    icon: <CalendarDays className="w-8 h-8 mb-2 text-primary" />,
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
          {links.map(({ href, label, icon }) => (
            <Link to={href} key={href}>
              <Card className="p-6 transition-all duration-300 border shadow-xl hover:scale-105 hover:shadow-2xl backdrop-blur-md bg-white/40 border-white/30">
                <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                  {icon}
                  <CardTitle className="text-lg font-semibold">
                    {label}
                  </CardTitle>
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
