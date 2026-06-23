/**
 * PharmacyDetailScreen.tsx — Figma: "Pharmacy Detail"
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Star, Phone, Navigation, Package, Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SearchStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { usePharmacyDetail } from '@/hooks/usePharmacyDetail';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';

type Nav = NativeStackNavigationProp<SearchStackParamList>;
type RouteProps = RouteProp<SearchStackParamList, typeof Routes.PHARMACY_DETAIL>;

const HOURS = [
  ['Mon–Fri', '8:00 AM – 10:30 PM'],
  ['Saturday', '8:00 AM – 10:00 PM'],
  ['Sunday', '9:00 AM – 9:00 PM'],
];

const PharmacyDetailScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const { pharmacyId, medicineId } = route.params;
  const { data: pharmacy, isLoading, isError, refetch } = usePharmacyDetail(pharmacyId);

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading pharmacy..." />;
  }

  if (isError || !pharmacy) {
    return (
      <View style={[styles.root, styles.centered]}>
        <Text style={styles.errorTitle}>Pharmacy not found</Text>
        <Button title="Try again" onPress={() => refetch()} variant="outline" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{pharmacy.name}</Text>
        <View style={styles.rightSpacer} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={[styles.bodyContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
              <Text style={styles.pharmacyAddr}>{pharmacy.address}</Text>
              <View style={styles.statusRow}>
                <Badge
                  label={pharmacy.isOpen ? 'Open' : 'Closed'}
                  variant={pharmacy.isOpen ? 'green' : 'red'}
                />
                {pharmacy.closingTime && pharmacy.isOpen && (
                  <Text style={styles.closesText}>Closes {pharmacy.closingTime}</Text>
                )}
              </View>
            </View>
            <View style={styles.ratingBlock}>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4].map(i => (
                  <Star key={i} size={12} color="#f59e0b" fill="#f59e0b" />
                ))}
                <Star size={12} color={Colors.gray300} />
              </View>
              <Text style={styles.ratingText}>
                {pharmacy.rating.toFixed(1)} ({pharmacy.rating > 0 ? 'reviews' : 'no reviews'})
              </Text>
            </View>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => pharmacy.phone && Linking.openURL(`tel:${pharmacy.phone}`)}>
              <Phone size={14} color={Colors.textSecondary} />
              <Text style={styles.actionBtnText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate(Routes.FULL_MAP)}>
              <Navigation size={14} color={Colors.textSecondary} />
              <Text style={styles.actionBtnText}>Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Operating Hours</Text>
          {HOURS.map(([day, hrs]) => (
            <View key={day} style={styles.hoursRow}>
              <Text style={styles.hoursDay}>{day}</Text>
              <Text style={styles.hoursTime}>{hrs}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.medHeader}>
            <Text style={styles.sectionTitle}>Available Medicines</Text>
            <View style={styles.searchIconBox}>
              <Search size={12} color={Colors.textMuted} />
            </View>
          </View>
          <View style={styles.emptyMed}>
            <Package size={24} color={Colors.textMuted} />
            <Text style={styles.emptyMedText}>
              Medicine inventory loads from the server when available.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <Button
          title="Reserve Medicine"
          onPress={() =>
            navigation.navigate(Routes.RSV_CONFIRM, {
              pharmacyId: pharmacy.id,
              medicineId: medicineId ?? '',
            })
          }
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centered: { alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  errorTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: Spacing.lg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.gray100, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary, textAlign: 'center' },
  rightSpacer: { width: 32 },
  body: { flex: 1 },
  bodyContent: { padding: Spacing.lg, gap: Spacing.md },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.lg,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  infoLeft: { flex: 1, paddingRight: Spacing.md },
  pharmacyName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  pharmacyAddr: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4, lineHeight: 18 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm },
  closesText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  ratingBlock: { alignItems: 'flex-end' },
  starsRow: { flexDirection: 'row', gap: 2 },
  ratingText: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, backgroundColor: Colors.gray50,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border,
  },
  actionBtnText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  sectionTitle: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold,
    color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  hoursRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.gray50,
  },
  hoursDay: { fontSize: FontSize.xs, color: Colors.textSecondary },
  hoursTime: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  medHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  searchIconBox: { backgroundColor: Colors.gray50, borderRadius: Radius.sm, padding: 6 },
  emptyMed: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  emptyMedText: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg,
  },
});

export default PharmacyDetailScreen;
