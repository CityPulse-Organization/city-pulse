import {
  Comment,
  CommentItem,
  Icon,
  IconInfo,
  POSTS,
  ThemedBackground,
} from "@/src/components";
import { UIButton, UIDivider, UIImage, UIText } from "@/src/ui";
import { UIBottomSheet } from "@/src/ui/organisms/UIBottomSheet";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
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
import { ActivityIndicator, Dimensions, FlatList, ScrollView, View, ViewToken } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from "react-native-unistyles";



export const MOCK_COMMENTS: CommentItem[] = [
  {
    id: "c1",
    username: "kyrylo",
    commentText: "Looks serious. Hope everyone is ok.",
    timeAgo: "2m ago",
    profileImageUrl: "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
  },
  {
    id: "c2",
    username: "alex",
    commentText: "Any updates? Which street is blocked? Anything else?",
    timeAgo: "5m ago",
    profileImageUrl: "https://th.bing.com/th/id/OIP.eh5RRJ5l1pqHQDN1ubb1VAHaEx?w=272&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
  },
  {
    id: "c3",
    username: "maria",
    commentText: "Thanks for sharing. Stay safe!",
    timeAgo: "12m ago",
    profileImageUrl: undefined,
  },
  {
    id: "c4",
    username: "kyrylo",
    commentText: "Looks serious. Hope everyone is ok.",
    timeAgo: "2m ago",
    profileImageUrl: "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
  },
  {
    id: "c5",
    username: "alex",
    commentText: "Any updates? Which street is blocked? Anything else?",
    timeAgo: "5m ago",
    profileImageUrl: "https://th.bing.com/th/id/OIP.eh5RRJ5l1pqHQDN1ubb1VAHaEx?w=272&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
  },
  {
    id: "c6",
    username: "maria",
    commentText: "Thanks for sharing. Stay safe!",
    timeAgo: "12m ago",
    profileImageUrl: undefined,
  },
  {
    id: "c7",
    username: "kyrylo",
    commentText: "Looks serious. Hope everyone is ok.",
    timeAgo: "2m ago",
    profileImageUrl: "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
  },
  {
    id: "c8",
    username: "alex",
    commentText: "Any updates? Which street is blocked? Anything else?",
    timeAgo: "5m ago",
    profileImageUrl: "https://th.bing.com/th/id/OIP.eh5RRJ5l1pqHQDN1ubb1VAHaEx?w=272&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
  },
  {
    id: "c9",
    username: "maria",
    commentText: "Thanks for sharing. Stay safe!",
    timeAgo: "12m ago",
    profileImageUrl: undefined,
  },
];

export const MOCK_LIKE_COUNT = 12;




const SCREEN_WIDTH = Dimensions.get("window").width;




type PostMenuOptionItem = {
  id: string;
  title: string;
  iconName: ComponentProps<typeof Ionicons>["name"];
  color?: string;
  onExecuteAction: () => void;
};





const CommentsHeader = React.memo(() => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.commentsHeaderContainer}>
      <View style={styles.commentsHeader}>
        <Ionicons
          name="chatbubble-outline"
          size={theme.utils.s(20)}
          color={theme.colors.lightViolet}
        />
        <UIText size="md" weight="normal" style={styles.commentsHeaderText}>
          Comments
        </UIText>
      </View>
      <UIDivider color={theme.colors.commentDividerColor} />
    </View>
  );
});




type CommentsFooterProps = {
  bottomSheetProps: BottomSheetFooterProps;
  insetsBottom: number;
  profileImageUrl: string;
};

const CommentsFooter = React.memo(
  ({ bottomSheetProps, insetsBottom, profileImageUrl }: CommentsFooterProps) => {
    const { theme } = useUnistyles();
    const [commentText, setCommentText] = useState("");

    const isCommentValid = commentText.trim().length > 0;

    const handleSendComment = useCallback(() => {
      setCommentText("");
    }, []);

    return (
      <BottomSheetFooter {...bottomSheetProps}>
        <View style={styles.footerContainer}>

          <UIDivider height={theme.utils.vs(0.5)} />

          <View
            style={[
              styles.commentInputBar,
              { paddingBottom: Math.max(insetsBottom, theme.utils.vs(30)) },
            ]}
          >
            <Icon
              profileImageUrl={profileImageUrl}
              size="comment"
              borderColor="violet"
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
                isCommentValid
                  ? { backgroundColor: theme.colors.lightViolet }
                  : { backgroundColor: theme.colors.inputCommentBackgroundColor },
              ]}
              onPress={handleSendComment}
              disabled={!isCommentValid}
            >
              <Ionicons
                name="send-outline"
                size={theme.utils.s(18)}
                color={isCommentValid ? theme.colors.white : theme.colors.faintColor}
              />
            </UIButton>

          </View>
        </View>
      </BottomSheetFooter>
    );
  },
);

export default function PostDetailScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const activePostId = params.id as string;
  const isOwnPost = params.isOwnPost === "true";

  const currentPostData = POSTS.find((mockPost) => mockPost.id === activePostId);


  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveCarouselIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;



  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);
  const [totalLikeCount, setTotalLikeCount] = useState(MOCK_LIKE_COUNT);

  const toggleLikeStatus = useCallback(() => {
    setIsLikedByCurrentUser((prev) => {
      const nextStatus = !prev;
      setTotalLikeCount((currentCount) => (nextStatus ? currentCount + 1 : currentCount - 1));
      return nextStatus;
    });
  }, []);



  const [isSavedByCurrentUser, setIsSavedByCurrentUser] = useState(false);

  const toggleSaveStatus = useCallback(() => {
    setIsSavedByCurrentUser((prev) => !prev);
  }, []);



  const commentsBottomSheetRef = useRef<BottomSheetModal>(null);

  const presentCommentsSheet = useCallback(() => {
    commentsBottomSheetRef.current?.present();
  }, []);


  const renderCommentsFooter = useCallback(
    (footerProps: BottomSheetFooterProps) => (
      <CommentsFooter
        bottomSheetProps={footerProps}
        insetsBottom={insets.bottom}
        profileImageUrl={currentPostData?.profileImageUrl ?? ""}
      />
    ),
    [insets.bottom, currentPostData?.profileImageUrl],
  );


  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoadingMoreComments, setIsLoadingMoreComments] = useState(false);
  const isLoadingMoreCommentsRef = useRef(false);

  const handleLoadMoreComments = useCallback(() => {
    if (isLoadingMoreCommentsRef.current) return;
    isLoadingMoreCommentsRef.current = true;
    setIsLoadingMoreComments(true);

    setComments((prevComments) => {
      const nextBatch = MOCK_COMMENTS.slice(prevComments.length, prevComments.length + 20);
      return nextBatch.length === 0 ? prevComments : [...prevComments, ...nextBatch];
    });
    setIsLoadingMoreComments(false);
    isLoadingMoreCommentsRef.current = false;
  }, []);




  const ellipsisBottomSheetRef = useRef<BottomSheetModal>(null);

  const presentEllipsisSheet = useCallback(() => {
    ellipsisBottomSheetRef.current?.present();
  }, []);

  const executeMenuOption = useCallback((callback: () => void) => {
    ellipsisBottomSheetRef.current?.close();
    callback();
  }, []);

  const postMenuOptions: PostMenuOptionItem[] = useMemo(() => {
    if (isOwnPost) {
      return [
        {
          id: "edit",
          title: "Edit",
          iconName: "pencil-outline",
          onExecuteAction: () => router.navigate("/(tabs)/profile/edit-post"),
        },
        {
          id: "delete",
          title: "Delete",
          iconName: "trash-outline",
          color: "red",
          onExecuteAction: () => console.log("Usuwanie posta..."),
        },
      ];
    }

    return [
      {
        id: "share",
        title: "Share",
        iconName: "share-social-outline",
        onExecuteAction: () => { },
      },
      {
        id: "report",
        title: "Report",
        iconName: "alert-circle-outline",
        color: "red",
        onExecuteAction: () => {
          throw new Error("Function not implemented.");
        },
      },
    ];
  }, [isOwnPost, router]);

  const renderPostMenuOptionItem = useCallback(
    ({ item }: { item: PostMenuOptionItem }) => {
      const itemColor = item.color ?? theme.colors.lightViolet;
      const textColor = item.color ?? theme.colors.textColor;

      return (
        <UIButton
          onPress={() => executeMenuOption(item.onExecuteAction)}
          style={styles.ellipseOptionButton}
        >
          <Ionicons color={itemColor} size={theme.utils.s(24)} name={item.iconName} />
          <UIText size="md" style={{ color: textColor }}>
            {item.title}
          </UIText>
        </UIButton>
      );
    },
    [theme, executeMenuOption],
  );

  const renderCarouselSlide = useCallback(
    ({ item: imageUrl }: { item: string }) => (
      <View style={styles.carouselSlide}>
        <UIImage
          imageUrl={imageUrl}
          isAspectRatio={false}
          style={styles.headerImage}
        />
      </View>
    ),
    [],
  );



  if (!currentPostData) return null;

  const {
    imagesUrl = [],
    description = "",
    username,
    profileImageUrl = "",
    accidentTime,
    location = "",
    isBroadcasting,
  } = currentPostData;



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
            keyExtractor={(imageUrl) => imageUrl}
            viewabilityConfig={viewConfigRef.current}
            onViewableItemsChanged={handleViewableItemsChanged}
            renderItem={renderCarouselSlide}
          />

          <LinearGradient
            colors={["rgba(0, 0, 0, 0.6)", "rgba(0,0,0,0)", "rgba(0, 0, 0, 0.8)"]}
            locations={[0.1, 0.4, 1]}
            style={styles.gradient}
            pointerEvents="none"
          />

          {location ? (
            <View style={styles.locationContainer} pointerEvents="none">
              <Ionicons
                name="location-outline"
                size={theme.utils.s(14)}
                color={theme.colors.lightViolet}
              />
              <UIText size="sm" style={styles.locationText}>
                {location}
              </UIText>
            </View>
          ) : null}

          {imagesUrl.length > 1 && (
            <View style={styles.carouselFooter} pointerEvents="none">
              <View style={styles.dotsRow}>
                {imagesUrl.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === activeCarouselIndex ? styles.dotActive : styles.dotInactive,
                    ]}
                  />
                ))}
              </View>
            </View>
          )}
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
              <UIButton onPress={toggleLikeStatus} style={styles.actionPost}>
                <Ionicons
                  name={isLikedByCurrentUser ? "heart" : "heart-outline"}
                  size={theme.utils.s(20)}
                  color={isLikedByCurrentUser ? theme.colors.lightRed : theme.colors.iconColor}
                />
                <UIText weight="normal" style={styles.actionCount}>
                  {totalLikeCount}
                </UIText>
              </UIButton>

              <UIButton onPress={presentCommentsSheet} style={styles.actionPost}>
                <Ionicons
                  name="chatbubble-outline"
                  size={theme.utils.s(20)}
                  color={theme.colors.iconColor}
                />
                <UIText style={styles.actionCount}>
                  {MOCK_COMMENTS.length /* TODO: replace with total from API */}
                </UIText>
              </UIButton>

              <UIButton onPress={toggleSaveStatus} style={styles.actionPost}>
                <Ionicons
                  name={isSavedByCurrentUser ? "bookmark" : "bookmark-outline"}
                  size={theme.utils.s(20)}
                  color={isSavedByCurrentUser ? theme.colors.darkViolet : theme.colors.iconColor}
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
        snapPoints={["75%"]}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="none"
        topInset={insets.top}
        footerComponent={renderCommentsFooter}
      >
        <BottomSheetFlatList
          data={comments}
          keyExtractor={(commentData: CommentItem) => commentData.id}
          contentContainerStyle={{ paddingBottom: theme.utils.vs(100), paddingHorizontal: theme.utils.s(10) }}
          onEndReached={handleLoadMoreComments}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoadingMoreComments ? <ActivityIndicator size="small" /> : null}
          renderItem={({ item: commentData }: { item: CommentItem }) => (
            <Comment comment={commentData} />
          )}
        />
      </UIBottomSheet>

      <View
        style={[
          styles.backButtonContainer,
          { top: Math.max(insets.top, theme.utils.vs(50)) },
        ]}
      >
        <UIButton onPress={() => router.back()}>
          <BlurView intensity={80} tint="dark" style={styles.backButton}>
            <Ionicons
              name="chevron-back"
              size={theme.utils.s(20)}
              color={theme.colors.white}
            />
          </BlurView>
        </UIButton>
      </View>

      <View
        style={[
          styles.menuButtonContainer,
          { top: Math.max(insets.top, theme.utils.vs(50)) },
        ]}
      >
        <UIButton onPress={presentEllipsisSheet}>
          <BlurView intensity={80} tint="dark" style={styles.backButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={theme.utils.s(20)}
              color={theme.colors.white}
            />
          </BlurView>
        </UIButton>
      </View>

      <UIBottomSheet ref={ellipsisBottomSheetRef} snapPoints={["20%"]} >
        <BottomSheetFlatList
          data={postMenuOptions}
          renderItem={renderPostMenuOptionItem}
          contentContainerStyle={{ paddingHorizontal: theme.utils.s(20) }}
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
    paddingHorizontal: theme.utils.s(20),
    paddingVertical: theme.utils.vs(16),
    gap: theme.utils.s(16),
    backgroundColor: theme.colors.postEllipseButtonBackground,
    marginBottom: theme.utils.vs(8),
    borderRadius: theme.utils.ms(22),
  },

  page: {
    flex: 1,
  },

  imageContainer: {
    width: "100%",
    height: theme.utils.vs(440),
    position: "relative",
  },
  carouselSlide: {
    width: SCREEN_WIDTH,
    height: theme.utils.vs(440),
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  locationContainer: {
    position: "absolute",
    bottom: theme.utils.vs(40),
    left: theme.utils.s(16),
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(6),
    borderWidth: 1,
    backgroundColor: theme.colors.postPreviewItemBackgroundColor,
    borderColor: theme.colors.darkViolet,
    borderRadius: 999,
    paddingHorizontal: theme.utils.s(12),
    paddingVertical: theme.utils.vs(6),
  },
  locationText: {
    color: theme.colors.lightViolet,
  },

  carouselFooter: {
    position: "absolute",
    bottom: theme.utils.vs(20),
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.utils.s(8),
  },
  dotsRow: {
    flexDirection: "row",
    gap: theme.utils.s(6),
  },
  dot: {
    height: theme.utils.vs(6),
    borderRadius: 999,
  },
  dotActive: {
    width: theme.utils.s(22),
    backgroundColor: theme.colors.darkViolet,
  },
  dotInactive: {
    width: theme.utils.s(6),
    backgroundColor: theme.colors.faintColor,
  },

  contentContainer: {
    paddingHorizontal: theme.utils.s(20),
    marginTop: theme.utils.vs(10),
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.utils.vs(20),
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

  descriptionCard: {
    backgroundColor: theme.colors.postPreviewItemBackgroundColor,
    padding: theme.utils.s(20),
    borderRadius: theme.utils.ms(22),
    borderWidth: 1,
    borderColor: theme.colors.darkViolet,
    marginBottom: theme.utils.vs(32),
    opacity: 0.9,
  },
  descriptionText: {
    color: theme.colors.textColor,
    lineHeight: theme.utils.ms(22),
  },

  commentsHeaderContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.utils.s(16),
    paddingBottom: theme.utils.vs(20),
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
    top: Math.max(rt.insets.top, theme.utils.vs(10)),
  },
  backButton: {
    paddingHorizontal: theme.utils.s(8),
    paddingVertical: theme.utils.vs(8),
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