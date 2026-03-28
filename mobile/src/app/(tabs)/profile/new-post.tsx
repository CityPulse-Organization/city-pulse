import { ThemedBackground } from "@/src/components";
import { BlurButton } from "@/src/components/BlurButton";
import { ImagesCarousel } from "@/src/components/post-details/ImagesCarousel";
import {
  UIButton,
  UIInput,
  UIKeyboardAvoidingScrollView,
  UIText,
} from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

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

  const onCancel = () => {
    router.back();
  };

  const onPost = () => {
    router.back();
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

      <View style={styles.buttonWrapper}>
        <UIButton onPress={onPost} style={styles.postButton}>
          <LinearGradient
            colors={[
              styles.gradientStart.backgroundColor,
              styles.gradientEnd.backgroundColor,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.postButtonGradient}
          >
            <UIText weight="bold" size="md" style={styles.postButtonText}>
              Post
            </UIText>
          </LinearGradient>
        </UIButton>
      </View>
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
    borderRadius: theme.utils.s(12),
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    paddingHorizontal: theme.utils.s(14),
  },

  descriptionInput: {
    minHeight: theme.utils.vs(120),
  },


  buttonWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.utils.s(16),
    paddingBottom: Math.max(rt.insets.bottom, theme.utils.vs(16)),
    paddingTop: theme.utils.vs(12),
  },

  postButton: {
    borderRadius: theme.utils.s(14),
    overflow: "hidden",
  },

  postButtonGradient: {
    paddingVertical: theme.utils.vs(16),
    borderRadius: theme.utils.s(14),
    alignItems: "center",
    justifyContent: "center",
  },

  postButtonText: {
    color: theme.colors.primaryText,
    letterSpacing: 0.5,
  },

  gradientStart: {
    backgroundColor: theme.colors.mutedAccent,
  },
  gradientEnd: {
    backgroundColor: theme.colors.accent,
  },
}));
