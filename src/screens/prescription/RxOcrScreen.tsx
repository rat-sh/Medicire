/**
 * RxOcrScreen.tsx — Figma: "OCR Processing"
 * Shows multi-stage AI processing with animated status indicators.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Zap, Check, Shield } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { VaultStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { ScreenLayout } from '@/components/ui/ScreenLayout';

type Nav = NativeStackNavigationProp<VaultStackParamList>;

const STAGES = [
  "Reading Prescription",
  "Identifying Medicines",
  "Validating Results",
  "Checking Availability",
  "Ranking Pharmacies",
];

const RxOcrScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (activeStage < STAGES.length) {
      const t = setTimeout(() => setActiveStage(s => s + 1), 1500);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => navigation.navigate(Routes.RX_REVIEW, { prescriptionId: 'mock-rx-id' }), 1000);
      return () => clearTimeout(t);
    }
  }, [activeStage, navigation]);

  return (
    <ScreenLayout backgroundColor={Colors.surface} contentStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Zap size={24} color={Colors.primary} />
        </View>
        <Text style={styles.title}>AI is reading your prescription</Text>
        <Text style={styles.subtitle}>
          This takes a few seconds. We extract all medicines automatically.
        </Text>
      </View>

      <View style={styles.stages}>
        {STAGES.map((label, i) => {
          const isDone = i < activeStage;
          const isActive = i === activeStage;
          const isPending = i > activeStage;

          return (
            <View key={label} style={[
              styles.stageItem,
              isActive && styles.stageItemActive,
              isDone && styles.stageItemDone
            ]}>
              <View style={[
                styles.stageIcon,
                isDone && styles.stageIconDone,
                isActive && styles.stageIconActive
              ]}>
                {isDone ? (
                  <Check size={16} color={Colors.textInverse} />
                ) : isActive ? (
                  <ActivityIndicator size="small" color={Colors.textInverse} />
                ) : (
                  <Text style={styles.stageNum}>{i + 1}</Text>
                )}
              </View>
              <Text style={[
                styles.stageLabel,
                isActive && styles.stageLabelActive,
                isDone && styles.stageLabelDone
              ]}>
                {label}
              </Text>
              {isActive && (
                <View style={styles.dots}>
                  {[0, 1, 2].map(d => (
                    <View key={d} style={styles.dot} />
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Shield size={14} color={Colors.primary} />
        <Text style={styles.footerText}>
          Your prescription data is encrypted and private. We never share it without your permission.
        </Text>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  header: { marginBottom: Spacing['3xl'] },
  iconBox: {
    width: 48, height: 48, backgroundColor: Colors.primaryLight,
    borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: { fontSize: 20, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  stages: { gap: Spacing.md },
  stageItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.md, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.gray100,
    backgroundColor: Colors.gray50,
  },
  stageItemActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  stageItemDone: { borderColor: '#dcfce7', backgroundColor: '#f0fdf4' },
  stageIcon: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.gray200,
    alignItems: 'center', justifyContent: 'center',
  },
  stageIconActive: { backgroundColor: Colors.primary },
  stageIconDone: { backgroundColor: Colors.success },
  stageNum: { fontSize: 12, fontWeight: FontWeight.bold, color: Colors.textMuted },
  stageLabel: { fontSize: 14, fontWeight: FontWeight.semibold, color: Colors.textMuted },
  stageLabelActive: { color: Colors.primary },
  stageLabelDone: { color: Colors.success },
  dots: { flexDirection: 'row', gap: 4, marginLeft: 'auto' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary },
  footer: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    marginTop: Spacing['2xl'], padding: Spacing.md, backgroundColor: Colors.gray50,
    borderRadius: Radius.md,
  },
  footerText: { flex: 1, fontSize: 11, color: Colors.textSecondary, lineHeight: 16 },
});

export default RxOcrScreen;
