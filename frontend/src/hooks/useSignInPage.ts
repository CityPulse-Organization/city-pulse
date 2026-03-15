import {
  useSignIn,
  useGoogleSignIn,
  useCompleteGoogleRegistration,
} from "./useAuth";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { isAxiosError } from "axios";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInFormData = z.infer<typeof schema>;

export const useSignInPage = () => {
  const router = useRouter();
  const { mutateAsync: signIn, isPending: isSignInPending } = useSignIn();
  const { mutateAsync: googleSignIn, isPending: isGooglePending } =
    useGoogleSignIn();
  const {
    mutateAsync: completeGoogleRegistration,
    isPending: isCompletePending,
  } = useCompleteGoogleRegistration();

  const [loading, setLoading] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        await signIn({ username: data.username, password: data.password });
      } catch (error) {
        console.error("Sign in failed:", error);
        let message = "Invalid username or password.";

        if (isAxiosError(error) && error.response?.data?.message) {
          message = error.response.data.message;
        } else if (error instanceof Error) {
          message = error.message;
        }

        Toast.show({
          type: "error",
          text1: "Sign In Error",
          text2: message,
        });
      }
    },
    [signIn],
  );

  const onGoogleSignIn = useCallback(async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error("Google ID Token not found. Please try again.");
      }

      try {
        await googleSignIn(idToken);
      } catch (error: any) {
        if (
          isAxiosError(error) &&
          error.response?.status === 404 &&
          (error.response?.data?.status === "REGISTRATION_REQUIRED" ||
            (typeof error.response?.data === "string" &&
              error.response.data.includes("REGISTRATION_REQUIRED")))
        ) {
          router.push({
            pathname: "/(auth)/complete-registration",
            params: { token: idToken },
          });
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error("Google login failed:", error);
      if (error.code !== "SIGN_IN_CANCELLED") {
        let message = "Something went wrong during Google Sign-In";

        if (isAxiosError(error)) {
          console.log("Full error data:", error.response?.data);
          const data =
            typeof error.response?.data === "string"
              ? JSON.parse(error.response.data)
              : error.response?.data;

          message = data?.message || error.message;
        } else if (error instanceof Error) {
          message = error.message;
        }

        Toast.show({
          type: "error",
          text1: "Google Auth Error",
          text2: message,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [googleSignIn, completeGoogleRegistration]);

  const onSignUpPress = useCallback(() => {
    router.replace("/sign-up");
  }, [router]);

  return {
    control: form.control,
    onSubmit: form.handleSubmit(onSubmit),
    onGoogleSignIn,
    isPending:
      isSignInPending || isGooglePending || isCompletePending || loading,
    onSignUpPress,
  };
};
