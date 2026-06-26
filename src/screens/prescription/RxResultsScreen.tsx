/**
 * RxResultsScreen.tsx — Figma: "Prescription Results"
 * Summary card with best match, detailed availability list, and actions.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, MapPin, Package, AlertTriangle, Building2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { VaultStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/constants/theme';
import LinearGradient from 'react-native-linear-gradient';

type Nav = NativeStackNavigationProp<VaultStackParamList>;
type RouteProps = RouteProp<VaultStackParamList, typeof Routes.RX_RESULTS>;

const AVAILABILITY = [
  { id: '1', name: "Metformin 500mg", status: "in-stock", pharmacies: 4 },
  { id: '2', name: "Atorvastatin 10mg", status: "in-stock", pharmacies: 3 },
  { id: '3', name: "Amlodipine 5mg", status: "in-stock", pharmacies: 5 },
  { id: '4', name: "Pantoprazole 40mg", status: "low-stock", pharmacies: 2 },
  { id: '5', name: "Metoprolol 25mg", status: "in-stock", pharmacies: 3 },
  { id: '6', name: "Vitamin D3 60K", status: "out-of-stock", pharmacies: 0 },
];

const RxResultsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const { prescriptionId } = route.params;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Prescription Results</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Best Match Card */}
        <LinearGradient
          colors={[Colors.primary, '#0d9e8f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.matchCard}>
          <View style={styles.matchTop}>
            <View style={styles.matchInfo}>
              <Text style={styles.matchLabel}>Best match</Text>
              <Text style={styles.pharmacyName}>Apollo Pharmacy, Salt Lake</Text>
              <View style={styles.locRow}>
                <MapPin size={10} color="rgba(255,255,255,0.7)" />
                <Text style={styles.locText}>1.2 km away</Text>
              </View>
            </View>
            <View style={styles.matchCount}>
              <Text style={styles.countText}>5/6</Text>
              <Text style={styles.countLabel}>medicines</Text>
            </View>
          </View>
          <View style={styles.matchActions}>
            <TouchableOpacity
              style={styles.reserveAllBtn}
              onPress={() => navigation.navigate(Routes.RSV_CONFIRM as any, { pharmacyId: 'apollo-1', medicineId: 'multi' })}>
              <Package size={14} color={Colors.primary} />
              <Text style={styles.reserveAllText}>Reserve All Here</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.compareBtn}
              onPress={() => navigation.navigate(Routes.RX_COMPARE, { prescriptionId })}>
              <Text style={styles.compareBtnText}>Compare</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <Text style={styles.sectionLabel}>Medicine Availability</Text>

        {AVAILABILITY.map(item => (
          <View key={item.id} style={styles.availItem}>
            <View style={[
              styles.statusDot,
              { backgroundColor: item.status === 'in-stock' ? Colors.success : item.status === 'low-stock' ? Colors.warning : Colors.error }
            ]} />
            <View style={styles.availInfo}>
              <Text style={styles.medName}>{item.name}</Text>
              <Text style={styles.pharmacyCount}>
                {item.pharmacies > 0 ? `Available at ${item.pharmacies} pharmacies nearby` : "Not available nearby"}
              </Text>
            </View>
            <View style={[
              styles.badge,
              { backgroundColor: item.status === 'in-stock' ? Colors.successLight : item.status === 'low-stock' ? Colors.warningLight : Colors.errorLight },
              { borderColor: item.status === 'in-stock' ? Colors.successBorder : item.status === 'low-stock' ? Colors.warningBorder : Colors.errorBorder }
            ]}>
              <Text style={[
                styles.badgeText,
                { color: item.status === 'in-stock' ? Colors.success : item.status === 'low-stock' ? Colors.warning : Colors.error }
              ]}>
                {item.status === 'in-stock' ? 'In stock' : item.status === 'low-stock' ? 'Low' : 'Unavailable'}
              </Text>
            </View>
          </View>
        ))}

        {/* Warning for out of stock */}
        <View style={styles.warningBox}>
          <AlertTriangle size={16} color={Colors.warning} />
          <Text style={styles.warningText}>
            Vitamin D3 60K is not found nearby. Try searching online pharmacies or ask your doctor for an alternative.
          </Text>
        </View>
      </ScrollView>

      {/* Reused BottomNav is usually handled by the TabNavigator, but for screens with bottom content we often add space or absolute nav */}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.gray100, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  body: { flex: 1 },
  bodyContent: { padding: Spacing.lg, paddingBottom: 100 },
  matchCard: {
    borderRadius: Radius.xxl, padding: Spacing.lg, marginBottom: Spacing.xl,
    ...Shadow.md,
  },
  matchTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
  matchInfo: { flex: 1 },
  matchLabel: { fontSize: 10, fontWeight: FontWeight.medium, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' },
  pharmacyName: { fontSize: 16, fontWeight: FontWeight.bold, color: Colors.textInverse, marginTop: 2 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locText: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  matchCount: { alignItems: 'flex-end' },
  countText: { fontSize: 28, fontWeight: FontWeight.bold, color: Colors.textInverse, lineHeight: 32 },
  countLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  matchActions: { flexDirection: 'row', gap: Spacing.sm, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: Spacing.md },
  reserveAllBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.surface, paddingVertical: 10, borderRadius: Radius.xl,
  },
  reserveAllText: { fontSize: 12, fontWeight: FontWeight.bold, color: Colors.primary },
  compareBtn: {
    paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  compareBtnText: { fontSize: 12, fontWeight: FontWeight.semibold, color: Colors.textInverse },
  sectionLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textMuted, textTransform: 'uppercase', marginBottom: Spacing.md, letterSpacing: 0.5 },
  availItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight, marginBottom: Spacing.sm,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  availInfo: { flex: 1 },
  medName: { fontSize: 14, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  pharmacyCount: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: FontWeight.bold },
  warningBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.warningLight + '30', padding: Spacing.md, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.warningBorder + '40', marginTop: Spacing.sm,
  },
  warningText: { flex: 1, fontSize: 12, color: Colors.warning, lineHeight: 18, fontWeight: FontWeight.medium },
});

export default RxResultsScreen;
