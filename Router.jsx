import Home from "@/pages/Home/Home";
import Instructors from "@/pages/Instructors/Instructors";
import Project from "@/pages/Project/Project";
import React, { useEffect } from "react";
import { Route, Routes } from "react-router";
import { Login } from "@/pages/Login/Login";
import AddProject from "@/pages/AddProject/AddProject";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Register from "@/pages/Register/Register";
import UpdateProject from "@/pages/UpdateProject/UpdateProject";

const Router = () => {
  useEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-5 lg:py-12">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects/:id" element={<Project />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/add-project" element={<AddProject />} />
        <Route path="/dashboard/update-project" element={<UpdateProject />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
};

export default Router;
