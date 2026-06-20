/**
 * PharmacyDetailScreen.tsx
 * Figma: "Pharmacy Detail" — pharmacy info card (name, address, hours, rating),
 *        operating hours table, available medicines list, Reserve CTA
 * Mock: MOCK_PHARMACIES with hardcoded medicine list
 * Real API: GET /pharmacies/:id?medicineId=
 * MOCK_MARKER: Replace mock data with pharmaciesApi.getById(pharmacyId)
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Star, Phone, Navigation, Package, Search } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SearchStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
// ── MOCK_MARKER ───────────────────────────────────────────────────────────────
import { MOCK_PHARMACIES } from '@/services/api/mock/pharmacies';
// ─────────────────────────────────────────────────────────────────────────────

type Nav = NativeStackNavigationProp<SearchStackParamList>;
type RouteProps = RouteProp<SearchStackParamList, typeof Routes.PHARMACY_DETAIL>;

// Hardcoded medicine list — MOCK_MARKER: replace with real pharmacy medicines API
const MOCK_MEDICINES_IN_PHARMACY = [
  { name: 'Paracetamol 500mg', brand: 'Crocin', price: '48', status: 'in-stock' as const },
  { name: 'Paracetamol 650mg', brand: 'Dolo 650', price: '54', status: 'in-stock' as const },
  { name: 'Metformin 500mg', brand: 'Glycomet', price: '38', status: 'low-stock' as const },
  { name: 'Atorvastatin 10mg', brand: 'Atorva', price: '72', status: 'in-stock' as const },
  { name: 'Pantoprazole 40mg', brand: 'Pan-40', price: '28', status: 'out-of-stock' as const },
];

const HOURS = [
  ['Mon–Fri', '8:00 AM – 10:30 PM'],
  ['Saturday', '8:00 AM – 10:00 PM'],
  ['Sunday', '9:00 AM – 9:00 PM'],
];

const statusConfig = {
  'in-stock': { label: 'In stock', textColor: Colors.success, bg: Colors.successLight, border: Colors.successBorder },
  'low-stock': { label: 'Low stock', textColor: Colors.warning, bg: Colors.warningLight, border: Colors.warningBorder },
  'out-of-stock': { label: 'Out of stock', textColor: Colors.error, bg: Colors.errorLight, border: Colors.errorBorder },
};

const PharmacyDetailScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { pharmacyId, medicineId } = route.params;

  // MOCK_MARKER: Replace with useQuery(() => pharmaciesApi.getById(pharmacyId))
  const pharmacy = MOCK_PHARMACIES.find(p => p.id === pharmacyId) ?? MOCK_PHARMACIES[0];

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{pharmacy.name}</Text>
        <View style={styles.rightSpacer} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Pharmacy info card */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
              <Text style={styles.pharmacyAddr}>{pharmacy.address}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.openBadge, { backgroundColor: pharmacy.isOpen ? Colors.successLight : Colors.errorLight, borderColor: pharmacy.isOpen ? Colors.successBorder : Colors.errorBorder }]}>
                  <Text style={[styles.openBadgeText, { color: pharmacy.isOpen ? Colors.success : Colors.error }]}>
                    {pharmacy.isOpen ? 'Open' : 'Closed'}
                  </Text>
                </View>
                {pharmacy.isOpen && pharmacy.closingTime && (
                  <Text style={styles.closingText}>Closes {pharmacy.closingTime}</Text>
                )}
              </View>
            </View>
            <View style={styles.ratingBlock}>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4].map(i => <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />)}
                <Star size={12} color={Colors.gray300} />
              </View>
              <Text style={styles.ratingText}>{pharmacy.rating.toFixed(1)} rating</Text>
            </View>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => Linking.openURL(`tel:${pharmacy.phone}`)}>
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

        {/* Operating Hours */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Operating Hours</Text>
          {HOURS.map(([day, hrs]) => (
            <View key={day} style={styles.hoursRow}>
              <Text style={styles.hoursDay}>{day}</Text>
              <Text style={styles.hoursTime}>{hrs}</Text>
            </View>
          ))}
        </View>

        {/* Available Medicines */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>Available Medicines</Text>
            <View style={styles.searchMini}>
              <Search size={12} color={Colors.textMuted} />
            </View>
          </View>
          {MOCK_MEDICINES_IN_PHARMACY.map(({ name, brand, price, status }) => {
            const cfg = statusConfig[status];
            return (
              <View key={name} style={styles.medRow}>
                <View style={styles.medIcon}>
                  <Package size={16} color={Colors.primary} />
                </View>
                <View style={styles.medInfo}>
                  <Text style={styles.medName}>{name}</Text>
                  <Text style={styles.medBrand}>{brand}</Text>
                </View>
                <View style={styles.medRight}>
                  <Text style={styles.medPrice}>₹{price}</Text>
                  <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                    <Text style={[styles.badgeText, { color: cfg.textColor }]}>{cfg.label}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Reserve CTA */}
      <View style={styles.cta}>
        <TouchableOpacity
          style={styles.reserveBtn}
          onPress={() => navigation.navigate(Routes.RSV_CONFIRM, {
            pharmacyId: pharmacy.id,
            medicineId: medicineId ?? 'med_001',
          })}>
          <Text style={styles.reserveBtnText}>Reserve Medicine</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, paddingTop: 48,
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.gray100, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  rightSpacer: { width: 32 },
  headerTitle: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  body: { flex: 1 },
  bodyContent: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.lg,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  infoLeft: { flex: 1 },
  pharmacyName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  pharmacyAddr: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 8 },
  openBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, borderWidth: 1 },
  openBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  closingText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  ratingBlock: { alignItems: 'flex-end', gap: 4 },
  starsRow: { flexDirection: 'row', gap: 1 },
  ratingText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  actionRow: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, backgroundColor: Colors.gray50,
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
  },
  actionBtnText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  cardTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: Spacing.md },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  searchMini: { width: 28, height: 28, backgroundColor: Colors.gray50, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  hoursDay: { fontSize: FontSize.xs, color: Colors.textSecondary },
  hoursTime: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  medRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  medIcon: { width: 32, height: 32, backgroundColor: Colors.primaryLight, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center' },
  medInfo: { flex: 1 },
  medName: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  medBrand: { fontSize: 10, color: Colors.textSecondary },
  medRight: { alignItems: 'flex-end', gap: 4 },
  medPrice: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: FontWeight.semibold },
  cta: {
    backgroundColor: Colors.surface, borderTopWidth: 1,
    borderTopColor: Colors.borderLight, padding: Spacing.xl, paddingBottom: 32,
  },
  reserveBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center' },
  reserveBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});

export default PharmacyDetailScreen;
