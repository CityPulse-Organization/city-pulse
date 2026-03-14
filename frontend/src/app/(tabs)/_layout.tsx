import { BottomTabBar } from "@/src/components";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
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
