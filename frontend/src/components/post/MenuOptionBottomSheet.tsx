import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { ComponentProps, memo, useCallback, useMemo, useRef } from "react";
import { UIBottomSheet, UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native-unistyles";
import { useRouter } from "expo-router";
import { BlurButton } from "../BlurButton";

type PostMenuOptionItem = {
    id: string;
    title: string;
    iconName: ComponentProps<typeof Ionicons>["name"];
    color?: string;
    onExecuteAction: () => void;
};


export const MenuOptionBottomSheet = memo(({ isOwnPost }: { isOwnPost: boolean }) => {
    const router = useRouter();

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
            const itemColor = item.color ?? styles.ellipseOptionButtonIcon.color;
            const textColor = item.color ?? styles.ellipseOptionButtonText.color;

            return (
                <UIButton
                    onPress={() => executeMenuOption(item.onExecuteAction)}
                    style={styles.ellipseOptionButton}
                >
                    <Ionicons color={itemColor} size={styles.ellipseOptionButtonIcon.height} name={item.iconName} />
                    <UIText size="md" style={{ color: textColor }}>
                        {item.title}
                    </UIText>
                </UIButton>
            );
        },
        [executeMenuOption],
    );

    return (
        <>
            <BlurButton onPress={presentEllipsisSheet} iconName="ellipsis-vertical" style={{ left: undefined, right: styles.ellipsisButton.right }} />

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
    ellipsisButton: {
        right: theme.utils.s(16),
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
    ellipseOptionButtonIcon: {
        height: theme.utils.s(24),
        color: theme.colors.accent,
    },
    ellipseOptionButtonText: {
        color: theme.colors.primaryText,
        fontSize: theme.utils.ms(14),
    },
}));