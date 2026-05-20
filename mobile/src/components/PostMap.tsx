import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Ionicons } from "@expo/vector-icons";
import Mapbox, {
  MapView,
  Camera,
  ShapeSource,
  CircleLayer,
  SymbolLayer,
  MarkerView,
  Images,
} from "@rnmapbox/maps";
import { useMapPosts } from "@/src/hooks/useMapPosts";
import { useRouter } from "expo-router";
import { UIText } from "@/src/ui";
import { LinearGradient } from "expo-linear-gradient";

Mapbox.setAccessToken(null);
if (process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_KEY) {
  Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_KEY);
}

const EMPTY_GEOJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

type PostFeature = GeoJSON.Feature & {
  properties: {
    id: number;
    imageUrl: string;
    caption: string | null;
    likeCount: number;
    commentCount: number;
    [key: string]: unknown;
  };
};

const PostMarker = memo(function PostMarker({
  feature,
  onPress,
}: {
  feature: PostFeature;
  onPress: (f: PostFeature) => void;
}) {
  const coords = (feature.geometry as GeoJSON.Point).coordinates;

  return (
    <MarkerView
      coordinate={[coords[0], coords[1]]}
      allowOverlap={true}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <Pressable
        onPress={() => onPress(feature)}
        style={styles.markerContainer}
      >
        <View style={styles.markerPulse} />
        <View style={styles.markerDisc}>
          <Ionicons name="image" size={16} color="#ffffff" />
        </View>
      </Pressable>
    </MarkerView>
  );
});

export const PostMap = memo(function PostMap() {
  const router = useRouter();
  const { geojson, loading, fetchPosts } = useMapPosts();
  const [initialized, setInitialized] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!initialized) {
      fetchPosts(22.4, 51.1, 22.7, 51.4);
      setInitialized(true);
    }
  }, [initialized, fetchPosts]);

  const handleRegionDidChange = useCallback(
    async (state: Mapbox.MapState) => {
      const props = state?.properties;
      if (!props?.bounds) return;

      const { ne, sw } = props.bounds;
      if (!ne || !sw) return;

      await fetchPosts(sw[0], sw[1], ne[0], ne[1]);
    },
    [fetchPosts],
  );

  const handlePostPress = useCallback(
    (feature: PostFeature) => {
      const id = feature.properties?.id;
      if (id != null) {
        router.push({
          pathname: "/post/[id]" as const,
          params: { id: String(id) },
        });
      }
    },
    [router],
  );

  const handleShapePress = useCallback(
    (e: { features: GeoJSON.Feature[] }) => {
      const features = e.features;
      if (!features || features.length === 0) return;
      const f = features[0];
      const props = f.properties as Record<string, unknown>;

      if (props && "cluster" in props && props.cluster) {
        // Cluster tap — zoom in to expand
        const coords = (f.geometry as GeoJSON.Point).coordinates;
        mapRef.current?.getClusterExpansionZoom("posts-source", f).then(
          (result) => {
            const zoom =
              result != null && typeof result === "object" && "zoom" in result
                ? (result as { zoom: number }).zoom
                : 16;
            mapRef.current?.setCamera({
              centerCoordinate: coords,
              zoomLevel: zoom,
              animationDuration: 300,
            });
          },
          () => {
            mapRef.current?.setCamera({
              centerCoordinate: coords,
              zoomLevel: 16,
              animationDuration: 300,
            });
          },
        );
      } else {
        // Individual post from shape — navigate
        const id = props?.id;
        if (id != null) {
          router.push({
            pathname: "/post/[id]" as const,
            params: { id: String(id) },
          });
        }
      }
    },
    [router],
  );

  const shape = useMemo<GeoJSON.FeatureCollection>(() => {
    if (!geojson || !geojson.features) return EMPTY_GEOJSON;
    return geojson as unknown as GeoJSON.FeatureCollection;
  }, [geojson]);

  // Extract individual (non-clustered) features for MarkerView overlays
  const individualFeatures = useMemo(() => {
    return geojson.features as PostFeature[];
  }, [geojson.features]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        styleURL="mapbox://styles/mapbox/standard"
        logoEnabled={false}
        attributionEnabled={false}
        onMapIdle={handleRegionDidChange}
      >
        <Camera
          animationDuration={1500}
          animationMode="flyTo"
          centerCoordinate={[22.5684, 51.2465]}
          zoomLevel={14}
          pitch={0}
          heading={0}
        />

        {/* Clusters rendered with layers */}
        <ShapeSource
          id="posts-source"
          shape={shape}
          cluster={true}
          clusterRadius={50}
          clusterMaxZoom={18}
          clusterProperties={{}}
          onPress={handleShapePress}
        >
          {/* Individual post dots (hidden — we use MarkerView instead) */}
          <CircleLayer
            id="post-points"
            filter={["!", ["has", "point_count"]]}
            style={{
              circleRadius: 0,
              circleOpacity: 0,
            }}
          />

          {/* Cluster outer glow */}
          <CircleLayer
            id="cluster-glow"
            filter={["has", "point_count"]}
            style={{
              circleColor: "rgba(139, 92, 246, 0.12)",
              circleRadius: [
                "interpolate",
                ["linear"],
                ["get", "point_count"],
                2,
                26,
                10,
                30,
                50,
                34,
                200,
                40,
              ],
            }}
          />

          {/* Cluster circles */}
          <CircleLayer
            id="cluster-circles"
            filter={["has", "point_count"]}
            style={{
              circleColor: "#8b5cf6",
              circleRadius: [
                "interpolate",
                ["linear"],
                ["get", "point_count"],
                2,
                18,
                10,
                22,
                50,
                26,
                200,
                32,
              ],
              circleOpacity: 0.9,
              circleStrokeWidth: 2.5,
              circleStrokeColor: "#ffffff",
            }}
          />

          {/* Cluster count labels */}
          <SymbolLayer
            id="cluster-count"
            filter={["has", "point_count"]}
            style={{
              textField: ["get", "point_count_abbreviated"],
              textSize: 13,
              textColor: "#ffffff",
              textFont: ["DIN Pro Medium"],
              textHaloColor: "transparent",
              textAllowOverlap: true,
            }}
          />
        </ShapeSource>

        {/* Individual post markers — styled like the old MapboxMap */}
        {individualFeatures.map((feature) => {
          const coords = (feature.geometry as GeoJSON.Point).coordinates;
          if (!coords) return null;
          return (
            <PostMarker
              key={feature.properties?.id}
              feature={feature}
              onPress={handlePostPress}
            />
          );
        })}
      </MapView>

      {loading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="small" color="#8b5cf6" />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  map: {
    flex: 1,
  },
  loadingIndicator: {
    position: "absolute",
    top: Math.max(rt.insets.top, 20) + 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 8,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerDisc: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(30, 30, 30, 0.9)",
    borderWidth: 2,
    borderColor: "#8b5cf6",
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
    backgroundColor: "#8b5cf6",
    opacity: 0.2,
  },
}));
