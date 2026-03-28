import { Icon, NavigationHeader, ThemedBackground } from "@/src/components";
import { ProfileData, useEditProfile } from "@/src/hooks/profile/useEditProfileForm";
import { UIButton, UIInput, UIText } from "@/src/ui";
import { UIKeyboardAvoidingScrollView } from "@/src/ui/molecules/UIKeyboardAvoidingScrollView";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, memo } from "react";
import { Control, Controller, FieldErrors, useWatch } from "react-hook-form";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type FormFieldConfig = {
  id: keyof ProfileData;
  iconName: IconName;
  placeholder: string;
  isMultiline?: boolean;
  autoCapitalize?: "none";
};

type IconName = ComponentProps<typeof Ionicons>["name"];

const FORM_FIELDS_CONFIG: FormFieldConfig[] = [
  {
    id: "nickname",
    iconName: "person-outline",
    placeholder: "Nickname",
    autoCapitalize: "none",
  },
  {
    id: "job",
    iconName: "briefcase-outline",
    placeholder: "Job or Title"
  },
  {
    id: "biography",
    iconName: "chatbox-outline",
    placeholder: "Biography. Tell us about yourself.",
    isMultiline: true,
  },
];

export default function EditProfileScreen() {
  const { control, errors, handleAvatarPress, onCancel, onSave } = useEditProfile()

  const avatarUrl = useWatch({
    control,
    name: "avatarUrl",
  });

  return (
    <ThemedBackground>
      <NavigationHeader
        title="Edit Profile"
        onLeftAction={onCancel}
        onRightAction={onSave}
        rightActionLabel="Save"
      />

      <UIKeyboardAvoidingScrollView
        keyboardVerticalOffset={styles.keyboardVertivalOffset.paddingBottom}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.avatarSection}>
          <UIButton
            onPress={handleAvatarPress}
            isLoading={false}
          >
            <View pointerEvents="none">
              <Icon size="medium" profileImageUrl={avatarUrl} />
            </View>

            <View style={styles.editBadge}>
              <Ionicons name="camera" size={styles.cameraIcon.height} color={styles.cameraIcon.color} />
            </View>
          </UIButton>

          <UIText size="md" weight="bold" style={styles.editPhotoText}>
            Change Photo
          </UIText>
        </View>

        <FormSection control={control} errors={errors} />
      </UIKeyboardAvoidingScrollView>

    </ThemedBackground>
  );
}

type FormSectionProps = {
  control: Control<ProfileData>;
  errors: FieldErrors<ProfileData>;
};

const FormSection = memo(({ control, errors }: FormSectionProps) => (
  <View style={styles.formContainer}>
    {FORM_FIELDS_CONFIG.map((field) => (
      <FormFieldItem
        key={field.id}
        field={field}
        control={control}
        errorMessage={errors[field.id]?.message}
      />
    ))}
  </View>
));

const FormFieldItem = memo(({ field, control, errorMessage }: {
  field: FormFieldConfig;
  control: Control<ProfileData>;
  errorMessage?: string;
}) => {
  return (
    <View style={styles.fieldWrapper}>
      <Controller
        control={control}
        name={field.id}
        render={({ field: { onChange, onBlur, value } }) => (
          <UIInput
            leftElement={
              <Ionicons
                name={field.iconName}
                size={styles.iconInput.height}
                color={errorMessage ? styles.errorText.color : styles.iconInput.color}
              />
            }
            containerStyle={[
              styles.inputContainer,
              field.isMultiline && styles.inputContainerMultiline,
              errorMessage && styles.inputErrorBorder
            ]}
            inputStyle={field.isMultiline && styles.inputMultilineText}
            multiline={field.isMultiline}
            numberOfLines={field.isMultiline ? 12 : 1}
            textAlignVertical={field.isMultiline ? "top" : "center"}
            placeholder={field.placeholder}
            placeholderTextColor={styles.placeholderInput.color}
            autoCapitalize={field.autoCapitalize}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errorMessage && (
        <UIText style={styles.errorText} size="sm">
          {errorMessage}
        </UIText>
      )}
    </View>
  );
});

const styles = StyleSheet.create((theme, rt) => ({
  scrollContent: {
    paddingBottom: rt.insets.bottom + theme.utils.vs(40),
  },

  avatarSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.utils.vs(20),
    paddingBottom: theme.utils.vs(20),
    gap: theme.utils.vs(14),
  },

  editBadge: {
    position: "absolute",
    bottom: theme.utils.vs(4),
    right: theme.utils.s(-4),
    backgroundColor: theme.colors.accent,
    padding: theme.utils.s(6),
    borderRadius: theme.utils.s(999),
    borderWidth: 3,
    borderColor: theme.colors.background,
  },

  cameraIcon: {
    height: theme.utils.s(16),
    color: theme.colors.white,
  },

  editPhotoText: {
    color: theme.colors.accent,
    letterSpacing: 0.5,
  },

  formContainer: {
    paddingHorizontal: theme.utils.s(16),
    gap: theme.utils.vs(16),
  },

  fieldWrapper: {
    gap: theme.utils.vs(4),
  },

  inputContainer: {
    borderBottomWidth: 0,
    backgroundColor: theme.colors.backgroundSubtle,
    borderRadius: theme.utils.s(12),
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    paddingHorizontal: theme.utils.s(14),
  },

  inputContainerMultiline: {
    alignItems: "baseline",
  },

  inputMultilineText: {
    minHeight: theme.utils.vs(140),
  },

  iconInput: {
    color: theme.colors.muted,
    height: theme.utils.s(20),
  },

  placeholderInput: {
    color: theme.colors.muted,
  },

  errorText: {
    color: theme.colors.alert,
    marginLeft: theme.utils.s(16),
  },

  inputErrorBorder: {
    borderColor: theme.colors.alert,
  },

  keyboardVertivalOffset: {
    paddingBottom: theme.utils.vs(60),
  },
}));
