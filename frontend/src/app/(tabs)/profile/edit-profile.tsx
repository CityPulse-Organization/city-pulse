import { Icon, ThemedBackground } from "@/src/components";
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
  const { control, errors, handleAvatarPress, onCancel, onSave } = useEditProfile()

  const avatarUrl = useWatch({
    control,
    name: "avatarUrl",
  });

  return (
    <ThemedBackground style={styles.page}>
      <HeaderSection onSave={onSave} onCancel={onCancel} />

      <UIKeyboardAvoidingScrollView
        keyboardVerticalOffset={styles.keyboardVertivalOffset.paddingBottom}
      >
        <UIButton
          style={styles.avatarContainer}
          onPress={handleAvatarPress}
          isLoading={false}
        >
          <View pointerEvents="none">
            <Icon size="medium" profileImageUrl={avatarUrl} />
          </View>
        </UIButton>

        <FormSection control={control} errors={errors} />
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
              field.isMultiline && styles.inputContainerMultiline,
              errorMessage && styles.inputErrorBorder
            ]}
            inputStyle={field.isMultiline ? styles.biographyInput : undefined}
            multiline={field.isMultiline}
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



const styles = StyleSheet.create((theme) => ({
  page: {
    gap: theme.utils.s(10),
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
    paddingTop: theme.utils.vs(10),
    gap: theme.utils.s(14),
  },
  fieldWrapper: {
    gap: theme.utils.vs(4),
  },
  inputContainerMultiline: {
    alignItems: "baseline",
  },
  iconInput: {
    color: theme.colors.muted,
    height: theme.utils.s(18),
    marginTop: theme.utils.vs(12),
  },
  biographyInput: {
    maxHeight: theme.utils.vs(340),
    textAlignVertical: "top",
  },
  placeholderInput: {
    color: theme.colors.muted,
  },

  errorText: {
    color: theme.colors.alert,
    marginLeft: theme.utils.s(28),
  },
  inputErrorBorder: {
    borderColor: theme.colors.alert,
  }
}));
