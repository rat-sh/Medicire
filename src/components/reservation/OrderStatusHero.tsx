/**
 * OrderStatusHero.tsx
 * The large status card at the top of the order status screen.
 * Shows icon, status label, subtitle, cancellation reason, and delivery mode pill.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Truck, ShoppingBag } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { STATUS_CONFIG } from '@/constants/reservation';
import type { ReservationStatus } from '@/types/reservation';

interface Props {
  status: ReservationStatus;
  isDelivery: boolean;
  cancellationReason?: string;
}

export const OrderStatusHero: React.FC<Props> = ({ status, isDelivery, cancellationReason }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const { Icon } = cfg;
  const isCancelled = status === 'cancelled';

  return (
    <View style={[styles.card, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      <View style={[styles.iconBox, { backgroundColor: cfg.color + '20', borderColor: cfg.border }]}>
        <Icon size={28} color={cfg.color} />
      </View>

      <Text style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>
      <Text style={styles.sub}>{cfg.sub}</Text>

      {isCancelled && cancellationReason ? (
        <View style={styles.cancelReasonBox}>
          <Text style={styles.cancelReasonText}>Reason: {cancellationReason}</Text>
        </View>
      ) : null}

      <View style={[styles.deliveryPill, { backgroundColor: cfg.color + '15' }]}>
        {isDelivery
          ? <Truck size={11} color={cfg.color} />
          : <ShoppingBag size={11} color={cfg.color} />}
        <Text style={[styles.deliveryPillText, { color: cfg.color }]}>
          {isDelivery ? 'Home Delivery' : 'Store Pickup'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xxl, borderWidth: 1,
    padding: Spacing.xl, alignItems: 'center',
  },
  iconBox: {
    width: 60, height: 60, borderRadius: 30, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md,
  },
  label: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginBottom: 4 },
  sub: {
    fontSize: FontSize.sm, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 20,
  },
  cancelReasonBox: {
    marginTop: Spacing.sm, paddingHorizontal: Spacing.md,
    paddingVertical: 6, backgroundColor: Colors.errorLight,
    borderRadius: Radius.sm,
  },
  cancelReasonText: {
    fontSize: FontSize.xs, color: Colors.error, fontWeight: FontWeight.medium,
  },
  deliveryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginTop: Spacing.md, paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: Radius.full,
  },
  deliveryPillText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
});
