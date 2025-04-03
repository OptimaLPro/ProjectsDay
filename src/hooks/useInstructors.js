import { getInstructors } from "@/api/instructors";
import { useQuery } from "@tanstack/react-query";

export const useInstructors = () => {
  return useQuery({
    queryKey: ["instructors"],
    queryFn: getInstructors,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
};
