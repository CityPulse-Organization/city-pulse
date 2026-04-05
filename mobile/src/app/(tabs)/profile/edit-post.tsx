import { ThemedBackground } from "@/src/components";
import { UIInput, UIText } from "@/src/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import { usePost } from "@/src/hooks/post/usePost";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { NavigationHeader } from "@/src/components/NavigationHeader";

export default function EditPostScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const postId = Number(id);

  const { post, isPostLoading, editPost, isEditing } = usePost(postId);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    if (post?.caption) {
      setCaption(post.caption);
    }
  }, [post?.caption]);

  const onCancel = useCallback(() => {
    router.back();
  }, [router]);

  const onSave = useCallback(() => {
    editPost(caption);
  }, [caption, editPost, router]);

  if (isPostLoading) {
    return (
      <ThemedBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={styles.loader.color} />
        </View>
      </ThemedBackground>
    );
  }

  return (
    <ThemedBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <NavigationHeader
          title="Edit Post"
          onLeftAction={onCancel}
          onRightAction={onSave}
          rightActionLabel="Done"
          isLoading={isEditing}
        />
        <ScrollView contentContainerStyle={styles.content}>
          <UIText size="sm" weight="bold" style={styles.label}>
            Caption
          </UIText>
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
    padding: theme.utils.s(16),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    color: theme.colors.accent,
  },
  label: {
    color: theme.colors.muted,
    marginBottom: theme.utils.vs(8),
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.backgroundSubtle,
    borderRadius: theme.utils.ms(8),
    paddingHorizontal: theme.utils.s(12),
  },
  captionInput: {
    fontSize: theme.utils.s(16),
    color: theme.colors.primaryText,
    minHeight: theme.utils.vs(120),
    textAlignVertical: "top",
    paddingTop: theme.utils.vs(12),
  },
}));
