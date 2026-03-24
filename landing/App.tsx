import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Pressable,
  Platform,
  Image,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useEffect } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MAX_WIDTH = Math.min(SCREEN_WIDTH, 1400);
const IS_DESKTOP = SCREEN_WIDTH > 768;

const THEME = {
  bg: "#020202",
  accent: "#a824e0",
  alert: "#FF204E",
  white: "#FFFFFF",
  muted: "rgba(255, 255, 255, 0.5)",
  border: "rgba(255, 255, 255, 0.08)",
  glass: "rgba(255, 255, 255, 0.02)",
};

export default function App() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // For Web, we want the body to scroll, not a container with flex:1
  const ContainerComponent = Platform.OS === "web" ? View : ScrollView;
  const containerProps =
    Platform.OS === "web"
      ? {}
      : {
          contentContainerStyle: styles.scrollContent,
          showsVerticalScrollIndicator: true,
        };

  return (
    <View style={styles.outerContainer}>
      <StatusBar style="light" />

      {Platform.OS === "web" && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
          html, body { 
            background-color: #020202 !important; 
            margin: 0; padding: 0; 
            overflow-y: auto !important;
            overflow-x: hidden !important;
            height: auto !important;
            min-height: 100%;
          }
          #root { 
            display: block !important; 
            height: auto !important;
            min-height: 100vh;
            overflow: visible !important;
          }
          .glass { backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); }
          .grain { 
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: url("https://grainy-gradients.vercel.app/noise.svg"); 
            opacity: 0.02; pointer-events: none; z-index: 1000;
          }
        `,
          }}
        />
      )}

      {/* Background Layers */}
      <View style={styles.bgWrapper}>
        <Image
          source={require("./assets/city_bg.png")}
          style={styles.parallaxBg}
          resizeMode="cover"
          blurRadius={40}
        />
        <View style={styles.darkGradient} />
        <View
          style={[
            styles.glowBlob,
            {
              top: -300,
              left: -200,
              backgroundColor: THEME.accent,
              opacity: 0.12,
            },
          ]}
        />
        <View
          style={[
            styles.glowBlob,
            {
              bottom: 0,
              right: -100,
              backgroundColor: THEME.alert,
              opacity: 0.08,
            },
          ]}
        />
      </View>

      <ContainerComponent {...containerProps} style={styles.mainContainer}>
        <View style={styles.contentWrapper}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brand}>
              <View style={styles.logoIcon}>
                <Ionicons name="pulse" size={30} color="#FFF" />
              </View>
              <Text style={styles.brandText}>CityPulse</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.dot} />
              <Text style={styles.statusLabel}>Live in Lublin</Text>
            </View>
          </View>

          {/* Hero */}
          <Animated.View
            style={[
              styles.hero,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.heroText}>
              <View style={styles.supraContainer}>
                <Text style={styles.supra}>NEXT-GEN URBAN GUARDIAN</Text>
              </View>
              <Text style={styles.title}>
                The Pulse Of{"\n"}
                <Text style={{ color: THEME.accent }}>Your Street.</Text>
              </Text>
              <Text style={styles.description}>
                Experience real-time incident awareness. 3D vector maps, instant
                notifications, and a verified community safety network. Built
                for the modern citizen.
              </Text>

              <View style={styles.ctaRow}>
                <Pressable
                  style={styles.primaryBtn}
                  onPress={() => window.alert("App Store link coming soon")}
                >
                  <Ionicons name="logo-apple" size={24} color="#000" />
                  <Text style={styles.primaryBtnText}>App Store</Text>
                </Pressable>
                <Pressable
                  style={styles.secondaryBtn}
                  onPress={() => window.alert("Google Play link coming soon")}
                >
                  <Ionicons name="logo-android" size={24} color="#FFF" />
                  <Text style={styles.secondaryBtnText}>Google Play</Text>
                </Pressable>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.sVal}>12k+</Text>
                  <Text style={styles.sLab}>Users</Text>
                </View>
                <View style={styles.sLine} />
                <View style={styles.stat}>
                  <Text style={styles.sVal}>1.2s</Text>
                  <Text style={styles.sLab}>Latency</Text>
                </View>
                <View style={styles.sLine} />
                <View style={styles.stat}>
                  <Text style={styles.sVal}>99%</Text>
                  <Text style={styles.sLab}>Verified</Text>
                </View>
              </View>
            </View>

            {IS_DESKTOP && (
              <View style={styles.mockupContainer}>
                <View style={styles.phoneBase}>
                  <View style={styles.phoneScreen}>
                    <Image
                      source={require("./assets/mockup.png")}
                      style={styles.fullImg}
                    />
                    <View style={styles.uiBadge}>
                      <Ionicons name="shield-checkmark" size={18} color={THEME.accent} />
                      <Text style={styles.uiBadgeTxt}>Verified Boss</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </Animated.View>

          {/* Content Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Precision Intelligence</Text>
            <Text style={styles.sectionSubtitle}>
              From the heart of the city to every district.
            </Text>

            <View style={styles.featGrid}>
              {[
                {
                  icon: "map",
                  t: "3D Perspective",
                  d: "60-degree tilt maps provide unmatched spatial awareness of incidents.",
                },
                {
                  icon: "notifications",
                  t: "Instant Alerts",
                  d: "Zero-latency push notifications the moment an incident is verified.",
                },
                {
                  icon: "people",
                  t: "Community Driven",
                  d: "A network of verified guardians ensuring every report is accurate.",
                },
              ].map((f, i) => (
                <View key={i} style={styles.featCard}>
                  <View style={styles.featIcon}>
                    <Ionicons
                      name={f.icon as any}
                      size={32}
                      color={THEME.accent}
                    />
                  </View>
                  <Text style={styles.featTitle}>{f.t}</Text>
                  <Text style={styles.featDesc}>{f.d}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.section, { marginTop: 150 }]}>
            <LinearGradient
              colors={["rgba(255,255,255,0.05)", "transparent"]}
              style={styles.megaCard}
            >
              <View style={styles.megaLeft}>
                <Text style={styles.megaTag}>THE GUARDIAN NETWORK</Text>
                <Text style={styles.megaTitle}>Report. Verify. Protect.</Text>
                <Text style={styles.megaDesc}>
                  By joining CityPulse, you become more than a user. You become
                  a Guardian. Help your community by reporting hazards and
                  verifying incident data to keep everyone safe.
                </Text>
                <Pressable
                  style={styles.learnBtn}
                  onPress={() => window.alert("Guardian docs coming soon")}
                >
                  <Text style={styles.learnBtnText}>Learn about Ranks</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={THEME.accent}
                  />
                </Pressable>
              </View>
            </LinearGradient>
          </View>

          <View style={[styles.section, { marginBottom: 100 }]}>
            <Text style={styles.locTitle}>Operating Districts</Text>
            <View style={styles.locGrid}>
              {[
                "Centrum",
                "Zamek",
                "Plac Litewski",
                "CSK",
                "Ogród Saski",
                "Stare Miasto",
              ].map((d, i) => (
                <View key={i} style={styles.locCard}>
                  <Text style={styles.locName}>{d}</Text>
                  <Text style={styles.locStatus}>✓ Fully Active</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.fBrand}>
              <Text style={styles.fLogo}>CityPulse</Text>
              <Text style={styles.fSlogan}>Built for safer streets.</Text>
            </View>
            <View style={styles.fMeta}>
              <Text style={styles.fCopy}>
                © 2026 CityPulse. Lublin, Poland.
              </Text>
              <View style={styles.fLinks}>
                <Text style={styles.fLink}>Terms</Text>
                <Text style={styles.fLink}>Privacy</Text>
              </View>
            </View>
          </View>
        </View>
      </ContainerComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: THEME.bg },
  bgWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  parallaxBg: { width: "100%", height: "100%", opacity: 0.15 },
  darkGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2,2,2,0.94)",
  },
  glowBlob: {
    position: "absolute",
    width: 700,
    height: 700,
    borderRadius: 350,
  },

  mainContainer: {
    flex: 1,
    height: Platform.OS === "web" ? "auto" : undefined,
  },
  scrollContent: { paddingBottom: 60, alignItems: "center" },
  contentWrapper: {
    width: "100%",
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: IS_DESKTOP ? 80 : 24,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 140,
  },
  brand: { flexDirection: "row", alignItems: "center" },
  logoIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: THEME.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: THEME.accent,
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  brandText: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "900",
    marginLeft: 16,
    letterSpacing: -1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4E9F3D",
    marginRight: 8,
  },
  statusLabel: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  hero: {
    flexDirection: IS_DESKTOP ? "row" : "column",
    marginTop: 60,
    alignItems: "center",
    gap: 80,
  },
  heroText: { flex: 1.2, alignItems: IS_DESKTOP ? "flex-start" : "center" },
  supraContainer: {
    backgroundColor: THEME.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 28,
  },
  supra: { color: "#FFF", fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  title: {
    color: "#FFF",
    fontSize: IS_DESKTOP ? 96 : 56,
    fontWeight: "900",
    lineHeight: IS_DESKTOP ? 96 : 60,
    letterSpacing: -4,
    textAlign: IS_DESKTOP ? "left" : "center",
  },
  description: {
    color: THEME.muted,
    fontSize: IS_DESKTOP ? 22 : 18,
    lineHeight: 34,
    marginTop: 32,
    textAlign: IS_DESKTOP ? "left" : "center",
    maxWidth: 650,
  },

  ctaRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 56,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  primaryBtn: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 18,
  },
  primaryBtnText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 18,
    marginLeft: 12,
  },
  secondaryBtn: {
    backgroundColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  secondaryBtnText: {
    color: "#FFF",
    fontWeight: "900",
    fontSize: 18,
    marginLeft: 12,
  },

  statsRow: { flexDirection: "row", marginTop: 64, gap: 40, opacity: 0.8 },
  stat: { alignItems: "center" },
  sVal: { color: "#FFF", fontSize: 26, fontWeight: "900" },
  sLab: { color: THEME.muted, fontSize: 12, fontWeight: "700", marginTop: 4 },
  sLine: { width: 1, height: 40, backgroundColor: THEME.border },

  mockupContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  phoneBase: {
    width: 340,
    height: 700,
    borderRadius: 54,
    backgroundColor: "#000",
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.9,
    shadowRadius: 60,
  },
  phoneScreen: {
    flex: 1,
    borderRadius: 42,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  fullImg: { width: "100%", height: "100%" },
  uiBadge: {
    position: "absolute",
    top: 40,
    right: -40,
    backgroundColor: "rgba(0,0,0,0.9)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    flexDirection: "row",
    alignItems: "center",
  },
  uiBadgeTxt: { color: "#FFF", fontWeight: "bold", marginLeft: 10 },

  section: { marginTop: 180 },
  sectionTitle: {
    color: "#FFF",
    fontSize: IS_DESKTOP ? 56 : 40,
    fontWeight: "900",
    letterSpacing: -2,
    textAlign: "center",
  },
  sectionSubtitle: {
    color: THEME.muted,
    fontSize: 20,
    marginTop: 16,
    textAlign: "center",
  },
  featGrid: {
    flexDirection: IS_DESKTOP ? "row" : "column",
    marginTop: 80,
    gap: 32,
  },
  featCard: {
    flex: 1,
    backgroundColor: THEME.glass,
    padding: 40,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  featIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  featTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
  },
  featDesc: { color: THEME.muted, fontSize: 16, lineHeight: 26 },

  megaCard: {
    borderRadius: 40,
    padding: IS_DESKTOP ? 80 : 40,
    borderWidth: 1,
    borderColor: THEME.border,
    overflow: "hidden",
  },
  megaLeft: { flex: 1 },
  megaTag: {
    color: THEME.accent,
    fontWeight: "900",
    fontSize: 13,
    marginBottom: 20,
  },
  megaTitle: {
    color: "#FFF",
    fontSize: 42,
    fontWeight: "900",
    marginBottom: 24,
  },
  megaDesc: {
    color: THEME.muted,
    fontSize: 18,
    lineHeight: 30,
    marginBottom: 40,
    maxWidth: 600,
  },
  learnBtn: { flexDirection: "row", alignItems: "center", gap: 10 },
  learnBtnText: { color: THEME.accent, fontSize: 16, fontWeight: "700" },

  locTitle: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 40,
  },
  locGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },
  locCard: {
    backgroundColor: THEME.glass,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.border,
    minWidth: 220,
  },
  locName: { color: "#FFF", fontSize: 18, fontWeight: "800" },
  locStatus: {
    color: "#4E9F3D",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
  },

  footer: {
    marginTop: 150,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    paddingTop: 80,
    paddingBottom: 60,
  },
  fBrand: { marginBottom: 40 },
  fLogo: { color: "#FFF", fontSize: 32, fontWeight: "900" },
  fSlogan: { color: THEME.muted, fontSize: 18, marginTop: 8 },
  fMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fCopy: { color: "rgba(255,255,255,0.2)", fontSize: 14 },
  fLinks: { flexDirection: "row", gap: 24 },
  fLink: { color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: "600" },
});
