import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from "react-native-reanimated";
import { ArrowRight } from "lucide-react-native";

import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import { getLeads } from "../../mock";
import { Enquiry } from "../../types";
import { GlassCard } from "../ui/GlassCard";
import { ChannelBadge } from "../ui/ChannelBadge";
import { StatusPill } from "../ui/StatusPill";
import { SectionHeader } from "../ui/SectionHeader";

const AnimatedView = Animated.createAnimatedComponent(View);

const FeedItem = ({ enquiry, index }: { enquiry: Enquiry, index: number }) => {
  const router = useRouter();
  const { colors } = useTheme();
  
  // Staggered entry animation
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 260 }));
    translateY.value = withDelay(index * 50, withTiming(0, { duration: 260 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Format time (e.g. 9:14 AM)
  const timeString = new Date(enquiry.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <AnimatedView style={animatedStyle}>
      <GlassCard 
        style={styles.card} 
        onPress={() => router.push(`/conversation/${enquiry.id}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={[Typography.h3, { color: colors.text.primary, flex: 1 }]}>
            {enquiry.customer}
          </Text>
          <Text style={[Typography.caption, { color: colors.text.muted }]}>
            {timeString}
          </Text>
        </View>

        <View style={styles.badgeRow}>
          <StatusPill status={enquiry.status} size="sm" />
          <ChannelBadge channel={enquiry.channel} size="sm" />
        </View>

        <View style={[styles.quoteBox, { backgroundColor: 'transparent', borderColor: colors.glass.border }]}>
          <Text 
            style={[Typography.body, { color: colors.text.muted, fontStyle: 'italic' }]}
            numberOfLines={2}
          >
            "{enquiry.message}"
          </Text>
        </View>
      </GlassCard>
    </AnimatedView>
  );
};

export const ActivityFeed = () => {
  const router = useRouter();
  const { colors } = useTheme();
  
  // Get last 5 enquiries
  const recentEnquiries = getLeads().slice(0, 5);

  const ViewAllButton = () => (
    <TouchableOpacity onPress={() => router.push("/leads")} style={styles.viewAllRow}>
      <Text style={[Typography.bodyMd, { color: colors.accent.indigo }]}>View all</Text>
      <ArrowRight size={16} color={colors.accent.indigo} style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SectionHeader title="Recent Activity" rightElement={<ViewAllButton />} />
      <View style={styles.feedList}>
        {recentEnquiries.map((enq, index) => (
          <FeedItem key={enq.id} enquiry={enq} index={index} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xxxl * 3, // Space for tab bar
  },
  viewAllRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  feedList: {
    gap: Spacing.md,
  },
  card: {
    // padding removed to let GlassCard internal padding handle it, fixing the glass background gap
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  badgeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  quoteBox: {
    marginTop: Spacing.sm,
    paddingLeft: Spacing.sm,
    borderLeftWidth: 2,
  }
});
