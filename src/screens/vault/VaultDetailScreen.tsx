/**
 * VaultDetailScreen.tsx
 * Figma: "Vault Detail" — prescription image preview, extracted medicines table,
 *        doctor info, hospital info, date, Re-scan + Find Now actions
 * Mock: Hardcoded prescription detail data
 * Real API: GET /prescriptions/:id
 * MOCK_MARKER: Replace MOCK_RX_DETAIL with prescriptionsApi.getById(id)
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ChevronLeft, FileText, RefreshCw, MapPin, Package,
  User, Building,
} from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { VaultStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type Nav = NativeStackNavigationProp<VaultStackParamList>;
type RouteProps = RouteProp<VaultStackParamList, typeof Routes.VAULT_DETAIL>;

// ── MOCK_MARKER ───────────────────────────────────────────────────────────────
const MOCK_RX_DETAIL = {
  id: 'rx_001',
  date: 'June 14, 2025',
  doctor: 'Dr. Subrata Bose',
  specialty: 'Internal Medicine',
  hospital: 'AMRI Hospitals, Salt Lake',
  medicines: [
    { name: 'Metformin 500mg', dosage: '2x daily after meals', qty: '60 tablets' },
    { name: 'Atorvastatin 10mg', dosage: '1x at night', qty: '30 tablets' },
    { name: 'Amlodipine 5mg', dosage: '1x morning', qty: '30 tablets' },
    { name: 'Pantoprazole 40mg', dosage: '1x before breakfast', qty: '30 tablets' },
    { name: 'Metoprolol 25mg', dosage: '1x daily', qty: '30 tablets' },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

const VaultDetailScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prescription Details</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Prescription image mock */}
        <View style={styles.imageCard}>
          <View style={styles.imagePlaceholder}>
            <FileText size={48} color={Colors.textMuted} />
            <Text style={styles.imagePlaceholderText}>Prescription Image</Text>
          </View>
        </View>

        {/* Doctor & hospital info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <User size={14} color={Colors.primary} />
            <View>
              <Text style={styles.infoLabel}>Doctor</Text>
              <Text style={styles.infoValue}>{MOCK_RX_DETAIL.doctor}</Text>
              <Text style={styles.infoSub}>{MOCK_RX_DETAIL.specialty}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Building size={14} color={Colors.primary} />
            <View>
              <Text style={styles.infoLabel}>Hospital</Text>
              <Text style={styles.infoValue}>{MOCK_RX_DETAIL.hospital}</Text>
              <Text style={styles.infoSub}>Dated: {MOCK_RX_DETAIL.date}</Text>
            </View>
          </View>
        </View>

        {/* Medicines extracted */}
        <Text style={styles.sectionTitle}>Extracted Medicines</Text>
        <View style={styles.medList}>
          {MOCK_RX_DETAIL.medicines.map(({ name, dosage, qty }) => (
            <View key={name} style={styles.medRow}>
              <View style={styles.medIcon}>
                <Package size={14} color={Colors.primary} />
              </View>
              <View style={styles.medInfo}>
                <Text style={styles.medName}>{name}</Text>
                <Text style={styles.medDosage}>{dosage}</Text>
                <Text style={styles.medQty}>{qty}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* CTAs */}
      <View style={styles.cta}>
        <TouchableOpacity style={styles.secondaryBtn}>
          <RefreshCw size={14} color={Colors.textSecondary} />
          <Text style={styles.secondaryBtnText}>Re-scan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate(Routes.RX_RESULTS as any, { prescriptionId: MOCK_RX_DETAIL.id })}>
          <MapPin size={14} color={Colors.textInverse} />
          <Text style={styles.primaryBtnText}>Find Now</Text>
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
  bodyContent: { padding: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  imageCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 160, backgroundColor: Colors.gray100,
    alignItems: 'center', justifyContent: 'center', gap: Spacing.md,
  },
  imagePlaceholderText: { color: Colors.textMuted, fontSize: FontSize.sm },
  infoCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.lg,
    gap: Spacing.md,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  infoLabel: { fontSize: 10, fontWeight: FontWeight.semibold, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  infoValue: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginTop: 2 },
  infoSub: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 1 },
  divider: { height: 1, backgroundColor: Colors.borderLight },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  medList: { gap: Spacing.sm },
  medRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  medIcon: { width: 32, height: 32, backgroundColor: Colors.primaryLight, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  medInfo: { flex: 1 },
  medName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  medDosage: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  medQty: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  cta: {
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.borderLight,
    flexDirection: 'row', gap: Spacing.md, padding: Spacing.xl, paddingBottom: 32,
  },
  primaryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 12,
  },
  primaryBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
  secondaryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingVertical: 12,
  },
  secondaryBtnText: { color: Colors.textSecondary, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});

export default VaultDetailScreen;
