import { useQuery } from "@tanstack/react-query";
import { getInternships } from "@/api/internships";
import { useAuth } from "@/context/AuthContext";

export const useInternships = () => {
  const { year } = useAuth();

  return useQuery({
    queryKey: ["internships", year],
    enabled: !!year,
    queryFn: async () => {
      const data = await getInternships(year);

      return [
        {
          _id: "all",
          name: "All",
          years: [year],
        },
        ...data,
      ];
    },
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });
};
