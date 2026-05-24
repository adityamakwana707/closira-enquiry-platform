import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ChevronRight, AlertOctagon } from "lucide-react-native";
import { useRouter } from "expo-router";

import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import { Enquiry } from "../../types";
import { GlassCard } from "../ui/GlassCard";
import { UrgencyDot } from "../ui/UrgencyDot";

interface EscalationCardProps {
  enquiry: Enquiry;
}

export const EscalationCard = ({ enquiry }: EscalationCardProps) => {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const isHighUrgency = enquiry.urgency === "high";

  return (
    <GlassCard 
      style={styles.card} 
      accentColor={isHighUrgency ? colors.urgency.high : colors.urgency.medium}
      onPress={() => router.push(`/conversation/${enquiry.id}`)}
      variant={isHighUrgency && !isDark ? "elevated" : "default"}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <UrgencyDot urgency={enquiry.urgency || "medium"} />
          <Text style={[Typography.h3, { color: colors.text.primary, marginLeft: Spacing.sm }]}>
            {enquiry.customer}
          </Text>
        </View>
        <Text style={[Typography.caption, { color: colors.text.muted }]}>
          {new Date(enquiry.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      <View style={styles.reasonContainer}>
        <AlertOctagon size={16} color={colors.status.escalated} />
        <Text style={[Typography.bodyMd, { color: colors.text.primary, marginLeft: Spacing.xs, flex: 1 }]} numberOfLines={2}>
          {enquiry.escalationReason || "Escalation requires review"}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={[Typography.caption, { color: colors.text.muted }]} numberOfLines={1}>
          Waiting for response...
        </Text>
        <ChevronRight size={16} color={colors.text.muted} />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  reasonContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }
});
