import { ProtectedRoute } from "@/hooks/ProtectedRoute";
import AdminChangeYearbook from "@/pages/AdminChangeYearbook/AdminChangeYearbook";
import AdminManageAwards from "@/pages/AdminManageAwards/AdminManageAwards";
import AdminManageInstructors from "@/pages/AdminManageInstructors/AdminManageInstructors";
import AdminManageInternships from "@/pages/AdminManageInternships/AdminManageInternships";
import AdminManageUsers from "@/pages/AdminManageUsers/AdminManageUsers";
import AdminUpdateProjects from "@/pages/AdminUpdateProjects/AdminUpdateProjects";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Home from "@/pages/Home/Home";
import InstructorProfile from "@/pages/Instructors/InstructorProfile";
import Instructors from "@/pages/Instructors/Instructors";
import InternshipProfile from "@/pages/Internships/InternshipProfile";
import Internships from "@/pages/Internships/Internships";
import { Login } from "@/pages/Login/Login";
import Project from "@/pages/Project/Project";
import Register from "@/pages/Register/Register";
import Unauthorized from "@/pages/Unauthorized/Unauthorized";
import { UserAddProject } from "@/pages/UserAddProject/UserAddProject";
import { UserUpdateProject } from "@/pages/UserUpdateProject/UserUpdateProject";
import { useEffect } from "react";
import { Route, Routes } from "react-router";
import StudentAssignProject from "@/pages/Dashboard/StudentAssignProject";

const Router = () => {
  useEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-5 lg:py-12">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/projects/:id" element={<Project />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/internships/:id" element={<InternshipProfile />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/instructors/:id" element={<InstructorProfile />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected routes (student) */}
        <Route element={<ProtectedRoute allowedRoles={["student", "admin"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/add-project" element={<UserAddProject />} />
          <Route
            path="/dashboard/update-project"
            element={<UserUpdateProject />}
          />
          <Route
            path="/dashboard/assign-project"
            element={<StudentAssignProject />}
          />
        </Route>

        {/* Protected routes (admin) */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/auth-users" element={<AdminManageUsers />} />
          <Route
            path="/dashboard/update-projects"
            element={<AdminUpdateProjects />}
          />
          <Route
            path="/dashboard/change-yearbook"
            element={<AdminChangeYearbook />}
          />
          <Route
            path="/dashboard/manage-internships"
            element={<AdminManageInternships />}
          />
          <Route
            path="/dashboard/manage-instructors"
            element={<AdminManageInstructors />}
          />
          <Route
            path="/dashboard/manage-awards"
            element={<AdminManageAwards />}
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
};

export default Router;
