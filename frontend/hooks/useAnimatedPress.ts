import { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";

export function useAnimatedPress() {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1.00, { damping: 12 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return { animatedStyle, onPressIn, onPressOut };
}
