/**
 * ResultsListScreen.tsx — Figma: "Results List"
 */
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, MapIcon, MapPin, Search, Filter, Building2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SearchStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/constants/theme';
import { usePharmacySearch } from '@/hooks/usePharmacySearch';
import { useLocationStore } from '@/store/locationStore';
import { ApiStateView } from '@/components/ui/ApiStateView';
import type { PharmacyWithStock } from '@/types/pharmacy';
import { PharmacyResultCard, STOCK_STATUS_CONFIG } from './components/PharmacyResultCard';

type Nav = NativeStackNavigationProp<SearchStackParamList>;
type RouteProps = RouteProp<SearchStackParamList, typeof Routes.RESULTS_LIST>;

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
    return <PharmacyResultCard pharmacy={p} medicineId={medicineId} />;
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
});

export default ResultsListScreen;
