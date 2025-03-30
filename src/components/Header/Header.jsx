import React, { useState } from "react";
import { Button } from "../ui/button";
import { Briefcase, Crown, House, Users } from "lucide-react";
import HeaderButton from "./HeaderButton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#ffffffc4] py-2 z-10 text-[#131313] relative rounded-[40px] mx-20 px-2 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <img src="/images/logo.png" alt="Logo" className="h-14 w-auto" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Projects Day</h1>
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
            } md:flex items-center gap-3`}
          >
            <HeaderButton name="Home" icon={<House />} />
            <HeaderButton name="Projects" icon={<Briefcase />} />
            <HeaderButton name="Instructors" icon={<Users />} />
            <HeaderButton name="Internships" icon={<Briefcase />} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
