import { NavigationHeader, ThemedBackground } from "@/src/components";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { StyleSheet } from "react-native-unistyles";

export default function AddNewPostScreen() {
  const router = useRouter();

  const { uris } = useLocalSearchParams();

  const onCancel = () => {
    router.back();
  };

  const onShare = () => {
    router.back();
  };
  return (
    <ThemedBackground>
      <NavigationHeader
        title="New Post"
        onLeftAction={onCancel}
        onRightAction={onShare}
        rightActionLabel="Share"
      />
      <Image source={{ uri: uris[0] }} style={styles.image} />
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});
