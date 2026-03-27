import {
  InteractiveImagePreview,
  NavigationHeader,
  ThemedBackground,
} from "@/src/components";
import { useNewPostImage } from "@/src/hooks/new-post/useNewPostImage";
import { UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { memo, useCallback, useMemo } from "react";
import { View, Dimensions } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { ITEM_SIZE, POST_CONFIG } from "@/src/types/post";
import { GridItem, Photo } from "@/src/types/newPostImage";
import { useCollapsibleGallery } from "@/src/hooks/new-post/useCollapsibleGallery";
import Animated from "react-native-reanimated";


const AnimatedFlashList = Animated.createAnimatedComponent(FlashList as any) as any;
const SCREEN_WIDTH = Dimensions.get("window").width;
const PREVIEW_HEIGHT = SCREEN_WIDTH * 0.9;
const GALLERY_HEADER_HEIGHT = 60;
const TOTAL_HEADER_HEIGHT = PREVIEW_HEIGHT + GALLERY_HEADER_HEIGHT;

export default function AddNewPostImageScreen() {
  const {
    gridItems,
    loadAssets,
    previewImage,
    selectedImages,
    isMultiSelectMode,
    toggleMultiSelect,
    handleSelectImage,
    onCancel,
    onDone,
    openCamera,
  } = useNewPostImage();

  const {
    scrollHandler,
    headerAnimatedStyle,
    listAnimatedStyle,
    revealHeader
  } = useCollapsibleGallery(PREVIEW_HEIGHT);

  const onGalleryItemPress = useCallback(
    (item: Photo) => {
      handleSelectImage(item);
      revealHeader();
    },
    [handleSelectImage, revealHeader],
  );


  const renderItem = useCallback(
    ({ item }: { item: GridItem }) => {
      if (!("uri" in item)) {
        return <CameraItem onPress={openCamera} />;
      }

      const selectionIndex = selectedImages.findIndex(
        (img: Photo) => img.id === item.id,
      );
      const isSelected = selectionIndex >= 0;
      const isPreviewing = previewImage?.id === item.id;

      return (
        <GalleryItem
          item={item}
          isSelected={isSelected}
          selectionIndex={selectionIndex}
          isPreviewing={isPreviewing}
          isMultiSelectMode={isMultiSelectMode}
          onPress={onGalleryItemPress}
        />
      );
    },
    [
      selectedImages,
      previewImage?.id,
      isMultiSelectMode,
      onGalleryItemPress,
      openCamera,
    ],
  );

  const keyExtractor = useCallback((item: GridItem) => item.id, []);
  const getItemType = useCallback(
    (item: GridItem) => (item.id === "camera-id" ? "camera" : "gallery"),
    [],
  );

  const listExtraData = useMemo(
    () => ({
      selectedImages,
      isMultiSelectMode,
      previewImageId: previewImage?.id,
    }),
    [selectedImages, isMultiSelectMode, previewImage?.id],
  );

  const listContentStyle = useMemo(
    () => ({
      ...styles.listContent,
      paddingTop: TOTAL_HEADER_HEIGHT,
    }),
    [],
  );

  return (
    <ThemedBackground>
      <NavigationHeader
        title="New Post"
        onLeftAction={onCancel}
        onRightAction={onDone}
      />

      <View style={styles.container}>
        <Animated.View style={headerAnimatedStyle}>
          <View style={{ height: PREVIEW_HEIGHT, width: "100%" }}>
            <InteractiveImagePreview imageUri={previewImage?.uri} />
          </View>
          <GalleryHeader
            isMultiSelectMode={isMultiSelectMode}
            onToggleMultiSelect={toggleMultiSelect}
          />
        </Animated.View>

        <Animated.View style={listAnimatedStyle}>
          <AnimatedFlashList
            data={gridItems}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemType={getItemType}
            numColumns={POST_CONFIG.COLUMN_COUNT}
            onEndReached={loadAssets}
            onEndReachedThreshold={0.5}
            contentContainerStyle={listContentStyle}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            extraData={listExtraData}
          />
        </Animated.View>
      </View>
    </ThemedBackground>
  );
}

const CameraItem = memo(({ onPress }: { onPress: () => void }) => {
  return (
    <UIButton onPress={onPress} style={styles.cameraItem}>
      <Ionicons
        name="camera-outline"
        size={styles.cameraIcon.height}
        color={styles.cameraIcon.color}
      />
    </UIButton>
  );
});

type GalleryItemProps = {
  item: Photo;
  isSelected: boolean;
  selectionIndex: number;
  isPreviewing: boolean;
  isMultiSelectMode: boolean;
  onPress: (item: Photo) => void;
};

const GalleryItem = memo(
  ({
    item,
    isSelected,
    selectionIndex,
    isPreviewing,
    isMultiSelectMode,
    onPress,
  }: GalleryItemProps) => {
    const handlePress = useCallback(() => {
      onPress(item);
    }, [item, onPress]);

    return (
      <UIButton
        onPress={handlePress}
        style={styles.galleryCell}
        disabled={isPreviewing}
      >
        <Image
          source={{ uri: item.uri }}
          style={[
            {
              width: ITEM_SIZE,
              height: ITEM_SIZE,
            },
            isPreviewing && styles.dimmedImage,
          ]}
          contentFit="cover"
        />

        {isPreviewing && <View style={styles.previewBorder} />}

        {isMultiSelectMode && isSelected && (
          <View style={styles.selectionBadge}>
            <UIText size={"xs"} weight={"bold"} style={{ color: "white" }}>
              {selectionIndex + 1}
            </UIText>
          </View>
        )}
      </UIButton>
    );
  },
);

type GalleryHeaderProps = {
  isMultiSelectMode: boolean;
  onToggleMultiSelect: () => void;
};

const GalleryHeader = memo(
  ({ isMultiSelectMode, onToggleMultiSelect }: GalleryHeaderProps) => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <UIText size="md" weight="normal" style={styles.recentsText}>
            Recents
          </UIText>

          <Ionicons
            name="chevron-forward-outline"
            size={styles.chevronIcon.height}
            color={styles.chevronIcon.color}
          />
        </View>

        <UIButton
          onPress={onToggleMultiSelect}
          style={[
            styles.multiplyPhotosButton,
            isMultiSelectMode && styles.multiplyPhotosButtonActive,
          ]}
        >
          <Ionicons
            name="albums-outline"
            size={styles.multiplyPhotosIcon.height}
            color={
              isMultiSelectMode
                ? styles.multiplyPhotosIcon.selectedColor
                : styles.multiplyPhotosIcon.color
            }
          />
        </UIButton>
      </View>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    overflow: "hidden",
  },

  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.utils.s(14),
    height: GALLERY_HEADER_HEIGHT,
    backgroundColor: theme.colors.background,
  },
  textContainer: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: theme.utils.s(6),
  },
  recentsText: {
    color: theme.colors.primaryText,
  },
  chevronIcon: {
    height: theme.utils.s(14),
    color: theme.colors.icon,
  },

  multiplyPhotosButton: {
    padding: theme.utils.s(4),
    borderRadius: theme.utils.ms(100),
  },
  multiplyPhotosButtonActive: {
    backgroundColor: theme.colors.buttonSelectedBackground,
  },
  multiplyPhotosIcon: {
    height: theme.utils.s(20),
    color: theme.colors.icon,
    selectedColor: theme.colors.iconSelected,
  },

  cameraItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    backgroundColor: theme.colors.backgroundSubtle,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    color: theme.colors.muted,
    height: theme.utils.s(30),
  },

  galleryCell: {
    marginRight: 4,
    marginBottom: 4,
  },
  previewBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2.4,
    borderColor: theme.colors.accent,
  },
  dimmedImage: {
    opacity: 0.5,
  },
  listContent: {
    paddingBottom: theme.utils.vs(80),
  },
  selectionBadge: {
    position: "absolute",
    top: theme.utils.vs(5),
    right: theme.utils.s(5),
    width: theme.utils.s(24),
    height: theme.utils.vs(24),
    borderRadius: theme.utils.ms(12),
    backgroundColor: theme.colors.mutedAccent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.white,
    zIndex: 10,
  },
}));
