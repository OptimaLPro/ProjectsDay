import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";
import { useNavigate } from "react-router";

const AvatarProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer border border-gray-300">
          {user ? (
            <>
              <AvatarImage src="" alt={user.email} />
              <AvatarFallback>
                {user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <User className="h-5 w-5 text-gray-500" />
            </div>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 text-center">
        {user ? (
          <>
            <div className="text-sm py-2 text-gray-500">{user.email}</div>
            <DropdownMenuItem
              className=" cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarProfile;
