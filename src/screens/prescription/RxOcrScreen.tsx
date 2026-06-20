/**
 * RxOcrScreen.tsx
 * Figma: "OCR Processing" — 5 AI stage cards advancing: Reading → Identifying →
 *        Validating → Checking → Ranking, then auto-navigates to rx-review
 * Mock: Simulated stage progression with timeouts
 * Real API: Subscribe to WebSocket / SSE for real OCR stage events
 * MOCK_MARKER: Replace setTimeout stages with real WebSocket subscription
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Zap, Check, Shield } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RxStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Config } from '@/constants/config';

type Nav = NativeStackNavigationProp<RxStackParamList>;
type RouteProps = RouteProp<RxStackParamList, typeof Routes.RX_OCR>;

const STAGES = [
  'Reading Prescription',
  'Identifying Medicines',
  'Validating Results',
  'Checking Availability',
  'Ranking Pharmacies',
];

const BounceDot: React.FC<{ delay: number }> = ({ delay }) => {
  const translateY = useSharedValue(0);
  translateY.value = withRepeat(
    withTiming(-6, { duration: 400 + delay }),
    -1, true,
  );
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  return <Animated.View style={[styles.bounceDot, style]} />;
};

const RxOcrScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const [activeStage, setActiveStage] = useState(2);

  useEffect(() => {
    if (!Config.USE_MOCK) return;
    // ── MOCK_MARKER: Replace with real WebSocket/SSE subscription ────────────
    if (activeStage < STAGES.length - 1) {
      const t = setTimeout(() => setActiveStage(s => s + 1), 1200);
      return () => clearTimeout(t);
    }
    if (activeStage === STAGES.length - 1) {
      const t = setTimeout(() =>
        navigation.navigate(Routes.RX_REVIEW, { prescriptionId: route.params.prescriptionId }),
        1000,
      );
      return () => clearTimeout(t);
    }
  }, [activeStage, navigation, route.params.prescriptionId]);

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.iconBox}>
          <Zap size={24} color={Colors.primary} />
        </View>
        <Text style={styles.heading}>AI is reading your prescription</Text>
        <Text style={styles.sub}>This takes a few seconds. We extract all medicines automatically.</Text>

        {/* Stage cards */}
        <View style={styles.stages}>
          {STAGES.map((label, i) => {
            const state = i < activeStage ? 'done' : i === activeStage ? 'active' : 'pending';
            return (
              <View
                key={label}
                style={[
                  styles.stageCard,
                  state === 'active' && styles.stageCardActive,
                  state === 'done' && styles.stageCardDone,
                ]}>
                {/* Stage icon */}
                <View style={[
                  styles.stageIcon,
                  state === 'done' && styles.stageIconDone,
                  state === 'active' && styles.stageIconActive,
                  state === 'pending' && styles.stageIconPending,
                ]}>
                  {state === 'done' && <Check size={16} color={Colors.textInverse} />}
                  {state === 'pending' && <Text style={styles.stageNum}>{i + 1}</Text>}
                </View>

                <Text style={[
                  styles.stageLabel,
                  state === 'active' && { color: Colors.primary },
                  state === 'done' && { color: Colors.success },
                  state === 'pending' && { color: Colors.textMuted },
                ]}>
                  {label}
                </Text>

                {state === 'active' && (
                  <View style={styles.dotsRow}>
                    <BounceDot delay={0} />
                    <BounceDot delay={150} />
                    <BounceDot delay={300} />
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Privacy note */}
        <View style={styles.privacyBox}>
          <Shield size={16} color={Colors.primary} />
          <Text style={styles.privacyText}>
            Your prescription data is encrypted and private. We never share it with pharmacies without your permission.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  statusSpacer: { height: 44 },
  content: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  iconBox: {
    width: 48, height: 48, backgroundColor: Colors.primaryLight,
    borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  heading: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 4 },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xl, lineHeight: 20 },
  stages: { gap: Spacing.md, marginBottom: Spacing.xl },
  stageCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.lg,
    padding: Spacing.lg, borderRadius: Radius.xl, borderWidth: 1,
    borderColor: Colors.borderLight, backgroundColor: Colors.gray50,
  },
  stageCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  stageCardDone: { borderColor: Colors.successBorder, backgroundColor: Colors.successLight },
  stageIcon: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stageIconDone: { backgroundColor: Colors.success },
  stageIconActive: { backgroundColor: Colors.primary },
  stageIconPending: { backgroundColor: Colors.gray200 },
  stageNum: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  stageLabel: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  dotsRow: { flexDirection: 'row', gap: 4 },
  bounceDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  privacyBox: {
    flexDirection: 'row', gap: Spacing.md, backgroundColor: Colors.gray50,
    borderRadius: Radius.md, padding: Spacing.md,
  },
  privacyText: { flex: 1, fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
});

export default RxOcrScreen;
