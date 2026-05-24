import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckCircle2, Clock, Send } from "lucide-react-native";

import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import { FollowUp } from "../../types";
import { GlassCard } from "../ui/GlassCard";
import { ChannelBadge } from "../ui/ChannelBadge";

interface FollowUpCardProps {
  followUp: FollowUp;
}

export const FollowUpCard = ({ followUp }: FollowUpCardProps) => {
  const { colors } = useTheme();

  const isOverdue = new Date(followUp.dueAt).getTime() < new Date().getTime();
  const isDone = followUp.status === "done";

  // Time formatting
  const timeString = new Date(followUp.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = new Date(followUp.dueAt).toLocaleDateString([], { month: 'short', day: 'numeric' });

  let accentColor;
  let statusIcon;
  let statusText;

  if (isDone) {
    accentColor = colors.status.resolved;
    statusIcon = <CheckCircle2 size={16} color={accentColor} />;
    statusText = "Completed";
  } else if (isOverdue) {
    accentColor = colors.urgency.high;
    statusIcon = <Clock size={16} color={accentColor} />;
    statusText = "Overdue";
  } else {
    accentColor = colors.accent.indigo;
    statusIcon = <Send size={16} color={accentColor} />;
    statusText = "Scheduled";
  }

  return (
    <GlassCard style={styles.card} accentColor={accentColor} variant={!isDone ? "elevated" : "default"}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[Typography.h3, { color: colors.text.primary }]}>{followUp.customer}</Text>
          <View style={styles.channelWrapper}>
            <ChannelBadge channel={followUp.channel} size="sm" />
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={[Typography.caption, { color: colors.text.primary, fontFamily: "Inter_600SemiBold" }]}>
            {timeString}
          </Text>
          <Text style={[Typography.caption, { color: colors.text.muted }]}>
            {dateString}
          </Text>
        </View>
      </View>

      <Text style={[Typography.body, { color: colors.text.secondary, marginVertical: Spacing.md }]} numberOfLines={3}>
        {followUp.messagePreview}
      </Text>

      <View style={[styles.footer, { backgroundColor: isDone ? colors.status.resolvedBg : (isOverdue ? colors.status.escalatedBg : 'rgba(99,102,241,0.1)') }]}>
        <View style={styles.statusRow}>
          {statusIcon}
          <Text style={[Typography.caption, { color: accentColor, marginLeft: Spacing.xs, fontFamily: "Inter_600SemiBold" }]}>
            {statusText}
          </Text>
        </View>
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
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
  },
  channelWrapper: {
    marginTop: 6,
    alignSelf: "flex-start",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  }
});
