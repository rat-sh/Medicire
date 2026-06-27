/**
 * HomeScreen.tsx — Figma: "Home Screen"
 */
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/constants/theme';
import { Routes } from '@/constants/routes';
import type { MainTabParamList, ProfileStackParamList, SearchStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useLocation } from '@/hooks/useLocation';
import { useNearbyPharmacies } from '@/hooks/usePharmacies';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { MapPreview } from '@/components/map/MapPreview';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getFirstName, getTimeGreeting } from '@/utils/greeting';

import { QUICK_ACTIONS } from './constants';
import { HomeHeader } from './components/HomeHeader';
import { NearbyPharmaciesSection } from './components/NearbyPharmaciesSection';

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

      <HomeHeader
        greeting={greeting}
        firstName={firstName}
        city={city ?? ''}
        insetsTop={insets.top}
        onSearch={() => navigateSearch()}
        onNotifications={() => navigation.navigate(Routes.PROFILE_TAB, { screen: Routes.NOTIFICATIONS })}
        onChangeLocation={requestLocation}
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Quick Actions Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}>
          {QUICK_ACTIONS.map(({ icon: Icon, label, bg, color, tab }) => (
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

        {/* Recent Searches */}
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

        {/* Map Preview */}
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

        {/* Nearby Pharmacies */}
        <Text style={styles.sectionTitle}>Nearby Pharmacies</Text>
        <NearbyPharmaciesSection
          hasPermission={hasPermission}
          latitude={latitude}
          longitude={longitude}
          isLoading={pharmaciesQuery.isLoading}
          isError={pharmaciesQuery.isError}
          pharmacies={pharmacies}
          onRefetch={() => pharmaciesQuery.refetch()}
          onSearch={() => navigateSearch()}
          onEnableLocation={requestLocation}
          onPharmacyPress={pharmacyId => 
            navigation.navigate(Routes.SEARCH_TAB, {
              screen: Routes.PHARMACY_DETAIL,
              params: { pharmacyId },
            })
          }
          onReserve={pharmacyId => 
            navigation.navigate(Routes.RESERVATIONS_TAB, {
              screen: Routes.RSV_CONFIRM,
              params: { pharmacyId, medicineId: '' },
            })
          }
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
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
});

export default HomeScreen;
