import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser } from "@/src/api";
import { useSession } from "@/src/hoc";
import { useCallback, useState } from "react";

export const useFollow = (targetUserId: string) => {
  const { session } = useSession();
  const userId = session.user?.id;
  const queryClient = useQueryClient();

  const [isFollowing, setIsFollowing] = useState(false);

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
