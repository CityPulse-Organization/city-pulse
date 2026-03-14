import {
  useCompleteGoogleRegistration,
  useGoogleSignIn,
  useRegister,
} from "@/src/hooks";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { isAxiosError } from "axios";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

const schema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    email: z.email("Invalid email address"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof schema>;

export const useSignUpPage = () => {
  const router = useRouter();
  const { mutateAsync: register, isPending } = useRegister();
  const { mutateAsync: googleSignIn } = useGoogleSignIn();
  const { mutateAsync: completeGoogleRegistration } =
    useCompleteGoogleRegistration();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
  });

  const onGoogleSignIn = useCallback(async () => {
    try {
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
           (typeof error.response?.data === 'string' && error.response.data.includes("REGISTRATION_REQUIRED")))
        ) {
          router.push({
            pathname: "/(auth)/complete-registration",
            params: { token: idToken }
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
          const data = typeof error.response?.data === 'string' 
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
    }
  }, [googleSignIn, completeGoogleRegistration]);
  const onSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        await register(data);
      } catch (error) {
        console.error("Sign up failed:", error);
        let message = "Could not complete registration. Please try again.";

        if (isAxiosError(error)) {
          const data = typeof error.response?.data === 'string' 
            ? JSON.parse(error.response.data) 
            : error.response?.data;
            
          message = data?.message || error.message;
        } else if (error instanceof Error) {
          message = error.message;
        }

        Toast.show({
          type: "error",
          text1: "Sign Up Error",
          text2: message,
        });
      }
    },
    [register],
  );

  const onBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const onSignInPress = useCallback(() => {
    router.replace("/sign-in");
  }, [router]);

  return {
    control: form.control,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    onBackPress,
    onSignInPress,
    onGoogleSignIn,
  };
};
