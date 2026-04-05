import { useLocalSearchParams } from "expo-router";
import { UniversalProfileScreen } from "@/src/components/UniversalProfileScreen";
import { useSession } from "@/src/hoc";
import { useRouter } from "expo-router";

export default function UserScreen() {
  const router = useRouter();
  const { session } = useSession();

  const { id, username } = useLocalSearchParams<{ id: string, username?: string }>();

  if (id === session?.user?.id) {
    router.replace("/profile");
  }

  return <UniversalProfileScreen id={id} initialUsername={username} />;
}
