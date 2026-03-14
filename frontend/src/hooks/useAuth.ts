import { useMutation } from "@tanstack/react-query";
import { register, login, logout, loginWithGoogle, completeGoogleRegistration } from "../api";
import { router } from "expo-router";
import { useSession } from "../hoc";
import { tokenStorage } from "../config";

export const useRegister = () => {
  const { setSession } = useSession();

  return useMutation({
    mutationFn: register,
    onSuccess: async () => {
      const user = await tokenStorage.getUser();
      setSession(user);
      router.replace("/(tabs)");
    },
  });
};

export const useSignIn = () => {
  const { setSession } = useSession();

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      const user = await tokenStorage.getUser();
      setSession(user);
      router.push("/(tabs)");
    },
  });
};

export const useGoogleSignIn = () => {
  const { setSession } = useSession();

  return useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: async () => {
      const user = await tokenStorage.getUser();
      setSession(user);
      router.push("/(tabs)");
    },
  });
};

export const useCompleteGoogleRegistration = () => {
  const { setSession } = useSession();

  return useMutation({
    mutationFn: ({ token, username }: { token: string; username: string }) =>
      completeGoogleRegistration(token, username),
    onSuccess: async () => {
      const user = await tokenStorage.getUser();
      setSession(user);
      router.push("/(tabs)");
    },
  });
};

export const useLogout = () => {
  const { setSession } = useSession();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setSession(null);
      router.replace("/(auth)");
    },
  });
};
