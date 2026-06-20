/**
 * ResultsMapScreen.tsx
 * Figma: "Results Map" — full-screen OSM map, color-coded pharmacy pins,
 *        floating header with back/search, legend chips at top-left
 * Mock: Uses MOCK_PHARMACIES positions on the map
 * Real API: Same pharmacy search, render on MapView
 * MOCK_MARKER: Replace MOCK_PHARMACIES with pharmaciesApi result
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, List } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SearchStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
// ── MOCK_MARKER ───────────────────────────────────────────────────────────────
import { MOCK_PHARMACIES } from '@/services/api/mock/pharmacies';
// ─────────────────────────────────────────────────────────────────────────────

type Nav = NativeStackNavigationProp<SearchStackParamList>;
type RouteProps = RouteProp<SearchStackParamList, typeof Routes.RESULTS_MAP>;

const LEGEND = [
  { color: Colors.pinInStock, label: 'In stock' },
  { color: Colors.pinLowStock, label: 'Low' },
  { color: Colors.pinClosed, label: 'Closed' },
  { color: Colors.pinOutOfStock, label: 'Out' },
];

const PIN_COLORS: Record<string, string> = {
  'in-stock': Colors.pinInStock,
  'low-stock': Colors.pinLowStock,
  'out-of-stock': Colors.pinOutOfStock,
};

const ResultsMapScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { medicineId, medicineName } = route.params;

  return (
    <View style={styles.root}>
      {/* Full-screen Map (OpenStreetMap — no API key needed) */}
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: 22.5726,
          longitude: 88.4298,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton={false}>
        {/* MOCK_MARKER: Replace MOCK_PHARMACIES with real search results */}
        {MOCK_PHARMACIES.map(p => (
          <Marker
            key={p.id}
            coordinate={p.location}
            onPress={() => navigation.navigate(Routes.PHARMACY_DETAIL, { pharmacyId: p.id, medicineId })}
            pinColor={PIN_COLORS[p.stockStatus] ?? Colors.pinClosed}
            title={p.name}
            description={p.stockStatus === 'in-stock' ? `₹${p.price ?? '—'}` : p.stockStatus}
          />
        ))}
      </MapView>

      {/* Floating header */}
      <View style={styles.floatingHeader}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}>
            <ChevronLeft size={16} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchPill}
            onPress={() => navigation.goBack()}>
            <Text style={styles.searchPillText} numberOfLines={1}>{medicineName}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate(Routes.RESULTS_LIST, { medicineId, medicineName })}>
            <List size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Legend chips */}
      <View style={styles.legend}>
        {LEGEND.map(({ color, label }) => (
          <View key={label} style={styles.legendChip}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  map: { ...StyleSheet.absoluteFill },

  floatingHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  headerContent: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingTop: 48, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg,
  },
  backBtn: {
    width: 32, height: 32, backgroundColor: Colors.surface,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
    elevation: 2,
  },
  searchPill: {
    flex: 1, backgroundColor: Colors.gray100, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
  },
  searchPillText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  iconBtn: {
    width: 32, height: 32, backgroundColor: Colors.gray100,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
  },

  legend: {
    position: 'absolute',
    top: 112,
    left: Spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  legendChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surface, borderRadius: Radius.full,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.borderLight,
    elevation: 2,
  },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 9, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
});

export default ResultsMapScreen;
