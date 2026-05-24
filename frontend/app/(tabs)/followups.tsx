import React from "react";
import { View, Text, StyleSheet, SectionList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckCircle2 } from "lucide-react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from "react-native-reanimated";

import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import { mockFollowUps } from "../../mock";
import { FollowUp } from "../../types";

import { FollowUpCard } from "../../components/followups/FollowUpCard";
import { BackgroundOrbs } from "../../components/ui/BackgroundOrbs";
import { EmptyState } from "../../components/ui/EmptyState";

const AnimatedView = Animated.createAnimatedComponent(View);

const AnimatedFollowUpItem = ({ item, index }: { item: FollowUp, index: number }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  React.useEffect(() => {
    opacity.value = withDelay((index % 10) * 50, withTiming(1, { duration: 260 }));
    translateY.value = withDelay((index % 10) * 50, withTiming(0, { duration: 260 }));
  }, [item.id, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <AnimatedView style={animatedStyle}>
      <FollowUpCard followUp={item} />
    </AnimatedView>
  );
};

export default function FollowUpsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const now = new Date().getTime();
  
  const overdue = mockFollowUps.filter(f => f.status !== "done" && new Date(f.dueAt).getTime() < now);
  const upcoming = mockFollowUps.filter(f => f.status !== "done" && new Date(f.dueAt).getTime() >= now);
  const completed = mockFollowUps.filter(f => f.status === "done");

  const sections = [];
  if (overdue.length > 0) {
    sections.push({ title: "Overdue", data: overdue });
  }
  if (upcoming.length > 0) {
    sections.push({ title: "Upcoming", data: upcoming });
  }
  if (completed.length > 0) {
    sections.push({ title: "Completed", data: completed });
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <BackgroundOrbs />
      <View style={[styles.container, { paddingTop: insets.top + Spacing.xl }]}>
        <View style={styles.headerContainer}>
          <Text style={[Typography.h1, { color: colors.text.primary, marginBottom: Spacing.xs }]}>
            Follow-ups
          </Text>
          <Text style={[Typography.body, { color: colors.text.secondary, marginBottom: Spacing.lg }]}>
            Scheduled responses and check-ins
          </Text>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => <AnimatedFollowUpItem item={item} index={index} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[Typography.h3, styles.sectionHeader, { color: colors.text.primary }]}>
              {title}
            </Text>
          )}
          ListEmptyComponent={
            <EmptyState 
              icon={CheckCircle2} 
              iconColor={colors.status.qualified}
              title="Inbox Zero" 
              subtitle="You have no pending follow-ups" 
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: Spacing.lg,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl * 3, // Space for tab bar
  },
  sectionHeader: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  }
});
