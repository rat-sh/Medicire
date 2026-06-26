/**
 * FullMapScreen.tsx
 * Figma: "Full Screen Map" — full OSM map with floating search bar,
 *        legend chips, zoom controls, locate-me button
 * Mock: All MOCK_PHARMACIES shown as pins
 * Real API: GET /pharmacies/nearby
 * MOCK_MARKER: Replace MOCK_PHARMACIES with pharmaciesApi.getNearby()
 */
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Search, Plus, Minus, Navigation } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SearchStackParamList } from '@/navigation/types';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
// ── MOCK_MARKER ───────────────────────────────────────────────────────────────
import { MOCK_PHARMACIES } from '@/services/api/mock/pharmacies';
// ─────────────────────────────────────────────────────────────────────────────

type Nav = NativeStackNavigationProp<SearchStackParamList>;

const LEGEND = [
  { color: Colors.pinInStock, label: 'In stock' },
  { color: Colors.pinLowStock, label: 'Low' },
  { color: Colors.pinClosed, label: 'Closed' },
];

const PIN_COLORS: Record<string, string> = {
  'in-stock': Colors.pinInStock,
  'low-stock': Colors.pinLowStock,
  'out-of-stock': Colors.pinOutOfStock,
};

const FullMapScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.root}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{ latitude: 22.5726, longitude: 88.4298, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
        showsUserLocation
        showsMyLocationButton={false}>
        {MOCK_PHARMACIES.map(p => (
          <Marker
            key={p.id}
            coordinate={p.location}
            pinColor={PIN_COLORS[p.stockStatus] ?? Colors.pinClosed}
            title={p.name}
          />
        ))}
      </MapView>

      {/* Floating header — back + search */}
      <View style={styles.floatingHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={16} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchBar}>
            <Search size={14} color={Colors.textMuted} />
            <Text style={styles.searchText}>Search in this area</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {LEGEND.map(({ color, label }) => (
          <View key={label} style={styles.legendChip}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Zoom controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomBtn}>
          <Plus size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomBtn}>
          <Minus size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Locate me button */}
      <TouchableOpacity style={styles.locateBtn}>
        <Navigation size={16} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  map: { ...StyleSheet.absoluteFill },
  floatingHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingTop: 48, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg,
  },
  backBtn: {
    width: 32, height: 32, backgroundColor: Colors.surface,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
    elevation: 2,
  },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    elevation: 2,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  searchText: { fontSize: FontSize.sm, color: Colors.textMuted },
  legend: {
    position: 'absolute', top: 112, left: Spacing.md,
    flexDirection: 'column', gap: 8,
  },
  legendChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surface, borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.borderLight, elevation: 2,
  },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  zoomControls: {
    position: 'absolute', top: '40%', right: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    elevation: 3, overflow: 'hidden',
  },
  zoomBtn: {
    width: 32, height: 32, alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  locateBtn: {
    position: 'absolute', bottom: 40, right: Spacing.md,
    width: 36, height: 36, backgroundColor: Colors.surface,
    borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    elevation: 3,
  },
});

export default FullMapScreen;
