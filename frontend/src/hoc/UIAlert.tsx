import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { Modal, Pressable, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  FadeInUp,
  FadeOutDown,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import { UIText } from "@/src/ui";
import { scheduleOnRN } from "react-native-worklets";
import { BlurView } from "expo-blur";

export type UIAlertButton = {
  text?: string;
  onPress?: () => void | Promise<void>;
  style?: "default" | "cancel" | "destructive";
};

export type UIAlertOptions = {
  title: string;
  message?: string;
  buttons?: UIAlertButton[];
};

type UIAlertContextType = {
  showAlert: (options: UIAlertOptions) => void;
  hideAlert: () => void;
};

const UIAlertContext = createContext<UIAlertContextType | null>(null);

export const UIAlert = {
  alert: (title: string, message?: string, buttons?: UIAlertButton[]) => {
    if (alertContextRef) {
      alertContextRef.showAlert({ title, message, buttons });
    } else {
      console.warn(
        "UIAlertProvider is not mounted. Wrap your app with UIAlertProvider.",
      );
    }
  },
};

export const UIAlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const config = useRef<UIAlertOptions | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showAlert = useCallback((opts: UIAlertOptions) => {
    config.current = opts;
    setIsVisible(true);
  }, []);

  const hideAlert = useCallback((callback?: () => void) => {
    setIsVisible(false);
    callback?.();
  }, []);

  const contextRef = useRef<UIAlertContextType>({ showAlert, hideAlert });

  useLayoutEffect(() => {
    contextRef.current = { showAlert, hideAlert };
    setAlertContextRef(contextRef.current);
  }, [showAlert, hideAlert]);

  useEffect(() => {
    return () => setAlertContextRef(null);
  }, []);

  const handlePress = useCallback(
    (btn: UIAlertButton) => {
      hideAlert();
      if (btn.onPress) btn.onPress();
    },
    [hideAlert],
  );

  const activeConfig = config.current;
  const buttons = activeConfig?.buttons?.length
    ? activeConfig.buttons
    : [{ text: "OK", style: "default" as const }];

  return (
    <UIAlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Modal transparent visible={isVisible} animationType="none">
        {isVisible && activeConfig && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200).withCallback((finished) => {
              if (finished) {
                config.current = null;
              }
            })}
            style={styles.backdrop}
          >
            <BlurView intensity={20} tint="dark" style={styles.absoluteFill} />
            <Pressable
              style={styles.absoluteFill}
              onPress={() => hideAlert()}
            />
            <Animated.View
              entering={FadeInUp.duration(250)}
              exiting={FadeOutDown.duration(200)}
              style={styles.alertBox}
            >
              <BlurView intensity={20} tint="dark" style={styles.blurBox}>
                <View style={styles.header}>
                  <UIText size="lg" weight="bold" style={styles.title}>
                    {activeConfig.title}
                  </UIText>
                  {!!activeConfig.message && (
                    <UIText size="md" style={styles.message}>
                      {activeConfig.message}
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
                      <View key={index} style={[styles.buttonWrapper]}>
                        <Pressable
                          onPress={() => handlePress(btn)}
                          style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                          ]}
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
              </BlurView>
            </Animated.View>
          </Animated.View>
        )}
      </Modal>
    </UIAlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(UIAlertContext);
  if (!context) {
    throw new Error("useAlert must be used within UIAlertProvider");
  }
  return context;
};

let alertContextRef: UIAlertContextType | null = null;

export const setAlertContextRef = (ref: UIAlertContextType | null) => {
  alertContextRef = ref;
};

const styles = StyleSheet.create((theme) => ({
  absoluteFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.utils.s(24),
  },
  alertBox: {
    width: "100%",
    maxWidth: theme.utils.s(340),
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.dividerColor,
  },
  blurBox: {
    flex: 0,
    backgroundColor: theme.colors.darkGray,
  },
  header: {
    padding: theme.utils.s(24),
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    color: theme.colors.textColor,
    marginBottom: theme.utils.s(8),
  },
  message: {
    textAlign: "center",
    color: theme.colors.iconInfoStatusTextColor,
    lineHeight: theme.utils.s(20),
  },
  buttonRow: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.dividerColor,
  },
  buttonCol: {
    flexDirection: "column",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.dividerColor,
  },
  buttonWrapper: {
    flex: 1,
  },

  button: {
    paddingVertical: theme.utils.s(16),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    backgroundColor: theme.colors.dividerColor,
  },
  buttonText: {
    color: theme.colors.violet,
  },
  cancelText: {
    color: theme.colors.primaryTextColor,
  },
  destructiveText: {
    color: theme.colors.lightRed,
  },
}));
