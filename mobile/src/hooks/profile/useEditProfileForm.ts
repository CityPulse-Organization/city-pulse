import { useRouter } from "expo-router";
import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ImagePicker from "react-native-image-crop-picker";
import * as z from "zod";


const profileSchema = z.object({
  nickname: z.string().min(3, "Nickname must be at least 3 characters").max(20, "Nickname is too long"),
  job: z.string().min(3, "Job must be at least 3 characters").max(20, "Job is too long"),
  biography: z.string().max(150, "Biography can't exceed 150 characters").optional(),
  avatarUrl: z.string().optional(),
});

export type ProfileData = z.infer<typeof profileSchema>;


export const useEditProfile = () => {
  const router = useRouter();

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: "",
      job: "",
      biography: "",
      avatarUrl: "",
    },
  });


  const onCancel = useCallback(() => {
    router.back();
  }, [router]);

  const onSubmit = useCallback((data: ProfileData) => {
    router.back();
  }, []);

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
  };
};