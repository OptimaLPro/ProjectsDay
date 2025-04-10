import { useQuery } from "@tanstack/react-query";
import { getInstructorById } from "@/api/instructors";

export const useInstructorById = (id) => {
  return useQuery({
    queryKey: ["instructor", id],
    enabled: !!id,
    queryFn: () => getInstructorById(id),
    staleTime: 1000 * 60 * 60,
  });
};
