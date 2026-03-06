const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default {
  expo: {
    name: "city-pulse-mobile",
    slug: "city-pulse-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "citypulsemobile",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.citypulsemobile",
      infoPlist: {
        NSCameraUsageDescription:
          "Allow City Pulse to access your camera to take profile and post pictures.",
        NSPhotoLibraryUsageDescription:
          "Allow City Pulse to access your photos to select post images.",
      },
      config: {
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.anonymous.citypulsemobile",
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
      ],
      config: {
        googleMaps: {
          apiKey: GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      bundler: "metro",
      output: "static",
    },
    plugins: [
      "expo-router",
      "expo-maps",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow City Pulse to use your location.",
        },
      ],
      [
        "expo-media-library",
        {
          photosPermission: "Allow City Pulse to access your photos.",
          savePhotosPermission: "Allow City Pulse to save photos.",
          isAccessMediaLocationEnabled: true,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
