import React, { ReactNode } from "react";
import { View, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import Animated from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { useAnimatedPress } from "../../hooks/useAnimatedPress";
import { Spacing } from "../../constants/spacing";

interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  accentColor?: string;
  onPress?: () => void;
  intensity?: number;
  variant?: "default" | "elevated" | "subtle";
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const GlassCard = ({
  children,
  style,
  innerStyle,
  accentColor,
  onPress,
  intensity,
  variant = "default",
}: GlassCardProps) => {
  const { colors, isDark } = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = useAnimatedPress();

  const defaultIntensity = intensity ?? 80;

  const containerStyle = [
    styles.container,
    {
      borderColor: colors.glass.border,
      borderWidth: 1,
      shadowColor: variant === "elevated" ? colors.shadow.strong : "transparent",
      shadowOffset: { width: 0, height: variant === "elevated" ? 12 : 0 },
      shadowOpacity: variant === "elevated" ? 1 : 0,
      shadowRadius: variant === "elevated" ? 40 : 0,
      elevation: variant === "elevated" ? 16 : 0,
    },
    style,
  ];

  const content = (
    <BlurView intensity={defaultIntensity} tint={isDark ? "dark" : "light"} style={styles.blurContainer}>
      <View style={[styles.inner, innerStyle]}>{children}</View>
    </BlurView>
  );

  if (onPress) {
    return (
      <AnimatedTouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={[containerStyle, animatedStyle]}
      >
        {content}
      </AnimatedTouchableOpacity>
    );
  }

  return <View style={containerStyle}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    overflow: "hidden", // Ensures blur doesn't leak outside rounded corners
  },
  blurContainer: {
    flex: 1,
  },
  inner: {
    padding: Spacing.lg,
    flex: 1,
  },
});
