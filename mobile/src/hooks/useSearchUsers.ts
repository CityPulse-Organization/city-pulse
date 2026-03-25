import { useInfiniteQuery } from "@tanstack/react-query";
import { searchUsers } from "@/src/api";

export const useSearchUsers = (username: string, sort?: string | string[]) => {
  return useInfiniteQuery({
    queryKey: ["users", "search", username, sort],
    queryFn: ({ pageParam = 0 }) => searchUsers(username, pageParam, 24, sort),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.last) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
  });
};
