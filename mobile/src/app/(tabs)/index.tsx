import { ThemedBackground, PostMap } from "@/src/components";
import { UIButton, UIText } from "@/src/ui";
import { useLogout } from "@/src/hooks";
import { UIAlert } from "@/src/hoc";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { mutate: handleLogout } = useLogout();
  const { t } = useTranslation();

  return (
    <ThemedBackground style={styles.screen} withoutSafeArea>
      <PostMap />

      <UIButton style={styles.logoutButton} onPress={() => handleLogout()}>
        <Ionicons name="log-out-outline" size={20} color={styles.icon.color} />
        <UIText style={styles.logoutText}>{t('home.logout')}</UIText>
      </UIButton>

      <UIButton
        style={[styles.logoutButton, { top: 120, right: 20, left: undefined }]}
        onPress={() => {
          UIAlert.alert(
            t('home.testAlertTitle'),
            t('home.testAlertMessage'),
            [
              { text: t('postMenu.cancel'), style: "cancel" },
              { text: t('home.confirm'), style: "default" },
              {
                text: t('postMenu.delete'),
                style: "destructive",
                onPress: () => console.log("Deleted!"),
              },
            ],
          );
        }}
      >
        <Ionicons
          name="alert-circle-outline"
          size={20}
          color={styles.icon.color}
        />
        <UIText style={styles.logoutText}>{t('home.showAlert')}</UIText>
      </UIButton>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create((theme) => ({
  icon: {
    color: theme.colors.white,
  },
  screen: { gap: 30 },
  logoutButton: {
    position: "absolute",
    top: 60,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 99,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  logoutText: {
    color: "white",
    fontSize: 14,
  },
}));
