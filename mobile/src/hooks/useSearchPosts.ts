import { useInfiniteQuery } from "@tanstack/react-query";
import { searchPosts } from "../api/post";

export const useSearchPosts = (caption?: string, size: number = 20) => {
  return useInfiniteQuery({
    queryKey: ["posts", "search", caption],
    queryFn: ({ pageParam = 0 }) => searchPosts(caption, pageParam, size),
    getNextPageParam: (lastPage) => {
      if (lastPage.page && lastPage.page.number < lastPage.page.totalPages - 1) {
        return lastPage.page.number + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};
