import { Alert, Linking } from "react-native";

export const handleImagePickerError = (error: any) => {
  console.log("Image processing failed/cancelled", error);

  const code = error?.code;
  const message = error?.message || "";

  if (code === 'E_PERMISSION_MISSING' || message.includes('permission')) {
    Alert.alert(
      "No media access",
      "To take a photo, you need to allow the app to access the photos in your phone’s settings",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() }
      ]
    );
  } else if (code === 'E_PICKER_CANCELLED') {
    console.log("User cancelled image selection");
  } else {
    console.log("Camera/Gallery error:", error);
  }
};