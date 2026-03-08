const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default {
  expo: {
    name: "City Pulse",
    slug: "city-pulse",
    owner: "kyrylokap",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "citypulse",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    extra: {
      eas: {
        projectId: "bf44a233-69a7-4e88-a2ed-8317f8f1cde1",
      },
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.citypulse.app",
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
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#111b24",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.citypulse.app",
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
      [
        "expo-splash-screen",
        {
          backgroundColor: "#111b24",
          image: "./assets/images/icon.png",
          imageWidth: 600,
          resizeMode: "cover",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
