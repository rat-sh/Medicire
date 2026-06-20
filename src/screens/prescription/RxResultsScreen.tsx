/**
 * RxResultsScreen.tsx
 * Figma: "Prescription Results" — gradient best-match card, medicine availability
 *        list with stock dots, out-of-stock warning banner
 * Mock: Hardcoded medicine availability results
 * Real API: GET /prescriptions/:id/pharmacy-results
 * MOCK_MARKER: Replace MOCK data with real prescription results API
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, MapPin, Package, AlertTriangle } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RxStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type Nav = NativeStackNavigationProp<RxStackParamList>;

// ── MOCK_MARKER: Replace with real prescription results ───────────────────────
const MOCK_MED_AVAILABILITY = [
  { name: 'Metformin 500mg', status: 'in-stock', pharmacies: 4 },
  { name: 'Atorvastatin 10mg', status: 'in-stock', pharmacies: 3 },
  { name: 'Amlodipine 5mg', status: 'in-stock', pharmacies: 5 },
  { name: 'Pantoprazole 40mg', status: 'low-stock', pharmacies: 2 },
  { name: 'Metoprolol 25mg', status: 'in-stock', pharmacies: 3 },
  { name: 'Vitamin D3 60K', status: 'out-of-stock', pharmacies: 0 },
];
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_DOT: Record<string, string> = {
  'in-stock': Colors.pinInStock,
  'low-stock': Colors.pinLowStock,
  'out-of-stock': Colors.pinOutOfStock,
};

const BADGE_CFG: Record<string, { label: string; bg: string; border: string; text: string }> = {
  'in-stock': { label: 'In stock', bg: Colors.successLight, border: Colors.successBorder, text: Colors.success },
  'low-stock': { label: 'Low stock', bg: Colors.warningLight, border: Colors.warningBorder, text: Colors.warning },
  'out-of-stock': { label: 'Unavailable', bg: Colors.errorLight, border: Colors.errorBorder, text: Colors.error },
};

const RxResultsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prescription Results</Text>
        <View style={styles.rightSpacer} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Best-match gradient card */}
        <View style={styles.bestCard}>
          <View style={styles.bestCardTop}>
            <View style={styles.bestCardLeft}>
              <Text style={styles.bestLabel}>Best match</Text>
              <Text style={styles.bestName}>Apollo Pharmacy, Salt Lake</Text>
              <View style={styles.bestDistRow}>
                <MapPin size={12} color="rgba(255,255,255,0.7)" />
                <Text style={styles.bestDist}>1.2 km away</Text>
              </View>
            </View>
            <View style={styles.bestCardRight}>
              <Text style={styles.bestCount}>5/6</Text>
              <Text style={styles.bestCountLabel}>medicines</Text>
            </View>
          </View>
          <View style={styles.bestCardBtns}>
            <TouchableOpacity
              style={styles.reserveAllBtn}
              onPress={() => navigation.navigate(Routes.RSV_CONFIRM as any, { pharmacyId: 'ph_001', medicineId: 'multi' })}>
              <Package size={14} color={Colors.primary} />
              <Text style={styles.reserveAllText}>Reserve All Here</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.compareBtn}
              onPress={() => navigation.navigate(Routes.RX_COMPARE, { prescriptionId: 'rx_001' })}>
              <Text style={styles.compareBtnText}>Compare</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Medicine availability */}
        <Text style={styles.sectionTitle}>Medicine Availability</Text>
        <View style={styles.medList}>
          {MOCK_MED_AVAILABILITY.map(({ name, status, pharmacies }) => {
            const cfg = BADGE_CFG[status];
            return (
              <View key={name} style={styles.medRow}>
                <View style={[styles.statusDot, { backgroundColor: STATUS_DOT[status] }]} />
                <View style={styles.medInfo}>
                  <Text style={styles.medName}>{name}</Text>
                  <Text style={styles.medSub}>
                    {pharmacies > 0 ? `Available at ${pharmacies} pharmacies nearby` : 'Not available nearby'}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                  <Text style={[styles.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Out of stock warning */}
        <View style={styles.warningBox}>
          <AlertTriangle size={16} color="#d97706" />
          <Text style={styles.warningText}>
            Vitamin D3 60K is not found nearby. Try searching online pharmacies or ask your doctor for an alternative.
          </Text>
        </View>
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
  rightSpacer: { width: 32 },
  headerTitle: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary, textAlign: 'center' },
  body: { flex: 1 },
  bodyContent: { padding: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  bestCard: {
    backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.lg,
  },
  bestCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  bestCardLeft: { flex: 1 },
  bestLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  bestName: { color: Colors.textInverse, fontSize: FontSize.base, fontWeight: FontWeight.bold, marginTop: 2 },
  bestDistRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  bestDist: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.xs },
  bestCardRight: { alignItems: 'flex-end' },
  bestCount: { color: Colors.textInverse, fontSize: 28, fontWeight: FontWeight.bold },
  bestCountLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.xs },
  bestCardBtns: {
    flexDirection: 'row', gap: Spacing.sm,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: Spacing.md,
  },
  reserveAllBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: Colors.textInverse, borderRadius: Radius.md, paddingVertical: 10,
  },
  reserveAllText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.primary },
  compareBtn: {
    paddingHorizontal: Spacing.lg, paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: Radius.md,
  },
  compareBtnText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textInverse },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  medList: { gap: Spacing.sm },
  medRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  medInfo: { flex: 1 },
  medName: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  medSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, borderWidth: 1 },
  badgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  warningBox: {
    flexDirection: 'row', gap: Spacing.md, backgroundColor: Colors.warningLight,
    borderWidth: 1, borderColor: Colors.warningBorder, borderRadius: Radius.md, padding: Spacing.md,
  },
  warningText: { flex: 1, fontSize: FontSize.xs, color: '#92400e', lineHeight: 18 },
});

export default RxResultsScreen;
