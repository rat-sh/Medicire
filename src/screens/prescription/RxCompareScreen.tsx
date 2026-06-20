/**
 * RxCompareScreen.tsx
 * Figma: "Pharmacy Comparison" — horizontal scrollable grid comparing 2 pharmacies
 *        medicine-by-medicine with stock badge + price
 * Mock: Hardcoded 2-pharmacy comparison data
 * Real API: GET /prescriptions/:id/compare
 * MOCK_MARKER: Replace MOCK_COMPARISON with real API comparison data
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RxStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type Nav = NativeStackNavigationProp<RxStackParamList>;

const PHARMACIES = ['Apollo Pharmacy', 'MedPlus Sector V'];
// ── MOCK_MARKER ───────────────────────────────────────────────────────────────
const MOCK_COMPARISON = [
  { name: 'Metformin 500mg', a: { s: 'in-stock', p: '38' }, b: { s: 'in-stock', p: '35' } },
  { name: 'Atorvastatin 10mg', a: { s: 'in-stock', p: '72' }, b: { s: 'low-stock', p: '68' } },
  { name: 'Amlodipine 5mg', a: { s: 'in-stock', p: '24' }, b: { s: 'in-stock', p: '26' } },
  { name: 'Pantoprazole 40mg', a: { s: 'low-stock', p: '28' }, b: { s: 'out-of-stock', p: '—' } },
  { name: 'Metoprolol 25mg', a: { s: 'in-stock', p: '45' }, b: { s: 'in-stock', p: '48' } },
];
// ─────────────────────────────────────────────────────────────────────────────

const BADGE_CFG: Record<string, { icon: string; bg: string; border: string; text: string }> = {
  'in-stock': { icon: '✓', bg: Colors.successLight, border: Colors.successBorder, text: Colors.success },
  'low-stock': { icon: '~', bg: Colors.warningLight, border: Colors.warningBorder, text: Colors.warning },
  'out-of-stock': { icon: '✗', bg: Colors.errorLight, border: Colors.errorBorder, text: Colors.error },
};

const RxCompareScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compare Pharmacies</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.body} horizontal={false} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableContent}>
          <View style={{ width: 500 }}>
            {/* Header row */}
            <View style={styles.tableHeaderRow}>
              <View style={styles.medCol}>
                <Text style={styles.medColLabel}>Medicine</Text>
              </View>
              {PHARMACIES.map(n => (
                <View key={n} style={styles.pharmaCol}>
                  <Text style={styles.pharmaName}>{n}</Text>
                  <Text style={styles.pharmaInfo}>1.2 km · Open</Text>
                </View>
              ))}
            </View>

            {/* Data rows */}
            {MOCK_COMPARISON.map(({ name, a, b }) => (
              <View key={name} style={styles.tableRow}>
                <View style={styles.medCol}>
                  <Text style={styles.medName}>{name}</Text>
                </View>
                {[a, b].map((x, i) => {
                  const cfg = BADGE_CFG[x.s];
                  return (
                    <View key={i} style={[styles.pharmaCell, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                      <View style={[styles.iconBadge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                        <Text style={[styles.iconBadgeText, { color: cfg.text }]}>{cfg.icon}</Text>
                      </View>
                      {x.p !== '—' && <Text style={styles.priceText}>₹{x.p}</Text>}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.cta}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate(Routes.RSV_CONFIRM as any, { pharmacyId: 'ph_001', medicineId: 'multi' })}>
          <Text style={styles.primaryBtnText}>Reserve at Apollo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate(Routes.RSV_CONFIRM as any, { pharmacyId: 'ph_002', medicineId: 'multi' })}>
          <Text style={styles.secondaryBtnText}>Reserve at MedPlus</Text>
        </TouchableOpacity>
      </View>
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
  body: { flex: 1 },
  tableContent: { padding: Spacing.lg, paddingBottom: 100 },
  tableHeaderRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.sm },
  medCol: { width: 140, justifyContent: 'flex-end', paddingBottom: 4 },
  medColLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  pharmaCol: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderLight,
  },
  pharmaName: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  pharmaInfo: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  tableRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: 8 },
  medName: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.textSecondary, paddingVertical: 8 },
  pharmaCell: {
    flex: 1, borderRadius: Radius.md, borderWidth: 1,
    padding: Spacing.md, alignItems: 'center',
  },
  iconBadge: {
    width: 28, height: 28, borderRadius: Radius.full, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  iconBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  priceText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  cta: {
    backgroundColor: Colors.surface, borderTopWidth: 1,
    borderTopColor: Colors.borderLight, padding: Spacing.xl, paddingBottom: 32, gap: Spacing.md,
  },
  primaryBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 12, alignItems: 'center' },
  primaryBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
  secondaryBtn: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
    paddingVertical: 12, alignItems: 'center',
  },
  secondaryBtnText: { color: Colors.textSecondary, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});

export default RxCompareScreen;
