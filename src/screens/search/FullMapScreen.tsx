/**
 * FullMapScreen.tsx
 * Figma: "Full Screen Map" — full Mappls map with floating search bar,
 *        legend chips, zoom controls, locate-me button
 * Map provider: Mappls (MapMyIndia) via mappls-map-react-native
 */
import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Search, Plus, Minus, Navigation } from 'lucide-react-native';
import {
  MapView,
  Camera,
  PointAnnotation,
  UserLocation,
  type CameraRef,
} from 'mappls-map-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SearchStackParamList } from '@/navigation/types';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { useLocationStore } from '@/store/locationStore';
// ── MOCK_MARKER ───────────────────────────────────────────────────────────────
import { MOCK_PHARMACIES } from '@/services/api/mock/pharmacies';
// ─────────────────────────────────────────────────────────────────────────────

type Nav = NativeStackNavigationProp<SearchStackParamList>;

const LEGEND = [
  { color: Colors.pinInStock,  label: 'In stock' },
  { color: Colors.pinLowStock, label: 'Low' },
  { color: Colors.pinClosed,   label: 'Closed' },
];

const PIN_COLORS: Record<string, string> = {
  'in-stock':     Colors.pinInStock,
  'low-stock':    Colors.pinLowStock,
  'out-of-stock': Colors.pinOutOfStock,
};

const DEFAULT_ZOOM = 13;

const FullMapScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const cameraRef = useRef<CameraRef>(null);
  const { latitude, longitude } = useLocationStore();

  const centerLat = latitude ?? 22.5726;
  const centerLng = longitude ?? 88.4298;

  const handleZoomIn = () => {
    cameraRef.current?.zoomTo(DEFAULT_ZOOM + 1, 300);
  };

  const handleZoomOut = () => {
    cameraRef.current?.zoomTo(DEFAULT_ZOOM - 1, 300);
  };

  const handleLocateMe = () => {
    if (latitude && longitude) {
      cameraRef.current?.flyTo([longitude, latitude], 600);
    }
  };

  return (
    <View style={styles.root}>
      {/* ── Mappls MapView ─────────────────────────────────────────────── */}
      <MapView
        style={styles.map}
        logoEnabled={false}
        compassEnabled={false}
        attributionEnabled={false}
      >
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: [centerLng, centerLat],
            zoomLevel: DEFAULT_ZOOM,
          }}
        />

        <UserLocation visible />

        {MOCK_PHARMACIES.map(p => (
          <PointAnnotation
            key={p.id}
            id={p.id}
            coordinate={[p.location.longitude, p.location.latitude]}
            title={p.name}
          >
            <View style={styles.pinWrapper}>
              <View
                style={[
                  styles.pinDot,
                  { backgroundColor: PIN_COLORS[p.stockStatus] ?? Colors.pinClosed },
                ]}
              />
              <View
                style={[
                  styles.pinTip,
                  { borderTopColor: PIN_COLORS[p.stockStatus] ?? Colors.pinClosed },
                ]}
              />
            </View>
          </PointAnnotation>
        ))}
      </MapView>

      {/* ── Floating header — back + search ──────────────────────────────── */}
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

      {/* ── Legend ───────────────────────────────────────────────────────── */}
      <View style={styles.legend}>
        {LEGEND.map(({ color, label }) => (
          <View key={label} style={styles.legendChip}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* ── Zoom controls ─────────────────────────────────────────────────── */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomIn}>
          <Plus size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomOut}>
          <Minus size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* ── Locate-me button ──────────────────────────────────────────────── */}
      <TouchableOpacity style={styles.locateBtn} onPress={handleLocateMe}>
        <Navigation size={16} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  map:  { ...StyleSheet.absoluteFill },

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
    elevation: 2, borderWidth: 1, borderColor: Colors.borderLight,
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

  // Custom pin marker
  pinWrapper: { alignItems: 'center' },
  pinDot: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 3, elevation: 4,
  },
  pinTip: {
    width: 0, height: 0,
    borderLeftWidth: 4, borderRightWidth: 4, borderTopWidth: 6,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    marginTop: -1,
  },
});

export default FullMapScreen;
