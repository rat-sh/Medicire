/**
 * ReservationTrackerScreen.tsx
 * Figma: "Reservation Tracker" — Order history list with status badges,
 *        grouped by month, tap to view individual reservation status
 * Mock: MOCK_RESERVATIONS list
 * Real API: GET /reservations
 * MOCK_MARKER: Replace MOCK_RESERVATIONS with useQuery(() => reservationsApi.list())
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, Package, MapPin } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReservationStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type Nav = NativeStackNavigationProp<ReservationStackParamList>;

// ── MOCK_MARKER ───────────────────────────────────────────────────────────────
const MOCK_RESERVATIONS = [
  { id: 'rsv_001', medicine: 'Paracetamol 500mg', pharmacy: 'Apollo Pharmacy', date: 'Jun 14', time: '10:00 AM', status: 'pending' as const, price: '48' },
  { id: 'rsv_002', medicine: 'Metformin 500mg', pharmacy: 'MedPlus, Sector V', date: 'Jun 10', time: 'ASAP', status: 'confirmed' as const, price: '35' },
  { id: 'rsv_003', medicine: 'Atorvastatin 10mg', pharmacy: 'Guardian Pharmacy', date: 'Jun 2', time: '2:00 PM', status: 'completed' as const, price: '72' },
  { id: 'rsv_004', medicine: 'Crocin 500mg', pharmacy: 'Apollo Pharmacy', date: 'May 28', time: '5:00 PM', status: 'cancelled' as const, price: '24' },
  { id: 'rsv_005', medicine: 'Azithromycin 500mg', pharmacy: 'Frank Ross', date: 'May 20', time: '12:00 PM', status: 'completed' as const, price: '95' },
];
// ─────────────────────────────────────────────────────────────────────────────

const BADGE_CFG = {
  pending: { label: 'Pending', bg: Colors.warningLight, border: Colors.warningBorder, text: Colors.warning },
  confirmed: { label: 'Confirmed', bg: Colors.successLight, border: Colors.successBorder, text: Colors.success },
  ready: { label: 'Ready', bg: Colors.infoLight, border: Colors.infoBorder, text: Colors.info },
  cancelled: { label: 'Cancelled', bg: Colors.errorLight, border: Colors.errorBorder, text: Colors.error },
  completed: { label: 'Completed', bg: Colors.gray100, border: Colors.gray200, text: Colors.gray500 },
};

const ReservationTrackerScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <View style={styles.statusSpacer} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>My Orders</Text>
        <Text style={styles.sub}>{MOCK_RESERVATIONS.length} reservations</Text>
      </View>

      <FlatList
        data={MOCK_RESERVATIONS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const badge = BADGE_CFG[item.status];
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate(Routes.RSV_STATUS, {
                reservationId: item.id,
                status: item.status,
              })}>
              {/* Medicine icon */}
              <View style={styles.iconBox}>
                <Package size={18} color={Colors.primary} />
              </View>
              {/* Info */}
              <View style={styles.cardInfo}>
                <Text style={styles.medName}>{item.medicine}</Text>
                <View style={styles.metaRow}>
                  <MapPin size={10} color={Colors.textMuted} />
                  <Text style={styles.metaText}>{item.pharmacy}</Text>
                </View>
                <Text style={styles.dateText}>{item.date} · {item.time}</Text>
              </View>
              {/* Right side */}
              <View style={styles.cardRight}>
                <View style={[styles.badge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                  <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
                </View>
                <Text style={styles.priceText}>₹{item.price}</Text>
                <ChevronRight size={14} color={Colors.textMuted} />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  statusSpacer: { height: 44 },
  header: {
    backgroundColor: Colors.surface, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  heading: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  list: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 100 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.lg,
  },
  iconBox: {
    width: 40, height: 40, backgroundColor: Colors.primaryLight,
    borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  medName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  metaText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  dateText: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  cardRight: { alignItems: 'flex-end', gap: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: FontWeight.semibold },
  priceText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textPrimary },
});

export default ReservationTrackerScreen;
