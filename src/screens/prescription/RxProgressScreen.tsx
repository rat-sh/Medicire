/**
 * RxProgressScreen.tsx — Figma: "Upload Progress"
 * Circular progress bar with percentage, auto-nav to RxOcr when done.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Svg, Circle } from 'react-native-svg';
import { Shield } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { VaultStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { ScreenLayout } from '@/components/ui/ScreenLayout';

type Nav = NativeStackNavigationProp<VaultStackParamList>;

const RxProgressScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigation.navigate(Routes.RX_OCR, { prescriptionId: 'mock-rx-id' }), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [navigation]);

  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <ScreenLayout backgroundColor={Colors.surface}>
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <Svg width={size} height={size} style={styles.svg}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={Colors.primaryLight}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={Colors.primary}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </Svg>
          <View style={styles.labelContainer}>
            <Text style={styles.percentText}>{progress}%</Text>
          </View>
        </View>

        <Text style={styles.title}>Uploading prescription</Text>
        <Text style={styles.subtitle}>
          Please keep the app open while we upload your prescription securely.
        </Text>

        <View style={styles.badge}>
          <Shield size={14} color={Colors.primary} />
          <Text style={styles.badgeText}>End-to-end encrypted upload</Text>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Spacing['3xl'],
  },
  progressContainer: {
    width: 120, height: 120, marginBottom: Spacing['2xl'],
    alignItems: 'center', justifyContent: 'center',
  },
  svg: { transform: [{ rotate: '-90deg' }] },
  labelContainer: { position: 'absolute' },
  percentText: {
    fontSize: 24, fontWeight: FontWeight.bold,
    color: Colors.textPrimary, fontVariant: ['tabular-nums'],
  },
  title: {
    fontSize: FontSize.lg, fontWeight: FontWeight.bold,
    color: Colors.textPrimary, marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: Spacing['2xl'],
  },
  badgeText: { fontSize: 12, color: Colors.textMuted },
});

export default RxProgressScreen;
