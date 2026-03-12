import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

type UIKeyboardAvoidingScrollViewProps = {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  keyboardVerticalOffset?: number;
} & ScrollViewProps;

export const UIKeyboardAvoidingScrollView = ({
  children,
  contentContainerStyle,
  style,
  keyboardVerticalOffset,
  ...props
}: UIKeyboardAvoidingScrollViewProps) => {
  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
}));