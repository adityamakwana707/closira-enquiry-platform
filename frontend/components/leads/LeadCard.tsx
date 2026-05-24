import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ChevronRight, Sparkles } from "lucide-react-native";
import { useRouter } from "expo-router";

import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import { Enquiry } from "../../types";
import { GlassCard } from "../ui/GlassCard";
import { ChannelBadge } from "../ui/ChannelBadge";
import { StatusPill } from "../ui/StatusPill";

// Deterministic color hash for avatars
const AVATAR_COLORS = ["indigo", "violet", "teal", "green", "amber", "rose"] as const;

function getAvatarColor(name: string, isDark: boolean, colors: any) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  const colorName = AVATAR_COLORS[index];
  
  // Map to semantic colors
  let hex;
  switch (colorName) {
    case "indigo": hex = colors.accent.indigo; break;
    case "violet": hex = colors.accent.violet; break;
    case "teal": hex = colors.accent.teal; break;
    case "green": hex = colors.channel.whatsapp; break; // #22C55E
    case "amber": hex = colors.channel.call; break;     // #F59E0B
    case "rose": hex = colors.status.escalated; break;  // #EF4444
  }
  
  const opacity = isDark ? "40" : "26"; // 25% and 15% hex approx
  return { bg: `${hex}${opacity}`, text: hex };
}

interface LeadCardProps {
  enquiry: Enquiry;
}

export const LeadCard = ({ enquiry }: LeadCardProps) => {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  let accentColor;
  switch (enquiry.status) {
    case "new": accentColor = colors.accent.indigo; break;
    case "qualified": accentColor = colors.status.qualified; break;
    case "escalated": accentColor = colors.status.escalated; break;
    case "resolved": accentColor = colors.status.resolved; break;
  }

  const initials = enquiry.customer.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  const avatarColors = getAvatarColor(enquiry.customer, isDark, colors);
  const timeString = new Date(enquiry.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <GlassCard 
      style={styles.card} 
      accentColor={accentColor}
      onPress={() => router.push(`/conversation/${enquiry.id}`)}
    >
      <View style={styles.container}>
        {/* Header: Avatar + Info */}
        <View style={styles.headerArea}>
          <View style={[styles.avatar, { backgroundColor: avatarColors.bg }]}>
            <Text style={[Typography.h3, { color: avatarColors.text }]}>{initials}</Text>
          </View>
          
          <View style={styles.headerInfo}>
            <View style={styles.nameTimeRow}>
              <Text style={[Typography.h3, { color: colors.text.primary, flex: 1 }]} numberOfLines={1}>
                {enquiry.customer}
              </Text>
              <Text style={[Typography.caption, { color: colors.text.muted }]}>{timeString}</Text>
            </View>
            
            <View style={styles.badgeRow}>
              <StatusPill status={enquiry.status} size="sm" />
              <ChannelBadge channel={enquiry.channel} size="sm" />
            </View>
          </View>
        </View>

        {/* Content: Quote */}
        <View style={[styles.quoteBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: colors.glass.border }]}>
          <Text style={[Typography.body, { color: colors.text.secondary, fontStyle: 'italic' }]} numberOfLines={2}>
            "{enquiry.message}"
          </Text>
        </View>

        {/* Footer: Action */}
        {enquiry.matchedSOP && (
          <View style={styles.footerRow}>
            <View style={[styles.sopPill, { backgroundColor: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)' }]}>
              <Sparkles size={14} color={colors.accent.indigo} />
              <Text style={[Typography.bodyMd, { color: colors.accent.indigo, marginLeft: 6 }]}>
                Matched SOP: {enquiry.matchedSOP}
              </Text>
            </View>
            <View style={[styles.actionBtn, { backgroundColor: colors.glass.surface }]}>
              <ChevronRight size={18} color={colors.text.primary} />
            </View>
          </View>
        )}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  container: {
    gap: Spacing.sm,
  },
  headerArea: {
    flexDirection: "row",
    gap: Spacing.md,
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  nameTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  quoteBox: {
    marginTop: 4,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  sopPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: 999,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  }
});
