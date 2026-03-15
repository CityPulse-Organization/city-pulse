import { BlurView } from "expo-blur";
import React from "react";
import { View } from "react-native";
import { UIButton } from "../ui";

import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

export const BottomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.container}>
      <BlurView
        intensity={80}
        tint={UnistylesRuntime.themeName}
        style={styles.glass}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <UIButton
              hitSlop={15}
              key={index}
              onPress={onPress}
              style={[styles.tabButton, isFocused && styles.tabButtonActive]}
            >
              {options.tabBarIcon({
                color: styles.tabBarIcon({ isFocused }).color,
              })}
            </UIButton>
          );
        })}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    position: "absolute",
    bottom: rt.insets.bottom + 12,
    left: 40,
    right: 40,
    alignItems: "center",
    zIndex: 999,
  },
  glass: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    borderRadius: 50,
    paddingVertical: 2,
    borderWidth: 1.5,
    borderColor: theme.colors.tabBarBorder,
    overflow: "hidden",
  },
  tabBarIcon: ({ isFocused }: { isFocused: boolean }) => ({
    color: isFocused ? theme.colors.tabBarIconActive : theme.colors.tabBarIconDefault,
  }),
  tabButton: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: theme.colors.tabBarItemActiveBackground,
  },
}));
