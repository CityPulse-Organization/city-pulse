import { Alert, Linking } from "react-native";

export const handleImagePickerError = (error: unknown) => {
  console.log("Image processing failed/cancelled", error);

  if (typeof error !== 'object' || error === null) {
    console.log("Unknown error format:", error);
    return;
  }

  const pickerError = error as { code?: string; message?: string };

  const code = pickerError?.code;
  const message = pickerError?.message || "";

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