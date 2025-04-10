import { useQuery } from "@tanstack/react-query";
import { getInstructors } from "@/api/instructors";
import { useAuth } from "@/context/AuthContext";

export const useInstructors = () => {
  const { year } = useAuth();

  return useQuery({
    queryKey: ["instructors", year],
    enabled: !!year,
    queryFn: () => getInstructors(year),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
};
