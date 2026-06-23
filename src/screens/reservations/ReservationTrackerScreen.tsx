/**
 * ReservationTrackerScreen.tsx — Figma: "Reservation Tracker"
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, Package, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReservationStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { useReservations } from '@/hooks/useReservations';
import { ApiStateView } from '@/components/ui/ApiStateView';
import { formatDate } from '@/utils/formatters';
import type { Reservation, ReservationStatus } from '@/types/reservation';

type Nav = NativeStackNavigationProp<ReservationStackParamList>;

const BADGE_CFG: Record<ReservationStatus, { label: string; bg: string; border: string; text: string }> = {
  pending: { label: 'Pending', bg: Colors.warningLight, border: Colors.warningBorder, text: Colors.warning },
  confirmed: { label: 'Confirmed', bg: Colors.successLight, border: Colors.successBorder, text: Colors.success },
  ready: { label: 'Ready', bg: Colors.infoLight, border: Colors.infoBorder, text: Colors.info },
  cancelled: { label: 'Cancelled', bg: Colors.errorLight, border: Colors.errorBorder, text: Colors.error },
  completed: { label: 'Completed', bg: Colors.gray100, border: Colors.gray200, text: Colors.gray500 },
};

const ReservationTrackerScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const reservationsQuery = useReservations();
  const reservations = reservationsQuery.data ?? [];

  const renderItem = ({ item }: { item: Reservation }) => {
    const badge = BADGE_CFG[item.status];
    const totalPrice = item.pricePerUnit * item.quantity;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate(Routes.RSV_STATUS, {
          reservationId: item.id,
          status: item.status,
        })}>
        <View style={styles.iconBox}>
          <Package size={18} color={Colors.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.medName}>{item.medicineName}</Text>
          <View style={styles.metaRow}>
            <MapPin size={10} color={Colors.textMuted} />
            <Text style={styles.metaText} numberOfLines={1}>{item.pharmacyName}</Text>
          </View>
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.cardRight}>
          <View style={[styles.badge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
          </View>
          <Text style={styles.priceText}>₹{totalPrice}</Text>
          <ChevronRight size={14} color={Colors.textMuted} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.heading}>My Orders</Text>
        <Text style={styles.sub}>
          {reservationsQuery.isLoading ? 'Loading...' : `${reservations.length} reservations`}
        </Text>
      </View>

      <ApiStateView
        isLoading={reservationsQuery.isLoading}
        isError={reservationsQuery.isError}
        isEmpty={!reservationsQuery.isLoading && reservations.length === 0}
        loadingText="Loading your orders..."
        errorMessage="Could not load reservations."
        emptyIcon={Package}
        emptyTitle="No orders yet"
        emptySubtitle="Reserve medicine from search results to see orders here."
        onRetry={() => reservationsQuery.refetch()}>
        <FlatList
          data={reservations}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
        />
      </ApiStateView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  heading: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  list: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 100 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.lg,
  },
  iconBox: {
    width: 40, height: 40, backgroundColor: Colors.primaryLight,
    borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  medName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  metaText: { fontSize: FontSize.xs, color: Colors.textSecondary, flex: 1 },
  dateText: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  cardRight: { alignItems: 'flex-end', gap: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: FontWeight.semibold },
  priceText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textPrimary },
});

export default ReservationTrackerScreen;
