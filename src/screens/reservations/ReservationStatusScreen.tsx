/**
 * ReservationStatusScreen.tsx
 * Orchestrates the order status view.
 * All rendering logic lives in dedicated components; this file owns only:
 *   - Route params & mock data lookup
 *   - Derived display values (status, flow, steps, totals)
 *   - Navigation handlers
 *   - Screen frame (header + scroll + inline CTAs)
 */
import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Package, Bell } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReservationStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/constants/theme';
import { STATUS_CONFIG, PICKUP_FLOW, DELIVERY_FLOW } from '@/constants/reservation';
import { MOCK_RESERVATIONS } from '@/services/api/mock/reservations';
import type { ReservationStatus, TrackingStep } from '@/types/reservation';
import {
  OrderStatusHero,
  OrderTimeline,
  PharmacyContactCard,
} from '@/components/reservation';
import { guardReservationId, guardReservationStatus } from '@/utils/navParamGuards';

type Props = NativeStackScreenProps<ReservationStackParamList, typeof Routes.RSV_STATUS>;
type Nav   = NativeStackNavigationProp<ReservationStackParamList>;

// ─── Screen ───────────────────────────────────────────────────────────────────
const ReservationStatusScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<Nav>();
  const insets     = useSafeAreaInsets();
  const { reservationId: rawId, status: rawStatus } = route.params;

  // Guard: treat nav params as untrusted (deep links are user-controlled)
  const reservationId = guardReservationId(rawId) ?? '';
  const routeStatus   = guardReservationStatus(rawStatus);

  const reservation = useMemo(
    () => MOCK_RESERVATIONS.find(r => r.id === reservationId) ?? MOCK_RESERVATIONS[0],
    [reservationId],
  );

  const status      = (routeStatus ?? reservation.status) as ReservationStatus;
  const isCancelled = status === 'cancelled';
  const isDelivery  = reservation.deliveryMode === 'delivery';
  const flow        = isDelivery ? DELIVERY_FLOW : PICKUP_FLOW;
  const cfg         = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  const steps: TrackingStep[] = reservation.trackingSteps ?? flow.map(key => ({
    key,
    label: STATUS_CONFIG[key]?.label ?? key,
    timestamp: undefined,
  }));

  const subtotal = reservation.pricePerUnit * reservation.quantity;
  const total    = subtotal + (reservation.deliveryFare ?? 0);

  return (
    <View style={styles.root}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate(Routes.RSV_TRACKER)}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>
          Order #{reservation.id.split('_').pop()?.toUpperCase()}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={[styles.bodyContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}>

        {/* ── Status hero ── */}
        <OrderStatusHero
          status={status}
          isDelivery={isDelivery}
          cancellationReason={reservation.cancellationReason}
        />

        {/* ── Order progress timeline ── */}
        {!isCancelled && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Order Progress</Text>
            <OrderTimeline
              steps={steps}
              status={status}
              flow={flow}
              activeColor={cfg.color}
            />
          </View>
        )}

        {/* ── Cancelled order history (simple list) ── */}
        {isCancelled && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Order History</Text>
            {steps.map(step => (
              <View key={step.key} style={styles.historyRow}>
                <View style={[
                  styles.historyDot,
                  { backgroundColor: step.key === 'cancelled' ? Colors.error : Colors.success },
                ]} />
                <Text style={styles.historyLabel}>{step.label}</Text>
                {step.timestamp && (
                  <Text style={styles.historyTs}>
                    {new Date(step.timestamp).toLocaleTimeString('en-IN', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ── Order details ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Order Details</Text>
          <DetailRow label="Medicine"  value={reservation.medicineName} />
          <DetailRow label="Dosage"    value={reservation.medicineDosage} />
          <DetailRow label="Quantity"  value={`${reservation.quantity} strips`} />
          <DetailRow label="Mode"      value={isDelivery ? 'Home Delivery' : 'Store Pickup'} />
          {isDelivery && reservation.deliveryAddress && (
            <DetailRow label="Deliver to" value={reservation.deliveryAddress} />
          )}
          <DetailRow label="Subtotal"  value={`₹${subtotal}`} />
          {isDelivery && (
            <DetailRow label="Delivery Fare" value={`₹${reservation.deliveryFare ?? 0}`} />
          )}
          <View style={styles.detailTotalRow}>
            <Text style={styles.detailTotalLabel}>Total Paid</Text>
            <Text style={styles.detailTotalValue}>₹{total}</Text>
          </View>
        </View>

        {/* ── Pharmacy contact card ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Pharmacy</Text>
          <PharmacyContactCard
            name={reservation.pharmacyName}
            address={reservation.pharmacyAddress}
            phone={reservation.pharmacyPhone}
            lat={reservation.pharmacyLat}
            lng={reservation.pharmacyLng}
            isDelivery={isDelivery}
          />
        </View>

        {/* ── Pending notification hint ── */}
        {status === 'pending' && (
          <View style={styles.infoBox}>
            <Bell size={16} color={Colors.warning} />
            <Text style={styles.infoText}>
              You'll get a notification when the pharmacy confirms or rejects your order.
            </Text>
          </View>
        )}

        {/* ── CTAs ── */}
        {isCancelled && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate(Routes.RSV_TRACKER)}>
            <Text style={styles.primaryBtnText}>Find Another Pharmacy</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate(Routes.RSV_TRACKER)}>
          <Package size={14} color={Colors.textSecondary} style={styles.btnIcon} />
          <Text style={styles.secondaryBtnText}>View All Orders</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// ─── Local helper ─────────────────────────────────────────────────────────────
const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: 32, height: 32, backgroundColor: Colors.gray100,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
  },
  headerSpacer: { width: 32 },
  title: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },

  body: { flex: 1 },
  bodyContent: { padding: Spacing.lg, gap: Spacing.md },

  section: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.borderLight, ...Shadow.sm,
  },
  sectionLabel: {
    fontSize: 10, fontWeight: FontWeight.bold, color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14,
  },

  // Cancelled history
  historyRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: 6,
  },
  historyDot:  { width: 10, height: 10, borderRadius: 5 },
  historyLabel:{ flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary },
  historyTs:   { fontSize: FontSize.xs, color: Colors.textMuted },

  // Order detail rows
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.gray50,
  },
  detailLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  detailValue: {
    fontSize: FontSize.sm, fontWeight: FontWeight.semibold,
    color: Colors.textPrimary, maxWidth: '60%', textAlign: 'right',
  },
  detailTotalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 10, marginTop: 4,
  },
  detailTotalLabel: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  detailTotalValue: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.primary },

  // Pending info box
  infoBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.warningLight, padding: Spacing.md,
    borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.warningBorder,
  },
  infoText: {
    flex: 1, fontSize: FontSize.xs, color: Colors.warning,
    fontWeight: FontWeight.medium, lineHeight: 18,
  },

  // Buttons
  primaryBtn: {
    backgroundColor: Colors.primary, paddingVertical: 14,
    borderRadius: Radius.xl, alignItems: 'center',
  },
  primaryBtnText: { color: Colors.textInverse, fontSize: FontSize.base, fontWeight: FontWeight.bold },
  secondaryBtn: {
    flexDirection: 'row', borderWidth: 1, borderColor: Colors.borderLight,
    paddingVertical: 14, borderRadius: Radius.xl,
    alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface,
  },
  secondaryBtnText: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  btnIcon: { marginRight: 6 },
});

export default ReservationStatusScreen;
