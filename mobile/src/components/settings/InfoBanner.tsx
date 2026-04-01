import { UIText } from "@/src/ui"
import { Ionicons } from "@expo/vector-icons"
import { memo } from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { StyleSheet } from "react-native-unistyles"


interface InfoBannerProps {
    text: string
    icon: React.ComponentProps<typeof Ionicons>['name'],
    style?: StyleProp<ViewStyle>;
}

export const InfoBanner = memo(({ text, icon, style }: InfoBannerProps) => (
    <View style={[styles.infoBanner, style]}>
        <Ionicons name={icon} size={styles.infoBannerIcon.height} color={styles.infoBannerIcon.color} />
        <View style={styles.textContainer}>
            <UIText size="xs" style={styles.infoBannerText}>
                {text}
            </UIText>
        </View>
    </View>
))


const styles = StyleSheet.create((theme) => ({
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: theme.utils.s(12),
        backgroundColor: theme.colors.backgroundSubtle,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        borderRadius: theme.utils.ms(12),
        padding: theme.utils.s(14),
    },


    infoBannerIcon: {
        height: theme.utils.vs(22),
        color: theme.colors.violet,
    },

    textContainer: {
        flex: 1,
    },
    infoBannerText: {
        color: theme.colors.muted,
        lineHeight: 18,
    },
}))