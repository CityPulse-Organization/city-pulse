import { Comment, CommentProps, IconInfo } from "@/src/components";
import { UIImage, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

const MOCK_COMMENTS: CommentProps[] = [
  {
    username: "kyrylo",
    commentText: "Looks serious. Hope everyone is ok.",
  },
  {
    username: "alex",
    commentText: "Any updates? Which street is blocked?",
  },
  {
    username: "maria",
    commentText: "Thanks for sharing. Stay safe!",
  },
];

export default function PostDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const imageUrl = params.imageUrl as string;
  const description = params.description as string;
  const username = params.username as string;
  const profileImageUrl = params.profileImageUrl as string;
  const accidentTime = params.accidentTime as string;
  const isBroadcasting = params.isBroadcasting === "true";

  const comments = useMemo(() => MOCK_COMMENTS, []);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        bounces={false}
      >
        <View style={styles.imageContainer}>
          <UIImage
            imageUrl={imageUrl}
            isAspectRatio={false}
            style={styles.headerImage}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0)", "rgba(23,23,23,1)"]}
            locations={[0, 0.4, 1]}
            style={styles.gradient}
          />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.userInfoWrapper}>
            <IconInfo
              profileImageUrl={profileImageUrl}
              username={username}
              statusText={accidentTime}
              isBroadCasting={isBroadcasting}
            />
          </View>

          {!!description && (
            <View style={styles.descriptionCard}>
              <UIText style={styles.descriptionText}>{description}</UIText>
            </View>
          )}

          <View style={styles.commentsSection}>
            <View style={styles.commentsHeader}>
              <UIText size="lg" style={styles.commentsHeaderText}>
                Comments
              </UIText>
              <View style={styles.commentsBadge}>
                <UIText size="sm" style={styles.commentsBadgeText}>
                  {comments.length}
                </UIText>
              </View>
            </View>

            <View style={styles.commentsList}>
              {comments.map((c, idx) => (
                <Comment
                  key={`${c.username}-${idx}`}
                  username={c.username}
                  commentText={c.commentText}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Back Button */}
      <View style={styles.backButtonContainer}>
        <Pressable onPress={() => router.back()}>
          <BlurView intensity={30} tint="dark" style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </BlurView>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  contentContainerStyle: {
    paddingBottom: rt.insets.bottom + theme.utils.s(40),
  },

  container: {
    flex: 1,
    backgroundColor: "rgba(23,23,23,1)", // match theme generally or use theme color
  },
  imageContainer: {
    width: "100%",
    height: theme.utils.s(450),
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    paddingHorizontal: theme.utils.s(20),
    marginTop: -theme.utils.s(40),
  },
  userInfoWrapper: {
    marginBottom: theme.utils.s(20),
  },
  descriptionCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: theme.utils.s(20),
    borderRadius: theme.utils.ms(22),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: theme.utils.s(32),
  },
  descriptionText: {
    color: "#ffffff",
    fontSize: theme.utils.ms(16),
    lineHeight: theme.utils.ms(26),
    letterSpacing: 0.3,
    opacity: 0.95,
  },
  commentsSection: {
    paddingHorizontal: theme.utils.s(4),
  },
  commentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(12),
    marginBottom: theme.utils.s(20),
  },
  commentsHeaderText: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  commentsBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: theme.utils.s(10),
    paddingVertical: theme.utils.s(4),
    borderRadius: 999,
  },
  commentsBadgeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  commentsList: {
    gap: theme.utils.s(24),
  },
  backButtonContainer: {
    position: "absolute",
    left: theme.utils.s(20),
    zIndex: 10,
    top: Math.max(rt.insets.top, theme.utils.s(10)),
  },
  backButton: {
    width: theme.utils.s(44),
    height: theme.utils.s(44),
    borderRadius: theme.utils.s(22),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
}));
