import api from "@/api/api";
import { useQuery } from "@tanstack/react-query";

export const useActiveYearbook = () => {
  return useQuery({
    queryKey: ["active-yearbook"],
    queryFn: () => api.get("/yearbooks/active").then((res) => res.data),
  });
};
