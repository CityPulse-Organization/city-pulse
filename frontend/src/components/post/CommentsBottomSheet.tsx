import { BottomSheetFlatList, BottomSheetFooter, BottomSheetFooterProps, BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { memo, useCallback, useRef, useState } from "react";
import { Comment, CommentItem, MOCK_COMMENTS } from "../Comment";
import { UIBottomSheet, UIButton, UIDivider, UIText } from "@/src/ui";
import { ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "../Icon";
import { StyleSheet } from "react-native-unistyles";


type CommentsBottomSheetProps = {
    profileImageUrl: string;
    commentsBottomSheetRef: React.RefObject<BottomSheetModal | null>;
}


export const CommentsBottomSheet = memo(({ profileImageUrl, commentsBottomSheetRef }: CommentsBottomSheetProps) => {
    const [footerHeight, setFooterHeight] = useState(0);

    const renderCommentsFooter = useCallback(
        (footerProps: BottomSheetFooterProps) => (
            <CommentsFooter
                bottomSheetProps={footerProps}
                profileImageUrl={profileImageUrl}
                onHeightChange={setFooterHeight}
            />
        ),
        [profileImageUrl],
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

    const keyExtractor = useCallback((commentData: CommentItem) => commentData.id, []);
    const renderItem = useCallback(({ item: commentData }: { item: CommentItem }) => (
        <Comment comment={commentData} />
    ), []);

    return (
        <UIBottomSheet
            header={<CommentsHeader />}
            ref={commentsBottomSheetRef}
            snapPoints={["75%"]}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="none"
            topInset={styles.bottomSheet.top}
            footerComponent={renderCommentsFooter}
        >
            <BottomSheetFlatList
                data={comments}
                keyExtractor={keyExtractor}
                contentContainerStyle={[styles.listContent, { paddingBottom: footerHeight }]}
                onEndReached={handleLoadMoreComments}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isLoadingMoreComments ?
                    <ActivityIndicator size="small" color={styles.loading.color} /> : null}
                renderItem={renderItem}
            />
        </UIBottomSheet>
    )
})



const CommentsHeader = memo(() => {
    return (
        <View style={styles.headerContainer}>

            <View style={styles.header}>
                <Ionicons
                    name="chatbubble-outline"
                    size={styles.headerIcon.height}
                    color={styles.headerIcon.color}
                />
                <UIText size="md" weight="normal" style={styles.headerText}>
                    Comments
                </UIText>
            </View>

            <UIDivider color={styles.headerDivider.color} />
        </View>
    );
});




type CommentsFooterProps = {
    bottomSheetProps: BottomSheetFooterProps;
    profileImageUrl: string;
    onHeightChange: (height: number) => void;
};

const CommentsFooter = memo(({
    bottomSheetProps,
    profileImageUrl,
    onHeightChange
}: CommentsFooterProps) => {
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

                <UIDivider height={styles.footerDivider.height} />

                <View style={styles.footerInputBar}>
                    <Icon
                        profileImageUrl={profileImageUrl}
                        size="comment"
                    />

                    <BottomSheetTextInput
                        style={styles.footerInput}
                        placeholder="Add a comment..."
                        placeholderTextColor={styles.inputPlaceholder.color}
                        onChangeText={setCommentText}
                        value={commentText}
                    />

                    <UIButton
                        style={[
                            styles.sendButton,
                            isCommentValid && { backgroundColor: styles.activeSendButton.backgroundColor },
                        ]}
                        onPress={handleSendComment}
                        disabled={!isCommentValid}
                    >
                        <Ionicons
                            name="send-outline"
                            size={styles.sendButtonIcon.height}
                            color={isCommentValid ? styles.sendButtonIcon.color : styles.sendButtonIconActive.color}
                        />
                    </UIButton>

                </View>
            </View>
        </BottomSheetFooter>
    );
},
);




const styles = StyleSheet.create((theme, rt) => ({
    bottomSheet: {
        top: rt.insets.top,
    },

    listContent: {
        paddingHorizontal: theme.utils.s(10),
    },
    loading: {
        color: theme.colors.accent,
    },

    headerContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.utils.s(16),
        paddingBottom: theme.utils.vs(20),
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.utils.s(12),
    },
    headerText: {
        color: theme.colors.primaryText,
    },
    headerIcon: {
        height: theme.utils.s(20),
        color: theme.colors.accent,
    },
    headerDivider: {
        color: theme.colors.mutedAccent
    },

    footerContainer: {
        backgroundColor: theme.colors.bottomSheetBackground,
        alignItems: "center",
        justifyContent: "center",
        gap: theme.utils.s(14),
    },
    footerDivider: {
        height: theme.utils.vs(0.5)
    },
    footerInputBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.utils.s(10),
        paddingHorizontal: theme.utils.s(10),
        paddingBottom: Math.max(rt.insets.bottom, theme.utils.vs(30)),
    },
    footerInput: {
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
    inputPlaceholder: {
        color: theme.colors.muted,
    },

    sendButton: {
        paddingHorizontal: theme.utils.s(10),
        paddingVertical: theme.utils.s(10),
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.backgroundSubtle,
    },
    activeSendButton: {
        backgroundColor: theme.colors.accent,
    },
    sendButtonIcon: {
        height: theme.utils.s(18),
        color: theme.colors.white,
    },
    sendButtonIconActive: {
        color: theme.colors.muted,
    },
}));