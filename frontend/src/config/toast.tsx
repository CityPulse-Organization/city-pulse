import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text } from "react-native";
import { ToastConfig, ToastConfigParams } from "react-native-toast-message";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

interface ModernToastProps {
  props: ToastConfigParams<any>;
  gradientColors: [string, string, ...string[]];
  icon?: string;
}

const ModernToast = ({
  props,
  gradientColors,
  icon = "✨",
}: ModernToastProps) => {
  const themeName = UnistylesRuntime.themeName;
  const blurTint = themeName === "dark" ? "dark" : "extraLight";

  const transparentColors = gradientColors.map((color) => `${color}33`) as [
    string,
    string,
    ...string[],
  ];

  return (
    <View style={styles.outerContainer}>
      <BlurView
        intensity={60}
        tint={blurTint}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={transparentColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mainGradient}
      >
        <View style={styles.innerContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>
          <View style={styles.textWrapper}>
            {props.text1 && (
              <Text style={styles.text1} numberOfLines={1}>
                {props.text1}
              </Text>
            )}
            {props.text2 && (
              <Text style={styles.text2} numberOfLines={2}>
                {props.text2}
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export const toastConfig: ToastConfig = {
  success: (props: ToastConfigParams<any>) => (
    <ModernToast
      props={props}
      gradientColors={["#00b09b", "#96c93d"]}
      icon="✅"
    />
  ),
  error: (props: ToastConfigParams<any>) => (
    <ModernToast
      props={props}
      gradientColors={["#FF416C", "#FF4B2B"]}
      icon="❌"
    />
  ),
  info: (props: ToastConfigParams<any>) => (
    <ModernToast
      props={props}
      gradientColors={["#4776E6", "#8E54E9"]}
      icon="ℹ️"
    />
  ),
};

const styles = StyleSheet.create((theme) => {
  const themeName = UnistylesRuntime.themeName;
  const isDark = themeName === "dark";

  return {
    outerContainer: {
      width: "90%",
      borderRadius: 22,
      overflow: "hidden",
      shadowColor: theme.colors.black,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 15,
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(255, 255, 255, 0.5)",
    },
    mainGradient: {
      paddingVertical: 14,
      paddingHorizontal: 18,
      minHeight: 80,
      flexDirection: "row",
      alignItems: "center",
    },
    innerContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    iconText: {
      fontSize: 22,
    },
    textWrapper: {
      flex: 1,
      justifyContent: "center",
    },
    text1: {
      fontSize: theme.utils.ms(17),
      fontWeight: "900",
      color: isDark ? "#ffffff" : "#1a1a1a",
      letterSpacing: -0.4,
    },
    text2: {
      fontSize: theme.utils.ms(14),
      fontWeight: "600",
      color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
      marginTop: 2,
    },
  };
});
