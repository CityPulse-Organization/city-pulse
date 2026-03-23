import { Dimensions } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

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

const colors = {
  white: "#ffffff",
  black: "#000000",
  gray: "#636363ff",
  black10: "#101010",
  lightGray: "#918f8fff",
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

  background: "rgba(245, 245, 247, 0.9)",
  primary: "rgba(0, 0, 0, 1)",
  primaryText: "rgba(0, 0, 0, 1)",
  icon: "rgba(18, 17, 17, 1)",
  borderSubtle: "rgba(0,0,0,0.08)",
  backgroundSubtle: "rgba(0,0,0,0.03)",

  muted: "rgba(0, 0, 0, 0.6)",
  lightMuted: "rgba(0, 0, 0, 0.2)",
  accent: "rgba(168, 36, 224, 1)",
  mutedAccent: "rgba(96, 44, 139, 1)",

  chartBackgroundColor: "#888888ff",
  chartBorderColor: "#4e4e4eff",
  bottomSheetColor: "#e3e0e0ff",

  tabBarIconActive: "rgba(0, 0, 0, 1)",
  tabBarIconDefault: "rgba(0, 0, 0, 0.6)",
  tabBarBorder: "rgba(202, 202, 202, 1)",
  tabBarItemActiveBackground: "rgba(165, 165, 165, 0.58)",

  bottomSheetBackground: "rgba(237, 237, 239, 1)",

  divider: "rgba(0,0,0,0.1)",

  buttonSelectedBackground: "rgba(0, 0, 0, 1)",
  iconSelected: "rgba(255, 255, 255, 1)",

  backgroundOverlay: "rgba(214, 198, 252, 0.4)",
  gradientOverlay: ["rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0)", "rgba(245, 245, 247, 1)"] as const,
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
    background: "rgba(12, 12, 12, 1)",
    primary: "rgba(255, 255, 255, 1)",
    primaryText: "rgba(255, 255, 255, 1)",
    icon: "rgba(209, 209, 209, 1)",
    borderSubtle: "rgba(255, 255, 255, 0.1)",
    backgroundSubtle: "rgba(255,255,255,0.04)",

    muted: "rgba(255, 255, 255, 0.5)",
    lightMuted: "rgba(255, 255, 255, 0.2)",

    chartBackgroundColor: "rgba(78, 78, 78, 1)",
    chartBorderColor: "rgba(26, 26, 26, 1)",
    bottomSheetColor: "rgba(18, 8, 28, 1)",

    tabBarIconActive: "rgba(255, 255, 255, 1)",
    tabBarIconDefault: "rgba(255, 255, 255, 0.6)",
    tabBarBorder: "rgba(39, 39, 39, 0.8)",
    tabBarItemActiveBackground: "rgba(61, 60, 60, 0.52)",

    bottomSheetBackground: "rgba(28, 28, 30, 1)",

    divider: "rgba(255, 255, 255, 0.1)",

    buttonSelectedBackground: "rgba(255, 255, 255, 1)",
    iconSelected: "rgba(0, 0, 0, 1)",

    backgroundOverlay: "rgba(18, 8, 28, 1)",
    gradientOverlay: ["rgba(0, 0, 0, 0.6)", "rgba(0,0,0,0)", "rgba(0, 0, 0, 0.8)"] as const,
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
  export interface UnistylesThemes extends AppThemes { }
}

StyleSheet.configure({
  settings: {
    initialTheme: "dark",
  },
  themes: appThemes,
});
