import React from "react";
import { View, StyleSheet } from "react-native";
import { Users, PhoneMissed, AlertTriangle, Clock } from "lucide-react-native";
import { StatCard } from "./StatCard";
import { Spacing } from "../../constants/spacing";
import { useTheme } from "../../hooks/useTheme";
import { DashboardStats } from "../../types";

interface StatsGridProps {
  stats: DashboardStats;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StatCard
          title="Total Leads Today"
          value={stats.totalLeadsToday}
          icon={Users}
          accentColor={colors.accent.indigo}
        />
        <View style={styles.gap} />
        <StatCard
          title="Missed Enquiries"
          value={stats.missedEnquiries}
          icon={PhoneMissed}
          accentColor={colors.urgency.medium} // amber
        />
      </View>
      <View style={styles.row}>
        <StatCard
          title="Open Escalations"
          value={stats.openEscalations}
          icon={AlertTriangle}
          accentColor={colors.urgency.high} // red
        />
        <View style={styles.gap} />
        <StatCard
          title="Follow-ups Due"
          value={stats.followUpsDue}
          icon={Clock}
          accentColor={colors.status.qualified} // green
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  row: {
    flexDirection: "row",
    height: 96,
  },
  gap: {
    width: Spacing.md,
  },
});
