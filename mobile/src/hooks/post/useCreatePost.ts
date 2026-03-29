import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, uploadFile } from "@/src/api";
import { useRouter } from "expo-router";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    mutate: sharePost,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: async ({
      imageUri,
      caption,
    }: {
      imageUri: string;
      caption?: string;
    }) => {
      const imageUrl = await uploadFile(imageUri);
      return createPost(imageUrl, caption);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      router.replace("/(tabs)/profile");
    },
  });

  return {
    sharePost,
    isCreating,
    error,
  };
};
