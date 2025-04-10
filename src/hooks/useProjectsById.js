import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/api/projects";

export const useProjectById = (id) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
};
