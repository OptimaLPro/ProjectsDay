import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

export const useUserEmails = () => {
  return useQuery({
    queryKey: ["user-emails"],
    queryFn: async () => {
      const { data } = await api.get("/auth/emails");
      return data; // [{ _id, email, name, image, internship, year }]
    },
    staleTime: 1000 * 60 * 60,
  });
};
