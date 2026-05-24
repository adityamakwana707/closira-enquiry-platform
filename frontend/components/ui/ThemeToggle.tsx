import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Moon, Sun } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { Spacing } from "../../constants/spacing";

export const ThemeToggle = () => {
  const { isDark, toggleTheme, colors } = useTheme();

  const rotation = useSharedValue(isDark ? 180 : 0);
  const opacity = useSharedValue(isDark ? 1 : 0); // 1 = moon, 0 = sun

  useEffect(() => {
    rotation.value = withSpring(isDark ? 180 : 0, { damping: 15 });
    opacity.value = withTiming(isDark ? 1 : 0, { duration: 200 });
  }, [isDark]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const sunAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - opacity.value,
    position: 'absolute',
  }));

  const moonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    position: 'absolute',
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={toggleTheme}
      style={[
        styles.container,
        {
          backgroundColor: colors.glass.surface,
          borderColor: colors.glass.border,
        },
      ]}
    >
      <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
        <Animated.View style={sunAnimatedStyle}>
          <Sun size={20} color={colors.text.primary} strokeWidth={2.5} />
        </Animated.View>
        <Animated.View style={moonAnimatedStyle}>
          <Moon size={20} color={colors.text.primary} strokeWidth={2.5} />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 999,
    padding: Spacing.sm,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
