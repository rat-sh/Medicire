/**
 * SplashScreen.tsx
 * Figma: "Splash Screen" — gradient bg, logo, tagline, dots
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';

type Nav = NativeStackNavigationProp<AuthStackParamList, typeof Routes.SPLASH>;

interface SplashScreenProps {
  /** When false, only shows branding (used during auth hydration). */
  autoNavigate?: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ autoNavigate = true }) => {
  const navigation = useNavigation<Nav>();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const dotOpacity = useSharedValue(0);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));
  const dotStyle = useAnimatedStyle(() => ({ opacity: dotOpacity.value }));

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 15 });
    logoOpacity.value = withSpring(1);
    textOpacity.value = withDelay(400, withSpring(1));
    dotOpacity.value = withDelay(700, withSpring(1));
  }, [logoScale, logoOpacity, textOpacity, dotOpacity]);

  useEffect(() => {
    if (!autoNavigate) return;

    const t = setTimeout(() => {
      if (isAuthenticated) {
        return;
      }
      navigation.replace(Routes.LOGIN);
    }, 2500);

    return () => clearTimeout(t);
  }, [autoNavigate, isAuthenticated, navigation]);

  return (
    <LinearGradient
      colors={['#0b8f81', '#0d9e8f', '#065f56']}
      style={styles.container}>
      <View style={styles.center}>
        <Animated.View style={[styles.logoBox, logoStyle]}>
          <Image source={require('../../../assets/img/logo2.png')} style={styles.logoImage} resizeMode="contain" />
        </Animated.View>

        <Animated.View style={[styles.textBlock, textStyle]}>
          <Text style={styles.appName}>Medicire</Text>
          <Text style={styles.tagline}>Medicine. Found. Fast.</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.dotsRow, dotStyle]}>
        <View style={styles.dotSmall} />
        <View style={styles.dotLarge} />
        <View style={styles.dotSmall} />
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { alignItems: 'center', gap: Spacing.xl },
  logoBox: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  textBlock: { alignItems: 'center', gap: 4 },
  appName: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: 'rgba(255,255,255,0.7)',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotLarge: {
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textInverse,
  },
});

export default SplashScreen;
