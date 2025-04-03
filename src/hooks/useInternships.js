import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

export const useInternships = () => {
  return useQuery({
    queryKey: ["internships"],
    queryFn: async () => {
      const res = await api.get("/internships");
      return res.data;
    },
  });
};