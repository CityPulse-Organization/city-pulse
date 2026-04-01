import { BlurButton } from "@/src/components/BlurButton";
import { ImagesCarousel } from "@/src/components/post-details/ImagesCarousel";
import {
  UIButton,
  UIKeyboardAvoidingScrollView,
  UIText,
} from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { ThemedBackground } from "@/src/components";
import { UIInput } from "@/src/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { StyleSheet } from "react-native-unistyles";
import { SaveButton } from "@/src/components/SaveButton";

export default function AddNewPostScreen() {
  const router = useRouter();
  const { uris } = useLocalSearchParams<{ uris: string }>();

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
  const [isLoading, setIsLoading] = useState(false);

  const onCancel = useCallback(() => {
    router.back();
  }, [router]);

  const onPost = () => {
    setIsLoading(true);
    try {
      // TODO: call API to create post
      router.push("/(tabs)/profile");
    } finally {
      setIsLoading(false);
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
            containerStyle={styles.locationContainer}
          />

          <UIInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            returnKeyType="done"
            containerStyle={styles.descriptionContainer}
            inputStyle={styles.descriptionInput}
          />
        </View>

      </UIKeyboardAvoidingScrollView>

      <SaveButton label="Post" onPress={onPost} isLoading={isLoading} />
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
    paddingTop: theme.utils.vs(36),
    gap: theme.utils.vs(16),
  },

  locationContainer: {
    backgroundColor: theme.colors.backgroundSubtle,
    borderBottomWidth: 0,
    borderRadius: theme.utils.s(12),
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    paddingHorizontal: theme.utils.s(14),
  },

  locationIcon: {
    height: theme.utils.s(20),
    color: theme.colors.muted,
  },

  descriptionContainer: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.backgroundSubtle,
    borderBottomWidth: 0,
    borderRadius: theme.utils.s(12),
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    paddingHorizontal: theme.utils.s(14),
  },

  descriptionInput: {
    minHeight: theme.utils.vs(120),
  },
}));
