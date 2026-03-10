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
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Dimensions, FlatList, ScrollView, View, ViewToken } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  StyleSheet,
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


export default function PostDetailScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const activePostId = params.id as string;
  const isOwnPost = params.isOwnPost === "true";

  const currentPostData = useMemo(
    () => POSTS.find((mockPost) => mockPost.id === activePostId),
    [activePostId],
  );

  const commentsBottomSheetRef = useRef<BottomSheetModal>(null);
  const openPresentCommentsSheet = useCallback(() => {
    commentsBottomSheetRef.current?.present();
  }, []);

  const handleBack = useCallback(() => router.back(), [router]);

  const backButtonContainerStyle = useMemo(
    () => [styles.backButtonContainer, { top: Math.max(insets.top, theme.utils.vs(50)) }],
    [insets.top, theme.utils],
  );


  if (!currentPostData) return null;

  const {
    imagesUrl = [],
    description = "",
    username,
    profileImageUrl = "",
    accidentTime,
    location = "",
    isBroadcasting = false,
  } = currentPostData;


  return (
    <ThemedBackground style={styles.page} withSafeArea={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        bounces={false}
      >
        <ImagesPreview imagesUrl={imagesUrl} location={location} />

        <View style={styles.contentContainer}>
          <UserInfoRow
            profileImageUrl={profileImageUrl}
            username={username}
            accidentTime={accidentTime}
            isBroadcasting={isBroadcasting}
            openPresentCommentsSheet={openPresentCommentsSheet}
          />

          {!!description && (
            <BlurView
              intensity={10}
              tint={"dark"}
              style={styles.descriptionCard}
            >
              <UIText size="sm" style={styles.descriptionText}>
                {description}
              </UIText>
            </BlurView>
          )}
        </View>

      </ScrollView>

      <Comments profileImageUrl={profileImageUrl} commentsBottomSheetRef={commentsBottomSheetRef} />
      <MenuOption isOwnPost={isOwnPost} />

      <View style={backButtonContainerStyle}>
        <UIButton onPress={handleBack}>
          <BlurView intensity={80} tint="dark" style={styles.backButton}>
            <Ionicons
              name="chevron-back"
              size={theme.utils.s(20)}
              color={theme.colors.white}
            />
          </BlurView>
        </UIButton>
      </View>

    </ThemedBackground>
  );
}



const ImagesPreview = memo(({ imagesUrl, location }: { imagesUrl: string[], location: string }) => {
  const { theme } = useUnistyles();

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveCarouselIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

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

  return (
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
        colors={theme.colors.gradientOverlay}
        locations={[0, 0.6, 1]}
        style={styles.gradient}
        pointerEvents="none"
      />

      {location ? (
        <View style={styles.locationContainer} pointerEvents="none">
          <Ionicons
            name="location-outline"
            size={theme.utils.s(14)}
            color={theme.colors.accent}
          />
          <UIText size="sm" style={styles.locationText}>
            {location}
          </UIText>
        </View>
      ) : null}

      {imagesUrl.length > 1 && (
        <View style={styles.carouselFooter} pointerEvents="none">
          <View style={styles.dotsRow}>
            {imagesUrl.map((imageUrl, index) => (
              <View
                key={imageUrl}
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
  )
})




type UserInfoRowProps = {
  profileImageUrl: string,
  username: string,
  accidentTime: string,
  isBroadcasting: boolean,
  openPresentCommentsSheet: () => void,
}


const UserInfoRow = memo(({ profileImageUrl, username, accidentTime, isBroadcasting, openPresentCommentsSheet }: UserInfoRowProps) => {
  const { theme } = useUnistyles();

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


  return (
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
            color={isLikedByCurrentUser ? theme.colors.lightRed : theme.colors.icon}
          />
          <UIText weight="normal" style={styles.actionCount}>
            {totalLikeCount}
          </UIText>
        </UIButton>

        <UIButton onPress={openPresentCommentsSheet} style={styles.actionPost}>
          <Ionicons
            name="chatbubble-outline"
            size={theme.utils.s(20)}
            color={theme.colors.icon}
          />
          <UIText style={styles.actionCount}>
            {MOCK_COMMENTS.length}
          </UIText>
        </UIButton>

        <UIButton onPress={toggleSaveStatus} style={styles.actionPost}>
          <Ionicons
            name={isSavedByCurrentUser ? "bookmark" : "bookmark-outline"}
            size={theme.utils.s(20)}
            color={isSavedByCurrentUser ? theme.colors.mutedAccent : theme.colors.icon}
          />
        </UIButton>
      </View>
    </View>
  )
})




type CommentsProps = {
  profileImageUrl: string;
  commentsBottomSheetRef: React.RefObject<BottomSheetModal | null>;
}


const Comments = memo(({ profileImageUrl, commentsBottomSheetRef }: CommentsProps) => {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();


  const [footerHeight, setFooterHeight] = useState(0);

  const renderCommentsFooter = useCallback(
    (footerProps: BottomSheetFooterProps) => (
      <CommentsFooter
        bottomSheetProps={footerProps}
        insetsBottom={insets.bottom}
        profileImageUrl={profileImageUrl}
        onHeightChange={setFooterHeight}
      />
    ),
    [insets.bottom, profileImageUrl],
  );


  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoadingMoreComments, setIsLoadingMoreComments] = useState(false);
  const isLoadingMoreCommentsRef = useRef(false);

  const handleLoadMoreComments = useCallback(() => {
    if (isLoadingMoreCommentsRef.current) return;

    isLoadingMoreCommentsRef.current = true;
    setIsLoadingMoreComments(true);

    setTimeout(() => {
      setComments((prevComments) => {
        const nextBatch = MOCK_COMMENTS.slice(prevComments.length, prevComments.length + 40);

        if (nextBatch.length === 0) {
          isLoadingMoreCommentsRef.current = true;
          return prevComments;
        }

        return [...prevComments, ...nextBatch];
      });

      setIsLoadingMoreComments(false);
      isLoadingMoreCommentsRef.current = false;
    }, 1000);
  }, []);

  return (
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
        contentContainerStyle={{ paddingBottom: footerHeight, paddingHorizontal: theme.utils.s(10) }}
        onEndReached={handleLoadMoreComments}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoadingMoreComments ? <ActivityIndicator size="small" color={theme.colors.accent} /> : null}
        renderItem={({ item: commentData }: { item: CommentItem }) => (
          <Comment comment={commentData} />
        )}
      />
    </UIBottomSheet>
  )
})



const CommentsHeader = memo(() => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.commentsHeaderContainer}>
      <View style={styles.commentsHeader}>
        <Ionicons
          name="chatbubble-outline"
          size={theme.utils.s(20)}
          color={theme.colors.accent}
        />
        <UIText size="md" weight="normal" style={styles.commentsHeaderText}>
          Comments
        </UIText>
      </View>
      <UIDivider color={theme.colors.commentDivider} />
    </View>
  );
});




type CommentsFooterProps = {
  bottomSheetProps: BottomSheetFooterProps;
  insetsBottom: number;
  profileImageUrl: string;
  onHeightChange: (height: number) => void;
};

const CommentsFooter = memo(({
  bottomSheetProps,
  insetsBottom,
  profileImageUrl,
  onHeightChange
}: CommentsFooterProps) => {
  const { theme } = useUnistyles();
  const [commentText, setCommentText] = useState("");

  const isCommentValid = commentText.trim().length > 0;

  const handleSendComment = useCallback(() => {
    setCommentText("");
  }, []);

  return (
    <BottomSheetFooter {...bottomSheetProps}>
      <View
        style={styles.footerContainer}
        onLayout={(e) => onHeightChange(e.nativeEvent.layout.height)}
      >

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
            placeholderTextColor={theme.colors.muted}
            onChangeText={setCommentText}
            value={commentText}
          />

          <UIButton
            style={[
              styles.sendButton,
              isCommentValid
                ? { backgroundColor: theme.colors.accent }
                : { backgroundColor: theme.colors.backgroundSubtle },
            ]}
            onPress={handleSendComment}
            disabled={!isCommentValid}
          >
            <Ionicons
              name="send-outline"
              size={theme.utils.s(18)}
              color={isCommentValid ? theme.colors.white : theme.colors.muted}
            />
          </UIButton>

        </View>
      </View>
    </BottomSheetFooter>
  );
},
);




type PostMenuOptionItem = {
  id: string;
  title: string;
  iconName: ComponentProps<typeof Ionicons>["name"];
  color?: string;
  onExecuteAction: () => void;
};


const MenuOption = memo(({ isOwnPost }: { isOwnPost: boolean }) => {
  const { theme } = useUnistyles();
  const router = useRouter();
  const insets = useSafeAreaInsets();


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


  const ellipsisBottomSheetRef = useRef<BottomSheetModal>(null);

  const presentEllipsisSheet = useCallback(() => {
    ellipsisBottomSheetRef.current?.present();
  }, []);

  const executeMenuOption = useCallback((callback: () => void) => {
    ellipsisBottomSheetRef.current?.close();
    callback();
  }, []);


  const renderPostMenuOptionItem = useCallback(
    ({ item }: { item: PostMenuOptionItem }) => {
      const itemColor = item.color ?? theme.colors.accent;
      const textColor = item.color ?? theme.colors.primaryText;

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

  return (
    <>
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

      <UIBottomSheet ref={ellipsisBottomSheetRef} snapPoints={["24%"]} >
        <BottomSheetFlatList
          data={postMenuOptions}
          renderItem={renderPostMenuOptionItem}
          contentContainerStyle={styles.ellipseOptionContainer}
        />
      </UIBottomSheet>
    </>
  )
})




const styles = StyleSheet.create((theme, rt) => ({
  page: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingBottom: rt.insets.bottom + theme.utils.s(10),
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
    backgroundColor: theme.colors.backgroundOverlay,
    borderColor: theme.colors.mutedAccent,
    borderRadius: 999,
    paddingHorizontal: theme.utils.s(12),
    paddingVertical: theme.utils.vs(6),
  },
  locationText: {
    color: theme.colors.accent,
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
    backgroundColor: theme.colors.mutedAccent,
  },
  dotInactive: {
    width: theme.utils.s(6),
    backgroundColor: theme.colors.muted,
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
    color: theme.colors.muted,
    fontSize: theme.utils.ms(14),
  },

  descriptionCard: {
    backgroundColor: theme.colors.backgroundOverlay,
    padding: theme.utils.s(20),
    borderRadius: theme.utils.ms(22),
    borderWidth: 1,
    borderColor: theme.colors.mutedAccent,
    marginBottom: theme.utils.vs(32),
    opacity: 0.9,
  },
  descriptionText: {
    color: theme.colors.primaryText,
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
    color: theme.colors.primaryText,
  },

  footerContainer: {
    backgroundColor: theme.colors.bottomSheetBackground,
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
    backgroundColor: theme.colors.backgroundSubtle,
    borderRadius: 999,
    paddingHorizontal: theme.utils.s(16),
    paddingVertical: theme.utils.s(10),
    color: theme.colors.primaryText,
    fontSize: theme.utils.ms(14),
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  sendButton: {
    paddingHorizontal: theme.utils.s(10),
    paddingVertical: theme.utils.s(10),
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
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
  ellipseOptionContainer: {
    paddingHorizontal: theme.utils.s(20),
    paddingTop: theme.utils.s(10),
  },
  ellipseOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.utils.s(20),
    paddingVertical: theme.utils.vs(16),
    marginBottom: theme.utils.vs(8),
    borderRadius: theme.utils.ms(22),
    backgroundColor: theme.colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    gap: theme.utils.s(16),
  },
}));