import React, { memo, useEffect, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import Mapbox, {
  MapView,
  Camera,
  SymbolLayer,
  ShapeSource,
  Terrain,
  RasterDemSource,
  CircleLayer,
  Atmosphere,
  UserLocation,
  Light,
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
  coordinates: [number, number][]; // Polygon coordinates
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
  apiKey?: string;
}

// Set access token globally
Mapbox.setAccessToken(null); // Initialize with null if needed, then set specifically

export const MapboxMap = memo(
  ({ markers, districts, camera, apiKey }: MapboxMapProps) => {
    useEffect(() => {
      if (apiKey) {
        Mapbox.setAccessToken(apiKey);
      }
    }, [apiKey]);

    const mapSource = useMemo(() => {
      return {
        type: "FeatureCollection" as const,
        features: markers.map((m, index) => ({
          type: "Feature" as const,
          id: index.toString(),
          properties: {
            label: m.label || "",
            color: (m.color || "#c7b4fd").toLowerCase(),
          },
          geometry: {
            type: "Point" as const,
            coordinates: [m.longitude, m.latitude],
          },
        })),
      };
    }, [markers]);

    const districtSource = useMemo(() => {
      return {
        type: "FeatureCollection" as const,
        features: (districts || []).map((d: MapboxDistrict) => {
          // Identify color group for stable matching
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
          {/* District Fills */}
        <ShapeSource id="districtSource" shape={districtSource}>
          <FillLayer
            id="districtFill"
            style={{
              fillColor: [
                "match",
                ["get", "colorGroup"],
                "CENTRE", "#ff8c00",
                "NORTH", "#2e8b57",
                "SOUTH", "#4169e1",
                "EAST", "#cd5c5c",
                "WEST", "#9370db",
                "#ffffff"
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
                "CENTRE", "#ff8c00",
                "NORTH", "#2e8b57",
                "SOUTH", "#4169e1",
                "EAST", "#cd5c5c",
                "WEST", "#9370db",
                "#ffffff"
              ],
              lineWidth: 1.5,
              lineOpacity: 0.5,
              lineDasharray: [2, 2],
            }}
            slot="bottom"
          />
        </ShapeSource>

          {/* Custom Interactive Markers (MarkerView) */}
        {markers.map((marker, index) => (
          <MarkerView
            key={`custom-marker-${index}`}
            coordinate={[marker.longitude, marker.latitude]}
            allowOverlap={true}
          >
            <View style={styles.customMarkerContainer}>
              <View 
                style={[
                  styles.markerPulse, 
                  { backgroundColor: marker.color || "#0040ff" }
                ]} 
              />
              <View style={[styles.markerDisc, { borderColor: marker.color || "#0040ff" }]}>
                <Ionicons 
                  name={marker.icon || "location"} 
                  size={16} 
                  color="#ffffff" 
                />
              </View>
              {marker.label && (
                <View style={styles.markerLabelContainer}>
                  <LinearGradient
                    colors={["rgba(30, 30, 30, 0.9)", "rgba(10, 10, 10, 0.95)"]}
                    style={styles.labelGradient}
                  >
                    <View style={styles.textWrapper}>
                      <View style={[styles.statusDot, { backgroundColor: marker.color || "#0040ff" }]} />
                      <View style={{ flexShrink: 1 }}>
                        <Text style={{ color: "#ffffff", fontSize: 11, fontWeight: "600" }}>
                          {marker.label}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              )}
            </View>
          </MarkerView>
        ))}

        </MapView>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  map: {
    flex: 1,
  },
  customMarkerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerDisc: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.75)",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  markerPulse: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    opacity: 0.2,
  },
  markerLabelContainer: {
    position: "absolute",
    bottom: 38,
    alignItems: "center",
    minWidth: 80,
  },
  labelGradient: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  textWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
