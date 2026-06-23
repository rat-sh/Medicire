/**
 * LocationPermScreen.tsx — Figma: "Location Permission"
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapPin, Navigation } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Button } from '@/components/ui/Button';
import { useLocation } from '@/hooks/useLocation';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

const LocationPermScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { requestLocation, isLoading } = useLocation();

  const scale = useSharedValue(1);
  scale.value = withRepeat(
    withTiming(1.15, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
    -1,
    true,
  );
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 0.3,
  }));

  const goNext = () => navigation.navigate(Routes.PROFILE_SETUP);

  const handleAllow = async () => {
    await requestLocation();
    goNext();
  };

  return (
    <ScreenLayout contentStyle={styles.content}>
      <View style={styles.illustrationWrap}>
        <Animated.View style={[styles.pulseRing, pulseStyle]} />
        <View style={styles.iconCircle}>
          <MapPin size={56} color={Colors.primary} />
        </View>
        <View style={styles.navBadge}>
          <Navigation size={16} color={Colors.textInverse} />
        </View>
      </View>

      <Text style={styles.heading}>Allow location access</Text>
      <Text style={styles.sub}>
        We need your location to find pharmacies near you and show real-time medicine availability in your area.
      </Text>

      <View style={styles.actions}>
        <Button
          title="Allow Location"
          onPress={handleAllow}
          loading={isLoading}
          fullWidth
        />

        <Button
          title="Not now"
          onPress={goNext}
          variant="outline"
          fullWidth
        />
      </View>

      <Text style={styles.privacyNote}>
        Location is only used while the app is open. We never share it with third parties.
      </Text>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['4xl'],
  },
  illustrationWrap: { position: 'relative', marginBottom: Spacing['4xl'] },
  pulseRing: {
    position: 'absolute',
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: Colors.primary,
    top: -16,
    left: -16,
  },
  iconCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  sub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing['4xl'],
  },
  privacyNote: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: Spacing.lg,
  },
  actions: { width: '100%', gap: Spacing.md },
});

export default LocationPermScreen;
