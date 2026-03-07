import { Icon, ThemedBackground } from "@/src/components";
import { UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ComponentProps, memo, useCallback, useState } from "react";
import { TextInput, View } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

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
      <HeaderSection onSave={onSave} onCancel={onCancel} />

      <UIButton
        style={styles.avatarContainer}
        onPress={onAvatarPress}
        isLoading={false}
      >
        <View pointerEvents="none">
          <Icon size="medium" profileImageUrl={formData.avatarUrl} />
        </View>
      </UIButton>

      <FormSection formData={formData} onChange={handleInputChange} />
    </ThemedBackground>
  );
}

type HeaderSectionProps = {
  onCancel: () => void;
  onSave: () => void;
};

const HeaderSection = memo(({ onCancel, onSave }: HeaderSectionProps) => {
  return (
    <View style={styles.headerContainer}>
      <UIButton onPress={onCancel} isLoading={false}>
        <UIText style={[styles.headerActionText, styles.cancelText]} size="md">
          Cancel
        </UIText>
      </UIButton>

      <UIButton onPress={onSave} isLoading={false}>
        <UIText
          style={[styles.headerActionText, styles.doneText]}
          size="md"
          weight="bold"
        >
          Done
        </UIText>
      </UIButton>
    </View>
  );
});

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
          color={theme.colors.faintColor}
          size={18}
          name={iconName}
          style={isMultiline ? { marginTop: 14 } : undefined}
        />

        <TextInput
          style={[styles.defaultInput, isMultiline && styles.biographyInput]}
          multiline={isMultiline}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.faintColor}
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
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  cancelText: {
    color: theme.colors.faintColor,
  },
  doneText: {
    color: theme.colors.lightViolet,
  },
  avatarContainer: {
    marginBottom: 20,
    borderRadius: 999,
    backgroundColor: theme.colors.defauldIconBackgroundColor,
    alignSelf: "center",
  },
  formContainer: {
    alignSelf: "stretch",
    paddingHorizontal: 30,
    gap: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: theme.colors.faintColor,
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
