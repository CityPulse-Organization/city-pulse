import { AuthButton } from "@/src/components";
import {
  UIButton,
  UIInput,
  UIText,
  UIKeyboardAvoidingScrollView,
} from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSignInPage } from "@/src/hooks";
import { Controller } from "react-hook-form";
import { Image, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from 'react-i18next';

export default function SignUpPage() {
  const { control, onSubmit, onGoogleSignIn, onSignUpPress, isLoading } =
    useSignInPage();
  const { t } = useTranslation();

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
            {t('auth.signIn')}
          </UIText>
        </View>
        <View style={styles.inputsContainer}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <UIInput
                placeholderTextColor={styles.input.borderColor}
                dividerColor="accent"
                inputStyle={styles.input}
                placeholder={t('auth.email')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
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
                dividerColor="accent"
                inputStyle={styles.input}
                placeholder={t('auth.password')}
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={fieldState.error?.message}
              />
            )}
          />

          <UIText style={styles.forgotPassword}>{t('auth.forgotPassword')}</UIText>
        </View>
        <View style={styles.bottomContainer}>
          <UIButton
            style={styles.googleButton}
            onPress={onGoogleSignIn}
            disabled={isLoading}
          >
            <Ionicons name="logo-google" size={26} color="white" />
            <UIText style={styles.googleText}>{t('auth.continueWithGoogle')}</UIText>
          </UIButton>
          <UIButton
            onPress={onSignUpPress}
            style={styles.signUpContainerBottom}
            disabled={isLoading}
          >
            <UIText style={styles.dontHaveAccountText}>
              {t('auth.dontHaveAccount')}
            </UIText>
            <UIText style={styles.signUpBottomText}>{t('auth.signUp')}</UIText>
          </UIButton>
        </View>
      </UIKeyboardAvoidingScrollView>

      <AuthButton label={t('auth.next')} onPress={onSubmit} loading={isLoading} />
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
  inputsContainer: { gap: theme.utils.vs(20), marginTop: theme.utils.vs(180) },
  input: {
    color: theme.colors.violet,
    fontSize: theme.utils.ms(14),
    borderColor: theme.colors.violet,
    borderBottomWidth: 1,
    padding: theme.utils.s(8),
  },
  forgotPassword: {
    color: theme.colors.darkAccent,
    paddingLeft: theme.utils.s(16),
  },
  bottomContainer: {
    marginTop: theme.utils.vs(40),
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
    paddingRight: theme.utils.s(20),
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
    color: theme.colors.darkAccent,
  },
}));
