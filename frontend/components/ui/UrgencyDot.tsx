import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { UrgencyLevel } from "../../types";
import { useTheme } from "../../hooks/useTheme";

interface UrgencyDotProps {
  urgency: UrgencyLevel;
}

export const UrgencyDot = ({ urgency }: UrgencyDotProps) => {
  const { colors } = useTheme();

  const isHigh = urgency === "high";
  const color = isHigh ? colors.urgency.high : colors.urgency.medium;
  const loopDuration = isHigh ? 800 : 1400;

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.15, { duration: loopDuration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: loopDuration / 2, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: loopDuration / 2, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: loopDuration / 2, easing: Easing.in(Easing.ease) })
      ),
      -1,
      true
    );
  }, [urgency, loopDuration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
