/**
 * LocationPermScreen.tsx
 * Figma: "Location Permission" — map pin illustration, allow/skip buttons
 * Mock: Any button → ProfileSetup
 * Real API: Use Geolocation.requestAuthorization() → set location in store
 * MOCK_MARKER: Replace fake navigation with real Geolocation.requestAuthorization()
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapPin, Navigation } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

const LocationPermScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  // Pulse animation on the map pin circle
  const scale = useSharedValue(1);
  scale.value = withRepeat(withTiming(1.15, { duration: 1200, easing: Easing.inOut(Easing.ease) }), -1, true);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: 0.3 }));

  const handleAllow = () => {
    // ── MOCK: Skip real permission request ─────────────────────────────────
    // TODO: Request actual location permission and use useLocationStore.setLocation()
    navigation.navigate(Routes.PROFILE_SETUP);
  };

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      <View style={styles.content}>

        {/* Illustration */}
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

        <TouchableOpacity style={styles.primaryBtn} onPress={handleAllow}>
          <Text style={styles.primaryBtnText}>Allow Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate(Routes.PROFILE_SETUP)}>
          <Text style={styles.secondaryBtnText}>Not now</Text>
        </TouchableOpacity>

        <Text style={styles.privacyNote}>
          Location is only used while the app is open. We never share it with third parties.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  statusSpacer: { height: 44 },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Spacing['4xl'], paddingBottom: Spacing.xl,
  },
  illustrationWrap: { position: 'relative', marginBottom: Spacing['4xl'] },
  pulseRing: {
    position: 'absolute',
    width: 112 + 32, height: 112 + 32,
    borderRadius: (112 + 32) / 2,
    backgroundColor: Colors.primary,
    top: -16, left: -16,
  },
  iconCircle: {
    width: 112, height: 112, borderRadius: 56,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  navBadge: {
    position: 'absolute', top: -4, right: -4,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  heading: {
    fontSize: FontSize['3xl'], fontWeight: FontWeight.bold,
    color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.md,
  },
  sub: {
    fontSize: FontSize.sm, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22, marginBottom: Spacing['4xl'],
  },
  primaryBtn: {
    width: '100%', backgroundColor: Colors.primary,
    borderRadius: Radius.md, paddingVertical: 14,
    alignItems: 'center', marginBottom: Spacing.md,
  },
  primaryBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
  secondaryBtn: {
    width: '100%', borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, paddingVertical: 14,
    alignItems: 'center', marginBottom: Spacing.lg,
  },
  secondaryBtnText: { fontWeight: FontWeight.semibold, fontSize: FontSize.sm, color: Colors.textSecondary },
  privacyNote: {
    fontSize: FontSize.xs, color: Colors.textMuted,
    textAlign: 'center', lineHeight: 18,
  },
});

export default LocationPermScreen;
