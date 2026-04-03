import { useLocalSearchParams } from "expo-router";
import { UniversalProfileScreen } from "@/src/components/UniversalProfileScreen";

export default function UserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <UniversalProfileScreen id={id} />;
}
