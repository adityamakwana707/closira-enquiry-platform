import React, { useEffect } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export const BackgroundOrbs = () => {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();

  // Shared values for floating animations
  const orb1X = useSharedValue(0);
  const orb1Y = useSharedValue(0);
  const orb2X = useSharedValue(0);
  const orb2Y = useSharedValue(0);
  const orb3X = useSharedValue(0);
  const orb3Y = useSharedValue(0);

  useEffect(() => {
    // Helper to generate a slow, randomized sequence within specific boundaries
    const generateRandomSequence = (min: number, max: number, speedMultiplier: number) => {
      const getRand = () => min + Math.random() * (max - min);
      // Extremely slow: 15 to 25 seconds per movement
      const getDur = () => (15000 + Math.random() * 10000) * speedMultiplier;
      
      return withSequence(
        withTiming(getRand(), { duration: getDur(), easing: Easing.inOut(Easing.ease) }),
        withTiming(getRand(), { duration: getDur(), easing: Easing.inOut(Easing.ease) }),
        withTiming(getRand(), { duration: getDur(), easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: getDur(), easing: Easing.inOut(Easing.ease) })
      );
    };

    // Orb 1: Top Left Quadrant
    orb1X.value = withRepeat(generateRandomSequence(-width * 0.4, -width * 0.1, 1), -1, false);
    orb1Y.value = withRepeat(generateRandomSequence(-height * 0.4, -height * 0.1, 1), -1, false);
    
    // Orb 2: Top Right Quadrant
    orb2X.value = withRepeat(generateRandomSequence(width * 0.1, width * 0.4, 1.2), -1, false);
    orb2Y.value = withRepeat(generateRandomSequence(-height * 0.4, -height * 0.1, 1.2), -1, false);
    
    // Orb 3: Bottom Center Quadrant
    orb3X.value = withRepeat(generateRandomSequence(-width * 0.2, width * 0.2, 0.9), -1, false);
    orb3Y.value = withRepeat(generateRandomSequence(height * 0.1, height * 0.4, 0.9), -1, false);
  }, [width, height]);

  const orb1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: orb1X.value }, { translateY: orb1Y.value }, { scale: 1.1 }]
  }));
  const orb2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: orb2X.value }, { translateY: orb2Y.value }, { scale: 0.9 }]
  }));
  const orb3Style = useAnimatedStyle(() => ({
    transform: [{ translateX: orb3X.value }, { translateY: orb3Y.value }, { scale: 1.2 }]
  }));

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" as any }]} >
      {/* Platform-specific blur filter trick for Web to make orbs perfectly soft */}
      <AnimatedGradient
        colors={[colors.orb.indigo, "transparent"]}
        style={[styles.orb, orb1Style, { top: '30%', left: '20%', width: 300, height: 300, filter: 'blur(40px)' } as any]}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 0.8, y: 0.8 }}
      />
      <AnimatedGradient
        colors={[colors.orb.violet, "transparent"]}
        style={[styles.orb, orb2Style, { top: '30%', right: '20%', width: 280, height: 280, filter: 'blur(40px)' } as any]}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 0.8, y: 0.8 }}
      />
      <AnimatedGradient
        colors={[colors.orb.teal, "transparent"]}
        style={[styles.orb, orb3Style, { bottom: '20%', left: '35%', width: 350, height: 350, filter: 'blur(50px)' } as any]}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 0.8, y: 0.8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  orb: {
    position: "absolute",
    borderRadius: 9999,
  },
});
