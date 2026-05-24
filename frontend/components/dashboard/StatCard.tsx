import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from "react-native-reanimated";
import { LucideIcon } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import { useAnimatedPress } from "../../hooks/useAnimatedPress";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import { GlassCard } from "../ui/GlassCard";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  accentColor: string;
}

// Custom hook for animated counting
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = 0;
    setDisplayValue(0);
    animatedValue.value = withTiming(value, {
      duration: 900,
      easing: Easing.bezier(0.25, 1, 0.5, 1),
    });
  }, [value]);

  useEffect(() => {
    let interval = setInterval(() => {
      setDisplayValue(Math.round(animatedValue.value));
      if (Math.round(animatedValue.value) === value) {
        clearInterval(interval);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [value]);

  return <Text style={[Typography.hero, { color: useTheme().colors.text.primary }]}>{displayValue}</Text>;
}

export const StatCard = ({ title, value, icon: Icon, accentColor }: StatCardProps) => {
  const { colors, isDark } = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = useAnimatedPress();

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <GlassCard 
        style={[styles.card, { borderRadius: 24 }]} 
        innerStyle={{ padding: Spacing.md + 4 }}
        variant={isDark ? "default" : "elevated"} 
        intensity={isDark ? 20 : 60}
        onPress={() => {}}
      >
        <View style={styles.topRow}>
          <View style={styles.valueContainer}>
            <AnimatedNumber value={value} />
          </View>
          <View style={[styles.iconWrapper, { backgroundColor: isDark ? `${accentColor}25` : `${accentColor}15` }]}>
            <Icon size={18} color={accentColor} style={{ opacity: 0.9 }} strokeWidth={2.5} />
          </View>
        </View>
        <Text style={[Typography.body, { color: colors.text.muted, marginTop: 4, fontFamily: "Inter_500Medium" }]} numberOfLines={2}>
          {title}
        </Text>
      </GlassCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  card: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  valueContainer: {
    flex: 1,
  },
});
