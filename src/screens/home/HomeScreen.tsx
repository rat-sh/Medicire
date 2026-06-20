/**
 * HomeScreen.tsx
 * Figma: "Home Screen" — teal header with greeting, search bar, location,
 *        quick-access chips, recent searches scroll, map preview, nearby pharmacies
 * Mock: Uses MOCK_PHARMACIES for nearby list, MOCK_RECENT_SEARCHES for chips
 * Real API: GET /pharmacies/nearby + GET /medicines/recent
 * MOCK_MARKER: Replace mock data with usePharmacies() and useMedicines() hooks
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bell, Search, MapPin, Package, Upload } from 'lucide-react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/constants/theme';
import { Routes } from '@/constants/routes';
import type { MainTabParamList } from '@/navigation/types';

// ── MOCK_MARKER: Replace with real data from usePharmacies() hook ──────────────
import { MOCK_PHARMACIES } from '@/services/api/mock/pharmacies';
import { MOCK_RECENT_SEARCHES } from '@/services/api/mock/medicines';
// ──────────────────────────────────────────────────────────────────────────────

type Nav = BottomTabNavigationProp<MainTabParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const quickActions = [
    { icon: MapPin, label: 'Nearby', bg: Colors.primaryLight, color: Colors.primary, tab: Routes.SEARCH_TAB },
    { icon: Package, label: 'My Orders', bg: '#eff6ff', color: '#2563eb', tab: Routes.RESERVATIONS_TAB },
    { icon: Upload, label: 'Prescription', bg: '#f5f3ff', color: '#7c3aed', tab: Routes.VAULT_TAB },
  ] as const;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Teal Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.username}>Arjun 👋</Text>
          </View>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => navigation.navigate(Routes.PROFILE_TAB)}>
            <Bell size={20} color={Colors.textInverse} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate(Routes.SEARCH_TAB)}>
          <Search size={16} color={Colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search medicines, brands...</Text>
        </TouchableOpacity>

        {/* Location */}
        <View style={styles.locationRow}>
          <MapPin size={12} color="rgba(255,255,255,0.7)" />
          <Text style={styles.locationText}>Salt Lake, Kolkata</Text>
          <TouchableOpacity>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Body */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Quick-access chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsContent}>
          {quickActions.map(({ icon: Icon, label, bg, color, tab }) => (
            <TouchableOpacity
              key={label}
              style={styles.quickChip}
              onPress={() => navigation.navigate(tab as any)}>
              <View style={[styles.chipIcon, { backgroundColor: bg }]}>
                <Icon size={16} color={color} />
              </View>
              <Text style={styles.chipLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent searches */}
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        {/* MOCK_MARKER: Replace with real recent searches from API */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentContent}>
          {MOCK_RECENT_SEARCHES.map(name => (
            <TouchableOpacity
              key={name}
              style={styles.recentChip}
              onPress={() => navigation.navigate(Routes.SEARCH_TAB as any)}>
              <Text style={styles.recentChipText}>{name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Map preview */}
        <View style={styles.mapSection}>
          <View style={styles.mapHeader}>
            <Text style={styles.sectionTitle}>Map Preview</Text>
            <TouchableOpacity onPress={() => navigation.navigate(Routes.SEARCH_TAB as any)}>
              <Text style={styles.seeAll}>Full map →</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.mapPreview} onPress={() => navigation.navigate(Routes.SEARCH_TAB as any)}>
            {/* Simple mock map background */}
            <View style={styles.mapBg}>
              <View style={styles.mapRoad1} />
              <View style={styles.mapRoad2} />
              <View style={styles.mapRoad3} />
              {/* User dot */}
              <View style={styles.userDotWrap}>
                <View style={styles.userDotPulse} />
                <View style={styles.userDot} />
              </View>
              <View style={[styles.mapPin, { top: '30%', left: '22%' }]}>
                <View style={[styles.pinDot, { backgroundColor: Colors.pinInStock }]} />
              </View>
              <View style={[styles.mapPin, { top: '25%', left: '60%' }]}>
                <View style={[styles.pinDot, { backgroundColor: Colors.pinLowStock }]} />
              </View>
              <View style={[styles.mapPin, { top: '55%', left: '72%' }]}>
                <View style={[styles.pinDot, { backgroundColor: Colors.pinInStock }]} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Nearby pharmacies */}
        <Text style={styles.sectionTitle}>Nearby Pharmacies</Text>
        {/* MOCK_MARKER: Replace with real nearby pharmacies from usePharmacies() */}
        <View style={styles.pharmacyList}>
          {MOCK_PHARMACIES.slice(0, 3).map(pharmacy => (
            <TouchableOpacity
              key={pharmacy.id}
              style={styles.pharmacyCard}
              onPress={() => navigation.navigate(Routes.SEARCH_TAB as any)}>
              <View style={styles.pharmacyCardTop}>
                <View style={styles.pharmacyInfo}>
                  <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
                  <View style={styles.pharmacyMeta}>
                    <MapPin size={12} color={Colors.textMuted} />
                    <Text style={styles.pharmacyDistance}>
                      {pharmacy.distanceMeters >= 1000
                        ? `${(pharmacy.distanceMeters / 1000).toFixed(1)} km`
                        : `${pharmacy.distanceMeters} m`}
                    </Text>
                    <View style={styles.dot} />
                    <Text style={[styles.pharmacyStatus, { color: pharmacy.isOpen ? Colors.success : Colors.error }]}>
                      {pharmacy.isOpen
                        ? pharmacy.closingTime ? `Closes ${pharmacy.closingTime}` : 'Open'
                        : 'Closed'}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.stockBadge,
                  pharmacy.stockStatus === 'in-stock' && styles.badgeGreen,
                  pharmacy.stockStatus === 'low-stock' && styles.badgeAmber,
                  pharmacy.stockStatus === 'out-of-stock' && styles.badgeRed,
                ]}>
                  <Text style={[
                    styles.stockBadgeText,
                    pharmacy.stockStatus === 'in-stock' && { color: Colors.success },
                    pharmacy.stockStatus === 'low-stock' && { color: Colors.warning },
                    pharmacy.stockStatus === 'out-of-stock' && { color: Colors.error },
                  ]}>
                    {pharmacy.stockStatus === 'in-stock' ? 'In stock'
                      : pharmacy.stockStatus === 'low-stock' ? 'Low stock'
                      : 'Out of stock'}
                  </Text>
                </View>
              </View>
              <View style={styles.pharmacyCardBottom}>
                {pharmacy.price
                  ? <Text style={styles.pharmacyPrice}>₹{pharmacy.price}</Text>
                  : <Text style={styles.priceUnavailable}>Price unavailable</Text>}
                <TouchableOpacity
                  style={[styles.reserveBtn, pharmacy.stockStatus === 'out-of-stock' && styles.reserveBtnDisabled]}
                  disabled={pharmacy.stockStatus === 'out-of-stock'}
                  onPress={() => navigation.navigate(Routes.RESERVATIONS_TAB as any)}>
                  <Text style={[styles.reserveBtnText, pharmacy.stockStatus === 'out-of-stock' && styles.reserveBtnTextDisabled]}>
                    Reserve
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: { backgroundColor: Colors.primary, paddingTop: 48, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  greeting: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  username: { color: Colors.textInverse, fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  bellBtn: { width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 2, right: 2, width: 8, height: 8, backgroundColor: '#f87171', borderRadius: 4, borderWidth: 1.5, borderColor: Colors.primary },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    ...Shadow.sm, marginBottom: Spacing.md,
  },
  searchPlaceholder: { color: Colors.textMuted, fontSize: FontSize.sm },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.xs, flex: 1 },
  changeText: { color: Colors.textInverse, fontSize: FontSize.xs, fontWeight: FontWeight.semibold, textDecorationLine: 'underline' },

  // Body
  body: { flex: 1 },
  bodyContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: 100 },

  // Quick chips
  chipsScroll: { marginBottom: Spacing.xl, marginHorizontal: -Spacing.xl },
  chipsContent: { paddingHorizontal: Spacing.xl, gap: Spacing.md },
  quickChip: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight, ...Shadow.sm,
    alignItems: 'center', gap: 8,
  },
  chipIcon: { width: 36, height: 36, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  chipLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary },

  // Section titles
  sectionTitle: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold,
    color: Colors.textSecondary, textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: Spacing.md,
  },

  // Recent chips
  recentContent: { gap: Spacing.sm, marginBottom: Spacing.xl },
  recentChip: {
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.borderLight,
    borderRadius: Radius.full, ...Shadow.sm,
  },
  recentChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.textSecondary },

  // Map preview
  mapSection: { marginBottom: Spacing.xl },
  mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  seeAll: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.semibold },
  mapPreview: { height: 160, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderLight, ...Shadow.sm },
  mapBg: { flex: 1, backgroundColor: '#e8efe4', position: 'relative' },
  mapRoad1: { position: 'absolute', top: '38%', left: 0, right: 0, height: 14, backgroundColor: 'rgba(255,255,255,0.8)' },
  mapRoad2: { position: 'absolute', top: '62%', left: 0, right: 0, height: 8, backgroundColor: 'rgba(255,255,255,0.6)' },
  mapRoad3: { position: 'absolute', left: '28%', top: 0, bottom: 0, width: 12, backgroundColor: 'rgba(255,255,255,0.7)' },
  userDotWrap: { position: 'absolute', top: '46%', left: '46%', alignItems: 'center', justifyContent: 'center' },
  userDotPulse: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: '#3b82f6', opacity: 0.3 },
  userDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#3b82f6', borderWidth: 2, borderColor: Colors.surface },
  mapPin: { position: 'absolute' as any, alignItems: 'center' },
  pinDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: Colors.surface },

  // Pharmacy cards
  pharmacyList: { gap: Spacing.md },
  pharmacyCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.lg, gap: Spacing.md,
  },
  pharmacyCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pharmacyInfo: { flex: 1 },
  pharmacyName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  pharmacyMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  pharmacyDistance: { fontSize: FontSize.xs, color: Colors.textSecondary },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.gray300 },
  pharmacyStatus: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  stockBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: Radius.full, borderWidth: 1,
  },
  badgeGreen: { backgroundColor: Colors.successLight, borderColor: Colors.successBorder },
  badgeAmber: { backgroundColor: Colors.warningLight, borderColor: Colors.warningBorder },
  badgeRed: { backgroundColor: Colors.errorLight, borderColor: Colors.errorBorder },
  stockBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  pharmacyCardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pharmacyPrice: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  priceUnavailable: { fontSize: FontSize.xs, color: Colors.textMuted },
  reserveBtn: {
    paddingHorizontal: Spacing.lg, paddingVertical: 6,
    borderRadius: Radius.md, backgroundColor: Colors.primary,
  },
  reserveBtnDisabled: { backgroundColor: Colors.gray100 },
  reserveBtnText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textInverse },
  reserveBtnTextDisabled: { color: Colors.textMuted },
});

export default HomeScreen;
