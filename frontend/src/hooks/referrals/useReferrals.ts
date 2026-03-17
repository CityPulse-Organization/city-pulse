import { useCallback, useEffect, useState } from "react";
import { Share } from "react-native";
import {
  Easing,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type {
  GlowAnimations,
  HowItWorksStep,
  Milestone,
  PremiumPerk,
  Referral,
} from "@/src/types/referrals";

export const REFERRAL_CODE = "KYRYLO-PULSE";
export const REQUIRED_REFERRALS = 10;
export const CURRENT_REFERRALS = 4;

export const MILESTONES: Milestone[] = [
  {
    id: "bronze",
    label: "Bronze",
    count: 3,
    icon: "flame",
    gradient: ["#CD7F32", "#8B4513"],
    reward: "Custom profile frame",
    unlocked: CURRENT_REFERRALS >= 3,
  },
  {
    id: "silver",
    label: "Silver",
    count: 5,
    icon: "star",
    gradient: ["#E8E8E8", "#A8A8A8"],
    reward: "Verified badge",
    unlocked: CURRENT_REFERRALS >= 5,
  },
  {
    id: "gold",
    label: "Gold",
    count: 7,
    icon: "trophy",
    gradient: ["#FFD700", "#FF8C00"],
    reward: "Advanced analytics",
    unlocked: CURRENT_REFERRALS >= 7,
  },
  {
    id: "diamond",
    label: "Diamond",
    count: 10,
    icon: "diamond",
    gradient: ["#E040FB", "#7C4DFF"],
    reward: "Full Premium — forever",
    unlocked: CURRENT_REFERRALS >= 10,
  },
];

export const PREMIUM_PERKS: PremiumPerk[] = [
  {
    id: "1",
    icon: "shield-checkmark",
    title: "Verified Badge",
    desc: "Stand out with verification",
  },
  {
    id: "2",
    icon: "analytics",
    title: "Analytics",
    desc: "Deep performance insights",
  },
  {
    id: "3",
    icon: "color-palette",
    title: "Themes",
    desc: "Exclusive customization",
  },
  {
    id: "4",
    icon: "megaphone",
    title: "Priority",
    desc: "Boosted in Discover",
  },
  {
    id: "5",
    icon: "videocam",
    title: "HD Stream",
    desc: "High quality broadcast",
  },
  { id: "6", icon: "infinite", title: "Unlimited", desc: "Save everything" },
];

export const RECENT_REFERRALS: Referral[] = [
  { id: "1", username: "anna_k", joinedAt: "2 days ago" },
  { id: "2", username: "max_dev", joinedAt: "5 days ago" },
  { id: "3", username: "sofia.m", joinedAt: "1 week ago" },
  { id: "4", username: "d_jones", joinedAt: "2 weeks ago" },
];

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: 1,
    title: "Share your code",
    desc: "Send your referral link to friends",
    icon: "paper-plane",
  },
  {
    step: 2,
    title: "Friends join",
    desc: "They sign up with your code",
    icon: "people",
  },
  {
    step: 3,
    title: "Unlock rewards",
    desc: "Hit milestones, earn Premium",
    icon: "gift",
  },
];

export function useReferrals() {
  const [codeCopied, setCodeCopied] = useState(false);

  const ringPulse = useSharedValue(1);

  useEffect(() => {
    ringPulse.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
  }, [ringPulse]);

  const glowAnimations: GlowAnimations = { ringPulse };

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Join me on City Pulse! Use my referral code: ${REFERRAL_CODE}\n\nhttps://citypulse.app/invite/${REFERRAL_CODE}`,
      });
    } catch (_) {}
  }, []);

  const handleCopy = useCallback(() => {
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }, []);

  const progress = CURRENT_REFERRALS / REQUIRED_REFERRALS;
  const remaining = REQUIRED_REFERRALS - CURRENT_REFERRALS;

  return {
    codeCopied,
    glowAnimations,
    handleShare,
    handleCopy,
    progress,
    remaining,
  };
}
