/**
 * PharmacyContactCard.tsx
 * Pharmacy info row (name, address, phone) with Call and Directions/Track buttons.
 * Handles Linking.openURL side-effects internally based on props.
 * Used in both ReservationConfirmScreen and ReservationStatusScreen.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MapPin, Phone, Navigation } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

interface Props {
  name: string;
  address: string;
  phone?: string;
  lat?: number;
  lng?: number;
  /** When true: show open/closed badge and replace "Directions" with "Track Route" label */
  isDelivery: boolean;
  /** When provided, renders the open/closed status badge */
  isOpen?: boolean;
  closingTime?: string;
}

export const PharmacyContactCard: React.FC<Props> = ({
  name,
  address,
  phone,
  lat,
  lng,
  isDelivery,
  isOpen,
  closingTime,
}) => {
  const handleCall = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleMap = () => {
    if (lat && lng) {
      Linking.openURL(`https://maps.google.com/?q=${lat},${lng}&mode=driving`);
    } else {
      Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
    }
  };

  return (
    <>
      <View style={styles.pharmacyRow}>
        <View style={styles.pharmacyIcon}>
          <MapPin size={18} color={Colors.primary} />
        </View>
        <View style={styles.pharmacyInfo}>
          <Text style={styles.pharmacyName}>{name}</Text>
          <Text style={styles.pharmacyAddr}>{address}</Text>
          {phone ? (
            <Text style={styles.pharmacyPhone}>{phone}</Text>
          ) : null}
          {isOpen !== undefined ? (
            <View style={styles.openBadgeRow}>
              <View style={[styles.openDot, { backgroundColor: isOpen ? Colors.success : Colors.error }]} />
              <Text style={[styles.openText, { color: isOpen ? Colors.success : Colors.error }]}>
                {isOpen ? `Open · Closes ${closingTime ?? '10 PM'}` : 'Closed'}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleCall}>
          <Phone size={14} color={Colors.primary} />
          <Text style={styles.actionBtnText} numberOfLines={1}>
            {phone ?? 'Call'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnAlt]} onPress={handleMap}>
          <Navigation size={14} color={Colors.textSecondary} />
          <Text style={[styles.actionBtnText, styles.actionBtnTextAlt]}>
            {isDelivery ? 'Track Route' : 'Get Directions'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  pharmacyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  pharmacyIcon: {
    width: 40, height: 40, borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  pharmacyInfo: { flex: 1 },
  pharmacyName: {
    fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary,
  },
  pharmacyAddr: {
    fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2, lineHeight: 16,
  },
  pharmacyPhone: { fontSize: FontSize.xs, color: Colors.primary, marginTop: 3 },
  openBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  openDot: { width: 6, height: 6, borderRadius: 3 },
  openText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },

  actions: {
    flexDirection: 'row', gap: Spacing.sm,
    marginTop: Spacing.md, paddingTop: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.gray50,
  },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.primary + '30',
  },
  actionBtnAlt: { backgroundColor: Colors.gray50, borderColor: Colors.border },
  actionBtnText: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold,
    color: Colors.primary, flexShrink: 1,
  },
  actionBtnTextAlt: { color: Colors.textSecondary },
});
