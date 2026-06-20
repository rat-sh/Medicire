import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export interface PharmacyCardProps {
  name: string;
  distance: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  price?: string;
  open: boolean;
  closingTime?: string;
  onClick?: () => void;
  onReserve?: () => void;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({
  name,
  distance,
  status,
  price,
  open,
  closingTime,
  onClick,
  onReserve,
}) => {
  const stockConfig: Record<string, { label: string; variant: BadgeVariant }> = {
    'in-stock': { label: 'In stock', variant: 'green' },
    'low-stock': { label: 'Low stock', variant: 'amber' },
    'out-of-stock': { label: 'Out of stock', variant: 'red' },
  };
  
  const badge = stockConfig[status] || stockConfig['out-of-stock'];

  return (
    <Card onPress={onClick} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.meta}>
            <MapPin size={12} color={Colors.textMuted} />
            <Text style={styles.distance}>{distance}</Text>
            <View style={styles.dot} />
            <Text style={[styles.statusText, { color: open ? Colors.success : Colors.error }]}>
              {open ? (closingTime ? `Closes ${closingTime}` : 'Open') : 'Closed'}
            </Text>
          </View>
        </View>
        <Badge label={badge.label} variant={badge.variant} />
      </View>

      <View style={styles.bottomRow}>
        {price ? (
          <Text style={styles.price}>₹{price}</Text>
        ) : (
          <Text style={styles.priceUnavailable}>Price unavailable</Text>
        )}
        <TouchableOpacity
          style={[styles.reserveBtn, status === 'out-of-stock' && styles.reserveBtnDisabled]}
          disabled={status === 'out-of-stock'}
          onPress={onReserve}
        >
          <Text style={[styles.reserveText, status === 'out-of-stock' && styles.reserveTextDisabled]}>
            Reserve
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  distance: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  priceUnavailable: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  reserveBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
  reserveBtnDisabled: {
    backgroundColor: Colors.gray100,
  },
  reserveText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textInverse,
  },
  reserveTextDisabled: {
    color: Colors.textMuted,
  },
});
