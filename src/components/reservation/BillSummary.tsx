/**
 * BillSummary.tsx
 * Price breakdown for the order confirmation screen.
 * Calculates and renders subtotal, optional delivery fare, total, and payment hint.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight } from '@/constants/theme';
import { HOME_DELIVERY_FARE } from '@/constants/reservation';
import type { DeliveryMode } from '@/types/reservation';

interface Props {
  qty: number;
  pricePerUnit: number;
  deliveryMode: DeliveryMode;
}

export const BillSummary: React.FC<Props> = ({ qty, pricePerUnit, deliveryMode }) => {
  const subtotal    = pricePerUnit * qty;
  const deliveryFare = deliveryMode === 'delivery' ? HOME_DELIVERY_FARE : 0;
  const total       = subtotal + deliveryFare;

  return (
    <>
      {/* Medicine line */}
      <View style={styles.row}>
        <Text style={styles.label}>Medicine × {qty}</Text>
        <Text style={styles.value}>₹{subtotal}</Text>
      </View>

      {/* Delivery fare line (only for home delivery) */}
      {deliveryMode === 'delivery' && (
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Fare</Text>
          <Text style={[styles.value, styles.fareValue]}>+₹{HOME_DELIVERY_FARE}</Text>
        </View>
      )}

      {/* Total */}
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>₹{total}</Text>
      </View>

      {/* Payment method hint */}
      <Text style={styles.hint}>
        {deliveryMode === 'pickup'
          ? '💵 Pay at pharmacy counter on pickup'
          : '💵 Cash on delivery to delivery agent'}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6,
  },
  label:     { fontSize: FontSize.sm, color: Colors.textSecondary },
  value:     { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  fareValue: { color: Colors.error },

  totalRow: {
    borderTopWidth: 1, borderTopColor: Colors.gray100, paddingTop: 10, marginTop: 8,
  },
  totalLabel: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  totalValue: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.primary },

  hint: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 8, lineHeight: 18 },
});
