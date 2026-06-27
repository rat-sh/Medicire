/**
 * SearchEdgeCases.tsx
 * Edge case screens related to medicine/pharmacy search results.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft, MapPin, Package, AlertTriangle,
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

export const NoPharmaciesScreen: React.FC = () => (
  <EdgeStateBase
    icon={MapPin} iconColor={Colors.textMuted} iconBg={Colors.gray100}
    title="No pharmacies found nearby"
    subtitle="We couldn't find any open pharmacies within 10 km of your location. Try expanding the search radius."
    primaryAction={{ label: 'Expand Search Radius' }}
    secondaryAction={{ label: 'Try Different Location' }}
  />
);

export const NoMedicineScreen: React.FC = () => (
  <EdgeStateBase
    icon={Package} iconColor={Colors.textMuted} iconBg={Colors.gray100}
    title="Medicine not found"
    subtitle="We couldn't find 'Atorvastatin' at any nearby pharmacy. Try searching by generic name or brand name."
    primaryAction={{ label: 'Search Again' }}
    secondaryAction={{ label: 'Try a Different Name' }}
  />
);

export const OutOfStockScreen: React.FC = () => (
  <EdgeStateBase
    icon={Package} iconColor={Colors.error} iconBg={Colors.errorLight}
    title="Out of stock everywhere"
    subtitle="Pantoprazole 40mg is currently out of stock at all nearby pharmacies. We'll notify you when it's available."
    primaryAction={{ label: 'Set Stock Alert' }}
    secondaryAction={{ label: 'Search Alternative' }}
  />
);

export const PartialFulfillmentScreen: React.FC = () => (
  <EdgeStateBase
    icon={AlertTriangle} iconColor={Colors.warning} iconBg={Colors.warningLight}
    title="Partial medicines available"
    subtitle="Only 4 of 6 medicines in your prescription are available nearby. You may need to visit multiple pharmacies."
    primaryAction={{ label: 'Reserve Available Now' }}
    secondaryAction={{ label: 'View Full List' }}
  />
);

export const MultiPharmacyScreen: React.FC = () => (
  <EdgeStateBase
    icon={MapPin} iconColor={Colors.primary} iconBg={Colors.primaryLight}
    title="Split across pharmacies"
    subtitle="To get all 6 medicines, you'll need to visit 2 pharmacies. Reserve from both with one tap."
    primaryAction={{ label: 'Reserve from Both' }}
    secondaryAction={{ label: 'See Details' }}
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
