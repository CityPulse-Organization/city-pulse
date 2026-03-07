import {
  Comment,
  CommentItem,
  Icon,
  IconInfo,
  POSTS,
  ThemedBackground,
} from "@/src/components";
import { moderateScale, scale, UIButton, UIDivider, UIImage, UIText } from "@/src/ui";
import { UIBottomSheet } from "@/src/ui/organisms/UIBottomSheet";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetTextInput,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  ComponentProps,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, ScrollView, View, ViewToken } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from "react-native-unistyles";

export const MOCK_COMMENTS: CommentItem[] = [
  {
    username: "kyrylo",
    commentText: "Looks serious. Hope everyone is ok.",
    timeAgo: "2m ago",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
  },
  {
    username: "alex",
    commentText: "Any updates? Which street is blocked? Anything else?",
    timeAgo: "5m ago",
    profileImageUrl:
      "https://th.bing.com/th/id/OIP.eh5RRJ5l1pqHQDN1ubb1VAHaEx?w=272&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
  },
  {
    username: "maria",
    commentText: "Thanks for sharing. Stay safe!",
    timeAgo: "12m ago",
    profileImageUrl: undefined,
  },
  {
    username: "kyrylo",
    commentText: "Looks serious. Hope everyone is ok.",
    timeAgo: "2m ago",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
  },
  {
    username: "alex",
    commentText: "Any updates? Which street is blocked? Anything else?",
    timeAgo: "5m ago",
    profileImageUrl:
      "https://th.bing.com/th/id/OIP.eh5RRJ5l1pqHQDN1ubb1VAHaEx?w=272&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
  },
  {
    username: "maria",
    commentText: "Thanks for sharing. Stay safe!",
    timeAgo: "12m ago",
    profileImageUrl: undefined,
  },
  {
    username: "kyrylo",
    commentText: "Looks serious. Hope everyone is ok.",
    timeAgo: "2m ago",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
  },
  {
    username: "alex",
    commentText: "Any updates? Which street is blocked? Anything else?",
    timeAgo: "5m ago",
    profileImageUrl:
      "https://th.bing.com/th/id/OIP.eh5RRJ5l1pqHQDN1ubb1VAHaEx?w=272&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
  },
  {
    username: "maria",
    commentText: "Thanks for sharing. Stay safe!",
    timeAgo: "12m ago",
    profileImageUrl: undefined,
  },
  {
    username: "kyrylo",
    commentText: "Looks serious. Hope everyone is ok.",
    timeAgo: "2m ago",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
  },
  {
    username: "alex",
    commentText: "Any updates? Which street is blocked? Anything else?",
    timeAgo: "5m ago",
    profileImageUrl:
      "https://th.bing.com/th/id/OIP.eh5RRJ5l1pqHQDN1ubb1VAHaEx?w=272&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
  },
  {
    username: "maria",
    commentText: "Thanks for sharing. Stay safe!",
    timeAgo: "12m ago",
    profileImageUrl: undefined,
  },
];

export const MOCK_LIKE_COUNT = 12;

type PostElipsisOptionItem = {
  id: string;
  title: string;
  iconName: ComponentProps<typeof Ionicons>["name"];
  color?: string;
  onClick: () => void;
};

const CommentsHeader = () => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.commentsHeaderContainer}>
      <View style={styles.commentsHeader}>
        <Ionicons
          name="chatbubble-outline"
          size={scale(20)}
          color={theme.colors.lightViolet}
        />

        <UIText size="md" weight="normal" style={styles.commentsHeaderText}>
          Comments
        </UIText>

      </View>

      <UIDivider color={theme.colors.commentDividerColor} />
    </View>

  );
};

type CommentsFooterProps = {
  bottomSheetProps: any;
  insetsBottom: number;
  profileImageUrl: string;
};

const CommentsFooter = React.memo(({ bottomSheetProps, insetsBottom, profileImageUrl }: CommentsFooterProps) => {
  const { theme } = useUnistyles();
  const [commentText, setCommentText] = useState("");

  return (
    <BottomSheetFooter {...bottomSheetProps}>
      <View style={styles.footerContainer}>

        <UIDivider height={0.5} />

        <View
          style={[
            styles.commentInputBar,
            { paddingBottom: Math.max(insetsBottom, scale(12)) },
          ]}
        >
          <Icon
            profileImageUrl={profileImageUrl}
            size="comment"
            borderColor="faint"
          />

          <BottomSheetTextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor={theme.colors.faintColor}
            onChangeText={setCommentText}
            value={commentText}
          />

          <UIButton
            style={[
              styles.sendButton,
              commentText.trim()
                ? { backgroundColor: theme.colors.lightViolet }
                : { backgroundColor: theme.colors.inputCommentBackgroundColor },
            ]}
            onPress={() => setCommentText("")}
          >
            <Ionicons
              name="send-outline"
              size={scale(18)}
              color={commentText.trim() ? theme.colors.white : theme.colors.faintColor}
            />
          </UIButton>

        </View>
      </View>
    </BottomSheetFooter>
  );
});

export default function PostDetailScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const postId = params.id as string;
  const isOwnPost = params.isOwnPost === "true";

  const post = POSTS.find((post) => post.id === postId);

  if (!post) {
    return <UIText>Post nie istnieje</UIText>;
  }
  const imagesUrl = post.imagesUrl || [];
  const description = post.description || "";
  const username = post.username;
  const profileImageUrl = post.profileImageUrl || "";
  const accidentTime = post.accidentTime;
  const location = post.location || "";
  const isBroadcasting = post.isBroadcasting;

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const onViewRef = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
  );

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(MOCK_LIKE_COUNT);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(!saved);
  };

  const commentsBottomSheetRef = useRef<BottomSheetModal>(null);
  const handleOpenComments = () => {
    commentsBottomSheetRef.current?.present();
  };

  const renderFooter = useCallback((props: any) => (
    <CommentsFooter
      bottomSheetProps={props}
      insetsBottom={insets.bottom}
      profileImageUrl={profileImageUrl}
    />
  ), [insets.bottom, profileImageUrl]);


  const menuOptions: PostElipsisOptionItem[] = useMemo(() => {
    if (isOwnPost) {
      return [
        {
          id: "edit",
          title: "Edit",
          iconName: "pencil-outline",
          onClick: () => router.navigate("/(tabs)/profile/edit-post"),
        },
        {
          id: "delete",
          title: "Delete",
          iconName: "trash-outline",
          color: "red",
          onClick: () => console.log("Usuwanie posta..."),
        },
      ];
    }

    return [
      {
        id: "share",
        title: "Share",
        iconName: "share-social-outline",
        onClick: () => { },
      },
      {
        id: "report",
        title: "Report",
        iconName: "alert-circle-outline",
        color: "red",
        onClick: function (): void {
          throw new Error("Function not implemented.");
        },
      },
    ];
  }, [isOwnPost, router]);

  const ellipsisBottomSheetRef = useRef<BottomSheetModal>(null);
  const handleOpenEllipsisButton = () => {
    ellipsisBottomSheetRef.current?.present();
  };

  const handleOptionClick = useCallback(
    (callback: () => void) => {
      ellipsisBottomSheetRef.current?.close();
      callback();
    },
    [ellipsisBottomSheetRef],
  );

  const renderOptionItem = useCallback(
    ({ item, index }: { item: PostElipsisOptionItem; index: number }) => {
      const itemColor = item.color ?? theme.colors.lightViolet;
      const textColor = item.color ?? theme.colors.textColor;

      return (
        <View>
          <UIButton
            onPress={() => handleOptionClick(item.onClick)}
            style={styles.ellipseOptionButton}
          >
            <Ionicons color={itemColor} size={24} name={item.iconName} />
            <UIText size="md" style={{ color: textColor }}>
              {item.title}
            </UIText>
          </UIButton>
        </View>
      );
    },
    [theme, handleOptionClick, menuOptions.length],
  );


  return (
    <ThemedBackground style={styles.page} withSafeArea={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        bounces={false}
      >
        <View style={styles.imageContainer}>
          <FlatList
            data={imagesUrl}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            viewabilityConfig={viewConfigRef.current}
            onViewableItemsChanged={onViewRef.current}
            renderItem={({ item }) => (
              <View style={styles.carouselSlide}>
                <UIImage
                  imageUrl={item}
                  isAspectRatio={false}
                  style={styles.headerImage}
                />
              </View>
            )}
          />

          <LinearGradient
            colors={[
              "rgba(0, 0, 0, 0.6)",
              "rgba(0,0,0,0)",
              "rgba(0, 0, 0, 0.8)",
            ]}
            locations={[0.1, 0.4, 1]}
            style={styles.gradient}
            pointerEvents="none"
          />

          <View style={styles.locationContainer} pointerEvents="none">
            <Ionicons
              name="location-outline"
              size={scale(14)}
              color={theme.colors.lightViolet}
            />
            <UIText size="sm" style={styles.locationText}>
              {location}
            </UIText>
          </View>

          <View style={styles.carouselFooter} pointerEvents="none">
            <View style={styles.dotsRow}>
              {imagesUrl.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === activeIndex ? styles.dotActive : styles.dotInactive,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.userInfoRow}>
            <IconInfo
              profileImageUrl={profileImageUrl}
              username={username}
              statusText={accidentTime}
              isBroadCasting={isBroadcasting}
              iconBorderColor="violet"
              usernameWeight="bold"
            />

            <View style={styles.actionsRow}>
              <UIButton onPress={handleLike} style={styles.actionPost}>
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={scale(20)}
                  color={liked ? theme.colors.lightRed : theme.colors.iconColor}
                />
                <UIText weight="normal" style={styles.actionCount}>
                  {likeCount}
                </UIText>
              </UIButton>

              <UIButton onPress={handleOpenComments} style={styles.actionPost}>
                <Ionicons
                  name="chatbubble-outline"
                  size={scale(20)}
                  color={theme.colors.iconColor}
                />
                <UIText style={styles.actionCount}>
                  {MOCK_COMMENTS.length}
                </UIText>
              </UIButton>

              <UIButton onPress={handleSave} style={styles.actionPost}>
                <Ionicons
                  name={saved ? "bookmark" : "bookmark-outline"}
                  size={scale(20)}
                  color={
                    saved ? theme.colors.darkViolet : theme.colors.iconColor
                  }
                />
              </UIButton>
            </View>
          </View>

          {!!description && (
            <BlurView
              intensity={10}
              tint={UnistylesRuntime.themeName}
              style={styles.descriptionCard}
            >
              <UIText size="sm" style={styles.descriptionText}>
                {description}
              </UIText>
            </BlurView>
          )}
        </View>
      </ScrollView>

      <UIBottomSheet
        header={<CommentsHeader />}
        ref={commentsBottomSheetRef}
        snapPoints={["75%", "100%"]}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        topInset={insets.top}
        footerComponent={renderFooter}
      >
        <BottomSheetFlatList
          data={MOCK_COMMENTS}
          keyExtractor={(_: CommentItem, index: number) => index.toString()}
          contentContainerStyle={{ paddingBottom: scale(70), paddingHorizontal: 10 }}
          renderItem={({ item }: { item: CommentItem }) => (
            <Comment comment={item} />
          )}
        />
      </UIBottomSheet>

      <View
        style={[
          styles.backButtonContainer,
          { top: Math.max(insets.top, scale(50)) },
        ]}
      >
        <UIButton onPress={() => router.back()}>
          <BlurView intensity={80} tint="dark" style={styles.backButton}>
            <Ionicons
              name="chevron-back"
              size={20}
              color={theme.colors.white}
            />
          </BlurView>
        </UIButton>
      </View>

      <View
        style={[
          styles.menuButtonContainer,
          { top: Math.max(insets.top, scale(50)) },
        ]}
      >
        <UIButton onPress={handleOpenEllipsisButton}>
          <BlurView intensity={80} tint="dark" style={styles.backButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={theme.colors.white}
            />
          </BlurView>
        </UIButton>
      </View>

      <UIBottomSheet ref={ellipsisBottomSheetRef} snapPoints={["20%"]} >
        <FlashList
          data={menuOptions}
          renderItem={renderOptionItem}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </UIBottomSheet>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  footerContainer: {
    backgroundColor: theme.colors.bottomSheetBackgroundColor,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: theme.utils.s(14),
  },
  commentInputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(10),
    paddingHorizontal: theme.utils.s(10),
  },
  commentInput: {
    flex: 1,
    backgroundColor: theme.colors.inputCommentBackgroundColor,
    borderRadius: 999,
    paddingHorizontal: theme.utils.s(16),
    paddingVertical: theme.utils.s(10),
    color: theme.colors.textColor,
    fontSize: theme.utils.ms(14),
    borderWidth: 1,
    borderColor: theme.colors.inputCommentBorderColor,
  },
  sendButton: {
    paddingHorizontal: theme.utils.s(10),
    paddingVertical: theme.utils.s(10),
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  contentContainerStyle: {
    paddingBottom: rt.insets.bottom + theme.utils.s(10),
  },
  ellipseOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: scale(16),
    backgroundColor: theme.colors.postEllipseButtonBackground,
    marginBottom: scale(8),
    borderRadius: moderateScale(22),
  },


  page: {
    flex: 1,
    gap: 10,
  },

  imageContainer: {
    width: "100%",
    height: theme.utils.s(450),
    position: "relative",
  },
  carouselSlide: {
    width: SCREEN_WIDTH,
    height: scale(400),
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  carouselFooter: {
    position: "absolute",
    bottom: scale(20),
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
  },
  dotsRow: {
    flexDirection: "row",
    gap: scale(6),
  },
  dot: {
    height: scale(6),
    borderRadius: 999,
  },
  dotActive: {
    width: scale(22),
    backgroundColor: theme.colors.darkViolet,
  },
  dotInactive: {
    width: scale(6),
    backgroundColor: theme.colors.faintColor,
  },

  contentContainer: {
    paddingHorizontal: theme.utils.s(20),
    marginTop: theme.utils.s(10),
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.utils.s(20),
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(16),
  },
  actionPost: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(6),
  },
  actionCount: {
    color: theme.colors.faintColor,
    fontSize: theme.utils.ms(14),
  },

  locationContainer: {
    position: "absolute",
    bottom: theme.utils.s(40),
    left: theme.utils.s(16),
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(6),
    borderWidth: 1,
    backgroundColor: theme.colors.postPreviewItemBackgroundColor,
    borderColor: theme.colors.darkViolet,
    borderRadius: 999,
    paddingHorizontal: theme.utils.s(12),
    paddingVertical: theme.utils.s(6),
  },
  locationText: {
    color: theme.colors.lightViolet,
  },

  descriptionCard: {
    backgroundColor: theme.colors.postPreviewItemBackgroundColor,
    padding: scale(20),
    borderRadius: moderateScale(22),
    borderWidth: 1,
    borderColor: theme.colors.darkViolet,
    marginBottom: scale(32),
    opacity: 0.9,
  },
  descriptionText: {
    color: theme.colors.textColor,
    lineHeight: moderateScale(22),
  },

  commentsHeaderContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.utils.s(16),
    paddingBottom: theme.utils.s(20),
  },
  commentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.utils.s(12),
  },
  commentsHeaderText: {
    color: theme.colors.textColor,
  },

  backButtonContainer: {
    position: "absolute",
    left: theme.utils.s(20),
    zIndex: 10,
    top: Math.max(rt.insets.top, theme.utils.s(10)),
  },
  backButton: {
    paddingHorizontal: theme.utils.s(8),
    paddingVertical: theme.utils.s(8),
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: theme.colors.white,
  },

  menuButtonContainer: {
    position: "absolute",
    right: theme.utils.s(16),
    zIndex: 10,
  },


}));
