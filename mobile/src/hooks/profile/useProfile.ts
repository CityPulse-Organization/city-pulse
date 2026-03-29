import { useInfiniteQuery } from "@tanstack/react-query";
import { getFollowers, getFollowing, getPostsByUserId } from "@/src/api";
import { useSession } from "@/src/hoc";
import { useCallback, useMemo } from "react";
import type { DiscoverUser, PostItem, PostResponse } from "@/src/types";

export const useProfile = () => {
  const { session } = useSession();
  const userId = session.user?.id;

  const {
    data: postsData,
    isLoading: isPostsLoading,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPostsPage,
    isFetchingNextPage: isFetchingNextPosts,
    refetch: refetchPosts,
    isRefetching: isRefetchingPosts,
  } = useInfiniteQuery({
    queryKey: ["userPosts", userId],
    queryFn: ({ pageParam = 0 }) => getPostsByUserId(userId!, pageParam),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.page.number;
      if (currentPage + 1 >= lastPage.page.totalPages) return undefined;
      return currentPage + 1;
    },
    initialPageParam: 0,
    enabled: !!userId,
    retry: false,
  });

  const posts: PostItem[] = useMemo(() => {
    if (!postsData?.pages) return [];
    return postsData.pages.flatMap((page) =>
      page.content.map((p: PostResponse) => ({
        id: String(p.id),
        username: String(p.userId),
        accidentTime: new Date(p.createdAt).toLocaleDateString(),
        imagesUrl: [p.imageUrl],
        description: p.caption ?? undefined,
        location: "",
        likeCount: p.likeCount,
        commentCount: p.commentCount,
      })),
    );
  }, [postsData]);

  const {
    data: followersData,
    fetchNextPage: fetchNextFollowers,
    hasNextPage: hasNextFollowersPage,
    isFetchingNextPage: isFetchingNextFollowers,
    refetch: refetchFollowers,
    isRefetching: isRefetchingFollowers,
  } = useInfiniteQuery({
    queryKey: ["followers", userId],
    queryFn: ({ pageParam = 0 }) => getFollowers(userId!, pageParam, 24),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.last) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    enabled: !!userId,
    retry: false,
  });

  const {
    data: followingData,
    fetchNextPage: fetchNextFollowing,
    hasNextPage: hasNextFollowingPage,
    isFetchingNextPage: isFetchingNextFollowing,
    refetch: refetchFollowing,
    isRefetching: isRefetchingFollowing,
  } = useInfiniteQuery({
    queryKey: ["following", userId],
    queryFn: ({ pageParam = 0 }) => getFollowing(userId!, pageParam, 24),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.last) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    enabled: !!userId,
    retry: false,
  });

  const followers: DiscoverUser[] = useMemo(() => {
    if (!followersData?.pages) return [];
    return followersData.pages.flatMap((page) =>
      page.content.map((u) => ({
        id: u.id,
        username: u.username,
        profileImageUrl: "",
        job: "",
      })),
    );
  }, [followersData]);

  const following: DiscoverUser[] = useMemo(() => {
    if (!followingData?.pages) return [];
    return followingData.pages.flatMap((page) =>
      page.content.map((u) => ({
        id: u.id,
        username: u.username,
        profileImageUrl: "",
        job: "",
      })),
    );
  }, [followingData]);

  const followersCount = followersData?.pages?.[0]?.totalElements ?? 0;
  const followingCount = followingData?.pages?.[0]?.totalElements ?? 0;
  const postsCount = postsData?.pages?.[0]?.page?.totalElements ?? 0;

  const refetchAll = useCallback(() => {
    refetchPosts();
    refetchFollowers();
    refetchFollowing();
  }, [refetchPosts, refetchFollowers, refetchFollowing]);

  const isRefetching =
    isRefetchingPosts || isRefetchingFollowers || isRefetchingFollowing;

  return {
    userId,
    posts,
    postsCount,
    isPostsLoading,
    fetchNextPosts,
    hasNextPostsPage,
    isFetchingNextPosts,
    followers,
    followersCount,
    fetchNextFollowers,
    hasNextFollowersPage,
    isFetchingNextFollowers,
    following,
    followingCount,
    fetchNextFollowing,
    hasNextFollowingPage,
    isFetchingNextFollowing,
    refetchAll,
    isRefetching,
  };
};
