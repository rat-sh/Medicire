/**
 * ReservationStatusScreen.tsx
 * Figma: "Reservation Status" — 4 states: pending / confirmed / ready / cancelled / completed
 *        Animated status icon with pharmacy card, timeline steps, action buttons
 * Mock: Shows state based on route.params.status, tab bar lets you cycle through all states
 * Real API: GET /reservations/:id with WebSocket for real-time updates
 * MOCK_MARKER: Replace mock status with real reservation WebSocket events
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ChevronLeft, Clock, CheckCircle, Package, XCircle, MapPin, Phone,
} from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { ReservationStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type ReservationStatus = 'pending' | 'confirmed' | 'ready' | 'cancelled' | 'completed';
type Nav = NativeStackNavigationProp<ReservationStackParamList>;
type RouteProps = RouteProp<ReservationStackParamList, typeof Routes.RSV_STATUS>;

const STATUS_CONFIG: Record<ReservationStatus, {
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
  title: string;
  sub: string;
  label: string;
  badgeBg: string;
  badgeBorder: string;
}> = {
  pending: {
    icon: Clock, color: Colors.warning, bg: Colors.warningLight,
    title: 'Awaiting pharmacy confirmation', label: 'Pending',
    sub: 'The pharmacy will confirm your reservation within 10–15 minutes.',
    badgeBg: Colors.warningLight, badgeBorder: Colors.warningBorder,
  },
  confirmed: {
    icon: CheckCircle, color: Colors.success, bg: Colors.successLight,
    title: 'Reservation confirmed!', label: 'Confirmed',
    sub: 'Your medicines are set aside. Head to the pharmacy within 2 hours.',
    badgeBg: Colors.successLight, badgeBorder: Colors.successBorder,
  },
  ready: {
    icon: Package, color: Colors.info, bg: Colors.infoLight,
    title: 'Medicines ready for pickup', label: 'Ready for Pickup',
    sub: 'Your order is packed at the counter. Show this confirmation on arrival.',
    badgeBg: Colors.infoLight, badgeBorder: Colors.infoBorder,
  },
  cancelled: {
    icon: XCircle, color: Colors.error, bg: Colors.errorLight,
    title: 'Reservation cancelled', label: 'Cancelled',
    sub: 'This reservation was cancelled. You can search again and place a new one.',
    badgeBg: Colors.errorLight, badgeBorder: Colors.errorBorder,
  },
  completed: {
    icon: CheckCircle, color: Colors.gray500, bg: Colors.gray100,
    title: 'Pickup completed!', label: 'Completed',
    sub: 'Thanks for using Medicire. We hope you feel better soon.',
    badgeBg: Colors.gray100, badgeBorder: Colors.gray200,
  },
};

const STEPS: { key: ReservationStatus; label: string }[] = [
  { key: 'pending', label: 'Requested' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'ready', label: 'Ready' },
  { key: 'completed', label: 'Collected' },
];

const stepIndex = (status: ReservationStatus) =>
  ['pending', 'confirmed', 'ready', 'completed'].indexOf(status);

const ReservationStatusScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const status = (route.params?.status ?? 'pending') as ReservationStatus;
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  const currentStep = stepIndex(status);

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservation Status</Text>
        <View style={styles.rightSpacer} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Status hero */}
        <View style={[styles.heroCard, { backgroundColor: cfg.bg }]}>
          <View style={[styles.heroIcon, { backgroundColor: cfg.bg }]}>
            <Icon size={32} color={cfg.color} />
          </View>
          <Text style={[styles.heroTitle, { color: cfg.color }]}>{cfg.title}</Text>
          <Text style={styles.heroSub}>{cfg.sub}</Text>
          <View style={[styles.heroBadge, { backgroundColor: cfg.badgeBg, borderColor: cfg.badgeBorder }]}>
            <Text style={[styles.heroBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        {/* Timeline (only for active statuses) */}
        {status !== 'cancelled' && (
          <View style={styles.timelineCard}>
            <View style={styles.timeline}>
              {STEPS.map((step, i) => (
                <React.Fragment key={step.key}>
                  <View style={styles.timelineItem}>
                    <View style={[
                      styles.timelineDot,
                      i <= currentStep ? styles.timelineDotActive : styles.timelineDotInactive,
                    ]}>
                      {i < currentStep && <CheckCircle size={12} color={Colors.textInverse} />}
                      {i === currentStep && <View style={styles.timelineDotCenter} />}
                    </View>
                    <Text style={[
                      styles.timelineLabel,
                      i <= currentStep ? { color: Colors.textPrimary, fontWeight: FontWeight.semibold } : { color: Colors.textMuted },
                    ]}>
                      {step.label}
                    </Text>
                  </View>
                  {i < STEPS.length - 1 && (
                    <View style={[styles.timelineLine, i < currentStep && styles.timelineLineActive]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        )}

        {/* Pharmacy info */}
        <View style={styles.pharmacyCard}>
          <Text style={styles.cardTitle}>Pickup Location</Text>
          <View style={styles.pharmacyRow}>
            <MapPin size={14} color={Colors.primary} />
            <View>
              <Text style={styles.pharmacyName}>Apollo Pharmacy, Salt Lake</Text>
              <Text style={styles.pharmacyAddr}>Sector V, Bidhannagar, Kolkata</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Phone size={14} color={Colors.textSecondary} />
            <Text style={styles.callBtnText}>+91 98765 43210</Text>
          </TouchableOpacity>
        </View>

        {/* Ref code */}
        <View style={styles.refCard}>
          <Text style={styles.refLabel}>Reservation ID</Text>
          <Text style={styles.refCode}>#RSV-2025-1847</Text>
        </View>

        {/* Action buttons */}
        {status === 'pending' && (
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Cancel Reservation</Text>
          </TouchableOpacity>
        )}
        {(status === 'confirmed' || status === 'ready') && (
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => navigation.navigate(Routes.RSV_TRACKER as any)}>
            <Text style={styles.trackBtnText}>Track Reservation</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  statusSpacer: { height: 44 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.gray100, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  rightSpacer: { width: 32 },
  headerTitle: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary, textAlign: 'center' },
  body: { flex: 1 },
  bodyContent: { padding: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  heroCard: { borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', gap: Spacing.md },
  heroIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, textAlign: 'center' },
  heroSub: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  heroBadge: { paddingHorizontal: Spacing.lg, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1 },
  heroBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  timelineCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.xl,
  },
  timeline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timelineItem: { alignItems: 'center', gap: 6 },
  timelineDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  timelineDotActive: { backgroundColor: Colors.primary },
  timelineDotInactive: { backgroundColor: Colors.gray100, borderWidth: 2, borderColor: Colors.gray200 },
  timelineDotCenter: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.textInverse },
  timelineLabel: { fontSize: 10 },
  timelineLine: { flex: 1, height: 2, backgroundColor: Colors.gray200, marginHorizontal: 2, marginBottom: 20 },
  timelineLineActive: { backgroundColor: Colors.primary },
  pharmacyCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.lg, gap: Spacing.md,
  },
  cardTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  pharmacyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  pharmacyName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  pharmacyAddr: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  callBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.gray50, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, paddingVertical: 8, paddingHorizontal: Spacing.md, alignSelf: 'flex-start',
  },
  callBtnText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  refCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.lg,
    alignItems: 'center',
  },
  refLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  refCode: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, fontVariant: ['tabular-nums'], marginTop: 4 },
  cancelBtn: {
    borderWidth: 1, borderColor: Colors.error, borderRadius: Radius.md,
    paddingVertical: 12, alignItems: 'center',
  },
  cancelBtnText: { color: Colors.error, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
  trackBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 12, alignItems: 'center',
  },
  trackBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});

export default ReservationStatusScreen;
