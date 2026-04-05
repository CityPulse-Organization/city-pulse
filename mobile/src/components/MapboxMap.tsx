import React, { memo, useEffect, useMemo, useState } from "react";
import { View, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native-unistyles";
import { UIText } from "@/src/ui";
import Mapbox, {
  MapView,
  Camera,
  ShapeSource,
  Terrain,
  RasterDemSource,
  FillLayer,
  LineLayer,
  MarkerView,
} from "@rnmapbox/maps";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export interface MapboxMarker {
  latitude: number;
  longitude: number;
  label?: string;
  color?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export interface MapboxDistrict {
  id: string;
  name: string;
  color: string;
  coordinates: [number, number][];
}

export interface MapboxCamera {
  latitude: number;
  longitude: number;
  zoom?: number;
  pitch?: number;
  bearing?: number;
}

export interface MapboxMapProps {
  markers: MapboxMarker[];
  districts?: MapboxDistrict[];
  camera?: MapboxCamera;
}

Mapbox.setAccessToken(null);

if (process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_KEY) {
  Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_KEY);
}

export const MapboxMap = memo(
  ({ markers, districts, camera }: MapboxMapProps) => {
    const [showDistricts, setShowDistricts] = useState(true);
    const [showMarkers, setShowMarkers] = useState(true);

    const districtSource = useMemo(() => {
      return {
        type: "FeatureCollection" as const,
        features: (districts || []).map((d: MapboxDistrict) => {
          let group = "CENTRE";
          if (d.color === "#2e8b57") group = "NORTH";
          if (d.color === "#4169e1") group = "SOUTH";
          if (d.color === "#cd5c5c") group = "EAST";
          if (d.color === "#9370db") group = "WEST";

          return {
            type: "Feature" as const,
            id: d.id,
            properties: {
              name: d.name,
              colorGroup: group,
            },
            geometry: {
              type: "Polygon" as const,
              coordinates: [d.coordinates],
            },
          };
        }),
      };
    }, [districts]);

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          styleURL="mapbox://styles/mapbox/standard"
          logoEnabled={false}
          attributionEnabled={false}
        >
          <Camera
            animationDuration={2000}
            animationMode="flyTo"
            centerCoordinate={[
              camera?.longitude ?? -122.4194,
              camera?.latitude ?? 37.7749,
            ]}
            zoomLevel={camera?.zoom ?? 15.5}
            pitch={camera?.pitch ?? 60}
            heading={camera?.bearing ?? 10}
          />

          <RasterDemSource
            id="mapbox-dem"
            url="mapbox://mapbox.mapbox-terrain-dem-v1"
            tileSize={512}
          >
            <Terrain style={{ exaggeration: 1.5 }} />
          </RasterDemSource>
          {showDistricts && (
            <ShapeSource id="districtSource" shape={districtSource}>
              <FillLayer
                id="districtFill"
                style={{
                  fillColor: [
                    "match",
                    ["get", "colorGroup"],
                    "CENTRE",
                    "#ff8c00",
                    "NORTH",
                    "#2e8b57",
                    "SOUTH",
                    "#4169e1",
                    "EAST",
                    "#cd5c5c",
                    "WEST",
                    "#9370db",
                    "#ffffff",
                  ],
                  fillOpacity: 0.15,
                }}
                slot="bottom"
              />
              <LineLayer
                id="districtOutline"
                style={{
                  lineColor: [
                    "match",
                    ["get", "colorGroup"],
                    "CENTRE",
                    "#ff8c00",
                    "NORTH",
                    "#2e8b57",
                    "SOUTH",
                    "#4169e1",
                    "EAST",
                    "#cd5c5c",
                    "WEST",
                    "#9370db",
                    "#ffffff",
                  ],
                  lineWidth: 1.5,
                  lineOpacity: 0.5,
                  lineDasharray: [2, 2],
                }}
                slot="bottom"
              />
            </ShapeSource>
          )}

          {showMarkers &&
            markers.map((marker, index) => (
              <MarkerView
                key={`custom-marker-${index}`}
                coordinate={[marker.longitude, marker.latitude]}
                allowOverlap={true}
              >
                <View style={styles.customMarkerContainer}>
                  <View
                    style={[
                      styles.markerPulse,
                      styles.dynamicBackground(marker.color),
                    ]}
                  />
                  <View
                    style={[
                      styles.markerDisc,
                      styles.dynamicBorder(marker.color),
                    ]}
                  >
                    <Ionicons
                      name={marker.icon || "location"}
                      size={16}
                      color="#ffffff"
                    />
                  </View>
                  {marker.label && (
                    <View style={styles.markerLabelContainer}>
                      <LinearGradient
                        colors={[
                          "rgba(30, 30, 30, 0.9)",
                          "rgba(10, 10, 10, 0.95)",
                        ]}
                        style={styles.labelGradient}
                      >
                        <View style={styles.textWrapper}>
                          <View
                            style={[
                              styles.statusDot,
                              styles.dynamicBackground(marker.color),
                            ]}
                          />
                          <View style={styles.shrinkContainer}>
                            <UIText
                              size="xs"
                              weight="normal"
                              style={styles.markerLabelText}
                            >
                              {marker.label}
                            </UIText>
                          </View>
                        </View>
                      </LinearGradient>
                    </View>
                  )}
                </View>
              </MarkerView>
            ))}
        </MapView>

        {((districts && districts.length > 0) ||
          (markers && markers.length > 0)) && (
          <View style={styles.overlayControls}>
            <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
              {districts && districts.length > 0 && (
                <Pressable
                  onPress={() => setShowDistricts(!showDistricts)}
                  style={styles.toggleButton}
                >
                  <Ionicons
                    name={showDistricts ? "layers" : "layers-outline"}
                    size={22}
                    style={styles.marker(showDistricts)}
                  />
                </Pressable>
              )}
              {districts &&
                districts.length > 0 &&
                markers &&
                markers.length > 0 && <View style={styles.divider} />}
              {markers && markers.length > 0 && (
                <Pressable
                  onPress={() => setShowMarkers(!showMarkers)}
                  style={styles.toggleButton}
                >
                  <Ionicons
                    name={showMarkers ? "location" : "location-outline"}
                    size={22}
                    style={styles.marker(showMarkers)}
                  />
                </Pressable>
              )}
            </BlurView>
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  map: {
    flex: 1,
  },
  overlayControls: {
    position: "absolute",
    right: theme.utils.s(16),
    top: Math.max(rt.insets.top, theme.utils.vs(20)) + theme.utils.vs(16),
    borderRadius: theme.utils.s(24),
    overflow: "hidden",
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: theme.utils.vs(4) },
    shadowOpacity: 0.3,
    shadowRadius: theme.utils.s(5),
    elevation: 6,
    backgroundColor: "transparent",
  },
  blurContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  divider: {
    height: theme.utils.vs(1),
    width: "60%",
    backgroundColor: theme.colors.divider,
  },
  toggleButton: {
    width: theme.utils.s(44),
    height: theme.utils.s(44),
    alignItems: "center",
    justifyContent: "center",
  },
  customMarkerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerDisc: {
    width: theme.utils.s(32),
    height: theme.utils.s(32),
    borderRadius: theme.utils.s(16),
    backgroundColor: theme.colors.backgroundOverlay,
    borderWidth: theme.utils.s(2),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: theme.utils.vs(4) },
    shadowOpacity: 0.3,
    shadowRadius: theme.utils.s(5),
    elevation: 5,
  },
  markerPulse: {
    position: "absolute",
    width: theme.utils.s(48),
    height: theme.utils.s(48),
    borderRadius: theme.utils.s(24),
    opacity: 0.2,
  },
  markerLabelContainer: {
    position: "absolute",
    bottom: theme.utils.vs(38),
    alignItems: "center",
    minWidth: theme.utils.s(80),
  },
  labelGradient: {
    paddingVertical: theme.utils.vs(4),
    paddingHorizontal: theme.utils.s(12),
    borderRadius: theme.utils.s(12),
    borderWidth: theme.utils.s(1),
    borderColor: theme.colors.borderSubtle,
  },
  textWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(6),
  },
  statusDot: {
    width: theme.utils.s(6),
    height: theme.utils.s(6),
    borderRadius: theme.utils.s(3),
  },
  marker: (active: boolean) => ({
    color: active ? theme.colors.accent : theme.colors.white,
  }),
  markerLabelText: {
    color: theme.colors.white,
  },
  dynamicBorder: (dynamicColor?: string) => ({
    borderColor: dynamicColor || theme.colors.violet,
  }),
  dynamicBackground: (dynamicColor?: string) => ({
    backgroundColor: dynamicColor || theme.colors.violet,
  }),
  shrinkContainer: {
    flexShrink: 1,
  },
}));
