import { NavigationHeader, ThemedBackground } from "@/src/components";
import { UIImage, UIInput } from "@/src/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { useCreatePost } from "@/src/hooks/post/useCreatePost";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function AddNewPostScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams();
  const [caption, setCaption] = useState("");
  const { sharePost, isCreating } = useCreatePost();

  const isMultiImages = Array.isArray(imageUri);
  const singleImageUri = isMultiImages ? undefined : (imageUri as string);

  const onCancel = useCallback(() => {
    router.back();
  }, [router]);

  const onShare = useCallback(() => {
    if (singleImageUri) {
      sharePost({ imageUri: singleImageUri, caption });
    }
  }, [singleImageUri, caption, sharePost]);

  return (
    <ThemedBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <NavigationHeader
          title="New Post"
          onLeftAction={onCancel}
          onRightAction={onShare}
          rightActionLabel="Share"
          isLoading={isCreating}
        />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.imageWrapper}>
            {!isMultiImages && singleImageUri && (
              <UIImage
                size="post"
                isAspectRatio={true}
                imageUrl={singleImageUri}
              />
            )}
          </View>

          <UIInput
            placeholder="Write a caption..."
            value={caption}
            onChangeText={setCaption}
            multiline
            style={styles.captionInput}
            containerStyle={styles.inputContainer}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    paddingBottom: theme.utils.vs(40),
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: theme.colors.backgroundSubtle,
  },
  inputContainer: {
    paddingHorizontal: theme.utils.s(16),
    marginTop: theme.utils.vs(16),
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  captionInput: {
    fontSize: theme.utils.s(16),
    color: theme.colors.primaryText,
    minHeight: theme.utils.vs(100),
    textAlignVertical: "top",
  },
}));
