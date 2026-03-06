import { UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

export type CommentProps = {
  username: string;
  commentText: string;
};

export const Comment = ({ username, commentText }: CommentProps) => {
  const { theme } = useUnistyles();
  return (
    <View style={{ flexDirection: "column", gap: 6 }}>
      <View style={{ flexDirection: "row", gap: 20, alignItems: "flex-end" }}>
        <Ionicons
          name="person"
          size={36}
          color={theme.colors.primaryTextColor}
        />
        <UIText size="md" style={{ color: theme.colors.white }}>
          {username}
        </UIText>
      </View>

      <UIText
        style={{
          color: theme.colors.iconInfoStatusTextColor,
          flexWrap: "wrap",
          flexShrink: 1,
          paddingLeft: 46,
        }}
      >
        {commentText}
      </UIText>
    </View>
  );
};
