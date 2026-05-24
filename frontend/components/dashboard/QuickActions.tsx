import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Zap, MessageSquare, Megaphone, BarChart2 } from "lucide-react-native";
import { useRouter } from "expo-router";
import Animated from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { useAnimatedPress } from "../../hooks/useAnimatedPress";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  primary?: boolean;
  badge?: number;
}

const ActionButton = ({ label, icon, onPress, primary, badge }: ActionButtonProps) => {
  const { colors, isDark } = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = useAnimatedPress();

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={1}
      style={[
        styles.button,
        animatedStyle,
        {
          backgroundColor: primary ? colors.accent.indigo : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)'),
          borderColor: primary ? colors.accent.indigo : colors.glass.border,
          borderWidth: 1,
        }
      ]}
    >
      <View style={styles.iconWrapper}>
        {icon}
        {badge && badge > 0 ? (
          <View style={[styles.badge, { backgroundColor: colors.urgency.high }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={[
        Typography.caption, 
        { color: primary ? "#FFFFFF" : colors.accent.indigo, marginLeft: Spacing.sm }
      ]}>
        {label}
      </Text>
    </AnimatedTouchableOpacity>
  );
};

export const QuickActions = () => {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ActionButton 
          label="New Message" 
          icon={<MessageSquare size={16} color="#FFFFFF" strokeWidth={2.5} />} 
          primary 
          onPress={() => {}} 
        />
        <ActionButton 
          label="Broadcast" 
          icon={<Megaphone size={16} color={colors.accent.indigo} strokeWidth={2.5} />} 
          onPress={() => {}} 
        />
        <ActionButton 
          label="Analytics" 
          icon={<BarChart2 size={16} color={colors.accent.indigo} strokeWidth={2.5} />} 
          onPress={() => {}} 
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  scrollContent: {
    gap: Spacing.sm,
    paddingHorizontal: 2, // avoid clipping border/shadow on first/last item
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 999,
  },
  iconWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "Inter_700Bold",
  }
});
