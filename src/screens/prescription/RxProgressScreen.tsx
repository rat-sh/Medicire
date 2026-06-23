/**
 * RxProgressScreen.tsx
 * Figma: "Upload Progress" — circular progress ring animating from 67→100%,
 *        then auto-navigates to rx-ocr
 * Mock: Animates with setTimeout
 * Real API: Show real upload progress from multipart upload
 * MOCK_MARKER: Replace simulated progress with real upload progress event
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { Shield } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { VaultStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { Config } from '@/constants/config';

type Nav = NativeStackNavigationProp<VaultStackParamList>;

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const RxProgressScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState(67);

  useEffect(() => {
    if (Config.USE_MOCK) {
      // ── MOCK_MARKER: Replace with real upload progress callback ───────────
      if (progress < 100) {
        const t = setTimeout(() => setProgress(p => Math.min(p + 5, 100)), 300);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => navigation.navigate(Routes.RX_OCR, { prescriptionId: 'rx_mock' }), 600);
        return () => clearTimeout(t);
      }
    }
  }, [progress, navigation]);

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress / 100);

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      <View style={styles.center}>
        {/* Circular progress ring */}
        <View style={styles.ringWrap}>
          <Svg width={96} height={96} viewBox="0 0 96 96" style={{ transform: [{ rotate: '-90deg' }] }}>
            {/* Track */}
            <Circle cx={48} cy={48} r={RADIUS} fill="none" stroke={Colors.primaryLight} strokeWidth={8} />
            {/* Progress */}
            <Circle
              cx={48} cy={48} r={RADIUS}
              fill="none" stroke={Colors.primary} strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        </View>

        <Text style={styles.heading}>Uploading prescription</Text>
        <Text style={styles.sub}>
          Please keep the app open while we upload your prescription securely.
        </Text>

        <View style={styles.encryptedRow}>
          <Shield size={14} color={Colors.primary} />
          <Text style={styles.encryptedText}>End-to-end encrypted upload</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  statusSpacer: { height: 44 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xxxl },
  ringWrap: { width: 96, height: 96, marginBottom: Spacing['4xl'], position: 'relative' },
  ringCenter: {
    position: 'absolute', inset: 0, top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  progressText: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  heading: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: Spacing.xl },
  encryptedRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  encryptedText: { fontSize: FontSize.xs, color: Colors.textSecondary },
});

export default RxProgressScreen;
