import { AuthButton } from "@/src/components";
import {
  UIButton,
  UIInput,
  UIText,
  UIKeyboardAvoidingScrollView,
} from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCompleteRegistrationPage } from "@/src/hooks";
import { Controller } from "react-hook-form";
import { Image, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function CompleteRegistrationPage() {
  const { control, onSubmit, isPending } = useCompleteRegistrationPage();

  return (
    <View style={styles.mainContainer}>
      <Image
        resizeMode="cover"
        style={styles.image}
        source={require("@assets/images/sign-in.jpg")}
      />

      <UIKeyboardAvoidingScrollView
        style={styles.formContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <UIButton onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </UIButton>
        <View style={styles.signUpContainer}>
          <UIText weight="normal" size="extraLarge" style={styles.signUpText}>
            Last step
          </UIText>
          <UIText style={styles.description}>
            Please choose a unique username to finish creating your account.
          </UIText>
        </View>
        <View style={styles.inputsContainer}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <UIInput
                placeholderTextColor={styles.input.borderColor}
                inputStyle={styles.input}
                dividerColor="accent"
                placeholder="Username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                error={fieldState.error?.message}
              />
            )}
          />
        </View>
      </UIKeyboardAvoidingScrollView>

      <AuthButton label="Finish" onPress={onSubmit} loading={isPending} />
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  image: { width: "100%", height: "100%", position: "absolute" },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  formContainer: {
    position: "absolute",
    top: rt.insets.top + 20,
    left: 30,
    right: 30,
    bottom: rt.insets.bottom,
    borderRadius: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.utils.vs(120),
  },
  signUpContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.utils.vs(20),
  },
  signUpText: {
    color: theme.colors.violet,
  },
  description: {
    color: theme.colors.violet,
    textAlign: "center",
    marginTop: theme.utils.vs(10),
    opacity: 0.8,
  },
  inputsContainer: { gap: theme.utils.vs(20), marginTop: theme.utils.vs(140) },
  input: {
    backgroundColor: "transparent",
    color: theme.colors.violet,
    borderBottomWidth: 1,
    borderColor: theme.colors.violet,
  },
}));
