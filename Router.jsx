import Home from "@/pages/Home/Home";
import Instructors from "@/pages/Instructors/Instructors";
import React from "react";
import { Route, Routes } from "react-router";

const Router = () => {
  return (
    <div className="pt-5 lg:py-12">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:id" element={<div>Project Details</div>} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
};

export default Router;
