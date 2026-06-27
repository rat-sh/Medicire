/**
 * PharmacyResultCard.tsx
 * Reusable card component for pharmacy search results.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapPin, Star, Navigation } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SearchStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/constants/theme';
import { formatDistance } from '@/utils/formatters';
import type { PharmacyWithStock } from '@/types/pharmacy';

type Nav = NativeStackNavigationProp<SearchStackParamList>;

export const STOCK_STATUS_CONFIG = {
  'in-stock': { color: Colors.pinInStock, label: 'In stock', badge: Colors.successLight, badgeBorder: Colors.successBorder, textColor: Colors.success },
  'low-stock': { color: Colors.pinLowStock, label: 'Low stock', badge: Colors.warningLight, badgeBorder: Colors.warningBorder, textColor: Colors.warning },
  'out-of-stock': { color: Colors.pinOutOfStock, label: 'Out of stock', badge: Colors.errorLight, badgeBorder: Colors.errorBorder, textColor: Colors.error },
};

interface PharmacyResultCardProps {
  pharmacy: PharmacyWithStock;
  medicineId: string;
}

export const PharmacyResultCard: React.FC<PharmacyResultCardProps> = ({
  pharmacy: p,
  medicineId,
}) => {
  const navigation = useNavigation<Nav>();
  const cfg = STOCK_STATUS_CONFIG[p.stockStatus];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(Routes.PHARMACY_DETAIL, { pharmacyId: p.id, medicineId })}>
      <View style={styles.cardTop}>
        <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
        <View style={styles.nameBlock}>
          <Text style={styles.pharmacyName}>{p.name}</Text>
          <View style={styles.metaRow}>
            <MapPin size={10} color={Colors.textMuted} />
            <Text style={styles.metaText}>{formatDistance(p.distanceMeters)}</Text>
            <View style={styles.dot} />
            <Text style={[styles.metaText, { color: p.isOpen ? Colors.success : Colors.error }]}>
              {p.isOpen ? `Closes ${p.closingTime ?? '9 PM'}` : 'Closed'}
            </Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: cfg.badge, borderColor: cfg.badgeBorder }]}>
          <Text style={[styles.badgeText, { color: cfg.textColor }]}>{cfg.label}</Text>
        </View>
      </View>

      <View style={styles.cardBottom}>
        <View style={styles.ratingRow}>
          <Star size={10} color="#f59e0b" fill="#f59e0b" />
          <Text style={styles.ratingText}>{p.rating.toFixed(1)}</Text>
        </View>
        {p.price
          ? <Text style={styles.price}>₹{p.price}</Text>
          : <Text style={styles.priceNA}>Price N/A</Text>}
        <View style={styles.cardBtns}>
          <TouchableOpacity style={styles.dirBtn}>
            <Navigation size={14} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.reserveBtn, p.stockStatus === 'out-of-stock' && styles.reserveBtnDisabled]}
            disabled={p.stockStatus === 'out-of-stock'}
            onPress={() => navigation.navigate(Routes.RSV_CONFIRM, { pharmacyId: p.id, medicineId })}>
            <Text style={[styles.reserveBtnText, p.stockStatus === 'out-of-stock' && { color: Colors.textMuted }]}>
              {p.stockStatus === 'out-of-stock' ? 'Unavailable' : 'Reserve'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.lg, ...Shadow.sm,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginBottom: Spacing.md },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4, flexShrink: 0 },
  nameBlock: { flex: 1 },
  pharmacyName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.gray300 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, borderWidth: 1 },
  badgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  price: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  priceNA: { flex: 1, fontSize: FontSize.xs, color: Colors.textMuted },
  cardBtns: { flexDirection: 'row', gap: Spacing.sm },
  dirBtn: {
    width: 36, height: 36, backgroundColor: Colors.gray100,
    borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center',
  },
  reserveBtn: {
    paddingHorizontal: Spacing.lg, paddingVertical: 8,
    backgroundColor: Colors.primary, borderRadius: Radius.md,
  },
  reserveBtnDisabled: { backgroundColor: Colors.gray100 },
  reserveBtnText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textInverse },
});
