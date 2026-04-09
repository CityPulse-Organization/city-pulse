import { useInfiniteQuery } from "@tanstack/react-query";
import { getPulsePosts } from "../api/post";

export const usePulse = (search?: string, size: number = 20) => {
  return useInfiniteQuery({
    queryKey: ["posts", "pulse", search],
    queryFn: ({ pageParam = 0 }) => getPulsePosts(search, pageParam, size),
    getNextPageParam: (lastPage) => {
      if (
        lastPage.page &&
        lastPage.page.number < lastPage.page.totalPages - 1
      ) {
        return lastPage.page.number + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};
