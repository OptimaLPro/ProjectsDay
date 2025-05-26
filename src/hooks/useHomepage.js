import { useQuery } from "@tanstack/react-query";
import { getHomepageData } from "@/api/homepage";

export const useHomepage = () => {
  return useQuery({
    queryKey: ["homepage"],
    queryFn: getHomepageData,
    refetchOnWindowFocus: false,
  });
};
