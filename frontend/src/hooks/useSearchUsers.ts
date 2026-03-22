import { useInfiniteQuery } from "@tanstack/react-query";
import { searchUsers } from "../api/user";

export const useSearchUsers = (username: string) => {
  return useInfiniteQuery({
    queryKey: ["users", "search", username],
    queryFn: ({ pageParam = 0 }) => searchUsers(username, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.last) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
  });
};
