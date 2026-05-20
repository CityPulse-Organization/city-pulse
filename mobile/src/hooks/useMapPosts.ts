import { useState, useCallback, useRef } from "react";
import { getMapPosts } from "../api/post";
import type { GeoJSONFeatureCollection } from "../types";

const EMPTY_COLLECTION: GeoJSONFeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

export type MapRegion = {
  latitude: number;
  longitude: number;
  zoomLevel: number;
};

export const useMapPosts = () => {
  const [geojson, setGeojson] = useState<GeoJSONFeatureCollection>(EMPTY_COLLECTION);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPosts = useCallback(
    async (minLon: number, minLat: number, maxLon: number, maxLat: number) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const data = await getMapPosts(minLon, minLat, maxLon, maxLat);
        if (!controller.signal.aborted) {
          setGeojson(data);
        }
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error("[useMapPosts] Failed to fetch map posts", e);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [],
  );

  return { geojson, loading, fetchPosts };
};
