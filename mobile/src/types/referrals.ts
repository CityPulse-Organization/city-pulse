import type { SharedValue } from "react-native-reanimated";

export type Milestone = {
  id: string;
  label: string;
  count: number;
  icon: "flame" | "star" | "trophy" | "diamond";
  gradient: [string, string];
  reward: string;
  unlocked: boolean;
};

export type PremiumPerk = {
  id: string;
  icon: string;
  title: string;
  desc: string;
};

export type Referral = {
  id: string;
  username: string;
  joinedAt: string;
};

export type HowItWorksStep = {
  step: number;
  title: string;
  desc: string;
  icon: "paper-plane" | "people" | "gift";
};

export type GlowAnimations = {
  ringPulse: SharedValue<number>;
};
