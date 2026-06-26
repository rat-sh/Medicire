/**
 * ParcelInfoCard.tsx
 * Static informational card explaining how a medicine parcel is packed.
 * No props — purely presentational.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Package } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';

const PARCEL_ITEMS = [
  { icon: '💊', text: 'Medicines sealed in tamper-proof zip pouch' },
  { icon: '🧾', text: 'Invoice included with each strip labelled' },
  { icon: '❄️',  text: 'Temperature-safe packaging for sensitive medicines' },
  { icon: '📦', text: 'Outer box with your name and order ID for delivery' },
];

export const ParcelInfoCard: React.FC = () => (
  <>
    <View style={styles.header}>
      <Package size={16} color={Colors.primary} />
      <Text style={styles.title}>How your parcel will be packed</Text>
    </View>
    {PARCEL_ITEMS.map(item => (
      <View key={item.text} style={styles.row}>
        <Text style={styles.emoji}>{item.icon}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    ))}
  </>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.sm, marginBottom: Spacing.md,
  },
  title: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.primary },
  row: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: Spacing.sm, marginBottom: 6,
  },
  emoji: { fontSize: 14, width: 20 },
  text:  { flex: 1, fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
});
