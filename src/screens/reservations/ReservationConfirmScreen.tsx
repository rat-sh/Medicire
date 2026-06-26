/**
 * ReservationConfirmScreen.tsx
 * Orchestrates the order confirmation flow.
 * This file owns only:
 *   - Local UI state (qty, selectedWindow, deliveryMode, isSubmitting)
 *   - Mock submission logic
 *   - Navigation handler
 *   - Screen frame (header, scroll, footer CTA)
 *   - Medicine info section (tightly coupled with local qty state)
 *   - Pharmacy section (renders PharmacyContactCard)
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Package, Minus, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReservationStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Config } from '@/constants/config';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/constants/theme';
import { PICKUP_WINDOWS, HOME_DELIVERY_FARE } from '@/constants/reservation';
import { MOCK_PHARMACIES } from '@/services/api/mock/pharmacies';
import type { DeliveryMode } from '@/types/reservation';
import {
  PharmacyContactCard,
  DeliveryModeSelector,
  PickupWindowSelector,
  BillSummary,
  ParcelInfoCard,
} from '@/components/reservation';
import { guardPharmacyId } from '@/utils/navParamGuards';

type Nav        = NativeStackNavigationProp<ReservationStackParamList>;
type RouteProps = RouteProp<ReservationStackParamList, typeof Routes.RSV_CONFIRM>;

// ─── Screen ───────────────────────────────────────────────────────────────────
const ReservationConfirmScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<RouteProps>();
  const insets     = useSafeAreaInsets();
  const { pharmacyId: rawPharmacyId } = route.params;

  // ── State ──────────────────────────────────────────────────────────────────
  const [qty,            setQty]            = useState(1);
  const [selectedWindow, setSelectedWindow] = useState(0);
  const [deliveryMode,   setDeliveryMode]   = useState<DeliveryMode>('pickup');
  const [isSubmitting,   setIsSubmitting]   = useState(false);

  // ── Derived data ───────────────────────────────────────────────────────────
  // Guard: deep-link params are untrusted — validate before use
  const pharmacyId = guardPharmacyId(rawPharmacyId) ?? MOCK_PHARMACIES[0].id;
  const pharmacy    = MOCK_PHARMACIES.find(p => p.id === pharmacyId) ?? MOCK_PHARMACIES[0];
  const pricePerUnit = pharmacy.price ?? 48;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (Config.USE_MOCK) {
        navigation.navigate(Routes.RSV_STATUS, {
          reservationId: 'rsv_mock_001',
          status: 'pending',
        });
      }
    }, 900);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const fare  = deliveryMode === 'delivery' ? HOME_DELIVERY_FARE : 0;
  const total = pricePerUnit * qty + fare;

  return (
    <View style={styles.root}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Confirm Order</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={[styles.bodyContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}>

        {/* ── Medicine info + quantity stepper ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Medicine</Text>
          <View style={styles.infoRow}>
            <View style={styles.iconBoxTeal}>
              <Package size={20} color={Colors.primary} />
            </View>
            <View style={styles.details}>
              <Text style={styles.mainText}>Metformin 500mg</Text>
              <Text style={styles.subText}>Glycomet · ₹{pricePerUnit} per strip</Text>
            </View>
          </View>
          <View style={styles.stepperRow}>
            <Text style={styles.stepperLabel}>Quantity (strips)</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setQty(q => Math.max(1, q - 1))}>
                <Minus size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity
                style={[styles.stepBtn, styles.stepBtnPrimary]}
                onPress={() => setQty(q => Math.min(20, q + 1))}>
                <Plus size={16} color={Colors.textInverse} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Pharmacy info + contact actions ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Pharmacy</Text>
          <PharmacyContactCard
            name={pharmacy.name}
            address={pharmacy.address}
            phone={pharmacy.phone}
            lat={pharmacy.location?.latitude}
            lng={pharmacy.location?.longitude}
            isDelivery={deliveryMode === 'delivery'}
            isOpen={pharmacy.isOpen}
            closingTime={pharmacy.closingTime}
          />
        </View>

        {/* ── Delivery mode toggle ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Delivery Option</Text>
          <DeliveryModeSelector
            value={deliveryMode}
            onChange={setDeliveryMode}
            fare={HOME_DELIVERY_FARE}
          />
        </View>

        {/* ── Pickup window (pickup mode only) ── */}
        {deliveryMode === 'pickup' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Pickup Window</Text>
            <PickupWindowSelector
              windows={PICKUP_WINDOWS}
              selectedIndex={selectedWindow}
              onChange={setSelectedWindow}
            />
          </View>
        )}

        {/* ── Bill breakdown ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Bill Details</Text>
          <BillSummary
            qty={qty}
            pricePerUnit={pricePerUnit}
            deliveryMode={deliveryMode}
          />
        </View>

        {/* ── Parcel packaging info ── */}
        <View style={[styles.section, styles.parcelCard]}>
          <ParcelInfoCard />
        </View>
      </ScrollView>

      {/* ── Footer CTA ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>Total Payable</Text>
          <Text style={styles.footerTotalValue}>₹{total}</Text>
        </View>
        <TouchableOpacity
          style={[styles.primaryBtn, isSubmitting && styles.primaryBtnDisabled]}
          onPress={handleConfirm}
          disabled={isSubmitting}>
          <Text style={styles.primaryBtnText}>
            {isSubmitting
              ? 'Placing Order…'
              : deliveryMode === 'pickup'
                ? '✓ Reserve for Pickup'
                : '✓ Place Delivery Order'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: 32, height: 32, backgroundColor: Colors.gray100,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
  },
  headerSpacer: { width: 32 },
  title: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },

  body: { flex: 1 },
  bodyContent: { padding: Spacing.lg, gap: Spacing.md },

  section: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.borderLight, ...Shadow.sm,
  },
  sectionLabel: {
    fontSize: 10, fontWeight: FontWeight.bold, color: Colors.textMuted,
    textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.8,
  },

  // Medicine section
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  iconBoxTeal: {
    width: 44, height: 44, borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  details: { flex: 1 },
  mainText: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  subText:  { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },

  stepperRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: Spacing.lg, paddingTop: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.gray50,
  },
  stepperLabel: { fontSize: 13, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center',
  },
  stepBtnPrimary: { backgroundColor: Colors.primary },
  qtyText: {
    fontSize: FontSize.lg, fontWeight: FontWeight.bold,
    color: Colors.textPrimary, width: 24, textAlign: 'center',
  },

  // Parcel card accent
  parcelCard: {
    borderColor: Colors.primaryLight,
    backgroundColor: Colors.primaryLight + '40',
  },

  // Footer
  footer: {
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.sm,
  },
  footerTotal: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: Spacing.sm,
  },
  footerTotalLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  footerTotalValue: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  primaryBtn: {
    backgroundColor: Colors.primary, paddingVertical: 14,
    borderRadius: Radius.xl, alignItems: 'center',
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: Colors.textInverse, fontSize: FontSize.base, fontWeight: FontWeight.bold },
});

export default ReservationConfirmScreen;
