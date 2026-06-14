import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { ComponentProps, memo, useCallback, useMemo, useRef } from "react";
import { UIBottomSheet, UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native-unistyles";
import { useRouter } from "expo-router";
import { BlurButton } from "../BlurButton";
import { GradientCard } from "../GradientCard";
import { View } from "react-native";
import { Alert } from "react-native";
import { useTranslation } from 'react-i18next';

type PostMenuOptionItem = {
  id: string;
  title: string;
  iconName: ComponentProps<typeof Ionicons>["name"];
  color?: string;
  onExecuteAction: () => void;
};

type MenuOptionBottomSheetProps = {
  isOwnPost: boolean;
  postId: number;
  removePost?: () => void;
};

export const MenuOptionBottomSheet = memo(
  ({ isOwnPost, postId, removePost }: MenuOptionBottomSheetProps) => {
    const router = useRouter();
    const { t } = useTranslation();

    const handleDelete = useCallback(() => {
      Alert.alert(t('postMenu.deleteTitle'), t('postMenu.deleteMessage'), [
        { text: t('postMenu.cancel'), style: "cancel" },
        {
          text: t('postMenu.delete'),
          style: "destructive",
          onPress: () => removePost?.(),
        },
      ]);
    }, [removePost, t]);

    const postMenuOptions: PostMenuOptionItem[] = useMemo(() => {
      if (isOwnPost) {
        return [
          {
            id: "edit",
            title: t('postMenu.edit'),
            iconName: "pencil-outline",
            onExecuteAction: () => {
              router.navigate({
                pathname: "/(tabs)/profile/edit-post",
                params: { id: postId },
              });
            },
          },
          {
            id: "delete",
            title: t('postMenu.delete'),
            iconName: "trash-outline",
            color: "red",
            onExecuteAction: handleDelete,
          },
        ];
      }

      return [
        {
          id: "share",
          title: t('postMenu.share'),
          iconName: "share-social-outline",
          onExecuteAction: () => { },
        },
        {
          id: "report",
          title: t('postMenu.report'),
          iconName: "alert-circle-outline",
          color: "red",
          onExecuteAction: () => {
            throw new Error("Function not implemented.");
          },
        },
      ];
    }, [isOwnPost, router, postId, handleDelete]);

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
        return <MenuOptionCard item={item} onExecute={executeMenuOption} />;
      },
      [executeMenuOption],
    );

    return (
      <>
        <View style={styles.ellipsisButton}>
          <BlurButton onPress={presentEllipsisSheet} iconName="ellipsis-vertical" />
        </View>

        <UIBottomSheet ref={ellipsisBottomSheetRef} snapPoints={["27%"]}>
          <BottomSheetFlatList
            data={postMenuOptions}
            renderItem={renderPostMenuOptionItem}
            contentContainerStyle={styles.ellipseOptionContainer}
          />
        </UIBottomSheet>
      </>
    );
  },
);

type MenuOptionCardProps = {
  item: PostMenuOptionItem;
  onExecute: (action: () => void) => void;
}

const MenuOptionCard = memo(({ item, onExecute }: MenuOptionCardProps) => {
  const handlePress = useCallback(() => {
    onExecute(item.onExecuteAction);
  }, [item, onExecute]);

  const itemColor = item.color ?? styles.ellipseOptionButtonIcon.color;
  const textColor = item.color ?? styles.ellipseOptionButtonText.color;

  return (
    <GradientCard
      colors={[
        "rgba(168,36,224,0.45)",
        "rgba(124,77,255,0.20)",
        "rgba(206,147,216,0.10)",
      ]}
      style={styles.ellipseOptionCard}
    >
      <UIButton
        onPress={handlePress}
        style={styles.ellipseOptionButton}
      >
        <Ionicons color={itemColor} size={styles.ellipseOptionButtonIcon.height} name={item.iconName} />
        <UIText size="md" style={{ color: textColor }}>
          {item.title}
        </UIText>
      </UIButton>
    </GradientCard>
  );
});



const styles = StyleSheet.create((theme, rt) => ({
  ellipsisButton: {
    position: "absolute",
    right: theme.utils.s(16),
    zIndex: 10,
    top: Math.max(rt.insets.top, theme.utils.vs(50)),
  },
  ellipseOptionContainer: {
    paddingHorizontal: theme.utils.s(20),
    paddingTop: theme.utils.s(10),
    paddingBottom: Math.max(rt.insets.bottom, theme.utils.vs(30)),


  },
  ellipseOptionCard: {
    paddingBottom: theme.utils.s(4),
    marginBottom: theme.utils.s(8),
  },
  ellipseOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.utils.s(20),
    paddingVertical: theme.utils.vs(20),
    gap: theme.utils.s(16),
  },
  ellipseOptionButtonIcon: {
    height: theme.utils.s(24),
    color: theme.colors.accent,
  },
  ellipseOptionButtonText: {
    color: theme.colors.primaryText,
    fontSize: theme.utils.ms(14),
  },
}));