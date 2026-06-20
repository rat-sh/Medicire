/**
 * EdgeCaseScreens.tsx
 * Figma: 14 edge case screens — each is a simple full-screen empty state
 * All screens exported individually for use in navigation
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft, MapPin, Package, AlertTriangle, WifiOff, Lock,
  Camera, Clock, FileText, RefreshCw, XCircle, Search, Upload, Heart,
} from 'lucide-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type EmptyStateProps = {
  icon: React.ComponentType<{ size: number; color: string }>;
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle: string;
  primaryAction?: { label: string; onPress?: () => void };
  secondaryAction?: { label: string; onPress?: () => void };
};

const EdgeStateBase: React.FC<EmptyStateProps> = ({
  icon: Icon, iconColor = Colors.textMuted, iconBg = Colors.gray100,
  title, subtitle, primaryAction, secondaryAction,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.statusSpacer} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
      {/* Empty state */}
      <View style={styles.center}>
        <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
          <Icon size={28} color={iconColor} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {primaryAction && (
          <TouchableOpacity style={styles.primaryBtn} onPress={primaryAction.onPress ?? (() => navigation.goBack())}>
            <Text style={styles.primaryBtnText}>{primaryAction.label}</Text>
          </TouchableOpacity>
        )}
        {secondaryAction && (
          <TouchableOpacity style={styles.secondaryBtn} onPress={secondaryAction.onPress ?? (() => navigation.goBack())}>
            <Text style={styles.secondaryBtnText}>{secondaryAction.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ── 1. No Pharmacies Nearby ───────────────────────────────────────────────────
export const NoPharmaciesScreen: React.FC = () => (
  <EdgeStateBase
    icon={MapPin} iconColor={Colors.textMuted} iconBg={Colors.gray100}
    title="No pharmacies found nearby"
    subtitle="We couldn't find any open pharmacies within 10 km of your location. Try expanding the search radius."
    primaryAction={{ label: 'Expand Search Radius' }}
    secondaryAction={{ label: 'Try Different Location' }}
  />
);

// ── 2. Medicine Not Found ─────────────────────────────────────────────────────
export const NoMedicineScreen: React.FC = () => (
  <EdgeStateBase
    icon={Package} iconColor={Colors.textMuted} iconBg={Colors.gray100}
    title="Medicine not found"
    subtitle="We couldn't find 'Atorvastatin' at any nearby pharmacy. Try searching by generic name or brand name."
    primaryAction={{ label: 'Search Again' }}
    secondaryAction={{ label: 'Try a Different Name' }}
  />
);

// ── 3. OCR Failure ────────────────────────────────────────────────────────────
export const OcrFailScreen: React.FC = () => (
  <EdgeStateBase
    icon={AlertTriangle} iconColor={Colors.error} iconBg={Colors.errorLight}
    title="Couldn't read prescription"
    subtitle="Our AI wasn't able to extract medicine details from your prescription. Try uploading a clearer image."
    primaryAction={{ label: 'Upload Again' }}
    secondaryAction={{ label: 'Add Medicines Manually' }}
  />
);

// ── 4. Poor Image Quality ─────────────────────────────────────────────────────
export const PoorImageScreen: React.FC = () => (
  <EdgeStateBase
    icon={Camera} iconColor={Colors.warning} iconBg={Colors.warningLight}
    title="Image quality too low"
    subtitle="The prescription image is blurry or too dark. Please take a new photo in good lighting with the text fully visible."
    primaryAction={{ label: 'Take New Photo' }}
    secondaryAction={{ label: 'Upload from Gallery' }}
  />
);

// ── 5. Network Failure ────────────────────────────────────────────────────────
export const NetworkFailScreen: React.FC = () => (
  <EdgeStateBase
    icon={WifiOff} iconColor={Colors.error} iconBg={Colors.errorLight}
    title="No internet connection"
    subtitle="Check your network connection and try again. Your data is safe and will sync when you reconnect."
    primaryAction={{ label: 'Try Again' }}
  />
);

// ── 6. Location Denied ────────────────────────────────────────────────────────
export const LocationDeniedScreen: React.FC = () => (
  <EdgeStateBase
    icon={Lock} iconColor={Colors.warning} iconBg={Colors.warningLight}
    title="Location access denied"
    subtitle="Enable location access in your phone settings for Medicire to find pharmacies near you."
    primaryAction={{ label: 'Open Settings' }}
    secondaryAction={{ label: 'Enter Location Manually' }}
  />
);

// ── 7. Reservation Rejected ───────────────────────────────────────────────────
export const RsvRejectedScreen: React.FC = () => (
  <EdgeStateBase
    icon={XCircle} iconColor={Colors.error} iconBg={Colors.errorLight}
    title="Reservation declined"
    subtitle="Apollo Pharmacy was unable to fulfill your reservation for Paracetamol 500mg. Try another pharmacy nearby."
    primaryAction={{ label: 'Find Another Pharmacy' }}
    secondaryAction={{ label: 'Go Home' }}
  />
);

// ── 8. Pharmacy Closed ────────────────────────────────────────────────────────
export const PharmacyClosedScreen: React.FC = () => (
  <EdgeStateBase
    icon={Clock} iconColor={Colors.textMuted} iconBg={Colors.gray100}
    title="Pharmacy is closed"
    subtitle="MedPlus is closed right now. It opens at 9:00 AM tomorrow. You can reserve in advance or find an open pharmacy."
    primaryAction={{ label: 'Find Open Pharmacies' }}
    secondaryAction={{ label: 'Reserve for Tomorrow 9 AM' }}
  />
);

// ── 9. Out of Stock ───────────────────────────────────────────────────────────
export const OutOfStockScreen: React.FC = () => (
  <EdgeStateBase
    icon={Package} iconColor={Colors.error} iconBg={Colors.errorLight}
    title="Out of stock everywhere"
    subtitle="Pantoprazole 40mg is currently out of stock at all nearby pharmacies. We'll notify you when it's available."
    primaryAction={{ label: 'Set Stock Alert' }}
    secondaryAction={{ label: 'Search Alternative' }}
  />
);

// ── 10. Partial Fulfillment ───────────────────────────────────────────────────
export const PartialFulfillmentScreen: React.FC = () => (
  <EdgeStateBase
    icon={AlertTriangle} iconColor={Colors.warning} iconBg={Colors.warningLight}
    title="Partial medicines available"
    subtitle="Only 4 of 6 medicines in your prescription are available nearby. You may need to visit multiple pharmacies."
    primaryAction={{ label: 'Reserve Available Now' }}
    secondaryAction={{ label: 'View Full List' }}
  />
);

// ── 11. Multiple Pharmacy Suggestion ─────────────────────────────────────────
export const MultiPharmacyScreen: React.FC = () => (
  <EdgeStateBase
    icon={MapPin} iconColor={Colors.primary} iconBg={Colors.primaryLight}
    title="Split across pharmacies"
    subtitle="To get all 6 medicines, you'll need to visit 2 pharmacies. Reserve from both with one tap."
    primaryAction={{ label: 'Reserve from Both' }}
    secondaryAction={{ label: 'See Details' }}
  />
);

// ── 12. Upload Timeout ────────────────────────────────────────────────────────
export const UploadTimeoutScreen: React.FC = () => (
  <EdgeStateBase
    icon={Upload} iconColor={Colors.error} iconBg={Colors.errorLight}
    title="Upload timed out"
    subtitle="The prescription upload took too long. Check your internet connection and try uploading again."
    primaryAction={{ label: 'Try Again' }}
    secondaryAction={{ label: 'Add Medicines Manually' }}
  />
);

// ── 13. Empty Vault ───────────────────────────────────────────────────────────
export const EmptyVaultScreen: React.FC = () => (
  <EdgeStateBase
    icon={FileText} iconColor={Colors.textMuted} iconBg={Colors.gray100}
    title="No prescriptions saved"
    subtitle="Upload your first prescription to find medicines and keep a record of your health documents."
    primaryAction={{ label: 'Upload Prescription' }}
  />
);

// ── 14. Empty History ─────────────────────────────────────────────────────────
export const EmptyHistoryScreen: React.FC = () => (
  <EdgeStateBase
    icon={Search} iconColor={Colors.textMuted} iconBg={Colors.gray100}
    title="No reservation history"
    subtitle="You haven't made any reservations yet. Search for a medicine to get started."
    primaryAction={{ label: 'Search Medicines' }}
  />
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  statusSpacer: { height: 44 },
  header: {
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
  },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.gray100, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Spacing['4xl'], gap: Spacing.md,
  },
  iconBox: {
    width: 64, height: 64, borderRadius: Radius.xl,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.base, fontWeight: FontWeight.bold,
    color: Colors.textPrimary, textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.sm, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
  },
  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl, paddingVertical: 12,
    alignItems: 'center', marginTop: Spacing.md, width: '100%',
  },
  primaryBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
  secondaryBtn: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl, paddingVertical: 12,
    alignItems: 'center', width: '100%',
  },
  secondaryBtnText: { color: Colors.textSecondary, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});
