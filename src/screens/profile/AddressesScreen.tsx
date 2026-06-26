/**
 * AddressesScreen.tsx — Figma: "Addresses"
 * List of saved addresses with Home/Work icons and primary badges.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Edit, Plus, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/constants/theme';

const ADDRESSES = [
  { id: '1', label: "Home", icon: "🏠", address: "12/A Bosepukur Road, Kasba, Kolkata 700042", primary: true },
  { id: '2', label: "Work", icon: "💼", address: "Salt Lake Sector V, Block GP, Kolkata 700091", primary: false },
];

const AddressesScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Saved Addresses</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {ADDRESSES.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.icon}>{item.icon}</Text>
              <View style={styles.details}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>{item.label}</Text>
                  {item.primary && (
                    <View style={styles.primaryBadge}>
                      <Text style={styles.primaryBadgeText}>Primary</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressText}>{item.address}</Text>
              </View>
              <TouchableOpacity style={styles.editBtn}>
                <Edit size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn}>
          <Plus size={18} color={Colors.textSecondary} />
          <Text style={styles.addBtnText}>Add new address</Text>
        </TouchableOpacity>
      </ScrollView>
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
  bodyContent: { padding: Spacing.lg, gap: Spacing.md },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.borderLight,
    ...Shadow.sm,
  },
  cardContent: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  icon: { fontSize: 24 },
  details: { flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  label: { fontSize: 14, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  primaryBadge: { backgroundColor: Colors.successLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  primaryBadgeText: { fontSize: 10, fontWeight: FontWeight.bold, color: Colors.success },
  addressText: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  editBtn: { padding: 4 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.surface, paddingVertical: 16, borderRadius: Radius.xl,
    borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.gray200,
  },
  addBtnText: { fontSize: 14, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
});

export default AddressesScreen;
