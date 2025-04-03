import { getInternships } from "@/api/internships";
import { useQuery } from "@tanstack/react-query";

export const useInternships = () => {
  return useQuery({
    queryKey: ["internships"],
    queryFn: getInternships,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
};
