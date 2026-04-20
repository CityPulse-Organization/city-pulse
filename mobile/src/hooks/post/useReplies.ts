import { useInfiniteQuery } from "@tanstack/react-query";
import { getReplies } from "@/src/api";
import { CommentResponse } from "@/src/types";
import { useMemo } from "react";

export const useReplies = (commentId: number) => {
  const enabled = !isNaN(commentId);

  const {
    data: repliesData,
    isLoading: isRepliesLoading,
    fetchNextPage: fetchNextReplies,
    hasNextPage: hasNextRepliesPage,
    isFetchingNextPage: isFetchingNextReplies,
  } = useInfiniteQuery({
    queryKey: ["replies", commentId],
    queryFn: ({ pageParam = 0 }) => getReplies(commentId, pageParam),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.page.number;
      if (currentPage + 1 >= lastPage.page.totalPages) return undefined;
      return currentPage + 1;
    },
    initialPageParam: 0,
    enabled,
  });

  const replies: CommentResponse[] = useMemo(() => {
    if (!repliesData?.pages) return [];
    return repliesData.pages.flatMap((page) => page.content);
  }, [repliesData]);

  return {
    replies,
    isRepliesLoading,
    fetchNextReplies,
    hasNextRepliesPage,
    isFetchingNextReplies,
  };
};
