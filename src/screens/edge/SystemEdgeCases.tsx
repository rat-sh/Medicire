/**
 * SystemEdgeCases.tsx
 * Edge case screens related to system, network, or hardware failures.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft, AlertTriangle, WifiOff, Lock, Camera, Clock, FileText, XCircle, Search, Upload,
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
      <View style={styles.statusSpacer} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
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

export const OcrFailScreen: React.FC = () => (
  <EdgeStateBase
    icon={AlertTriangle} iconColor={Colors.error} iconBg={Colors.errorLight}
    title="Couldn't read prescription"
    subtitle="Our AI wasn't able to extract medicine details from your prescription. Try uploading a clearer image."
    primaryAction={{ label: 'Upload Again' }}
    secondaryAction={{ label: 'Add Medicines Manually' }}
  />
);

export const PoorImageScreen: React.FC = () => (
  <EdgeStateBase
    icon={Camera} iconColor={Colors.warning} iconBg={Colors.warningLight}
    title="Image quality too low"
    subtitle="The prescription image is blurry or too dark. Please take a new photo in good lighting with the text fully visible."
    primaryAction={{ label: 'Take New Photo' }}
    secondaryAction={{ label: 'Upload from Gallery' }}
  />
);

export const NetworkFailScreen: React.FC = () => (
  <EdgeStateBase
    icon={WifiOff} iconColor={Colors.error} iconBg={Colors.errorLight}
    title="No internet connection"
    subtitle="Check your network connection and try again. Your data is safe and will sync when you reconnect."
    primaryAction={{ label: 'Try Again' }}
  />
);

export const LocationDeniedScreen: React.FC = () => (
  <EdgeStateBase
    icon={Lock} iconColor={Colors.warning} iconBg={Colors.warningLight}
    title="Location access denied"
    subtitle="Enable location access in your phone settings for Medicire to find pharmacies near you."
    primaryAction={{ label: 'Open Settings' }}
    secondaryAction={{ label: 'Enter Location Manually' }}
  />
);

export const RsvRejectedScreen: React.FC = () => (
  <EdgeStateBase
    icon={XCircle} iconColor={Colors.error} iconBg={Colors.errorLight}
    title="Reservation declined"
    subtitle="Apollo Pharmacy was unable to fulfill your reservation for Paracetamol 500mg. Try another pharmacy nearby."
    primaryAction={{ label: 'Find Another Pharmacy' }}
    secondaryAction={{ label: 'Go Home' }}
  />
);

export const PharmacyClosedScreen: React.FC = () => (
  <EdgeStateBase
    icon={Clock} iconColor={Colors.textMuted} iconBg={Colors.gray100}
    title="Pharmacy is closed"
    subtitle="MedPlus is closed right now. It opens at 9:00 AM tomorrow. You can reserve in advance or find an open pharmacy."
    primaryAction={{ label: 'Find Open Pharmacies' }}
    secondaryAction={{ label: 'Reserve for Tomorrow 9 AM' }}
  />
);

export const UploadTimeoutScreen: React.FC = () => (
  <EdgeStateBase
    icon={Upload} iconColor={Colors.error} iconBg={Colors.errorLight}
    title="Upload timed out"
    subtitle="The prescription upload took too long. Check your internet connection and try uploading again."
    primaryAction={{ label: 'Try Again' }}
    secondaryAction={{ label: 'Add Medicines Manually' }}
  />
);

export const EmptyVaultScreen: React.FC = () => (
  <EdgeStateBase
    icon={FileText} iconColor={Colors.textMuted} iconBg={Colors.gray100}
    title="No prescriptions saved"
    subtitle="Upload your first prescription to find medicines and keep a record of your health documents."
    primaryAction={{ label: 'Upload Prescription' }}
  />
);

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
  header: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.gray100, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing['4xl'], gap: Spacing.md },
  iconBox: { width: 64, height: 64, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  title: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  primaryBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingHorizontal: Spacing.xl, paddingVertical: 12, alignItems: 'center', marginTop: Spacing.md, width: '100%' },
  primaryBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
  secondaryBtn: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.xl, paddingVertical: 12, alignItems: 'center', width: '100%' },
  secondaryBtnText: { color: Colors.textSecondary, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});
