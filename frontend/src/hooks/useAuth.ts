import { useMutation } from "@tanstack/react-query";
import { register } from "../api";
import { router } from "expo-router";

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      router.push("/(tabs)");
    },
  });
};
