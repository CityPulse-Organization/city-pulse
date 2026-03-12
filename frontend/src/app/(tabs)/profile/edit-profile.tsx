import { Icon, ThemedBackground } from "@/src/components";
import { UIButton, UIInput, UIText } from "@/src/ui";
import { UIKeyboardAvoidingScrollView } from "@/src/ui/molecules/UIKeyboardAvoidingScrollView";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ComponentProps, memo, useCallback, useState } from "react";
import { View } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { StyleSheet } from "react-native-unistyles";

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
  {
    id: "job",
    iconName: "briefcase-outline",
    placeholder: "Edit job"
  },
  {
    id: "biography",
    iconName: "chatbox-outline",
    placeholder: "Edit biography",
    isMultiline: true,
  },
];

export default function EditProfileScreen() {
  const router = useRouter();
  // TODO: edit profile zod + react hook form
  const [formData, setFormData] = useState<ProfileData>({
    nickname: "",
    job: "",
    biography: "",
    avatarUrl: "",
  });

  const onCancel = useCallback(() => {
    router.back();
  }, [router]);

  const onSave = useCallback(() => {
    router.back();
  }, [router]);

  const onAvatarPress = useCallback(async () => {
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
  }, []);

  const handleInputChange = useCallback(
    (fieldId: keyof ProfileData, text: string) => {
      setFormData((prev) => ({ ...prev, [fieldId]: text }));
    },
    [],
  );


  return (
    <ThemedBackground style={styles.page}>
      <HeaderSection onSave={onSave} onCancel={onCancel} />

      <UIKeyboardAvoidingScrollView
        keyboardVerticalOffset={styles.keyboardVertivalOffset.paddingBottom}
      >
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
      </UIKeyboardAvoidingScrollView>

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
          id={field.id}
          iconName={field.iconName}
          placeholder={field.placeholder}
          isMultiline={field.isMultiline}
          autoCapitalize={field.autoCapitalize}
          value={formData[field.id]}
          onChangeText={onChange}
        />
      ))}
    </View>
  );
});

type IconName = ComponentProps<typeof Ionicons>["name"];

type ProfileInputProps = {
  id: keyof ProfileData;
  iconName: IconName;
  placeholder: string;
  isMultiline?: boolean;
  autoCapitalize?: "none";
  value: string;
  onChangeText: (id: keyof ProfileData, text: string) => void;
};

const ProfileInput = memo(
  ({
    id,
    iconName,
    placeholder,
    isMultiline = false,
    autoCapitalize,
    value,
    onChangeText,
  }: ProfileInputProps) => {
    const handleChangeText = useCallback((text: string) => {
      onChangeText(id, text);
    }, [id, onChangeText]);

    return (
      <View
        style={[
          styles.inputContainer,
          isMultiline && styles.inputContainerMultiline,
        ]}
      >
        <Ionicons
          color={styles.iconInput.color}
          size={styles.iconInput.height}
          name={iconName}
          style={isMultiline ? { marginTop: styles.iconInput.marginTop } : undefined}
        />
        {/* TODO: UIInput */}
        <UIInput
          style={[styles.defaultInput, isMultiline && styles.biographyInput]}
          multiline={isMultiline}
          placeholder={placeholder}
          placeholderTextColor={styles.placeholderInput.color}
          autoCapitalize={autoCapitalize}
          value={value}
          onChangeText={handleChangeText}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  page: {
    gap: theme.utils.s(20),
  },


  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
  headerActionText: {
    paddingHorizontal: theme.utils.s(5),
    paddingVertical: theme.utils.vs(10),
  },
  cancelText: {
    color: theme.colors.muted,
  },
  doneText: {
    color: theme.colors.accent,
  },

  keyboardVertivalOffset: {
    paddingBottom: theme.utils.vs(60),
  },

  avatarContainer: {
    borderRadius: theme.utils.ms(999),
    backgroundColor: theme.colors.backgroundSubtle,
    alignSelf: "center",
  },

  formContainer: {
    alignSelf: "stretch",
    paddingHorizontal: theme.utils.s(30),
    gap: theme.utils.s(14),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: theme.colors.muted,
    borderBottomWidth: 1,
    gap: theme.utils.s(10),
  },
  inputContainerMultiline: {
    alignItems: "flex-start",
  },
  iconInput: {
    color: theme.colors.muted,
    height: theme.utils.s(18),
    marginTop: theme.utils.vs(12),
  },
  defaultInput: {
    flex: 1,
    minHeight: theme.utils.vs(46),
    fontSize: theme.utils.ms(16),
    color: theme.colors.primaryText,
  },
  biographyInput: {
    maxHeight: theme.utils.vs(360),
    textAlignVertical: "top",
  },
  placeholderInput: {
    color: theme.colors.muted,
  }
}));
