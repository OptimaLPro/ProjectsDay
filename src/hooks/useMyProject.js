import { checkMyProject } from "@/api/projects";
import { useQuery } from "@tanstack/react-query";

export const useMyProject = () => {
  return useQuery({
    queryKey: ["myProject"],
    queryFn: checkMyProject,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
};
