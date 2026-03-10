import { useSignIn } from "@/src/hooks";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router } from "expo-router";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInFormData = z.infer<typeof schema>;

export const useSignInPage = () => {
  const { mutateAsync: signIn, isPending } = useSignIn();

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
      }
    },
    [signIn],
  );

  const onSignUpPress = useCallback(() => {
    router.replace("/sign-up");
  }, [router]);

  return {
    control: form.control,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    onSignUpPress,
  };
};
