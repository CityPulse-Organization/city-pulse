import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser } from "@/src/api";
import { useSession } from "@/src/hoc";
import { useCallback, useEffect, useState } from "react";

export const useFollow = (targetUserId: string) => {
  const { session } = useSession();
  const userId = session.user?.id;
  const queryClient = useQueryClient();

  const followingData = queryClient.getQueryData<any>(["following", userId]);
  
  const initiallyFollowing = followingData?.pages?.some((page: any) =>
    page.content.some((u: any) => u.id === targetUserId)
  ) || false;

  const [isFollowing, setIsFollowing] = useState(initiallyFollowing);

  useEffect(() => {
    setIsFollowing(initiallyFollowing);
  }, [initiallyFollowing]);

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["followers"] });
    queryClient.invalidateQueries({ queryKey: ["following"] });
  }, [queryClient]);

  const { mutate: follow, isPending: isFollowPending } = useMutation({
    mutationFn: () => followUser(targetUserId),
    onMutate: () => setIsFollowing(true),
    onError: () => setIsFollowing(false),
    onSuccess: invalidateQueries,
  });

  const { mutate: unfollow, isPending: isUnfollowPending } = useMutation({
    mutationFn: () => unfollowUser(targetUserId),
    onMutate: () => setIsFollowing(false),
    onError: () => setIsFollowing(true),
    onSuccess: invalidateQueries,
  });

  const toggleFollow = useCallback(() => {
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  }, [isFollowing, follow, unfollow]);

  const isSelf = userId === targetUserId;
  const isPending = isFollowPending || isUnfollowPending;

  return {
    isFollowing,
    toggleFollow,
    isPending,
    isSelf,
  };
};
