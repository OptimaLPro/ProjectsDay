import Home from "@/pages/Home/Home";
import React from "react";
import { Route, Routes } from "react-router";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects/:id" element={<div>Project Details</div>} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default Router;
