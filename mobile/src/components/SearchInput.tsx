import { memo, useState } from "react";
import { UIInput } from "../ui";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native-unistyles";

import { useTranslation } from "react-i18next";

export const SearchInput = memo(() => {
    const [input, setInput] = useState("");
    const { t } = useTranslation();

    return (
        <UIInput
            leftElement={
                <Ionicons
                    name="search"
                    size={styles.iconInput.height}
                    color={styles.iconInput.color}
                />
            }
            containerStyle={styles.searchContainer}
            inputStyle={styles.searchInput}
            placeholder={t('search.placeholder')}
            placeholderTextColor={styles.placeholderInput.color}
            value={input}
            onChangeText={setInput}
        />
    );
});

const styles = StyleSheet.create((theme) => ({
    iconInput: {
        color: theme.colors.accent,
        height: theme.utils.s(20),
    },
    searchContainer: {
        borderWidth: 1,
        borderColor: theme.colors.accent,
        borderRadius: theme.utils.ms(22),
        paddingHorizontal: theme.utils.s(16),
        marginHorizontal: theme.utils.s(20),
        margin: theme.utils.vs(14),
    },
    placeholderInput: {
        color: theme.colors.muted,
    },
    searchInput: {
        paddingVertical: theme.utils.vs(10),
    },
}));