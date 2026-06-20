/**
 * AddressesScreen.tsx + ConditionsScreen.tsx + NotifPrefsScreen.tsx + DeleteAccountScreen.tsx
 * Figma: Account sub-screens
 */

// ─────────────────────────────────────────────────────────────────────────────
// AddressesScreen
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, MapPin, Plus, Home, Briefcase } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/navigation/types';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

const MOCK_ADDRESSES = [
  { id: 'a1', type: 'home', label: 'Home', detail: 'AB-123, Salt Lake, Sector II, Kolkata — 700091', isDefault: true },
  { id: 'a2', type: 'work', label: 'Office', detail: 'Technopolis Building, Sector V, Kolkata — 700091', isDefault: false },
];

const AddressesScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <TouchableOpacity style={styles.addBtn}><Plus size={16} color={Colors.primary} /></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {MOCK_ADDRESSES.map(({ id, type, label, detail, isDefault }) => (
          <View key={id} style={styles.card}>
            <View style={styles.addrIcon}>
              {type === 'home' ? <Home size={16} color={Colors.primary} /> : <Briefcase size={16} color={Colors.textSecondary} />}
            </View>
            <View style={styles.addrText}>
              <View style={styles.addrLabelRow}>
                <Text style={styles.addrLabel}>{label}</Text>
                {isDefault && <View style={styles.defaultChip}><Text style={styles.defaultText}>Default</Text></View>}
              </View>
              <Text style={styles.addrDetail}>{detail}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.addCardBtn}>
          <Plus size={16} color={Colors.primary} />
          <Text style={styles.addCardText}>Add new address</Text>
        </TouchableOpacity>
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
  headerTitle: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary, textAlign: 'center' },
  addBtn: { width: 32, height: 32, backgroundColor: Colors.primaryLight, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  card: {
    flexDirection: 'row', gap: Spacing.md, backgroundColor: Colors.surface,
    borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.lg,
  },
  addrIcon: { width: 36, height: 36, backgroundColor: Colors.primaryLight, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center' },
  addrText: { flex: 1 },
  addrLabelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 4 },
  addrLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  defaultChip: { backgroundColor: Colors.primaryLight, borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 2 },
  defaultText: { fontSize: 10, fontWeight: FontWeight.semibold, color: Colors.primary },
  addrDetail: { fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
  addCardBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.border,
    borderRadius: Radius.xl, paddingVertical: Spacing.lg,
  },
  addCardText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.primary },
});

export default AddressesScreen;
