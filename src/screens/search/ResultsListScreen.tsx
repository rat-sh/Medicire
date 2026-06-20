/**
 * ResultsListScreen.tsx
 * Figma: "Results List" — pharmacy cards sorted by distance, stock indicator dots,
 *        reserve button per card, list/map toggle, in-stock count summary
 * Mock: MOCK_PHARMACIES filtered by medicine availability
 * Real API: GET /pharmacies/search?medicineId=&latitude=&longitude=
 * MOCK_MARKER: Replace mock data with pharmaciesApi.searchByMedicine()
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, MapIcon, MapPin, Star, Navigation } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SearchStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/constants/theme';
import { Config } from '@/constants/config';
import { MOCK_PHARMACIES } from '@/services/api/mock/pharmacies';
import type { PharmacyWithStock } from '@/types/pharmacy';

type Nav = NativeStackNavigationProp<SearchStackParamList>;
type RouteProps = RouteProp<SearchStackParamList, typeof Routes.RESULTS_LIST>;

const STOCK_STATUS_CONFIG = {
  'in-stock': { color: Colors.pinInStock, label: 'In stock', badge: Colors.successLight, badgeBorder: Colors.successBorder, textColor: Colors.success },
  'low-stock': { color: Colors.pinLowStock, label: 'Low stock', badge: Colors.warningLight, badgeBorder: Colors.warningBorder, textColor: Colors.warning },
  'out-of-stock': { color: Colors.pinOutOfStock, label: 'Out of stock', badge: Colors.errorLight, badgeBorder: Colors.errorBorder, textColor: Colors.error },
};

const ResultsListScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { medicineId, medicineName } = route.params;
  const [pharmacies, setPharmacies] = useState<PharmacyWithStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (Config.USE_MOCK) {
        // ── MOCK_MARKER: Replace with pharmaciesApi.searchByMedicine(medicineId, lat, lng) ──
        await new Promise<void>(r => setTimeout(r, 700));
        setPharmacies(MOCK_PHARMACIES);
      }
      setLoading(false);
    };
    load();
  }, [medicineId]);

  const inStockCount = pharmacies.filter(p => p.stockStatus === 'in-stock').length;

  const renderPharmacy = ({ item: p }: { item: PharmacyWithStock }) => {
    const cfg = STOCK_STATUS_CONFIG[p.stockStatus];
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate(Routes.PHARMACY_DETAIL, { pharmacyId: p.id, medicineId })}>
        {/* Row 1: status dot + name + stock badge */}
        <View style={styles.cardTop}>
          <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
          <View style={styles.nameBlock}>
            <Text style={styles.pharmacyName}>{p.name}</Text>
            <View style={styles.metaRow}>
              <MapPin size={10} color={Colors.textMuted} />
              <Text style={styles.metaText}>
                {p.distanceMeters >= 1000 ? `${(p.distanceMeters / 1000).toFixed(1)} km` : `${p.distanceMeters} m`}
              </Text>
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

        {/* Row 2: rating, price, reserve */}
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

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchPill}>
          <Text style={styles.searchPillText} numberOfLines={1}>{medicineName}</Text>
        </View>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate(Routes.RESULTS_MAP, { medicineId, medicineName })}>
          <MapIcon size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Summary bar */}
      {!loading && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            <Text style={styles.summaryCount}>{inStockCount}</Text>
            {' '}in-stock near you · {pharmacies.length} pharmacies total
          </Text>
          <View style={styles.legendRow}>
            {(['in-stock', 'low-stock', 'out-of-stock'] as const).map(s => (
              <View key={s} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: STOCK_STATUS_CONFIG[s].color }]} />
                <Text style={styles.legendText}>{STOCK_STATUS_CONFIG[s].label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Finding pharmacies near you...</Text>
        </View>
      ) : (
        <FlatList
          data={pharmacies}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderPharmacy}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, paddingTop: 48,
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.gray100, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  searchPill: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gray100, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
  },
  searchPillText: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  iconBtn: { width: 32, height: 32, backgroundColor: Colors.gray100, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },

  summaryBar: { backgroundColor: Colors.surface, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  summaryText: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 6 },
  summaryCount: { fontWeight: FontWeight.bold, color: Colors.success },
  legendRow: { flexDirection: 'row', gap: Spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: FontSize.xs, color: Colors.textMuted },

  loadingState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  loadingText: { fontSize: FontSize.sm, color: Colors.textSecondary },

  list: { padding: Spacing.xl, gap: Spacing.md, paddingBottom: 100 },
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

export default ResultsListScreen;
