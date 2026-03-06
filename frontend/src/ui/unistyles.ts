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
  lightRed: "#AE445A",
  alert: "#FF204E",
  lightYellow: "#F2F7A1",
  yellow: "#FEC260",
  green: "#2e7c2aff",
  lightGreen: "#4E9F3D",
  darkGray: "#333333",
  darkOrange: "#995400ff",
  violet: "#C7B4FD",
  darkViolet: "#602C8B",

  backgroundColor: "#e3e0e0ff",
  iconColor: "#121111ff",
  bottomSheetColor: "#e3e0e0ff",
  bottomSheetIndicatorStyle: "#303030ff",
  commentTextColor: "#0a0a0aff",
  chartBackgroundColor: "#888888ff",
  chartBorderColor: "#4e4e4eff",
  dividerColor: "#3d3c3c85",
  profileTextColor: "#0a0a0aff",
  profileIconColor: "#995400ff",
  profileBottonBackgroundColor: "#ffffffe2",
  profileButtonBorderColor: "#acacacff",
  editProfileDescription: "#969696",
  iconFocused: "#131633ff",
  iconTabBarColor: "#3d3d3dbc",
  bottomTabsBackgoundColor: "#999696",
  bottomTabsBorderColor: "#cacaca",
  activeButtonTabsBackgroundColor: "#a5a5a594",
  primaryTextColor: "#000000",
  iconInfoStatusTextColor: "#444444ff",
  iconInfoUsernameTextColor: "#46443eff",
  postEllipsisOptionsTextColor: "#121111ff",
  postEllipsisOptionsBackground: "#ffffffe2",
  newPostShareButtonColor: "#739676ff",
  backgroundCameraButton: "#222222ff",
  backgroundMultiplyPhotosButton: "#75747494",
  backgroundSelectionBadge: "#995400ff",
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
    backgroundColor: "#1e1e1eff",
    primaryTextColor: "#ffffffff",
    bottomTabsBackgoundColor: "#303030",
    bottomTabsBorderColor: "#272727",
    activeButtonTabsBackgroundColor: "#3d3c3c85",
    iconFocused: "#ffffff",
    iconTabBarColor: "#7f7f7fff",
    iconInfoUsernameTextColor: "#c9c9c9ff",
    iconInfoStatusTextColor: "#999999ff",
    bottomSheetColor: "#202021ff",
    bottomSheetIndicatorStyle: "#adadadff",
    commentTextColor: "#d1d1d1ff",
    chartBackgroundColor: "#rgba(78, 78, 78, 1)",
    chartBorderColor: "#1a1a1aff",
    dividerColor: "#8d8d8dff",
    profileTextColor: "#d1d1d1ff",
    profileIconColor: "#d1d1d1ff",
    profileBottonBackgroundColor: "#1e1e1e5a",
    profileButtonBorderColor: "#979797",
    editProfileDescription: "#969696",
    postEllipsisOptionsTextColor: "#e2e2e2ff",
    postEllipsisOptionsBackground: "#2d2d2fff",
    newPostShareButtonColor: "#426f40ff",
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
