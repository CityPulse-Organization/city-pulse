import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback } from "react";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";
import { UIText } from "../atoms";

type UIBottomSheetProps = {
  children: React.ReactNode;
  header?: string | React.ReactNode;
} & UnistylesVariants<typeof styles> &
  BottomSheetModalProps;

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
        handleIndicatorStyle={styles.handleIndicatorStyle}
        maxDynamicContentSize={700}
        {...props}
      >
        <BottomSheetScrollView style={styles.bottomSheetView}>
          {typeof header === "string" ? (
            <UIText size="xxl" style={styles.header}>
              {header}
            </UIText>
          ) : header ? (
            header
          ) : null}
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  header: {
    color: theme.colors.primaryTextColor,
    textAlign: "center",
  },
  bottomSheetView: {
    paddingBottom: 250,

    padding: 20,
    gap: 30,
    width: "100%",
    variants: {
      bottomSheetTheme: {
        default: {
          backgroundColor: theme.colors.black,
        },
        light: {
          backgroundColor: theme.colors.white,
        },
      },
    },
  },
  backdrop: {
    backgroundColor: theme.colors.black,
  },
  handleStyle: {
    backgroundColor: theme.colors.bottomSheetColor,
    borderRadius: 30,
  },
  backgroundStyle: {
    backgroundColor: theme.colors.bottomSheetColor,
  },
  handleIndicatorStyle: {
    backgroundColor: theme.colors.bottomSheetIndicatorStyle,
    width: 40,
  },
}));
