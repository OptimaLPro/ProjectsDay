import api from "@/api/api";
import { useQuery } from "@tanstack/react-query";

export const useYearbooks = () => {
  return useQuery({
    queryKey: ["yearbooks"],
    queryFn: () => api.get("/yearbooks").then((res) => res.data),
  });
};
