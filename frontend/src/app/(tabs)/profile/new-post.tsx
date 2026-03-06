import { NavigationHeader, ThemedBackground } from "@/src/components";
import { UIImage } from "@/src/ui";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AddNewPostScreen() {
  const router = useRouter();

  const { imageUri } = useLocalSearchParams();

  const isMultiImages = Array.isArray(imageUri);

  const onCancel = () => {
    router.back();
  };

  const onShare = () => {
    router.navigate("/(tabs)/profile");
  };
  return (
    <ThemedBackground>
      <NavigationHeader
        title="New Post"
        onLeftAction={onCancel}
        onRightAction={onShare}
        rightActionLabel="Share"
      />
      {!isMultiImages && (
        <UIImage size="post" isAspectRatio={true} imageUrl={imageUri} />
      )}
    </ThemedBackground>
  );
}
