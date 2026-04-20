import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register, login, logout, loginWithGoogle, completeGoogleRegistration } from "../api";
import { router } from "expo-router";
import { useSession } from "../hoc";
import { tokenStorage } from "../config";

export const useRegister = () => {
  const { setSession } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: async () => {
      queryClient.clear();
      const user = await tokenStorage.getUser();
      setSession(user);
      router.replace("/(tabs)");
    },
  });
};

export const useSignIn = () => {
  const { setSession } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      queryClient.clear();
      const user = await tokenStorage.getUser();
      setSession(user);
      router.push("/(tabs)");
    },
  });
};

export const useGoogleSignIn = () => {
  const { setSession } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: async (result, idToken) => {
      if (result.status === 200) {
        queryClient.clear();
        const user = await tokenStorage.getUser();
        setSession(user);
        router.push("/(tabs)");
      } else if (result.status === 202) {
        const temporaryToken = (result.data as any)?.temporaryToken;
        router.push({
          pathname: "/(auth)/complete-registration",
          params: { token: temporaryToken || idToken, idToken },
        });
      }
    },
  });
};

export const useCompleteGoogleRegistration = () => {
  const { setSession } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, username, idToken }: { token: string; username: string; idToken: string }) =>
      completeGoogleRegistration(token, username, idToken),
    onSuccess: async () => {
      queryClient.clear();
      const user = await tokenStorage.getUser();
      setSession(user);
      router.push("/(tabs)");
    },
  });
};

export const useLogout = () => {
  const { setSession } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      setSession(null);
      router.replace("/(auth)");
    },
  });
};
