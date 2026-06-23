/**
 * ResultsMapScreen.tsx — Figma: "Results Map"
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, List, Search } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SearchStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { usePharmacySearch } from '@/hooks/usePharmacySearch';
import { useLocationStore } from '@/store/locationStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

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
  const insets = useSafeAreaInsets();
  const { medicineId, medicineName } = route.params;
  const { latitude, longitude } = useLocationStore();
  const searchQuery = usePharmacySearch(medicineId);
  const pharmacies = searchQuery.data?.pharmacies ?? [];

  const region = {
    latitude: latitude ?? 22.5726,
    longitude: longitude ?? 88.4298,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.root}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={false}>
        {pharmacies.map(p => (
          <Marker
            key={p.id}
            coordinate={{
              latitude: p.location.latitude,
              longitude: p.location.longitude,
            }}
            onPress={() =>
              navigation.navigate(Routes.PHARMACY_DETAIL, { pharmacyId: p.id, medicineId })
            }
            pinColor={PIN_COLORS[p.stockStatus] ?? Colors.pinClosed}
            title={p.name}
          />
        ))}
      </MapView>

      <View style={[styles.floatingHeader, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={16} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.searchPill}>
            <Search size={16} color={Colors.primary} />
            <Text style={styles.searchPillText} numberOfLines={1}>{medicineName}</Text>
          </View>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate(Routes.RESULTS_LIST, { medicineId, medicineName })}>
            <List size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {searchQuery.isLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner text="Loading map..." />
        </View>
      )}

      <View style={[styles.legend, { top: insets.top + 88 }]}>
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
    backgroundColor: Colors.surface, ...StyleSheet.flatten({
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
    }),
  },
  headerContent: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 32, height: 32, backgroundColor: Colors.gray100,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
  },
  searchPill: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gray100, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg, paddingVertical: 10,
  },
  searchPillText: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  iconBtn: {
    width: 32, height: 32, backgroundColor: Colors.gray100,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
  },
  legend: {
    position: 'absolute', left: Spacing.lg,
    flexDirection: 'row', flexWrap: 'wrap', gap: 6,
  },
  legendChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surface, borderRadius: Radius.full,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.borderLight, elevation: 2,
  },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 9, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
});

export default ResultsMapScreen;
