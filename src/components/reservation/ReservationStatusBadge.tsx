/**
 * ReservationStatusBadge.tsx
 * Renders a colored badge for a reservation status.
 * Uses BADGE_CFG from constants as the single source of truth.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontSize, FontWeight, Radius } from '@/constants/theme';
import { BADGE_CFG } from '@/constants/reservation';
import type { ReservationStatus } from '@/types/reservation';

interface Props {
  status: ReservationStatus;
}

export const ReservationStatusBadge: React.FC<Props> = ({ status }) => {
  const cfg = BADGE_CFG[status] ?? BADGE_CFG.pending;
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      <Text style={[styles.text, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: Radius.full, borderWidth: 1,
  },
  text: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
});
