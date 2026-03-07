import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback } from "react";
import { StyleSheet } from "react-native-unistyles";
import { UIText } from "../atoms";
import { View } from "react-native";

type UIBottomSheetProps = {
  children: React.ReactNode;
  header?: string | React.ReactNode;
} & BottomSheetModalProps;

export const UIBottomSheet = forwardRef<BottomSheetModal, UIBottomSheetProps>(
  ({ children, header, ...props }, ref) => {
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}

          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
          style={styles.backdrop}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        handleStyle={styles.handleStyle}
        backgroundStyle={styles.backgroundStyle}
        ref={ref}
        enableDynamicSizing={false}
        handleIndicatorStyle={styles.handleIndicatorStyle}
        {...props}
      >
        <View style={{ flex: 1 }}>

          {header != null && (
            <View style={styles.headerView}>
              {typeof header === "string" ? (
                <UIText size="xxl" style={styles.header}>
                  {header}
                </UIText>
              ) : (
                header
              )}
            </View>
          )}

          {children}

        </View>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create((theme) => ({

  header: {
    color: theme.colors.primaryTextColor,
    textAlign: "center",
  },
  headerView: {
    paddingTop: theme.utils.s(10),
    width: "100%",
  },
  backdrop: {
    backgroundColor: theme.colors.black,
  },
  handleStyle: {
    backgroundColor: theme.colors.bottomSheetBackgroundColor,
    borderTopLeftRadius: theme.utils.s(14),
    borderTopRightRadius: theme.utils.s(14),
  },
  backgroundStyle: {
    backgroundColor: theme.colors.bottomSheetBackgroundColor,
  },
  handleIndicatorStyle: {
    backgroundColor: theme.colors.darkViolet,
    width: theme.utils.s(40),
  },
}));
