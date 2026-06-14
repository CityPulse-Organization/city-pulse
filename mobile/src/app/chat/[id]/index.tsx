import { LinearGradient } from "expo-linear-gradient";
import { UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import {
  Bubble,
  BubbleProps,
  GiftedChat,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  Send,
  SendProps,
} from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "See you at the Zamek event tonight! 🎉",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "@anna_kowalska",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
        },
      },
      {
        _id: 2,
        text: "Are you going to the festival?",
        createdAt: new Date(Date.now() - 600000),
        user: {
          _id: 2,
          name: "@anna_kowalska",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
        },
      },
      {
        _id: 3,
        text: "Hey! What's up?",
        createdAt: new Date(Date.now() - 1200000),
        user: {
          _id: 1,
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages),
    );
  }, []);

  const renderBubble = useCallback((props: BubbleProps<IMessage>) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: styles.bubbleRight,
          left: styles.bubbleLeft,
        }}
        textStyle={{
          right: styles.textRight,
          left: styles.textLeft,
        }}
      />
    );
  }, []);

  const renderInputToolbar = useCallback(
    (props: InputToolbarProps<IMessage>) => {
      return (
        <InputToolbar
          {...props}
          containerStyle={styles.inputToolbarContainer}
          primaryStyle={styles.inputToolbarPrimary}
        />
      );
    },
    [],
  );

  const renderSend = useCallback(
    (props: SendProps<IMessage>) => {
      return (
        <Send {...props} containerStyle={styles.sendContainer}>
          <View style={styles.sendButtonInner}>
            <Ionicons name="send" size={styles.sendButtonIcon.height} color="#fff" />
          </View>
        </Send>
      );
    },
    [],
  );

  const headerTitle = id === "organizer" ? "Organizer" : "Anna Kowalska";
  const headerAvatar =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200";

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          styles.linearGradientEnd.color,
          styles.linearGradientStart.color,
        ]}
        style={StyleSheet.absoluteFillObject}
      />
      <BlurView
        intensity={80}
        tint={styles.blurTint.color}
        style={[styles.header, { paddingTop: insets.top + styles.headerPaddingTop.paddingTop }]}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons
            name="chevron-back"
            size={styles.headerBackButton.height}
            color={styles.headerBackButton.color}
          />
        </Pressable>
        <View style={styles.headerInfo}>
          <Image
            source={{ uri: headerAvatar }}
            style={styles.headerAvatar}
            cachePolicy="memory-disk"
          />
          <View style={styles.headerTextWrap}>
            <UIText weight="bold" size="md" style={styles.headerTitle}>
              {headerTitle}
            </UIText>
            <UIText size="xs" style={styles.headerSubtitle}>
              Online
            </UIText>
          </View>
        </View>
        <View style={styles.headerPlaceholder} />
      </BlurView>

      <GiftedChat
        messages={messages}
        onSend={(msgs) => onSend(msgs)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        textInputProps={{
          style: styles.composerTextInput,
          placeholderTextColor: styles.composerTextInputColor.color,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    paddingBottom: rt.insets.bottom,
  },
  linearGradientStart: {
    color: theme.colors.background,
  },
  linearGradientEnd: {
    color: theme.colors.backgroundOverlay || theme.colors.background,
  },
  header: {
    paddingBottom: theme.utils.vs(12),
    paddingHorizontal: theme.utils.s(16),
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderSubtle,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerPaddingTop: {
    paddingTop: theme.utils.vs(10),
  },
  backButton: {
    padding: theme.utils.s(4),
  },
  blurTint: {
    color: rt.themeName,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.utils.s(10),
  },
  headerAvatar: {
    width: theme.utils.s(36),
    height: theme.utils.s(36),
    borderRadius: theme.utils.s(18),
  },
  headerTextWrap: {
    alignItems: "flex-start",
  },
  headerTitle: {
    color: theme.colors.primaryText,
    marginBottom: Platform.OS === "ios" ? 1 : 0,
  },
  headerSubtitle: {
    color: "#4CAF50",
  },
  headerPlaceholder: {
    width: theme.utils.s(34),
  },

  bubbleRight: {
    backgroundColor: theme.colors.accent,
    borderTopLeftRadius: theme.utils.s(18),
    borderTopRightRadius: theme.utils.s(18),
    borderBottomLeftRadius: theme.utils.s(18),
    borderBottomRightRadius: theme.utils.s(4),
    paddingVertical: theme.utils.vs(5),
    paddingHorizontal: theme.utils.s(5),
    marginVertical: theme.utils.vs(2),
  },
  bubbleLeft: {
    backgroundColor: theme.colors.backgroundSubtle,
    borderTopLeftRadius: theme.utils.s(18),
    borderTopRightRadius: theme.utils.s(18),
    borderBottomLeftRadius: theme.utils.s(4),
    borderBottomRightRadius: theme.utils.s(18),
    paddingVertical: theme.utils.vs(5),
    paddingHorizontal: theme.utils.s(5),
    marginVertical: theme.utils.vs(2),
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  textRight: {
    color: "#ffffff",
    fontSize: theme.utils.s(15),
  },
  textLeft: {
    color: theme.colors.primaryText,
    fontSize: theme.utils.s(15),
  },

  inputToolbarContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    paddingVertical: theme.utils.vs(6),
    paddingHorizontal: theme.utils.s(16),
  },
  inputToolbarPrimary: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundSubtle,
    borderRadius: theme.utils.s(25),
    paddingHorizontal: theme.utils.s(6),
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  composerTextInput: {
    color: theme.colors.primaryText,
    paddingTop: Platform.OS === "ios" ? theme.utils.vs(12) : theme.utils.vs(10),
    paddingBottom:
      Platform.OS === "ios" ? theme.utils.vs(12) : theme.utils.vs(10),
    paddingHorizontal: theme.utils.s(12),
    fontSize: theme.utils.s(15),
  },
  sendContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: theme.utils.s(4),
  },
  sendButtonInner: {
    width: theme.utils.s(32),
    height: theme.utils.s(32),
    borderRadius: theme.utils.s(16),
    backgroundColor: theme.colors.accent,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 2,
  },
  sendButtonIcon: {
    height: theme.utils.s(16),
  },
  headerBackButton: {
    height: theme.utils.s(26),
    color: theme.colors.primaryText,
  },
  composerTextInputColor: {
    color: theme.colors.muted,
  },

}));
