import { useQuery } from "@tanstack/react-query";
import { getUsersByEmails } from "@/api/users";

export const useUsersByEmails = (emails) => {
  return useQuery({
    queryKey: ["users-by-emails", emails],
    enabled: !!emails?.length,
    queryFn: () => getUsersByEmails(emails),
    staleTime: 1000 * 60 * 30,
  });
};
