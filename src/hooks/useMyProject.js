import { checkMyProject } from "@/api/projects";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export const useMyProject = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["myProject"],
    queryFn: checkMyProject,
    enabled: !!user,
    refetchOnWindowFocus: false,
  });
};
