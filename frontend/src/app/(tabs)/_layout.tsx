import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";
import { BottomTabBar } from "@/src/components";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native-unistyles";

export default function TabLayout() {
  if (Platform.OS === "ios") {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <Icon sf="map" selectedColor={styles.icon.color} />

          <Label>Map</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="news">
          <Icon sf="newspaper" selectedColor={styles.icon.color} />
          <Label>News</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="search">
          <Icon sf="magnifyingglass" selectedColor={styles.icon.color} />
          <Label>Search</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="person" selectedColor={styles.icon.color} />
          <Label>Profile</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }
  return (
    <Tabs
      screenOptions={{
        header: () => null,
      }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons color={color} size={28} name="map-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons color={color} size={28} name="layers-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons color={color} size={28} name="search" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons color={color} size={28} name="person-outline" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  icon: {
    color: theme.colors.lightViolet,
  },
}));
