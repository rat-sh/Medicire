/**
 * DeliveryModeSelector.tsx
 * Two-card toggle for Pickup (free) vs Home Delivery (+fare).
 * Shows a delivery hint strip when Home Delivery is selected.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Truck, ShoppingBag } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import type { DeliveryMode } from '@/types/reservation';

interface Props {
  value: DeliveryMode;
  onChange: (mode: DeliveryMode) => void;
  /** Flat delivery charge in INR (shown on card and hint) */
  fare: number;
}

export const DeliveryModeSelector: React.FC<Props> = ({ value, onChange, fare }) => (
  <>
    <View style={styles.row}>
      {/* ── Pickup card ── */}
      <TouchableOpacity
        style={[styles.card, value === 'pickup' && styles.cardActive]}
        onPress={() => onChange('pickup')}>
        <View style={[styles.icon, value === 'pickup' && styles.iconActive]}>
          <ShoppingBag
            size={20}
            color={value === 'pickup' ? Colors.textInverse : Colors.textSecondary}
          />
        </View>
        <Text style={[styles.label, value === 'pickup' && styles.labelActive]}>Pickup</Text>
        <Text style={[styles.fare, value === 'pickup' && styles.fareActive]}>Free</Text>
      </TouchableOpacity>

      {/* ── Home Delivery card ── */}
      <TouchableOpacity
        style={[styles.card, value === 'delivery' && styles.cardActive]}
        onPress={() => onChange('delivery')}>
        <View style={[styles.icon, value === 'delivery' && styles.iconActive]}>
          <Truck
            size={20}
            color={value === 'delivery' ? Colors.textInverse : Colors.textSecondary}
          />
        </View>
        <Text style={[styles.label, value === 'delivery' && styles.labelActive]}>
          Home Delivery
        </Text>
        <Text style={[styles.fare, value === 'delivery' && styles.fareActive]}>
          +₹{fare}
        </Text>
      </TouchableOpacity>
    </View>

    {/* ── Delivery hint strip ── */}
    {value === 'delivery' && (
      <View style={styles.hint}>
        <Truck size={12} color={Colors.primary} />
        <Text style={styles.hintText}>
          Estimated delivery in 30–60 min · Flat ₹{fare} delivery charge
        </Text>
      </View>
    )}
  </>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.sm },

  card: {
    flex: 1, alignItems: 'center',
    paddingVertical: Spacing.lg, paddingHorizontal: Spacing.sm,
    borderRadius: Radius.lg, borderWidth: 2, borderColor: Colors.gray200,
    backgroundColor: Colors.surface, gap: Spacing.sm,
  },
  cardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },

  icon: {
    width: 44, height: 44, borderRadius: Radius.md,
    backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center',
  },
  iconActive: { backgroundColor: Colors.primary },

  label: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  labelActive: { color: Colors.primary },

  fare: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textMuted },
  fareActive: { color: Colors.primary },

  hint: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.md,
    backgroundColor: Colors.primaryLight, borderRadius: Radius.md, padding: Spacing.md,
  },
  hintText: { flex: 1, fontSize: FontSize.xs, color: Colors.primary, lineHeight: 16 },
});
