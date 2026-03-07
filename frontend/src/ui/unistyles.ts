import { Dimensions } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

// Scaling utilities from login-page-setup
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const scale = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

export const getScaledValue = {
  h: (size: number) => (UnistylesRuntime.screen.width / BASE_WIDTH) * size,
  v: (size: number) => (UnistylesRuntime.screen.height / BASE_HEIGHT) * size,
  m: (size: number, factor: number = 0.5) => {
    const scaled = (UnistylesRuntime.screen.width / BASE_WIDTH) * size;
    return size + (scaled - size) * factor;
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// Colors - merged from both branches
const colors = {
  white: "#ffffff",
  black: "#000000",
  gray: "#636363ff",
  black10: "#101010",
  lightGray: "#8d8d8dff",
  red: "#F7374F",
  lightRed: "#e0534a",
  alert: "#FF204E",
  lightYellow: "#F2F7A1",
  yellow: "#FEC260",
  green: "#2e7c2aff",
  lightGreen: "#4E9F3D",
  darkGray: "#333333",
  darkOrange: "#995400ff",
  violet: "#C7B4FD",
  darkViolet: "#602C8B",
  lightViolet: "#a824e0ff",

  backgroundColor: "#e3e0e0ff",
  iconColor: "#121111ff",
  textColor: "#0a0a0aff",
  bottomSheetColor: "#e3e0e0ff",
  bottomSheetBackgroundColor: "#abababff",
  chartBackgroundColor: "#888888ff",
  chartBorderColor: "#4e4e4eff",
  dividerColor: "#3d3c3c85",
  faintColor: "#ffffff99",
  profileTextColor: "#0a0a0aff",
  profileIconColor: "#995400ff",
  profileBottonBackgroundColor: "#ffffffe2",
  profileButtonBorderColor: "#acacacff",
  iconFocused: "#131633ff",
  iconTabBarColor: "#3d3d3dbc",
  bottomTabsBackgoundColor: "#999696",
  bottomTabsBorderColor: "#cacaca",
  activeButtonTabsBackgroundColor: "#a5a5a594",
  primaryTextColor: "#000000",
  iconInfoStatusTextColor: "#444444ff",
  iconInfoUsernameTextColor: "#46443eff",
  backgroundCameraButton: "#222222ff",
  backgroundMultiplyPhotosButton: "#75747494",
  commentTextColor: "#46443eff",
  commentTimeTextColor: "rgba(28, 28, 28, 0.4)",
  postPreviewItemBackgroundColor: "rgba(86, 66, 106, 1)",
  postBorderColor: "rgba(255, 255, 255, 0.17)",
  defauldIconBackgroundColor: "rgba(12, 12, 12, 0.4)",
  postEllipsisOptionsTextColor: "#121111ff",
  postEllipseButtonBackground: "#c8c8c8ff",
  editProfileDescription: "#969696",
  newPostShareButtonColor: "#739676ff",
  backgroundSelectionBadge: "#995400ff",
  commentDividerColor: "#602c8b68",
  inputCommentBackgroundColor: "rgba(255,255,255,0.07)",
  inputCommentBorderColor: "rgba(255, 255, 255, 0.17)",

};

const lightTheme = {
  colors: colors,
  utils: {
    s: scale,
    vs: verticalScale,
    ms: moderateScale,
  },
};

const darkTheme = {
  colors: {
    ...colors,
    iconColor: "#d1d1d1ff",
    textColor: "#fcfafaff",
    backgroundColor: "rgba(12, 12, 12, 1)",
    primaryTextColor: "#ffffffff",
    bottomTabsBackgoundColor: "#303030",
    bottomTabsBorderColor: "#272727",
    activeButtonTabsBackgroundColor: "#3d3c3c85",
    iconFocused: "#ffffff",
    iconTabBarColor: "#7f7f7fff",
    iconInfoUsernameTextColor: "#c9c9c9ff",
    iconInfoStatusTextColor: "#999999ff",
    chartBackgroundColor: "#4e4e4eff",
    chartBorderColor: "#1a1a1aff",
    dividerColor: "#ffffff1a",
    profileTextColor: "#f4f4f4ff",
    profileIconColor: "#ffffff99",
    profileBottonBackgroundColor: "rgba(130, 130, 130, 0.02)",
    profileButtonBorderColor: "rgba(255, 255, 255, 0.17)",
    postPreviewItemBackgroundColor: "rgba(18, 8, 28, 1)",
    postBorderColor: "rgba(255, 255, 255, 0.17)",
    commentTextColor: "#e7e7e7ff",
    commentTimeTextColor: "rgba(255,255,255,0.4)",
    defauldIconBackgroundColor: "rgba(130, 130, 130, 0.02)",
    bottomSheetColor: "rgba(18, 8, 28, 1)",
    postEllipsisOptionsTextColor: "#e2e2e2ff",
    bottomSheetBackgroundColor: "#1C1C1E",
    postEllipseButtonBackground: "#29292ac1",
    editProfileDescription: "#969696",
    newPostShareButtonColor: "#426f40ff",
    commentDividerColor: "#602c8b68",
    inputCommentBackgroundColor: "rgba(255,255,255,0.07)",
    inputCommentBorderColor: "rgba(255, 255, 255, 0.17)",


  },
  utils: {
    s: scale,
    vs: verticalScale,
    ms: moderateScale,
  },
};

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  settings: {
    initialTheme: "dark",
  },
  themes: appThemes,
});
