import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const AvatarProfile = () => {
  return (
    <Avatar className="w-9 h-9 shadow-md cursor-pointer ">
      <AvatarImage />
      <AvatarFallback className="bg-zinc-400">
        <User />
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarProfile;
