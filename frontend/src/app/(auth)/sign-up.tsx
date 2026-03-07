import { AuthButton } from "@/src/components";
import { useRegister } from "@/src/hooks";
import { UIButton, UIInput, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function SignUpPage() {
  const { mutateAsync: register } = useRegister();
  const onPress = useCallback(() => {
    register({
      username: "user2",
      email: "user-email2@mail.com",
      password: "user123",
    });
  }, []);
  return (
    <View style={styles.mainContainer}>
      <Image
        resizeMode="cover"
        style={styles.image}
        source={require("@assets/images/sign-up.jpg")}
      />
      <KeyboardAvoidingView
        style={styles.formContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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
            <UIInput
              placeholderTextColor={styles.input.borderColor}
              style={styles.input}
              placeholder="Login"
            />
            <UIInput
              placeholderTextColor={styles.input.borderColor}
              style={styles.input}
              placeholder="Password"
              secureTextEntry
            />
            <UIInput
              placeholderTextColor={styles.input.borderColor}
              style={styles.input}
              placeholder="Repeat your password"
              secureTextEntry
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
        </ScrollView>
      </KeyboardAvoidingView>
      <AuthButton label="Next" onPress={onPress} />
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
    bottom: rt.insets.bottom + 60,
    borderRadius: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  signUpContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  signUpText: {
    color: theme.colors.violet,
  },
  inputsContainer: { gap: 40, marginTop: 180 },
  input: {
    backgroundColor: "transparent",
    color: theme.colors.violet,
    borderBottomWidth: 1,
    borderColor: theme.colors.violet,
  },
  bottomContainer: { marginTop: 60, alignItems: "center", gap: 20 },
  googleButton: {
    flexDirection: "row",

    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.violet,
    borderRadius: 99,
    padding: 16,
    paddingRight: 40,
  },
  googleText: {
    color: theme.colors.violet,
    marginLeft: 16,
  },
  signUpContainerBottom: { alignItems: "center" },
  signUpBottomText: {
    color: theme.colors.violet,
  },
  dontHaveAccountText: {
    color: theme.colors.darkViolet,
  },
}));
