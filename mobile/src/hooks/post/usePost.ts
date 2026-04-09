import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getPostById,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  getComments,
  getReplies,
  createComment,
  deleteComment,
  updatePostCaption,
  deletePost as apiDeletePost,
  likeComment,
  unlikeComment,
} from "@/src/api";
import type { CommentResponse, PostResponse } from "@/src/types";
import { useRouter } from "expo-router";
import { useMemo } from "react";

export const usePost = (postId: number) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const enabled = !isNaN(postId);

  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
    enabled,
  });

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    fetchNextPage: fetchNextComments,
    hasNextPage: hasNextCommentsPage,
    isFetchingNextPage: isFetchingNextComments,
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = 0 }) => getComments(postId, pageParam),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.page.number;
      if (currentPage + 1 >= lastPage.page.totalPages) return undefined;
      return currentPage + 1;
    },
    initialPageParam: 0,
    enabled,
  });

  const comments: CommentResponse[] = useMemo(() => {
    if (!commentsData?.pages) return [];
    return commentsData.pages.flatMap((page) => page.content);
  }, [commentsData]);

  const { mutate: toggleLike } = useMutation({
    mutationFn: (isCurrentlyLiked: boolean) =>
      isCurrentlyLiked ? unlikePost(postId) : likePost(postId),
    onMutate: async (isCurrentlyLiked) => {
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      const previous = queryClient.getQueryData<PostResponse>(["post", postId]);

      queryClient.setQueryData<PostResponse>(["post", postId], (old) => {
        if (!old) return old;
        return {
          ...old,
          likeCount: isCurrentlyLiked ? old.likeCount - 1 : old.likeCount + 1,
          isLikedByMe: !isCurrentlyLiked,
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["post", postId], context.previous);
      }
    },
  });

  const { mutate: toggleSave } = useMutation({
    mutationFn: (isCurrentlySaved: boolean) =>
      isCurrentlySaved ? unsavePost(postId) : savePost(postId),
    onMutate: async (isCurrentlySaved) => {
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      const previous = queryClient.getQueryData<PostResponse>(["post", postId]);

      queryClient.setQueryData<PostResponse>(["post", postId], (old) => {
        if (!old) return old;
        return {
          ...old,
          isSavedByMe: !isCurrentlySaved,
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["post", postId], context.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },
  });

  const { mutate: sendComment } = useMutation({
    mutationFn: (text: string) => createComment(postId, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const { mutate: sendReply } = useMutation({
    mutationFn: ({ text, parentId }: { text: string; parentId: number }) =>
      createComment(postId, { text, parentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const { mutate: removeComment } = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const { mutate: editPost, isPending: isEditing } = useMutation({
    mutationFn: (caption: string) => updatePostCaption(postId, caption),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      router.back();
    },
  });

  const { mutate: removePost, isPending: isDeleting } = useMutation({
    mutationFn: () => apiDeletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      router.back();
    },
  });

  const { mutate: toggleCommentLike } = useMutation({
    mutationFn: ({
      commentId,
      isCurrentlyLiked,
    }: {
      commentId: number;
      isCurrentlyLiked: boolean;
    }) => (isCurrentlyLiked ? unlikeComment(commentId) : likeComment(commentId)),
    onSuccess: (_, { commentId, isCurrentlyLiked }) => {
      const update = (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((p: any) => ({
            ...p,
            content: p.content.map((c: any) =>
              c.id === commentId
                ? {
                    ...c,
                    isLikedByMe: !isCurrentlyLiked,
                    likeCount: isCurrentlyLiked
                      ? c.likeCount - 1
                      : c.likeCount + 1,
                  }
                : c,
            ),
          })),
        };
      };

      queryClient.setQueryData(["comments", postId], update);
      queryClient.setQueriesData({ queryKey: ["replies"] }, update);
    },
  });

  return {
    post,
    isPostLoading,
    comments,
    isCommentsLoading,
    fetchNextComments,
    hasNextCommentsPage,
    isFetchingNextComments,
    toggleLike,
    toggleSave,
    sendComment,
    sendReply,
    toggleCommentLike,
    removeComment,
    editPost,
    isEditing,
    removePost,
    isDeleting,
  };
};

export const useCommentReplies = (commentId: number, enabled: boolean) => {
  return useInfiniteQuery({
    queryKey: ["replies", commentId],
    queryFn: ({ pageParam = 0 }) => getReplies(commentId, pageParam),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.page.number;
      if (currentPage + 1 >= lastPage.page.totalPages) return undefined;
      return currentPage + 1;
    },
    initialPageParam: 0,
    enabled: enabled && !isNaN(commentId),
  });
};
