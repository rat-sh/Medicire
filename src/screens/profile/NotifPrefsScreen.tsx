/**
 * NotifPrefsScreen.tsx
 * Figma: "Notification Preferences" — toggle list per notification type
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/navigation/types';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

const PREFS_ITEMS = [
  { key: 'reservation', label: 'Reservation Updates', sub: 'Confirmations, cancellations, ready for pickup', default: true },
  { key: 'stock', label: 'Stock Alerts', sub: 'When medicines come back in stock', default: true },
  { key: 'price', label: 'Price Drops', sub: 'When medicine prices decrease nearby', default: false },
  { key: 'pharmacy', label: 'New Pharmacies', sub: 'New pharmacies opening near you', default: false },
  { key: 'prescription', label: 'Prescription Reminders', sub: 'Remind me to refill prescriptions', default: true },
  { key: 'promotions', label: 'Promotions', sub: 'Offers and seasonal health tips', default: false },
];

const NotifPrefsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(PREFS_ITEMS.map(p => [p.key, p.default])),
  );

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Preferences</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {PREFS_ITEMS.map(({ key, label, sub }) => (
          <View key={key} style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>{label}</Text>
              <Text style={styles.rowSub}>{sub}</Text>
            </View>
            <Switch
              value={prefs[key]}
              onValueChange={v => setPrefs(p => ({ ...p, [key]: v }))}
              thumbColor={prefs[key] ? Colors.primary : Colors.gray300}
              trackColor={{ true: Colors.primaryLight, false: Colors.gray200 }}
            />
          </View>
        ))}
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Preferences</Text>
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
  content: { padding: Spacing.lg, paddingBottom: 100 },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.lg, marginBottom: Spacing.md,
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  rowSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2, lineHeight: 16 },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center', marginTop: Spacing.md },
  saveBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});

export default NotifPrefsScreen;
