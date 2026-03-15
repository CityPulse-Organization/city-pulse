import { useCompleteGoogleRegistration } from "./useAuth";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { isAxiosError } from "axios";

const schema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters long"),
});

export type CompleteRegistrationFormData = z.infer<typeof schema>;

export const useCompleteRegistrationPage = () => {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { mutateAsync: completeRegistration, isPending } = useCompleteGoogleRegistration();

  const form = useForm<CompleteRegistrationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = useCallback(
    async (data: CompleteRegistrationFormData) => {
      if (!token) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Authentication token is missing. Please try signing in again.",
        });
        return;
      }

      try {
        await completeRegistration({ token, username: data.username });
      } catch (error: any) {
        console.error("Complete registration failed:", error);
        let message = "Failed to complete registration";

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
          text1: "Registration Failed",
          text2: message,
        });
      }
    },
    [token, completeRegistration],
  );

  return {
    control: form.control,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
  };
};
