import { Briefcase, ChevronDown, House, LogIn, Users } from "lucide-react";
import { useState } from "react";
import HeaderButton from "./HeaderButton";
import { Link } from "react-router";
import DrawerMenu from "../DrawerMenu/DrawerMenu";
import AvatarProfile from "./AvatarProfile";
import { useAuth } from "@/context/AuthContext";
import { SelectYearbookDropDown } from "./SelectYearbookDropDown";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { year } = useAuth();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#ffffffc4] py-2 z-10 text-[#131313] relative rounded-[40px] px-6 shadow-md container mx-auto">
      <div className="flex items-center justify-center gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="absolute lg:hidden left-4">
          <DrawerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
        <div className="flex items-center gap-4">
          <div>
            <Link to="/">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-10 h-10 overflow-auto lg:h-14 lg:w-auto"
              />
            </Link>
          </div>
          <div className="hidden xs:block">
            <Link to="/">
              <div className="flex items-center gap-2">
                <div>
                  <h1 className="hidden text-xl font-bold lg:text-3xl lg:block">
                    Graduation Day {year}
                  </h1>
                  <h1 className="block text-xl font-bold lg:text-3xl lg:hidden">
                    Graduation Day
                  </h1>
                </div>
                <SelectYearbookDropDown />
              </div>
            </Link>
          </div>
        </div>
        <div className="items-center hidden gap-3 lg:flex lg:justify-end">
          <HeaderButton name="Home" icon={<House />} link="" />
          <HeaderButton
            name="Internships"
            icon={<Briefcase />}
            link="internships"
          />
          <HeaderButton
            name="Instructors"
            icon={<Users />}
            link="instructors"
          />
          {!user ? (
            <HeaderButton name="Login" icon={<LogIn />} link="login" />
          ) : (
            <>
              <HeaderButton
                name="Logout"
                icon={<LogIn />}
                link="#"
                onClick={logout}
              />
              <div className="hidden lg:block ">
                <AvatarProfile />
              </div>
            </>
          )}
        </div>
        <div className="absolute lg:hidden right-4">
          <AvatarProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;
