import { InteractiveImagePreview, NavigationHeader, ThemedBackground } from "@/src/components";
import { CONFIG, GridItem, ITEM_SIZE, type Photo } from "@/src/constants/newPostConfig";
import { useNewPostImage } from "@/src/hooks/post/useNewPostImage";
import { UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { memo, useCallback } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";



export default function AddNewPostImageScreen() {
  const { gridItems,
    loadAssets,
    previewImage,
    selectedImages,
    isMultiSelectMode,
    toggleMultiSelect,
    handleSelectImage,
    onCancel,
    onDone,
    openCamera } = useNewPostImage();

  const renderItem = useCallback(
    ({ item }: { item: GridItem }) => {
      if (!("uri" in item)) {
        return <CameraItem onPress={openCamera} />;
      }

      const selectionIndex = selectedImages.findIndex(
        (img) => img.id === item.id,
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
          onPress={handleSelectImage}
        />
      );
    },
    [selectedImages, previewImage?.id, isMultiSelectMode, handleSelectImage, openCamera],
  );

  const keyExtractor = useCallback((item: GridItem) => item.id, []);
  const getItemType = useCallback((item: GridItem) => item.id === "camera-id" ? "camera" : "gallery", []);

  return (
    <ThemedBackground>
      <NavigationHeader
        title="New Post"
        onLeftAction={onCancel}
        onRightAction={onDone}
      />

      <View style={styles.container}>
        <InteractiveImagePreview imageUri={previewImage?.uri} />

        <GalleryHeader
          isMultiSelectMode={isMultiSelectMode}
          onToggleMultiSelect={toggleMultiSelect}
        />

        <FlashList
          data={gridItems}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          numColumns={CONFIG.COLUMN_COUNT}
          onEndReached={loadAssets}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
          extraData={{ selectedImages, isMultiSelectMode, previewImage }}
        />
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
    return (
      <UIButton
        onPress={() => onPress(item)}
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
          <UIText
            size="md"
            weight="normal"
            style={styles.recentsText}
          >
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
    paddingTop: theme.utils.vs(10),
  },

  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.utils.s(14),
  },
  textContainer: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: theme.utils.s(6),
  },
  recentsText: {
    color: theme.colors.primaryText
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
