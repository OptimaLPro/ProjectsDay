import React, { useState } from "react";
import { Button } from "../ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-primary text-primary-foreground py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <img src="/images/logo.png" alt="Logo" className="h-15 w-auto" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Project Showcase</h1>

              <p className="text-primary-foreground/80 mt-1">
                Discover amazing student projects
              </p>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-primary-foreground focus:outline-none"
            >
              ☰
            </button>
          </div>
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:flex items-center gap-2`}
          >
            <Button variant="secondary">Home</Button>
            <Button variant="secondary">Instructors</Button>
            <Button variant="secondary">Internships</Button>
            <Button variant="secondary" className="font-bold">
              Winners Projects
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
