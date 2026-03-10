import { AuthButton } from "@/src/components";
import { useSignUpPage } from "@/src/hooks";
import {
  UIButton,
  UIInput,
  UIText,
  UIKeyboardAvoidingScrollView,
} from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Controller } from "react-hook-form";
import { Image, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function SignUpPage() {
  const { control, onSubmit, isPending } = useSignUpPage();

  return (
    <View style={styles.mainContainer}>
      <Image
        resizeMode="cover"
        style={styles.image}
        source={require("@assets/images/sign-up.jpg")}
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
            Sign up
          </UIText>
        </View>
        <View style={styles.inputsContainer}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <UIInput
                placeholderTextColor={styles.input.borderColor}
                placeholder="Username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                textInputStyle={styles.input}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <UIInput
                placeholderTextColor={styles.input.borderColor}
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                keyboardType="email-address"
                textInputStyle={styles.input}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <UIInput
                placeholderTextColor={styles.input.borderColor}
                placeholder="Password"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                textInputStyle={styles.input}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <UIInput
                placeholderTextColor={styles.input.borderColor}
                placeholder="Repeat your password"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                textInputStyle={styles.input}
                error={fieldState.error?.message}
              />
            )}
          />
        </View>
        <View style={styles.bottomContainer}>
          <UIButton style={styles.googleButton} onPress={() => {}}>
            <Ionicons name="logo-google" size={26} color="white" />
            <UIText style={styles.googleText}>Continue with Google</UIText>
          </UIButton>
          <UIButton
            onPress={() => router.replace("/sign-in")}
            style={styles.signUpContainerBottom}
          >
            <UIText style={styles.dontHaveAccountText}>
              Already have an account?
            </UIText>
            <UIText style={styles.signUpBottomText}>Sign in</UIText>
          </UIButton>
        </View>
      </UIKeyboardAvoidingScrollView>
      <AuthButton label="Next" onPress={onSubmit} loading={isPending} />
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
  inputsContainer: { gap: theme.utils.vs(20), marginTop: theme.utils.vs(120) },
  input: {
    backgroundColor: "transparent",
    color: theme.colors.violet,
    borderBottomWidth: 1,
    borderColor: theme.colors.violet,
  },
  bottomContainer: {
    marginTop: theme.utils.vs(50),
    alignItems: "center",
    gap: theme.utils.s(20),
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.violet,
    borderRadius: 99,
    padding: theme.utils.s(12),
    paddingRight: theme.utils.s(40),
  },
  googleText: {
    color: theme.colors.violet,
    marginLeft: theme.utils.s(16),
  },
  signUpContainerBottom: { alignItems: "center" },
  signUpBottomText: {
    color: theme.colors.violet,
  },
  dontHaveAccountText: {
    color: theme.colors.darkViolet,
  },
}));
