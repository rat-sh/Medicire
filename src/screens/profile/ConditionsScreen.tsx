/**
 * ConditionsScreen.tsx
 * Figma: "Chronic Conditions" — chip multi-select list with confirmation
 * Mock: Local toggle state
 * Real API: PATCH /users/conditions
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Check } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/navigation/types';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

const ALL_CONDITIONS = [
  'Diabetes (Type 2)', 'Hypertension', 'Asthma / COPD', 'Hypothyroidism', 'Hyperthyroidism',
  'Heart Disease / CAD', 'Arthritis', 'Kidney Disease', 'Liver Disease',
  'Epilepsy', 'Depression / Anxiety', 'High Cholesterol',
];

const ConditionsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [selected, setSelected] = useState<string[]>(['Diabetes (Type 2)', 'Hypertension']);

  const toggle = (c: string) =>
    setSelected(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chronic Conditions</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sub}>
          Select your chronic conditions so we can provide better medicine recommendations and alerts.
        </Text>
        <View style={styles.chipsWrap}>
          {ALL_CONDITIONS.map(c => {
            const isActive = selected.includes(c);
            return (
              <TouchableOpacity
                key={c}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => toggle(c)}>
                {isActive && <Check size={12} color={Colors.textInverse} />}
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Conditions</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  statusSpacer: { height: 44 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.gray100, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary, textAlign: 'center' },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.xl },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.lg, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.full, backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  chipTextActive: { color: Colors.textInverse },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});

export default ConditionsScreen;
