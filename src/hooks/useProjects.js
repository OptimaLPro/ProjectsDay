import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getProjects } from "@/api/projects";
import { useAuth } from "@/context/AuthContext";

// export const useProjects = () => {
//   const { year } = useAuth();

//   return useInfiniteQuery({
//     queryKey: ["projects", year],
//     enabled: !!year,
//     queryFn: ({ pageParam = 0 }) => getProjects(pageParam, year),
//     getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
//     refetchOnWindowFocus: false,
//     staleTime: 1000 * 60 * 60,
//   });
// };

export const useProjects = (searchQuery, activeInternship) => {
  const { year } = useAuth();

  return useInfiniteQuery({
    queryKey: ["projects", year, searchQuery, activeInternship],
    enabled: !!year,
    queryFn: ({ pageParam = 0 }) =>
      getProjects(pageParam, year, searchQuery, activeInternship),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};
