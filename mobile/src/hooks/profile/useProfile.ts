import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getFollowers,
  getFollowing,
  getMyProfile,
  getPostsByUserId,
} from "@/src/api";
import { useSession } from "@/src/hoc";
import { useCallback, useMemo } from "react";
import type { DiscoverUser, PostItem, PostResponse } from "@/src/types";

import { getUserProfile } from "@/src/api/user";
import { formatPrettyDate } from "@/src/utils";

export const useProfile = (userId?: string) => {
  const { session } = useSession();
  const sessionUserId = session.user?.id;
  const targetUserId = userId || sessionUserId;

  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
    isRefetching: isRefetchingProfile,
  } = useQuery({
    queryKey: ["profile", targetUserId],
    queryFn: () => (userId ? getUserProfile(userId) : getMyProfile()),
    enabled: !!targetUserId,
  });

  const {
    data: postsData,
    isLoading: isPostsLoading,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPostsPage,
    isFetchingNextPage: isFetchingNextPosts,
    refetch: refetchPosts,
    isRefetching: isRefetchingPosts,
  } = useInfiniteQuery({
    queryKey: ["userPosts", targetUserId],
    queryFn: ({ pageParam = 0 }) => getPostsByUserId(targetUserId!, pageParam),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.page.number;
      if (currentPage + 1 >= lastPage.page.totalPages) return undefined;
      return currentPage + 1;
    },
    initialPageParam: 0,
    enabled: !!targetUserId,
    retry: false,
  });

  const posts: PostItem[] = useMemo(() => {
    if (!postsData?.pages) return [];
    return postsData.pages.flatMap((page) =>
      page.content.map((post: PostResponse) => ({
        id: String(post.id),
        username: profile?.username ?? "",
        accidentTime: formatPrettyDate(post.createdAt),
        imagesUrl: [post.imageUrl],
        description: post.caption ?? undefined,
        location: "",
        likeCount: post.likeCount,
        commentCount: post.commentCount,
      })),
    );
  }, [postsData, profile]);

  const {
    data: followersData,
    fetchNextPage: fetchNextFollowers,
    hasNextPage: hasNextFollowersPage,
    isFetchingNextPage: isFetchingNextFollowers,
    refetch: refetchFollowers,
    isRefetching: isRefetchingFollowers,
  } = useInfiniteQuery({
    queryKey: ["followers", targetUserId],
    queryFn: ({ pageParam = 0 }) => getFollowers(targetUserId!, pageParam, 24),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.last) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    enabled: !!targetUserId,
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
    queryKey: ["following", targetUserId],
    queryFn: ({ pageParam = 0 }) => getFollowing(targetUserId!, pageParam, 24),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.last) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    enabled: !!targetUserId,
    retry: false,
  });

  const followers: DiscoverUser[] = useMemo(() => {
    if (!followersData?.pages) return [];
    return followersData.pages.flatMap((page) =>
      page.content.map((u) => ({
        id: u.id,
        username: u.username,
        profileImageUrl: u.avatarUrl ?? "",
        job: u.jobTitle ?? "",
      })),
    );
  }, [followersData]);

  const following: DiscoverUser[] = useMemo(() => {
    if (!followingData?.pages) return [];
    return followingData.pages.flatMap((page) =>
      page.content.map((u) => ({
        id: u.id,
        username: u.username,
        profileImageUrl: u.avatarUrl ?? "",
        job: u.jobTitle ?? "",
      })),
    );
  }, [followingData]);

  const followersCount = followersData?.pages?.[0]?.totalElements ?? 0;
  const followingCount = followingData?.pages?.[0]?.totalElements ?? 0;
  const postsCount = postsData?.pages?.[0]?.page?.totalElements ?? 0;

  const refetchAll = useCallback(() => {
    refetchProfile();
    refetchPosts();
    refetchFollowers();
    refetchFollowing();
  }, [refetchProfile, refetchPosts, refetchFollowers, refetchFollowing]);

  const isRefetching =
    isRefetchingProfile ||
    isRefetchingPosts ||
    isRefetchingFollowers ||
    isRefetchingFollowing;

  return {
    userId: targetUserId,
    username: profile?.username,
    profile,
    posts,
    postsCount,
    isProfileLoading,
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
