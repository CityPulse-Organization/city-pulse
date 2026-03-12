import { useRegister } from "@/src/hooks";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";

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

  const onSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        await register(data);
      } catch (error) {
        console.error("Sign up failed:", error);
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
  };
};
