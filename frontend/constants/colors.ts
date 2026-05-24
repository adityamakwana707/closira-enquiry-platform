const DarkPalette = {
  background: {
    primary:   "#0A0F1E",   // deep navy — base canvas
    secondary: "#111827",   // slightly lighter — screen backgrounds
    tertiary:  "#1F2937",   // cards, input fills
    elevated:  "#243044",   // modals, popovers
  },
  glass: {
    surface:   "rgba(255, 255, 255, 0.03)",
    surfaceHover: "rgba(255, 255, 255, 0.08)",
    border:    "rgba(255, 255, 255, 0.15)",
    strong:    "rgba(255, 255, 255, 0.08)",
  },
  orb: {
    indigo:  "rgba(99, 102, 241, 0.25)",
    violet:  "rgba(167, 139, 250, 0.20)",
    teal:    "rgba(45, 212, 191, 0.22)",
  },
  shadow: {
    card:    "transparent",
    strong:  "rgba(0, 0, 0, 0.80)",
  },
  text: {
    primary:   "#F9FAFB",
    secondary: "rgba(249, 250, 251, 0.70)",
    muted:     "rgba(249, 250, 251, 0.45)",
    disabled:  "rgba(249, 250, 251, 0.25)",
  },
  divider:     "rgba(255, 255, 255, 0.08)",
  tabBar: {
    background: "rgba(10, 15, 30, 0.88)",
    border:     "rgba(255, 255, 255, 0.08)",
  },
};

const LightPalette = {
  background: {
    primary:   "#E6E9F2",   // Slightly darker, cooler background so white glass pops
    secondary: "#F1F5F9",   // screen backgrounds
    tertiary:  "#E2E8F0",   // input fills, subtle sections
    elevated:  "#FFFFFF",   // modals, popovers
  },
  glass: {
    surface:      "rgba(255, 255, 255, 0.45)", // More opaque white frost
    surfaceHover: "rgba(255, 255, 255, 0.60)",
    border:       "rgba(255, 255, 255, 0.90)", // Stronger white rim
    strong:       "rgba(255, 255, 255, 0.80)",
  },
  orb: {
    indigo:  "rgba(99, 102, 241, 0.35)", // Softened to match dark mode updates
    violet:  "rgba(167, 139, 250, 0.30)",
    teal:    "rgba(45, 212, 191, 0.32)",
  },
  shadow: {
    card:    "transparent",
    strong:  "rgba(99, 102, 241, 0.15)",
  },
  text: {
    primary:   "#0F172A",
    secondary: "rgba(15, 23, 42, 0.65)",
    muted:     "rgba(15, 23, 42, 0.40)",
    disabled:  "rgba(15, 23, 42, 0.25)",
  },
  divider:     "rgba(15, 23, 42, 0.07)",
  tabBar: {
    background: "rgba(245, 244, 255, 0.90)",
    border:     "rgba(15, 23, 42, 0.07)",
  },
};

export const SemanticColors = {
  accent: {
    indigo:      "#6366F1",
    indigoLight: "#818CF8",
    indigoDark:  "#4F46E5",
    violet:      "#8B5CF6",
    teal:        "#14B8A6",
  },
  channel: {
    whatsapp:    "#22C55E",
    whatsappBg:  "rgba(34, 197, 94, 0.15)",
    email:       "#3B82F6",
    emailBg:     "rgba(59, 130, 246, 0.15)",
    call:        "#F59E0B",
    callBg:      "rgba(245, 158, 11, 0.15)",
  },
  status: {
    new:         "#6366F1",
    newBg:       "rgba(99, 102, 241, 0.15)",
    qualified:   "#22C55E",
    qualifiedBg: "rgba(34, 197, 94, 0.15)",
    escalated:   "#EF4444",
    escalatedBg: "rgba(239, 68, 68, 0.15)",
    resolved:    "#6B7280",
    resolvedBg:  "rgba(107, 114, 128, 0.15)",
  },
  urgency: {
    high:        "#EF4444",
    highBg:      "rgba(239, 68, 68, 0.12)",
    medium:      "#F59E0B",
    mediumBg:    "rgba(245, 158, 11, 0.12)",
  },
};

export const Themes = {
  dark:  { ...DarkPalette,  ...SemanticColors },
  light: { ...LightPalette, ...SemanticColors },
};

export type AppTheme = typeof Themes.dark;
