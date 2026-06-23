/**
 * HomeScreen.tsx — Figma: "Home Screen"
 */
import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Bell, Search, MapPin, Package, Upload, Building2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/constants/theme';
import { Routes } from '@/constants/routes';
import type { MainTabParamList, ProfileStackParamList, SearchStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useLocation } from '@/hooks/useLocation';
import { useNearbyPharmacies } from '@/hooks/usePharmacies';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { PharmacyCard } from '@/components/pharmacy/PharmacyCard';
import { MapPreview } from '@/components/map/MapPreview';
import { ApiStateView } from '@/components/ui/ApiStateView';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatDistance } from '@/utils/formatters';
import { getFirstName, getTimeGreeting } from '@/utils/greeting';

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, typeof Routes.HOME_TAB>,
  CompositeNavigationProp<
    NativeStackNavigationProp<SearchStackParamList>,
    NativeStackNavigationProp<ProfileStackParamList>
  >
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNav>();
  const insets = useSafeAreaInsets();
  const user = useAuthStore(s => s.user);
  const { city, hasPermission, latitude, longitude, hydrateLocation, requestLocation } = useLocation();
  const pharmaciesQuery = useNearbyPharmacies();
  const recentQuery = useRecentSearches();

  useEffect(() => {
    hydrateLocation();
  }, [hydrateLocation]);

  const quickActions = [
    { icon: MapPin, label: 'Nearby', bg: Colors.primaryLight, color: Colors.primary, tab: Routes.SEARCH_TAB },
    { icon: Package, label: 'My Orders', bg: Colors.infoLight, color: Colors.info, tab: Routes.RESERVATIONS_TAB },
    { icon: Upload, label: 'Prescription', bg: '#f5f3ff', color: '#7c3aed', tab: Routes.VAULT_TAB },
  ] as const;

  const greeting = getTimeGreeting();
  const firstName = getFirstName(user?.name);
  const pharmacies = pharmaciesQuery.data ?? [];
  const recentSearches = recentQuery.data ?? [];

  const navigateSearch = (screen?: typeof Routes.FULL_MAP) => {
    if (!screen) {
      navigation.navigate(Routes.SEARCH_TAB);
      return;
    }
    navigation.navigate(Routes.SEARCH_TAB, { screen });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.username} numberOfLines={1}>
              {firstName} 👋
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() =>
              navigation.navigate(Routes.PROFILE_TAB, { screen: Routes.NOTIFICATIONS })
            }>
            <Bell size={20} color={Colors.textInverse} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.searchBar} onPress={() => navigateSearch()}>
          <Search size={16} color={Colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search medicines, brands...</Text>
        </TouchableOpacity>

        <View style={styles.locationRow}>
          <MapPin size={12} color="rgba(255,255,255,0.7)" />
          <Text style={styles.locationText} numberOfLines={1}>
            {city}
          </Text>
          <TouchableOpacity onPress={requestLocation}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}>
          {quickActions.map(({ icon: Icon, label, bg, color, tab }) => (
            <TouchableOpacity
              key={label}
              style={styles.quickChip}
              onPress={() => {
                if (tab === Routes.RESERVATIONS_TAB) {
                  navigation.navigate(Routes.RESERVATIONS_TAB);
                } else if (tab === Routes.VAULT_TAB) {
                  navigation.navigate(Routes.VAULT_TAB, { screen: Routes.RX_UPLOAD });
                } else {
                  navigateSearch();
                }
              }}>
              <View style={[styles.chipIcon, { backgroundColor: bg }]}>
                <Icon size={16} color={color} />
              </View>
              <Text style={styles.chipLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Recent Searches</Text>
        {recentQuery.isLoading ? (
          <LoadingSpinner text="Loading recent searches..." />
        ) : recentSearches.length === 0 ? (
          <Text style={styles.emptyHint}>Your recent medicine searches will appear here.</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentContent}>
            {recentSearches.map(name => (
              <TouchableOpacity
                key={name}
                style={styles.recentChip}
                onPress={() => navigateSearch()}>
                <Text style={styles.recentChipText}>{name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.mapSection}>
          <View style={styles.mapHeader}>
            <Text style={styles.sectionTitle}>Map Preview</Text>
            <TouchableOpacity onPress={() => navigateSearch(Routes.FULL_MAP)}>
              <Text style={styles.seeAll}>Full map →</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.mapPreview}
            onPress={() => navigateSearch(Routes.FULL_MAP)}>
            <MapPreview />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Nearby Pharmacies</Text>
        {!hasPermission || latitude == null || longitude == null ? (
          <ApiStateView
            isLoading={false}
            isError={false}
            isEmpty
            emptyIcon={MapPin}
            emptyTitle="Location needed"
            emptySubtitle="Allow location access to see pharmacies near you."
            emptyAction="Enable location"
            onEmptyAction={requestLocation}
          />
        ) : (
          <ApiStateView
            isLoading={pharmaciesQuery.isLoading}
            isError={pharmaciesQuery.isError}
            isEmpty={!pharmaciesQuery.isLoading && pharmacies.length === 0}
            loadingText="Finding nearby pharmacies..."
            errorMessage="Could not load pharmacies. Check your connection."
            emptyIcon={Building2}
            emptyTitle="No pharmacies nearby"
            emptySubtitle="Try changing your location or check back later."
            onRetry={() => pharmaciesQuery.refetch()}
            onEmptyAction={() => navigateSearch()}>
            <View style={styles.pharmacyList}>
              {pharmacies.slice(0, 5).map(pharmacy => (
                <PharmacyCard
                  key={pharmacy.id}
                  name={pharmacy.name}
                  distance={formatDistance(pharmacy.distanceMeters)}
                  status={pharmacy.stockStatus}
                  price={pharmacy.price?.toString()}
                  open={pharmacy.isOpen}
                  closingTime={pharmacy.closingTime}
                  onClick={() =>
                    navigation.navigate(Routes.SEARCH_TAB, {
                      screen: Routes.PHARMACY_DETAIL,
                      params: { pharmacyId: pharmacy.id },
                    })
                  }
                  onReserve={() =>
                    navigation.navigate(Routes.RESERVATIONS_TAB, {
                      screen: Routes.RSV_CONFIRM,
                      params: { pharmacyId: pharmacy.id, medicineId: '' },
                    })
                  }
                />
              ))}
            </View>
          </ApiStateView>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  headerTextWrap: { flex: 1, paddingRight: Spacing.md },
  greeting: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  username: { color: Colors.textInverse, fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  bellBtn: {
    width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18, alignItems: 'center', justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute', top: 2, right: 2, width: 8, height: 8,
    backgroundColor: '#f87171', borderRadius: 4, borderWidth: 1.5, borderColor: Colors.primary,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    ...Shadow.sm, marginBottom: Spacing.md,
  },
  searchPlaceholder: { color: Colors.textMuted, fontSize: FontSize.sm, flex: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.xs, flex: 1 },
  changeText: {
    color: Colors.textInverse, fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold, textDecorationLine: 'underline',
  },
  body: { flex: 1 },
  bodyContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: 100 },
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
  sectionTitle: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold,
    color: Colors.textSecondary, textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: Spacing.md,
  },
  emptyHint: {
    fontSize: FontSize.sm, color: Colors.textMuted,
    marginBottom: Spacing.xl, lineHeight: 20,
  },
  recentContent: { gap: Spacing.sm, marginBottom: Spacing.xl },
  recentChip: {
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.borderLight,
    borderRadius: Radius.full, ...Shadow.sm,
  },
  recentChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  mapSection: { marginBottom: Spacing.xl },
  mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  seeAll: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.semibold },
  mapPreview: {
    height: 160, borderRadius: Radius.xl, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.borderLight, ...Shadow.sm,
  },
  pharmacyList: { gap: Spacing.md },
});

export default HomeScreen;
