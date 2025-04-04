import { Briefcase, House, LogIn, Users } from "lucide-react";
import { useState } from "react";
import HeaderButton from "./HeaderButton";
import { Link } from "react-router";
import DrawerMenu from "../DrawerMenu/DrawerMenu";
import AvatarProfile from "./AvatarProfile";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#ffffffc4] py-2 z-10 text-[#131313] relative rounded-[40px] px-6 shadow-md container mx-auto">
      <div className="flex items-center lg:flex-row lg:items-center justify-center lg:justify-between gap-4">
        <div className="lg:hidden absolute left-4">
          <DrawerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
        <div className="flex items-center gap-4">
          <div>
            <Link to="/">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="lg:h-14 lg:w-auto h-10 w-10 overflow-auto"
              />
            </Link>
          </div>
          <div className="hidden xs:block">
            <Link to="/">
              <h1 className="text-xl lg:text-3xl font-bold">Projects Day</h1>
            </Link>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-3 lg:justify-end">
          <HeaderButton name="Home" icon={<House />} link="" />
          <HeaderButton
            name="Instructors"
            icon={<Users />}
            link="instructors"
          />
          {!user ? (
            <HeaderButton name="Login" icon={<LogIn />} link="login" />
          ) : (
            <>
              <HeaderButton name="Logout" icon={<LogIn />} link="#" onClick={logout} />
              <div className="hidden lg:block ">
                <AvatarProfile />
              </div>
            </>
          )}
        </div>
        <div className="lg:hidden absolute right-4">
          <AvatarProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;
