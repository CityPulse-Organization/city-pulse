import { ThemedBackground } from "@/src/components";
import { UIButton, UIText } from "@/src/ui";
import { useLogout } from "@/src/hooks";
import WheelPicker from "@quidone/react-native-wheel-picker";
import { matchFont } from "@shopify/react-native-skia";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { memo, useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { CartesianChart, StackedBar } from "victory-native";

const POINTS = [
  {
    name: "Union Square",
    coordinates: { latitude: 37.787994, longitude: -122.407437 },
    tintColor: "#C37D7D",
    systemImage: "plus.circle.fill",
  },
  {
    name: "Golden Gate Bridge",
    coordinates: { latitude: 37.819929, longitude: -122.478255 },
    tintColor: "#C8BC7C",
    systemImage: "plus.circle.fill",
  },
  {
    name: "Fisherman's Wharf",
    coordinates: { latitude: 37.808, longitude: -122.417743 },
    tintColor: "#90C992",
    systemImage: "plus.circle.fill",
  },
  {
    name: "Pier 39",
    coordinates: { latitude: 37.808673, longitude: -122.409821 },
    tintColor: "#C37D7D",
    systemImage: "plus.circle.fill",
  },
  {
    name: "Alcatraz Island",
    coordinates: { latitude: 37.826977, longitude: -122.422956 },
    tintColor: "#C8BC7C",
    systemImage: "plus.circle.fill",
  },
  {
    name: "Chinatown",
    coordinates: { latitude: 37.794138, longitude: -122.407791 },
    tintColor: "rgba(169, 61, 61, 0.5)",
    systemImage: "plus.circle.fill",
  },
  {
    name: "Mission District",
    coordinates: { latitude: 37.759864, longitude: -122.414798 },
    tintColor: "rgb(0, 0, 0)",
    systemImage: "plus.circle.fill",
  },
  {
    name: "Dolores Park",
    coordinates: { latitude: 37.759617, longitude: -122.426906 },
    tintColor: "rgb(255, 255, 255)",
    systemImage: "plus.circle.fill",
  },
  {
    name: "Castro District",
    coordinates: { latitude: 37.760889, longitude: -122.435049 },
    systemImage: "plus.circle.fill",
  },
  {
    name: "Twin Peaks",
    coordinates: { latitude: 37.754407, longitude: -122.447684 },
    systemImage: "plus.circle.fill",
    tintColor: "rgb(0, 64, 255)",
  },
  {
    name: "Haight-Ashbury",
    coordinates: { latitude: 37.769036, longitude: -122.448066 },
    tintColor: "rgb(31, 176, 48)",
    systemImage: "plus.circle.fill",
  },
  {
    name: "Golden Gate Park",
    coordinates: { latitude: 37.769421, longitude: -122.486214 },
    systemImage: "plus.circle.fill",
    tintColor: "rgb(0, 64, 255)",
  },
  {
    name: "Presidio",
    coordinates: { latitude: 37.798874, longitude: -122.466193 },
    systemImage: "plus.circle.fill",
    tintColor: "rgb(0, 64, 255)",
  },
  {
    name: "Palace of Fine Arts",
    coordinates: { latitude: 37.802097, longitude: -122.448802 },
    systemImage: "plus.circle.fill",
  },
  {
    name: "Financial District",
    coordinates: { latitude: 37.794574, longitude: -122.399944 },
    systemImage: "plus.circle.fill",
  },
  {
    name: "Salesforce Tower",
    coordinates: { latitude: 37.789706, longitude: -122.396673 },
    systemImage: "plus.circle.fill",
  },
  {
    name: "AT&T Park",
    coordinates: { latitude: 37.778595, longitude: -122.38927 },
    systemImage: "plus.circle.fill",
  },
  {
    name: "Embarcadero",
    coordinates: { latitude: 37.7952, longitude: -122.393974 },
    systemImage: "plus.circle.fill",
  },
  {
    name: "Ocean Beach",
    coordinates: { latitude: 37.759703, longitude: -122.510759 },
    systemImage: "plus.circle.fill",
  },
  {
    name: "Baker Beach",
    coordinates: { latitude: 37.793572, longitude: -122.483638 },
    systemImage: "plus.circle.fill",
  },
];

const APPLE_MARKERS: AppleMaps.Marker[] = POINTS.map((p) => ({
  id: p.name,
  title: p.name,
  coordinates: p.coordinates,
  systemImage: p.systemImage,
  tintColor: p.tintColor,
}));

const GOOGLE_MARKERS: GoogleMaps.Marker[] = POINTS.map((p) => ({
  id: p.name,
  title: p.name,
  coordinates: p.coordinates,
}));

const COLORS = ["#C37D7D", "#C8BC7C", "#90C992"];

const data = Array.from({ length: 30 }, (_, index) => ({
  month: index + 1,
  incidentsCount: Math.floor(Math.random() * 30),
  criticalCount: Math.floor(Math.random() * 10),
  neutralCount: Math.floor(Math.random() * 10),
  solvedCount: Math.floor(Math.random() * 10),
}));

const YEARS = [...Array(10).keys()].map((index) => ({
  value: 2016 + index,
  label: (2016 + index).toString(),
}));

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((month, index) => ({
  value: index + 1,
  label: month,
}));

const font = matchFont({
  fontFamily: Platform.select({ ios: "Helvetica", default: "sans-serif" }),
  fontSize: 16,
  fontStyle: "normal" as const,
});

const MapSection = memo(() => {
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

  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === "ios" ? (
        <AppleMaps.View
          cameraPosition={{
            zoom: 11.2,
            coordinates: cameraCoordinates,
          }}
          markers={APPLE_MARKERS}
          style={styles.itemContainer}
        />
      ) : (
        <GoogleMaps.View
          cameraPosition={{
            zoom: 11.2,
            coordinates: cameraCoordinates,
          }}
          markers={GOOGLE_MARKERS}
          style={styles.itemContainer}
        />
      )}
    </View>
  );
});

const IncidentsStatistic = ({ period }: { period?: "year" | "month" }) => {
  const { theme } = useUnistyles();
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);

  return (
    <View style={styles.itemContainer}>
      <View style={styles.datePickerContainer}>
        <UIText style={styles.pickerValue}>Selected {period}:</UIText>
        <WheelPicker
          data={YEARS}
          itemTextStyle={styles.pickerValue}
          value={year}
          onValueChanged={({ item: { value } }) => setYear(value)}
          enableScrollByTapOnItem={true}
        />
        {period === "month" ? (
          <WheelPicker
            data={MONTHS}
            itemTextStyle={styles.pickerValue}
            value={month}
            onValueChanged={({ item: { value } }) => setMonth(value)}
            enableScrollByTapOnItem={true}
          />
        ) : null}
      </View>
      <View
        style={{
          flex: 1,
          padding: 10,
          borderRadius: 20,
          backgroundColor: theme.colors.chartBackgroundColor,
          borderColor: theme.colors.chartBorderColor,
          borderWidth: 1,
          elevation: 5,
        }}
      >
        <CartesianChart
          data={data}
          frame={{ lineWidth: 0 }}
          xKey="month"
          yKeys={[
            "incidentsCount",
            "criticalCount",
            "neutralCount",
            "solvedCount",
          ]}
          domainPadding={{ left: 50, right: 50, top: 30 }}
          axisOptions={{
            font: font,
            lineColor: "transparent",
            labelColor: theme.colors.white,
            tickCount: 6,
          }}
        >
          {({ points, chartBounds }) => {
            return (
              <StackedBar
                chartBounds={chartBounds}
                points={[
                  points.criticalCount,
                  points.neutralCount,
                  points.solvedCount,
                ]}
                colors={[COLORS[0], COLORS[1], COLORS[2]]}
              />
            );
          }}
        </CartesianChart>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const { theme } = useUnistyles();
  const { mutate: handleLogout } = useLogout();
  return (
    <ThemedBackground style={styles.screen} withSafeArea={false}>
      {/* <MapSection /> */}

      <UIButton style={styles.logoutButton} onPress={() => handleLogout()}>
        <Ionicons name="log-out-outline" size={20} color={theme.colors.white} />
        <UIText style={styles.logoutText}>Logout</UIText>
      </UIButton>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create((theme) => ({
  itemContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    padding: 10,
    borderRadius: 30,
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
