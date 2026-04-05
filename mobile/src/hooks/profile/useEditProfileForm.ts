import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ImagePicker from "react-native-image-crop-picker";
import * as z from "zod";
import { useProfile } from "./useProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser } from "@/src/api/user";
import { uploadFile } from "@/src/api/storage";
import Toast from "react-native-toast-message";

const profileSchema = z.object({
  jobTitle: z
    .string()
    .min(3, "Job must be at least 3 characters")
    .max(40, "Job is too long"),
  bio: z.string().max(255, "Biography can't exceed 255 characters").optional(),
  avatarUrl: z.string().optional(),
});

export type ProfileData = z.infer<typeof profileSchema>;

export const useEditProfile = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { profile, isProfileLoading } = useProfile();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      jobTitle: "",
      bio: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        jobTitle: profile.jobTitle ?? "",
        bio: profile.bio ?? "",
        avatarUrl: profile.avatarUrl ?? "",
      });
    }
  }, [profile, reset]);

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been successfully saved.",
      });
      router.back();
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Something went wrong while saving your profile.",
      });
    },
  });

  const onCancel = useCallback(() => {
    router.back();
  }, [router]);

  const onSubmit = useCallback(async (data: ProfileData) => {
    const { avatarUrl, ...rest } = data;
    const payload: Record<string, any> = { ...rest };

    try {
      if (avatarUrl && avatarUrl.startsWith("/")) {
        // Локальный путь — загружаем в storage
        const uploadedUrl = await uploadFile(avatarUrl);
        payload.avatarUrl = uploadedUrl;
      } else if (avatarUrl && avatarUrl.startsWith("http")) {
        // Уже URL — отправляем как есть
        payload.avatarUrl = avatarUrl;
      }
      // Пустой — не включаем в payload
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: "Could not upload avatar image.",
      });
      return;
    }

    updateProfile(payload);
  }, [updateProfile]);

  const onSave = handleSubmit(onSubmit);

  const handleAvatarPress = useCallback(async () => {
    ImagePicker.openPicker({
      cropping: true,
      cropperCircleOverlay: true,
      mediaType: "photo",
      forceJpg: true,
      freeStyleCropEnabled: true,
    })
      .then((image) => {
        setValue("avatarUrl", image.path, {
          shouldValidate: true,
          shouldDirty: true,
        });
      })
      .catch((error) => {
        console.log("Image picker cancelled or failed", error);
      });
  }, [setValue]);

  return {
    control,
    errors,
    handleAvatarPress,
    onCancel,
    onSave,
    isLoading: isProfileLoading || isUpdating,
  };
};
