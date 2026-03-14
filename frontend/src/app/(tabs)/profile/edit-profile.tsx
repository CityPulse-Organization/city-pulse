import { Icon, ThemedBackground } from "@/src/components";
import { UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ComponentProps, memo, useCallback, useState } from "react";
import { TextInput, View } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import Toast from "react-native-toast-message";

type ProfileData = {
  nickname: string;
  job: string;
  biography: string;
  avatarUrl: string;
};

type FormFieldConfig = {
  id: keyof ProfileData;
  iconName: IconName;
  placeholder: string;
  isMultiline?: boolean;
  autoCapitalize?: "none";
};

const FORM_FIELDS_CONFIG: FormFieldConfig[] = [
  {
    id: "nickname",
    iconName: "person-outline",
    placeholder: "Edit nickname",
    autoCapitalize: "none",
  },
  { id: "job", iconName: "briefcase-outline", placeholder: "Edit job" },
  {
    id: "biography",
    iconName: "chatbox-outline",
    placeholder: "Edit biography",
    isMultiline: true,
  },
];

export default function EditProfileScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState<ProfileData>({
    nickname: "",
    job: "",
    biography: "",
    avatarUrl: "",
  });

  const onCancel = () => {
    router.back();
  };

  const onSave = () => {
    Toast.show({
      type: "success",
      text1: "Profile Updated",
      text2: "Your changes have been saved successfully ✨",
    });
    router.back();
  };

  const onAvatarPress = async () => {
    ImagePicker.openPicker({
      cropping: true,
      cropperCircleOverlay: true,
      mediaType: "photo",
      forceJpg: true,
      freeStyleCropEnabled: true,
    })
      .then((image) => {
        setFormData((prev) => ({ ...prev, avatarUrl: image.path }));
      })
      .catch((error) => {
        console.log("Image picker cancelled or failed", error);
        if (error.code !== "E_PICKER_CANCELLED") {
          Toast.show({
            type: "error",
            text1: "Upload Failed",
            text2: "There was a problem selecting your image ❌",
          });
        }
      });
  };

  const handleInputChange = useCallback(
    (fieldId: keyof ProfileData, text: string) => {
      setFormData((prev) => ({ ...prev, [fieldId]: text }));
    },
    [],
  );

  return (
    <ThemedBackground style={styles.page}>
      <HeaderSection
        avatarUrl={formData.avatarUrl}
        onSave={onSave}
        onCancel={onCancel}
        onAvatarPress={onAvatarPress}
      />
      <FormSection formData={formData} onChange={handleInputChange} />
    </ThemedBackground>
  );
}

type HeaderSectionProps = {
  avatarUrl?: string;
  onCancel: () => void;
  onSave: () => void;
  onAvatarPress: () => void;
};

const HeaderSection = memo(
  ({ avatarUrl, onCancel, onSave, onAvatarPress }: HeaderSectionProps) => {
    return (
      <View style={styles.headerContainer}>
        <UIButton onPress={onCancel} isLoading={false}>
          <UIText style={styles.headerActionText} size="md">
            Cancel
          </UIText>
        </UIButton>

        <UIButton
          style={styles.avatarContainer}
          onPress={onAvatarPress}
          isLoading={false}
        >
          <View pointerEvents="none">
            <Icon size="medium" profileImageUrl={avatarUrl} />
          </View>
        </UIButton>

        <UIButton onPress={onSave} isLoading={false}>
          <UIText style={styles.headerActionText} size="md" weight="normal">
            Done
          </UIText>
        </UIButton>
      </View>
    );
  },
);

type FormSectionProps = {
  formData: ProfileData;
  onChange: (id: keyof ProfileData, text: string) => void;
};

const FormSection = memo(({ formData, onChange }: FormSectionProps) => {
  return (
    <View style={styles.formContainer}>
      {FORM_FIELDS_CONFIG.map((field) => (
        <ProfileInput
          key={field.id}
          iconName={field.iconName}
          placeholder={field.placeholder}
          isMultiline={field.isMultiline}
          autoCapitalize={field.autoCapitalize}
          value={formData[field.id]}
          onChangeText={(text) => onChange(field.id, text)}
        />
      ))}
    </View>
  );
});

type IconName = ComponentProps<typeof Ionicons>["name"];

type ProfileInputProps = {
  iconName: IconName;
  placeholder: string;
  isMultiline?: boolean;
  autoCapitalize?: "none";
  value: string;
  onChangeText: (text: string) => void;
};

const ProfileInput = memo(
  ({
    iconName,
    placeholder,
    isMultiline = false,
    autoCapitalize,
    value,
    onChangeText,
  }: ProfileInputProps) => {
    const { theme } = useUnistyles();
    return (
      <View
        style={[
          styles.inputContainer,
          isMultiline && styles.inputContainerMultiline,
        ]}
      >
        <Ionicons
          color={theme.colors.editProfileDescription}
          size={18}
          name={iconName}
          style={isMultiline ? { marginTop: 14 } : undefined}
        />

        <TextInput
          style={[styles.defaultInput, isMultiline && styles.biographyInput]}
          multiline={isMultiline}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.editProfileDescription}
          autoCapitalize={autoCapitalize}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  page: {
    gap: 20,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
  headerActionText: {
    color: theme.colors.profileTextColor,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  avatarContainer: {
    marginTop: 16,
    borderRadius: 100,
  },
  formContainer: {
    alignSelf: "stretch",
    paddingHorizontal: 30,
    gap: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: theme.colors.editProfileDescription,
    borderBottomWidth: 1,
    gap: 10,
  },
  inputContainerMultiline: {
    alignItems: "flex-start",
  },
  defaultInput: {
    flex: 1,
    minHeight: 46,
    fontSize: 17,
    color: theme.colors.profileTextColor,
  },
  biographyInput: {
    maxHeight: 360,
    textAlignVertical: "top",
  },
}));
