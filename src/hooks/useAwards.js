import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

export const useAwards = () => {
  return useQuery({
    queryKey: ["awards"],
    queryFn: async () => {
      const { data } = await api.get("/awards");
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
};
