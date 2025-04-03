import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

export const useMyProject = () => {
  return useQuery({
    queryKey: ["myProject"],
    queryFn: async () => {
      const res = await api.get("/projects/mine/check");
      return res.data;
    },
    retry: false, // לא לנסות שוב אם לא מורשה
  });
};
