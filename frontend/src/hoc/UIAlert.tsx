import React, { useEffect, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import Animated, { FadeIn, FadeOut, FadeInUp, FadeOutDown, runOnJS } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import { UIText } from "@/src/ui";

type UIAlertButton = {
  text?: string;
  onPress?: () => void | Promise<void>;
  style?: "default" | "cancel" | "destructive";
};

type UIAlertOptions = {
  title: string;
  message?: string;
  buttons?: UIAlertButton[];
};

let globalShowAlert: (options: UIAlertOptions) => void;
let globalHideAlert: () => void;

export const UIAlert = {
  alert: (title: string, message?: string, buttons?: UIAlertButton[]) => {
    if (globalShowAlert) {
      globalShowAlert({ title, message, buttons });
    } else {
      console.warn("UIAlertProvider is not mounted in the tree.");
    }
  },
};

export const UIAlertProvider = () => {
  const [alertConfig, setAlertConfig] = useState<UIAlertOptions | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    globalShowAlert = (opts) => {
      setAlertConfig(opts);
      setIsVisible(true);
    };
    globalHideAlert = () => setIsVisible(false);
  }, []);

  const handlePress = (btn: UIAlertButton) => {
    globalHideAlert();
    if (btn.onPress) btn.onPress();
  };

  const buttons = alertConfig?.buttons?.length
    ? alertConfig.buttons
    : [{ text: "OK", style: "default" as const }];

  return (
    <Modal transparent visible={isVisible || !!alertConfig} animationType="none">
      {isVisible && alertConfig && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200).withCallback((finished) => {
            if (finished) runOnJS(setAlertConfig)(null);
          })}
          style={styles.backdrop}
        >
          <Pressable
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={() => globalHideAlert()}
          />
          <Animated.View
            entering={FadeInUp.duration(250)}
            exiting={FadeOutDown.duration(200)}
            style={styles.alertBox}
          >
            <View style={styles.header}>
              <UIText size="lg" weight="bold" style={styles.title}>
                {alertConfig.title}
              </UIText>
              {!!alertConfig.message && (
                <UIText size="md" style={styles.message}>
                  {alertConfig.message}
                </UIText>
              )}
            </View>

            <View
              style={[
                buttons.length === 2 ? styles.buttonRow : styles.buttonCol,
              ]}
            >
              {buttons.map((btn, index) => {
                const isLast = index === buttons.length - 1;
                const isDefault = !btn.style || btn.style === "default";
                const isDestructive = btn.style === "destructive";

                return (
                  <View
                    key={index}
                    style={[
                      styles.buttonWrapper,
                      buttons.length === 2 && !isLast && styles.buttonBorderRight,
                      buttons.length !== 2 && !isLast && styles.buttonBorderBottom,
                    ]}
                  >
                    <Pressable
                      onPress={() => handlePress(btn)}
                      style={styles.button}
                    >
                      <UIText
                        size="lg"
                        weight={isDefault ? "bold" : "normal"}
                        style={[
                          styles.buttonText,
                          isDestructive && styles.destructiveText,
                          !isDefault && !isDestructive && styles.cancelText,
                        ]}
                      >
                        {btn.text || "OK"}
                      </UIText>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create((theme) => ({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  alertBox: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: theme.colors.background,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    color: theme.colors.primaryText,
    marginBottom: 8,
  },
  message: {
    textAlign: "center",
    color: theme.colors.muted,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  buttonCol: {
    flexDirection: "column",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  buttonWrapper: {
    flex: 1,
  },
  buttonBorderRight: {
    borderRightWidth: 1,
    borderRightColor: "rgba(255, 255, 255, 0.1)",
  },
  buttonBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  button: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#A78BFA", // Primary action color
  },
  cancelText: {
    color: theme.colors.primaryText,
  },
  destructiveText: {
    color: theme.colors.lightRed,
  },
}));
