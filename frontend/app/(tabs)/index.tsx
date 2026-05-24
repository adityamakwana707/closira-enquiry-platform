import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";

import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import { getDashboardStats } from "../../mock";

import { ThemeToggle } from "../../components/ui/ThemeToggle";
import { GlassCard } from "../../components/ui/GlassCard";
import { BackgroundOrbs } from "../../components/ui/BackgroundOrbs";
import { StatsGrid } from "../../components/dashboard/StatsGrid";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { ActivityFeed } from "../../components/dashboard/ActivityFeed";

export default function DashboardScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const stats = getDashboardStats();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <BackgroundOrbs />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[Typography.h1, { color: colors.text.primary }]}>{getGreeting()}, Rahul 👋</Text>
            <Text style={[Typography.body, { color: colors.text.secondary, marginTop: Spacing.xs }]}>
              Here's your business pulse for today
            </Text>
          </View>
          <View style={styles.headerRight}>
            <ThemeToggle />
          </View>
        </View>

        <StatsGrid stats={stats} />
        <QuickActions />
        <ActivityFeed />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.xxxl,
  },
  headerLeft: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  }
});
