import Home from "@/pages/Home/Home";
import Instructors from "@/pages/Instructors/Instructors";
import Project from "@/pages/Project/Project";
import React, { useEffect } from "react";
import { Route, Routes } from "react-router";
import { Login } from "@/pages/Login/Login";

const Router = () => {
  useEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-5 lg:py-12">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:id" element={<Project />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
};

export default Router;
