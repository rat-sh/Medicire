/**
 * ReservationConfirmScreen.tsx
 * Figma: "Confirm Reservation" — pharmacy + medicine summary card, quantity
 *        selector, pickup time picker chips, terms row, Confirm button
 * Mock: Submit → RsvStatus (pending state)
 * Real API: POST /reservations → navigate to RsvStatus
 * MOCK_MARKER: Replace navigation.navigate with real reservationsApi.create()
 */
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Package, MapPin, Clock, Plus, Minus, Shield } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { ReservationStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Config } from '@/constants/config';
// ── MOCK_MARKER ───────────────────────────────────────────────────────────────
import { MOCK_PHARMACIES } from '@/services/api/mock/pharmacies';
// ─────────────────────────────────────────────────────────────────────────────

type Nav = NativeStackNavigationProp<ReservationStackParamList>;
type RouteProps = RouteProp<ReservationStackParamList, typeof Routes.RSV_CONFIRM>;

const SLOTS = ['ASAP', '10:00 AM', '12:00 PM', '2:00 PM', '5:00 PM'];

const ReservationConfirmScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { pharmacyId } = route.params;
  const [qty, setQty] = useState(1);
  const [slot, setSlot] = useState('ASAP');

  // MOCK_MARKER: Replace with real pharmacy data
  const pharmacy = MOCK_PHARMACIES.find(p => p.id === pharmacyId) ?? MOCK_PHARMACIES[0];

  const handleConfirm = () => {
    if (Config.USE_MOCK) {
      // ── MOCK_MARKER: POST /reservations when backend is ready ─────────────
      navigation.navigate(Routes.RSV_STATUS, { reservationId: 'rsv_mock_001', status: 'pending' });
      return;
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Reservation</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Medicine Summary */}
        <View style={styles.card}>
          <View style={styles.medRow}>
            <View style={styles.medIcon}>
              <Package size={20} color={Colors.primary} />
            </View>
            <View style={styles.medInfo}>
              <Text style={styles.medName}>Paracetamol 500mg</Text>
              <Text style={styles.medBrand}>Crocin / Dolo</Text>
              <Text style={styles.medPrice}>₹{pharmacy.price ?? 48} per unit</Text>
            </View>
            {/* Quantity */}
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(q => Math.max(1, q - 1))}>
                <Minus size={14} color={Colors.textSecondary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(q => q + 1)}>
                <Plus size={14} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Pharmacy info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pickup From</Text>
          <View style={styles.pharmacyRow}>
            <MapPin size={16} color={Colors.primary} />
            <View style={styles.pharmacyInfo}>
              <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
              <Text style={styles.pharmacyAddr}>{pharmacy.address}</Text>
            </View>
          </View>
          <View style={styles.openRow}>
            <View style={[styles.openDot, { backgroundColor: pharmacy.isOpen ? Colors.success : Colors.error }]} />
            <Text style={[styles.openText, { color: pharmacy.isOpen ? Colors.success : Colors.error }]}>
              {pharmacy.isOpen ? `Open · Closes ${pharmacy.closingTime ?? '9 PM'}` : 'Closed'}
            </Text>
          </View>
        </View>

        {/* Pickup time chips */}
        <View style={styles.card}>
          <View style={styles.timeHeader}>
            <Clock size={14} color={Colors.textSecondary} />
            <Text style={styles.cardTitle}>Pickup Time</Text>
          </View>
          <View style={styles.slotsWrap}>
            {SLOTS.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.slotChip, slot === s && styles.slotChipActive]}
                onPress={() => setSlot(s)}>
                <Text style={[styles.slotText, slot === s && styles.slotTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Total */}
        <View style={styles.card}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total (incl. taxes)</Text>
            <Text style={styles.totalAmt}>₹{(Number(pharmacy.price ?? 48) * qty).toFixed(2)}</Text>
          </View>
          <Text style={styles.totalNote}>Pay at the pharmacy when you collect</Text>
        </View>

        {/* Privacy note */}
        <View style={styles.privacyRow}>
          <Shield size={14} color={Colors.primary} />
          <Text style={styles.privacyText}>
            Reservation is held for 2 hours. No payment needed now.
          </Text>
        </View>
      </ScrollView>

      {/* Confirm CTA */}
      <View style={styles.cta}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>Confirm Reservation</Text>
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
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.lg, gap: Spacing.md,
  },
  medRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  medIcon: { width: 40, height: 40, backgroundColor: Colors.primaryLight, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center' },
  medInfo: { flex: 1 },
  medName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  medBrand: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  medPrice: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.semibold, marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  qtyBtn: {
    width: 28, height: 28, backgroundColor: Colors.gray100,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
  },
  qtyText: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, minWidth: 20, textAlign: 'center' },
  cardTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  pharmacyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  pharmacyInfo: { flex: 1 },
  pharmacyName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  pharmacyAddr: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  openRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  openDot: { width: 8, height: 8, borderRadius: 4 },
  openText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  timeHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  slotsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  slotChip: {
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.full,
    backgroundColor: Colors.gray50,
  },
  slotChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  slotText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  slotTextActive: { color: Colors.textInverse },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  totalAmt: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  totalNote: { fontSize: FontSize.xs, color: Colors.textMuted },
  privacyRow: {
    flexDirection: 'row', gap: Spacing.md, alignItems: 'center',
    backgroundColor: Colors.primaryLight, borderRadius: Radius.md, padding: Spacing.md,
  },
  privacyText: { flex: 1, fontSize: FontSize.xs, color: Colors.primary },
  cta: {
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.borderLight,
    padding: Spacing.xl, paddingBottom: 32,
  },
  confirmBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center' },
  confirmBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});

export default ReservationConfirmScreen;
