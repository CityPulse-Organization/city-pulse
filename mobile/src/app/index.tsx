import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet as RNStyleSheet, View } from "react-native";
import {
  useSharedValue,
  withTiming,
  withDelay,
  useAnimatedReaction,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import { scheduleOnRN } from "react-native-worklets";
import { UIButton, UILoader } from "../ui";
import { useSession } from "../hoc";
import * as LocalAuthentication from "expo-local-authentication";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { UIText } from "../ui";
import { settingsStore } from "../store/settings";
import { useStore } from "zustand";
import { ThemedBackground } from "../components";



function BiometricLockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [failed, setFailed] = useState(false);

  const tryAuth = async () => {
    setIsAuthenticating(true);
    setFailed(false);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock City Pulse",
        cancelLabel: "Cancel",
      });
      if (result.success) {
        onUnlock();
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const triggered = useRef(false);
  useEffect(() => {
    if (!triggered.current) {
      triggered.current = true;
      tryAuth();
    }
  }, []);

  return (
    <ThemedBackground>
      <View style={lockStyles.container}>
        <View style={lockStyles.iconWrap}>
          <LinearGradient
            colors={[lockStyles.gradientStart.color, lockStyles.gradientEnd.color]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={lockStyles.gradient}
          />
          <Ionicons
            name={failed ? "lock-closed" : "finger-print-outline"}
            size={lockStyles.icon.height}
            color={lockStyles.icon.color}
          />
        </View>

        <UIText size="xl" weight="bold" style={lockStyles.title}>
          {failed ? "Authentication Failed" : "City Pulse"}
        </UIText>

        <UIText size="sm" style={lockStyles.subtitle}>
          {failed
            ? "Biometric authentication was not successful."
            : "Verify your identity to continue."}
        </UIText>

        <UIButton
          onPress={tryAuth}
          disabled={isAuthenticating}
          style={({ pressed }) => [
            lockStyles.button,
            pressed && lockStyles.buttonPressed,
          ]}
        >
          <LinearGradient
            colors={[lockStyles.gradientStart.color, lockStyles.gradientEnd.color]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={lockStyles.gradient}
          />
          {isAuthenticating ? (
            <ActivityIndicator color={lockStyles.loader.color} size="small" />
          ) : (
            <>
              <Ionicons name="finger-print-outline" size={lockStyles.buttonIcon.size} color={lockStyles.buttonIcon.color} />
              <UIText size="md" weight="bold" style={lockStyles.buttonText}>
                {failed ? "Try Again" : "Authenticate"}
              </UIText>
            </>
          )}
        </UIButton>
      </View>
    </ThemedBackground>
  );
}

const lockStyles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: theme.utils.s(40),
    gap: theme.utils.vs(16),
    paddingBottom: rt.insets.bottom,
    paddingTop: theme.utils.vs(100),
  },

  iconWrap: {
    width: theme.utils.s(88),
    height: theme.utils.s(88),
    borderRadius: 99,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.utils.vs(8),
  },

  gradient: {
    ...RNStyleSheet.absoluteFillObject,
  },
  gradientStart: {
    color: theme.colors.lightAccent,
  },
  gradientEnd: {
    color: theme.colors.darkAccent,
  },

  icon: {
    color: theme.colors.white,
    height: theme.utils.s(40),
  },

  title: {
    color: theme.colors.primaryText,
    textAlign: "center",
  },
  subtitle: {
    color: theme.colors.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: theme.utils.vs(16),
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.utils.s(10),
    paddingVertical: theme.utils.vs(14),
    paddingHorizontal: theme.utils.s(36),
    borderRadius: 99,
    overflow: "hidden",
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: theme.colors.primaryText,
  },
  buttonIcon: {
    color: theme.colors.white,
    size: theme.utils.s(20),
  },
  loader: {
    color: theme.colors.white,
  },
}));



export default function IndexRoute() {
  const { session, isLoading } = useSession();
  const isBiometricEnabled = useStore(settingsStore, (s) => s.isBiometricEnabled);

  const [animReady, setAnimReady] = useState(false);
  const [showBiometricGate, setShowBiometricGate] = useState(false);
  const animDone = useSharedValue(0);

  useEffect(() => {
    animDone.value = withDelay(1400, withTiming(1, { duration: 10 }));
  }, []);

  useAnimatedReaction(
    () => animDone.value,
    (value) => {
      if (value >= 1) {
        scheduleOnRN(setAnimReady, true);
      }
    },
  );

  useEffect(() => {
    if (!animReady || isLoading) return;

    if (!session.user) {
      router.replace("/(auth)");
      return;
    }

    if (!isBiometricEnabled) {
      router.replace("/(tabs)");
      return;
    }

    const verifyAndEnter = async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
          settingsStore.getState().setIsBiometricEnabled(false);
          router.replace("/(tabs)");
        } else {
          setShowBiometricGate(true);
        }
      } catch (error) {
        settingsStore.getState().setIsBiometricEnabled(false);
        router.replace("/(tabs)");
      }
    };

    verifyAndEnter();

  }, [animReady, isLoading, session.user, isBiometricEnabled]);

  if (showBiometricGate) {
    return (
      <BiometricLockScreen
        onUnlock={() => {
          setShowBiometricGate(false);
          router.replace("/(tabs)");
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <UILoader />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
}));
