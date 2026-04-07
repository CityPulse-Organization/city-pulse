import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, uploadFile } from "@/src/api";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import * as Haptics from 'expo-haptics';

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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      Toast.show({
        type: "success",
        text1: "Post Shared",
        text2: "Your post has been successfully sharing",
      });
      router.replace("/(tabs)/profile");
    },
    onError: (err) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      Toast.show({
        type: "error",
        text1: "Failed to Share Post",
        text2: err.message,
      });
    },
  });

  return {
    sharePost,
    isCreating,
    error,
  };
};
