import { BlurButton } from "@/src/components/BlurButton";
import { ImagesCarousel } from "@/src/components/post-details/ImagesCarousel";
import {
  UIKeyboardAvoidingScrollView,
} from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { ThemedBackground } from "@/src/components";
import { UIInput } from "@/src/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCreatePost } from "@/src/hooks/post/useCreatePost";
import { useState, useCallback } from "react";
import { StyleSheet } from "react-native-unistyles";
import { FooterButton } from "@/src/components/SaveButton";

export default function AddNewPostScreen() {
  const router = useRouter();
  const { uris } = useLocalSearchParams<{ uris: string }>();
  const { sharePost, isCreating } = useCreatePost();

  const imageUris: string[] = (() => {
    try {
      const parsed = JSON.parse(uris ?? "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const onCancel = useCallback(() => {
    router.back();
  }, [router]);

  const onPost = () => {
    if (imageUris.length > 0) {
      sharePost({
        imageUri: imageUris[0], // TODO: Currently API only supports single image
        caption: description,
      });
    }
  };

  return (
    <ThemedBackground style={styles.page}>
      <View style={styles.backButton}>
        <BlurButton onPress={onCancel} iconName="chevron-back" />
      </View>

      <UIKeyboardAvoidingScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <ImagesCarousel imagesUrl={imageUris} location={location} />

        <View style={styles.formContainer}>
          <UIInput
            rightElement={
              <Ionicons
                name="location-outline"
                size={styles.locationIcon.height}
                color={styles.locationIcon.color}
              />
            }
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            returnKeyType="next"
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
          />

          <UIInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            returnKeyType="done"
            containerStyle={[styles.inputContainer, styles.descriptionContainer]}
            inputStyle={[styles.input, styles.descriptionInput]}
          />
        </View>

      </UIKeyboardAvoidingScrollView>

      <FooterButton label="Post" onPress={onPost} isLoading={isCreating} />
    </ThemedBackground>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  page: {
    paddingTop: 0,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: rt.insets.bottom + theme.utils.vs(90),
  },

  backButton: {
    position: "absolute",
    left: theme.utils.s(16),
    zIndex: 10,
    top: Math.max(rt.insets.top, theme.utils.vs(50)),
  },

  formContainer: {
    paddingHorizontal: theme.utils.s(16),
    paddingTop: theme.utils.vs(50),
    gap: theme.utils.vs(16),
  },

  inputContainer: {
    backgroundColor: theme.colors.backgroundSubtle,
    borderBottomWidth: 0,
    borderRadius: theme.utils.s(12),
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    paddingHorizontal: theme.utils.s(14),
  },

  input: {
    paddingVertical: theme.utils.vs(10),
  },

  locationIcon: {
    height: theme.utils.s(20),
    color: theme.colors.muted,
  },

  descriptionContainer: {
    alignItems: "flex-start",
  },

  descriptionInput: {
    minHeight: theme.utils.vs(120),
  },
}));
