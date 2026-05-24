import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Circle, FileText, AlertTriangle, ArrowRightCircle, CheckCircle2 } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import { TimelineEvent } from "../../types";

interface ConversationTimelineProps {
  timeline: TimelineEvent[];
}

export const ConversationTimeline = ({ timeline }: ConversationTimelineProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {timeline.map((event, index) => {
        const isLast = index === timeline.length - 1;
        const timeString = new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let Icon = Circle;
        let iconColor = colors.text.muted;
        let bg = 'transparent';

        switch (event.eventType) {
          case "enquiry_created":
            Icon = ArrowRightCircle;
            iconColor = colors.accent.indigo;
            bg = 'rgba(99,102,241,0.1)';
            break;
          case "sop_matched":
            Icon = FileText;
            iconColor = colors.status.qualified;
            bg = colors.status.qualifiedBg;
            break;
          case "escalated":
          case "auto_escalated":
            Icon = AlertTriangle;
            iconColor = colors.status.escalated;
            bg = colors.status.escalatedBg;
            break;
          case "resolved":
            Icon = CheckCircle2;
            iconColor = colors.status.resolved;
            bg = colors.status.resolvedBg;
            break;
        }

        return (
          <View key={event.id} style={styles.eventRow}>
            <View style={styles.timelineCol}>
              <View style={[styles.iconWrapper, { backgroundColor: bg }]}>
                <Icon size={14} color={iconColor} strokeWidth={2.5} />
              </View>
              {!isLast && <View style={[styles.line, { backgroundColor: colors.glass.border }]} />}
            </View>
            <View style={styles.contentCol}>
              <Text style={[Typography.bodyMd, { color: colors.text.primary }]}>{event.description}</Text>
              <Text style={[Typography.caption, { color: colors.text.muted, marginTop: 2 }]}>{timeString}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
  eventRow: {
    flexDirection: "row",
  },
  timelineCol: {
    alignItems: "center",
    marginRight: Spacing.md,
    width: 24,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  contentCol: {
    flex: 1,
    paddingBottom: Spacing.xl,
    paddingTop: 2,
  }
});
