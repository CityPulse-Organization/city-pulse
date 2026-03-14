import { ThemedBackground, MapboxMap } from "@/src/components";
import { MapboxMarker } from "@/src/components/MapboxMap";
import { UIButton, UIText } from "@/src/ui";
import { useLogout } from "@/src/hooks";
import { UIAlert } from "@/src/hoc";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { memo, useEffect, useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { LUBLIN_DISTRICTS } from "@/src/data/lublinDistricts";

const POINTS: (MapboxMarker & {
  systemImage?: string;
  name: string;
  coordinates: { latitude: number; longitude: number };
  tintColor: string;
})[] = [
  {
    name: "Zamek Lubelski",
    coordinates: { latitude: 51.2504, longitude: 22.5721 },
    tintColor: "#c37d7d",
    systemImage: "plus.circle.fill",
    icon: "bonfire",
    latitude: 51.2504,
    longitude: 22.5721,
    label: "Zamek",
  },
  {
    name: "Brama Krakowska",
    coordinates: { latitude: 51.2478, longitude: 22.5678 },
    tintColor: "#c8bc7c",
    systemImage: "plus.circle.fill",
    icon: "lock-closed",
    latitude: 51.2478,
    longitude: 22.5678,
    label: "Brama",
  },
  {
    name: "Archikatedra Lubelska",
    coordinates: { latitude: 51.2464, longitude: 22.5694 },
    tintColor: "#90c992",
    systemImage: "plus.circle.fill",
    icon: "book",
    latitude: 51.2464,
    longitude: 22.5694,
    label: "Katedra",
  },
  {
    name: "Plac Litewski",
    coordinates: { latitude: 51.2485, longitude: 22.5598 },
    tintColor: "#0040ff",
    systemImage: "plus.circle.fill",
    icon: "color-filter",
    latitude: 51.2485,
    longitude: 22.5598,
    label: "Fontanny",
  },
  {
    name: "Centrum Spotkania Kultur",
    coordinates: { latitude: 51.2472, longitude: 22.55 },
    tintColor: "#a93d3d",
    systemImage: "plus.circle.fill",
    icon: "cube",
    latitude: 51.2472,
    longitude: 22.55,
    label: "CSK",
  },
  {
    name: "Ogród Saski",
    coordinates: { latitude: 51.25, longitude: 22.548 },
    tintColor: "#1fb030",
    systemImage: "plus.circle.fill",
    icon: "leaf",
    latitude: 51.25,
    longitude: 22.548,
    label: "Saski",
  },
];

const MARKERS3D = POINTS.map((p) => ({
  latitude: p.coordinates.latitude,
  longitude: p.coordinates.longitude,
  label: p.name,
  color: p.tintColor || "#ff0000",
}));

const MapSection = memo(function MapSectionComponent() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  useEffect(() => {
    async function getCurrentLocation() {
      await Location.requestForegroundPermissionsAsync();
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  const cameraCoordinates = location?.coords.latitude
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
    : POINTS[0]?.coordinates;

  const mapboxApiKey = process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_KEY || "";
  if (!mapboxApiKey) {
    console.error("EXPO_PUBLIC_MAPBOX_PUBLIC_KEY is not defined in .env file");
  }
  return (
    <View style={styles.itemContainer}>
      <MapboxMap
        apiKey={mapboxApiKey}
        markers={MARKERS3D}
        districts={LUBLIN_DISTRICTS}
        camera={{
          latitude: cameraCoordinates?.latitude || 51.2465,
          longitude: cameraCoordinates?.longitude || 22.5684,
          zoom: 15.5,
          bearing: 10,
          pitch: 60,
        }}
      />
    </View>
  );
});

export default function HomeScreen() {
  const { mutate: handleLogout } = useLogout();
  return (
    <ThemedBackground style={styles.screen} withoutSafeArea>
      <MapSection />

      <UIButton style={styles.logoutButton} onPress={() => handleLogout()}>
        <Ionicons name="log-out-outline" size={20} color={styles.icon.color} />
        <UIText style={styles.logoutText}>Logout</UIText>
      </UIButton>

      <UIButton
        style={[styles.logoutButton, { top: 120, right: 20, left: undefined }]}
        onPress={() => {
          UIAlert.alert(
            "Test Alert Popup",
            "This is a test of the new custom UIAlert component.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Confirm", style: "default" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => console.log("Deleted!"),
              },
            ],
          );
        }}
      >
        <Ionicons
          name="alert-circle-outline"
          size={20}
          color={styles.icon.color}
        />
        <UIText style={styles.logoutText}>Show Alert</UIText>
      </UIButton>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create((theme) => ({
  icon: {
    color: theme.colors.white,
  },
  itemContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  paginationContainer: { gap: 5, marginBottom: 10 },
  paginationDotActive: { backgroundColor: theme.colors.white },
  paginationDot: {
    backgroundColor: theme.colors.black,
    width: 10,
    borderRadius: 40,
  },
  nextButton: {
    backgroundColor: theme.colors.bottomTabsBackgoundColor,
    borderColor: theme.colors.bottomTabsBorderColor,
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  screen: { gap: 30 },
  logoutButton: {
    position: "absolute",
    top: 60,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 99,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  logoutText: {
    color: "white",
    fontSize: 14,
  },
  datePickerContainer: {
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    borderRadius: 20,
  },
  pickerValue: { color: theme.colors.primaryTextColor },
}));
