import { ThemedBackground } from "@/src/components";
import {
  GlowRing,
  GradientCard,
  GradientDivider,
  PerkCard,
  ReferralRow,
  StepCard,
  TierCard,
} from "@/src/components/referrals";
import {
  CURRENT_REFERRALS,
  HOW_IT_WORKS,
  MILESTONES,
  PREMIUM_PERKS,
  RECENT_REFERRALS,
  REFERRAL_CODE,
  REQUIRED_REFERRALS,
  useReferrals,
} from "@/src/hooks/referrals/useReferrals";
import { UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

export default function ReferralsScreen() {
  const {
    codeCopied,
    glowAnimations,
    handleShare,
    handleCopy,
    progress,
    remaining,
  } = useReferrals();

  return (
    <ThemedBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <LinearGradient
            colors={[
              "rgba(168,36,224,0.18)",
              "rgba(124,77,255,0.10)",
              "transparent",
            ]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={styles.auroraLayer1}
          />
          <LinearGradient
            colors={["rgba(224,64,251,0.10)", "transparent"]}
            start={{ x: 0.8, y: 0 }}
            end={{ x: 0.2, y: 0.8 }}
            style={styles.auroraLayer2}
          />

          <View style={styles.heroRow}>
            <View style={styles.heroLeft}>
              <UIText size="xxl" weight="bold" style={styles.heroTitle}>
                Invite & Earn
              </UIText>
              <UIText size="sm" style={styles.heroSub}>
                Bring {REQUIRED_REFERRALS} friends to City Pulse and unlock
                Premium — forever, for free.
              </UIText>
            </View>
            <LinearGradient
              colors={["#a824e0", "#7C4DFF", "#E040FB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroDiamond}
            >
              <Ionicons name="diamond" size={26} color="#fff" />
            </LinearGradient>
          </View>
        </View>

        {/* ── Glow Ring ── */}
        <GlowRing
          current={CURRENT_REFERRALS}
          total={REQUIRED_REFERRALS}
          progress={progress}
          remaining={remaining}
          milestones={MILESTONES}
          animations={glowAnimations}
        />

        <GradientDivider />

        {/* ── Code Card ── */}
        <GradientCard
          colors={[
            "rgba(168,36,224,0.45)",
            "rgba(124,77,255,0.20)",
            "rgba(206,147,216,0.10)",
          ]}
          style={styles.codeCardOuter}
        >
          <View style={styles.codeCardContent}>
            <View style={styles.codeTop}>
              <UIText size="xxs" style={styles.codeLbl}>
                YOUR REFERRAL CODE
              </UIText>
              <Pressable onPress={handleCopy} style={styles.copyBtn}>
                <LinearGradient
                  colors={
                    codeCopied
                      ? ["#4CAF50", "#2E7D32"]
                      : ["rgba(168,36,224,0.2)", "rgba(124,77,255,0.1)"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.copyBtnGrad}
                >
                  <Ionicons
                    name={codeCopied ? "checkmark" : "copy-outline"}
                    size={14}
                    color={
                      codeCopied
                        ? "#fff"
                        : UnistylesRuntime.getTheme().colors.accent
                    }
                  />
                  <UIText
                    size="xxs"
                    weight="bold"
                    style={codeCopied ? styles.whiteTxt : styles.accentText}
                  >
                    {codeCopied ? "Copied!" : "Copy"}
                  </UIText>
                </LinearGradient>
              </Pressable>
            </View>

            <UIText size="xl" weight="bold" style={styles.codeValue}>
              {REFERRAL_CODE}
            </UIText>

            <UIButton onPress={handleShare} style={styles.shareBtn}>
              <LinearGradient
                colors={["#a824e0", "#7C4DFF", "#E040FB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.shareBtnGrad}
              >
                <Ionicons name="share-social" size={18} color="#fff" />
                <UIText size="sm" weight="bold" style={styles.whiteTxt}>
                  Share Invite Link
                </UIText>
              </LinearGradient>
            </UIButton>
          </View>
        </GradientCard>

        <GradientDivider />

        {/* ── How It Works ── */}
        <SectionHeader colors={["#a824e0", "#7C4DFF"]} title="How It Works" />
        <View style={styles.stepsCol}>
          {HOW_IT_WORKS.map((s, i) => (
            <React.Fragment key={s.step}>
              <StepCard {...s} />
              {i < HOW_IT_WORKS.length - 1 && (
                <View style={styles.stepConnector}>
                  <LinearGradient
                    colors={["#a824e0", "rgba(124,77,255,0.3)", "transparent"]}
                    style={styles.stepLine}
                  />
                </View>
              )}
            </React.Fragment>
          ))}
        </View>

        <GradientDivider />

        {/* ── Milestones ── */}
        <SectionHeader
          colors={["#FFD700", "#FF8C00"]}
          title="Reward Milestones"
        />
        <View style={styles.tiersCol}>
          {MILESTONES.map((m) => (
            <TierCard key={m.id} milestone={m} />
          ))}
        </View>

        <GradientDivider />

        {/* ── Perks ── */}
        <SectionHeader
          colors={["#E040FB", "#7C4DFF"]}
          title="Premium Includes"
        />
        <View style={styles.perksGrid}>
          {PREMIUM_PERKS.map((p) => (
            <PerkCard key={p.id} icon={p.icon} title={p.title} desc={p.desc} />
          ))}
        </View>

        <GradientDivider />

        {/* ── Referrals ── */}
        <View style={styles.sectionTitleRow}>
          <LinearGradient
            colors={["#4CAF50", "#2E7D32"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sectionAccent}
          />
          <UIText size="md" weight="bold" style={styles.sectionTitle}>
            Your Referrals
          </UIText>
          <LinearGradient
            colors={["#a824e0", "#7C4DFF"]}
            style={styles.countBadge}
          >
            <UIText size="xxs" weight="bold" style={styles.whiteTxt}>
              {CURRENT_REFERRALS}
            </UIText>
          </LinearGradient>
        </View>
        <GradientCard
          colors={[
            "rgba(168,36,224,0.20)",
            "rgba(124,77,255,0.06)",
            "rgba(168,36,224,0.02)",
          ]}
        >
          <View>
            {RECENT_REFERRALS.map((r, i) => (
              <ReferralRow
                key={r.id}
                username={r.username}
                joinedAt={r.joinedAt}
                index={i}
              />
            ))}
          </View>
        </GradientCard>
      </ScrollView>
    </ThemedBackground>
  );
}

function SectionHeader({
  colors,
  title,
}: {
  colors: [string, string];
  title: string;
}) {
  return (
    <View style={styles.sectionTitleRow}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.sectionAccent}
      />
      <UIText size="md" weight="bold" style={styles.sectionTitle}>
        {title}
      </UIText>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: theme.utils.s(20),
    paddingBottom: theme.utils.vs(140),
  },

  hero: {
    padding: theme.utils.s(10),
    position: "relative",
    overflow: "hidden",
    borderRadius: theme.utils.s(16),
    marginBottom: theme.utils.vs(50),
  },
  auroraLayer1: {
    position: "absolute",
    top: -theme.utils.vs(60),
    left: -theme.utils.s(80),
    right: -theme.utils.s(40),
    height: theme.utils.vs(260),
    borderRadius: 999,
  },
  auroraLayer2: {
    position: "absolute",
    top: -theme.utils.vs(30),
    right: -theme.utils.s(60),
    width: theme.utils.s(200),
    height: theme.utils.vs(200),
    borderRadius: 999,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroLeft: { flex: 1, paddingRight: theme.utils.s(16) },
  heroTitle: {
    color: theme.colors.primaryText,
    marginBottom: theme.utils.vs(6),
  },
  heroSub: { color: theme.colors.muted, lineHeight: theme.utils.vs(20) },
  heroDiamond: {
    width: theme.utils.s(56),
    height: theme.utils.s(56),
    borderRadius: theme.utils.s(18),
    alignItems: "center",
    justifyContent: "center",
  },

  codeCardOuter: { marginBottom: 0 },
  codeCardContent: {
    paddingHorizontal: theme.utils.s(20),
    paddingTop: theme.utils.vs(18),
    paddingBottom: theme.utils.vs(20),
  },
  codeTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.utils.vs(10),
  },
  codeLbl: { color: theme.colors.muted, letterSpacing: 2 },
  copyBtn: { borderRadius: 50, overflow: "hidden" },
  copyBtnGrad: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(4),
    paddingHorizontal: theme.utils.s(10),
    paddingVertical: theme.utils.vs(5),
  },
  codeValue: {
    color: theme.colors.accent,
    letterSpacing: 3,
    marginBottom: theme.utils.vs(18),
    textAlign: "center",
  },
  shareBtn: { borderRadius: theme.utils.s(14), overflow: "hidden" },
  shareBtnGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.utils.vs(14),
    gap: theme.utils.s(10),
    borderRadius: theme.utils.s(14),
  },

  // Sections
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(10),
    marginBottom: theme.utils.vs(14),
  },
  sectionAccent: {
    width: theme.utils.s(4),
    height: theme.utils.vs(18),
    borderRadius: 2,
  },
  sectionTitle: { color: theme.colors.primaryText, flex: 1 },

  // Steps
  stepsCol: { gap: 0, marginBottom: theme.utils.vs(6) },
  stepConnector: { alignItems: "center", height: theme.utils.vs(14) },
  stepLine: { width: 2, height: "100%", borderRadius: 1 },

  // Tiers
  tiersCol: { gap: theme.utils.vs(8), marginBottom: theme.utils.vs(6) },

  // Perks
  perksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.utils.s(10),
    marginBottom: theme.utils.vs(6),
  },

  // Badge
  countBadge: {
    paddingHorizontal: theme.utils.s(8),
    paddingVertical: theme.utils.vs(2),
    borderRadius: 50,
  },

  // Text
  accentText: { color: theme.colors.accent },
  whiteTxt: { color: "#fff" },
}));
