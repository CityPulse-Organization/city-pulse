import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, uploadFile } from "@/src/api";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";

const DEFAULT_LAT = 51.2465;
const DEFAULT_LON = 22.5684;

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

      let latitude = DEFAULT_LAT;
      let longitude = DEFAULT_LON;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          latitude = loc.coords.latitude;
          longitude = loc.coords.longitude;
        }
      } catch {
        // fallback to defaults
      }

      return createPost(imageUrl, caption, latitude, longitude);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      Toast.show({
        type: "success",
        text1: "Post Shared",
        text2: "Your post has been successfully sharing",
      });
      router.replace("/(tabs)/profile");
    },
    onError: (err) => {
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
