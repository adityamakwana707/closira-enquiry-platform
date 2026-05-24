import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ShieldCheck } from "lucide-react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from "react-native-reanimated";

import { useTheme } from "../../hooks/useTheme";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import { getEscalations } from "../../mock";
import { Enquiry } from "../../types";

import { EscalationCard } from "../../components/escalations/EscalationCard";
import { BackgroundOrbs } from "../../components/ui/BackgroundOrbs";
import { EmptyState } from "../../components/ui/EmptyState";

const AnimatedView = Animated.createAnimatedComponent(View);

const AnimatedEscalationItem = ({ item, index }: { item: Enquiry, index: number }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  React.useEffect(() => {
    opacity.value = withDelay(index * 60, withTiming(1, { duration: 280 }));
    translateY.value = withDelay(index * 60, withTiming(0, { duration: 280 }));
  }, [item.id, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <AnimatedView style={animatedStyle}>
      <EscalationCard enquiry={item} />
    </AnimatedView>
  );
};

export default function EscalationsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const escalations = getEscalations();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <BackgroundOrbs />
      <View style={[styles.container, { paddingTop: insets.top + Spacing.xl }]}>
        <View style={styles.headerContainer}>
          <Text style={[Typography.h1, { color: colors.text.primary, marginBottom: Spacing.xs }]}>
            Escalations
          </Text>
          <Text style={[Typography.body, { color: colors.text.secondary, marginBottom: Spacing.lg }]}>
            Requires immediate attention
          </Text>
        </View>

        <FlatList
          data={escalations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => <AnimatedEscalationItem item={item} index={index} />}
          ListEmptyComponent={
            <EmptyState 
              icon={ShieldCheck} 
              iconColor={colors.status.qualified}
              title="All clear" 
              subtitle="No open escalations right now" 
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
