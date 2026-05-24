import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Inbox } from "lucide-react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from "react-native-reanimated";

import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import { useEnquiry } from "../../hooks/useEnquiry";
import { Enquiry } from "../../types";

import { LeadFilters } from "../../components/leads/LeadFilters";
import { LeadCard } from "../../components/leads/LeadCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { BackgroundOrbs } from "../../components/ui/BackgroundOrbs";
import { SectionHeader } from "../../components/ui/SectionHeader";

const AnimatedView = Animated.createAnimatedComponent(View);

const AnimatedLeadItem = ({ item, index }: { item: Enquiry, index: number }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  React.useEffect(() => {
    // Reset values to support re-filtering
    opacity.value = 0;
    translateY.value = 16;
    
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 260 }));
    translateY.value = withDelay(index * 50, withTiming(0, { duration: 260 }));
  }, [item.id, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <AnimatedView style={animatedStyle}>
      <LeadCard enquiry={item} />
    </AnimatedView>
  );
};

export default function LeadsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { filteredEnquiries, searchQuery, setSearchQuery } = useEnquiry();
  const [activeFilter, setActiveFilter] = useState("All");

  const displayedEnquiries = useMemo(() => {
    if (activeFilter === "All") return filteredEnquiries;
    return filteredEnquiries.filter(e => e.status.toLowerCase() === activeFilter.toLowerCase());
  }, [filteredEnquiries, activeFilter]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <BackgroundOrbs />
      <View style={[styles.container, { paddingTop: insets.top + Spacing.xl }]}>
        <View style={styles.headerContainer}>
          <Text style={[Typography.h1, { color: colors.text.primary, marginBottom: Spacing.lg }]}>
            Leads
          </Text>
        <LeadFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        <Text style={[Typography.caption, { color: colors.text.muted, marginBottom: Spacing.md }]}>
          Showing {displayedEnquiries.length} {displayedEnquiries.length === 1 ? "lead" : "leads"}
        </Text>
      </View>

      <FlatList
        data={displayedEnquiries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <AnimatedLeadItem item={item} index={index} />}
        ListEmptyComponent={
          <EmptyState 
            icon={Inbox} 
            title="No leads found" 
            subtitle="Try adjusting your search or filters" 
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
  }
});
