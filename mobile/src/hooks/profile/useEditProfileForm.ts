import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ImagePicker from "react-native-image-crop-picker";
import * as z from "zod";
import { useProfile } from "./useProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser } from "@/src/api/user";
import Toast from "react-native-toast-message";


const profileSchema = z.object({
  jobTitle: z.string().min(3, "Job must be at least 3 characters").max(40, "Job is too long"),
  bio: z.string().max(255, "Biography can't exceed 255 characters").optional(),
  avatarUrl: z.string().optional(),
});

export type ProfileData = z.infer<typeof profileSchema>;


export const useEditProfile = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { profile, isProfileLoading } = useProfile();

  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm<ProfileData>({
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
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been successfully saved.",
      });
      router.back();
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Something went wrong while saving your profile.",
      });
      console.error("Profile update error:", error);
    }
  });


  const onCancel = useCallback(() => {
    router.back();
  }, [router]);

  const onSubmit = useCallback((data: ProfileData) => {
    updateProfile(data);
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
          shouldDirty: true
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