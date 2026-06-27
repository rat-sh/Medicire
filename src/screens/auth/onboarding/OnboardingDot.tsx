/**
 * OnboardingDot.tsx
 * A single animated pagination dot for the onboarding screen.
 * Width interpolates from 8px (inactive) to 24px (active).
 */
import React from 'react';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

interface OnboardingDotProps {
  index: number;
  activeIndex: SharedValue<number>;
  color: string;
}

export const OnboardingDot: React.FC<OnboardingDotProps> = ({
  index,
  activeIndex,
  color,
}) => {
  const dotStyle = useAnimatedStyle(() => {
    const width = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [8, 24, 8],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [0.4, 1, 0.4],
      Extrapolation.CLAMP,
    );
    return { width, opacity };
  });

  return (
    <Animated.View style={[styles.dot, { backgroundColor: color }, dotStyle]} />
  );
};

const styles = StyleSheet.create({
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
