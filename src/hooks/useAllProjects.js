import api from "@/api/api";
import { useQuery } from "@tanstack/react-query";

const useAllProjects = () => {
  return useQuery({
    queryKey: ["all-projects"],
    queryFn: () => api.get("/projects/all").then((res) => res.data),
  });
};

export default useAllProjects;
