/**
 * ResultsListScreen.tsx — Figma: "Results List"
 */
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, MapIcon, MapPin, Star, Navigation, Search, Filter, Building2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SearchStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/constants/theme';
import { usePharmacySearch } from '@/hooks/usePharmacySearch';
import { useLocationStore } from '@/store/locationStore';
import { ApiStateView } from '@/components/ui/ApiStateView';
import { formatDistance } from '@/utils/formatters';
import type { PharmacyWithStock } from '@/types/pharmacy';

type Nav = NativeStackNavigationProp<SearchStackParamList>;
type RouteProps = RouteProp<SearchStackParamList, typeof Routes.RESULTS_LIST>;

const STOCK_STATUS_CONFIG = {
  'in-stock': { color: Colors.pinInStock, label: 'In stock', badge: Colors.successLight, badgeBorder: Colors.successBorder, textColor: Colors.success },
  'low-stock': { color: Colors.pinLowStock, label: 'Low stock', badge: Colors.warningLight, badgeBorder: Colors.warningBorder, textColor: Colors.warning },
  'out-of-stock': { color: Colors.pinOutOfStock, label: 'Out of stock', badge: Colors.errorLight, badgeBorder: Colors.errorBorder, textColor: Colors.error },
};

const FILTER_CHIPS = ['Open now', '≤ 2km', 'In stock', 'Low price'];

const ResultsListScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const { medicineId, medicineName } = route.params;
  const { latitude, longitude } = useLocationStore();
  const searchQuery = usePharmacySearch(medicineId);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const pharmacies = searchQuery.data?.pharmacies ?? [];
  const inStockCount = searchQuery.data?.inStockCount ?? 0;
  const hasLocation = latitude != null && longitude != null;

  const renderPharmacy = ({ item: p }: { item: PharmacyWithStock }) => {
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

  return (
    <View style={styles.root}>
      <View style={[styles.headerBlock, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={16} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.searchPill}>
            <Search size={16} color={Colors.primary} />
            <Text style={styles.searchPillText} numberOfLines={1}>{medicineName}</Text>
          </View>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate(Routes.RESULTS_MAP, { medicineId, medicineName })}>
            <MapIcon size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          {FILTER_CHIPS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(activeFilter === f ? null : f)}>
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.filterChip}>
            <Filter size={12} color={Colors.textSecondary} />
            <Text style={styles.filterChipText}> Filters</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {!hasLocation ? (
        <ApiStateView
          isLoading={false}
          isError={false}
          isEmpty
          emptyIcon={MapPin}
          emptyTitle="Location required"
          emptySubtitle="Enable location to find pharmacies with this medicine."
        />
      ) : (
        <ApiStateView
          isLoading={searchQuery.isLoading}
          isError={searchQuery.isError}
          isEmpty={!searchQuery.isLoading && pharmacies.length === 0}
          loadingText="Finding pharmacies near you..."
          errorMessage="Could not load pharmacy results."
          emptyIcon={Building2}
          emptyTitle="No pharmacies found"
          emptySubtitle="Try expanding your search area or check another medicine."
          onRetry={() => searchQuery.refetch()}>
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

          <FlatList
            data={pharmacies}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            renderItem={renderPharmacy}
            showsVerticalScrollIndicator={false}
          />
        </ApiStateView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerBlock: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    ...Shadow.sm,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm,
  },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.gray100, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  searchPill: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gray100, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
  },
  searchPillText: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  iconBtn: { width: 32, height: 32, backgroundColor: Colors.gray100, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  filterRow: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, gap: Spacing.sm },
  filterChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: 6,
    backgroundColor: Colors.gray100, borderRadius: Radius.full,
  },
  filterChipActive: { backgroundColor: Colors.primaryLight },
  filterChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.primary, fontWeight: FontWeight.semibold },
  summaryBar: { backgroundColor: Colors.surface, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  summaryText: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 6 },
  summaryCount: { fontWeight: FontWeight.bold, color: Colors.success },
  legendRow: { flexDirection: 'row', gap: Spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: FontSize.xs, color: Colors.textMuted },
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
