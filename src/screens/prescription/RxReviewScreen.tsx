/**
 * RxReviewScreen.tsx
 * Figma: "Medicine Review" — list of extracted medicines with confidence bars,
 *        amber highlight for low-confidence items, edit button, Add medicine button
 * Mock: Hardcoded extracted medicines with confidence scores
 * Real API: GET /prescriptions/:id/medicines
 * MOCK_MARKER: Replace MOCK_MEDICINES with real prescription API data
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Package, AlertCircle, Edit, Plus, CheckCircle } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { VaultStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type Nav = NativeStackNavigationProp<VaultStackParamList>;

// ── MOCK_MARKER: Replace with real extracted medicines from prescription API ───
const MOCK_EXTRACTED = [
  { name: 'Metformin 500mg', brand: 'Glycomet', qty: '60 tablets', confidence: 96, flagged: false },
  { name: 'Atorvastatin 10mg', brand: 'Lipitor / Atorva', qty: '30 tablets', confidence: 92, flagged: false },
  { name: 'Amlodipine 5mg', brand: 'Norvasc / Amlo', qty: '30 tablets', confidence: 88, flagged: false },
  { name: 'Pantoprazole 40mg', brand: 'Pan-40', qty: '30 tablets', confidence: 74, flagged: true },
  { name: 'Metoprolol 25mg', brand: 'Betaloc', qty: '30 tablets', confidence: 81, flagged: false },
];
// ─────────────────────────────────────────────────────────────────────────────

const confidenceColor = (c: number) =>
  c >= 90 ? Colors.success : c >= 80 ? Colors.primary : '#d97706';

const RxReviewScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Medicines</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Info banner */}
      <View style={styles.banner}>
        <CheckCircle size={16} color={Colors.primary} />
        <Text style={styles.bannerText}>
          We found {MOCK_EXTRACTED.length} medicines. Tap any item to correct errors made by OCR.
        </Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {MOCK_EXTRACTED.map(({ name, brand, qty, confidence, flagged }) => (
          <View key={name} style={[styles.medCard, flagged && styles.medCardFlagged]}>
            <View style={styles.medTop}>
              <View style={[styles.medIcon, flagged && styles.medIconFlagged]}>
                <Package size={16} color={flagged ? '#d97706' : Colors.primary} />
              </View>
              <View style={styles.medInfo}>
                <View style={styles.medNameRow}>
                  <Text style={styles.medName}>{name}</Text>
                  {flagged && <AlertCircle size={14} color="#f59e0b" />}
                </View>
                <Text style={styles.medBrand}>{brand}</Text>
                <Text style={styles.medQty}>{qty}</Text>
                {/* Confidence bar */}
                <View style={styles.confRow}>
                  <View style={styles.confTrack}>
                    <View style={[styles.confFill, { width: `${confidence}%`, backgroundColor: confidenceColor(confidence) }]} />
                  </View>
                  <Text style={[styles.confText, { color: confidenceColor(confidence) }]}>
                    {confidence}%
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editBtn}>
                <Edit size={12} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add manually */}
        <TouchableOpacity style={styles.addBtn}>
          <Plus size={16} color={Colors.textSecondary} />
          <Text style={styles.addBtnText}>Add medicine manually</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* CTA */}
      <View style={styles.cta}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate(Routes.RX_RESULTS, { prescriptionId: 'rx_001' })}>
          <Text style={styles.primaryBtnText}>Find These Medicines →</Text>
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
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.gray100, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary, textAlign: 'center' },
  banner: {
    flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start',
    backgroundColor: Colors.primaryLight, borderWidth: 1, borderColor: 'rgba(11,143,129,0.2)',
    borderRadius: Radius.md, padding: Spacing.md, margin: Spacing.lg,
  },
  bannerText: { flex: 1, fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.medium, lineHeight: 18 },
  body: { flex: 1 },
  bodyContent: { paddingHorizontal: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  medCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.lg,
  },
  medCardFlagged: { borderColor: '#fde68a' },
  medTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  medIcon: { width: 36, height: 36, backgroundColor: Colors.primaryLight, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  medIconFlagged: { backgroundColor: '#fffbeb' },
  medInfo: { flex: 1 },
  medNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  medName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary, flex: 1 },
  medBrand: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  medQty: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  confRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 8 },
  confTrack: { flex: 1, height: 4, backgroundColor: Colors.gray100, borderRadius: 2, overflow: 'hidden' },
  confFill: { height: 4, borderRadius: 2 },
  confText: { fontSize: 10, fontWeight: FontWeight.bold },
  editBtn: { width: 28, height: 28, backgroundColor: Colors.gray50, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, paddingVertical: Spacing.md,
    borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed',
    borderRadius: Radius.xl,
  },
  addBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  cta: {
    backgroundColor: Colors.surface, borderTopWidth: 1,
    borderTopColor: Colors.borderLight, padding: Spacing.xl, paddingBottom: 32,
  },
  primaryBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center' },
  primaryBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});

export default RxReviewScreen;
