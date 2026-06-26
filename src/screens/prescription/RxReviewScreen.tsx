/**
 * RxReviewScreen.tsx — Figma: "Medicine Review"
 * Lists extracted medicines with confidence bars, editing, and manual add.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, CheckCircle, Package, Edit, Plus, AlertCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { VaultStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/constants/theme';
import { ScreenLayout } from '@/components/ui/ScreenLayout';

type Nav = NativeStackNavigationProp<VaultStackParamList>;

const MOCK_MEDICINES = [
  { id: '1', name: "Metformin 500mg", brand: "Glycomet", qty: "60 tablets", confidence: 96, editable: false },
  { id: '2', name: "Atorvastatin 10mg", brand: "Lipitor / Atorva", qty: "30 tablets", confidence: 92, editable: false },
  { id: '3', name: "Amlodipine 5mg", brand: "Norvasc / Amlo", qty: "30 tablets", confidence: 88, editable: false },
  { id: '4', name: "Pantoprazole 40mg", brand: "Pan-40", qty: "30 tablets", confidence: 74, editable: true },
  { id: '5', name: "Metoprolol 25mg", brand: "Betaloc", qty: "30 tablets", confidence: 81, editable: false },
];

const RxReviewScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Review Medicines</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <CheckCircle size={16} color={Colors.primary} />
          <Text style={styles.infoText}>
            We found 5 medicines. Tap any item to correct errors made by OCR.
          </Text>
        </View>

        {MOCK_MEDICINES.map(med => (
          <View key={med.id} style={[styles.card, med.editable && styles.cardWarning]}>
            <View style={styles.cardMain}>
              <View style={[styles.iconBox, med.editable && styles.iconBoxWarning]}>
                <Package size={18} color={med.editable ? Colors.warning : Colors.primary} />
              </View>
              <View style={styles.details}>
                <View style={styles.nameRow}>
                  <Text style={styles.medName}>{med.name}</Text>
                  {med.editable && <AlertCircle size={14} color={Colors.warning} />}
                </View>
                <Text style={styles.brand}>{med.brand}</Text>
                <Text style={styles.qty}>{med.qty}</Text>

                <View style={styles.confidenceRow}>
                  <View style={styles.barBg}>
                    <View style={[
                      styles.barFill,
                      { width: `${med.confidence}%` },
                      { backgroundColor: med.confidence >= 90 ? Colors.success : med.confidence >= 80 ? Colors.primary : Colors.warning }
                    ]} />
                  </View>
                  <Text style={[
                    styles.confidenceLabel,
                    { color: med.confidence >= 90 ? Colors.success : med.confidence >= 80 ? Colors.primary : Colors.warning }
                  ]}>
                    {med.confidence}%
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editBtn}>
                <Edit size={14} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn}>
          <Plus size={16} color={Colors.textSecondary} />
          <Text style={styles.addBtnText}>Add medicine manually</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate(Routes.RX_RESULTS, { prescriptionId: 'mock-rx-id' })}>
          <Text style={styles.primaryBtnText}>Find These Medicines →</Text>
        </TouchableOpacity>
      </View>
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
  infoBox: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primaryLight, padding: Spacing.md, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: 'rgba(11, 143, 129, 0.1)',
  },
  infoText: { flex: 1, fontSize: 12, color: Colors.primary, fontWeight: FontWeight.medium, lineHeight: 18 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.md,
    ...Shadow.sm,
  },
  cardWarning: { borderColor: Colors.warningBorder, backgroundColor: Colors.warningLight + '20' },
  cardMain: { flexDirection: 'row', gap: Spacing.md },
  iconBox: {
    width: 36, height: 36, borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  iconBoxWarning: { backgroundColor: Colors.warningLight },
  details: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  medName: { fontSize: 14, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  brand: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  qty: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  barBg: { flex: 1, height: 4, backgroundColor: Colors.gray100, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  confidenceLabel: { fontSize: 10, fontWeight: FontWeight.bold, fontVariant: ['tabular-nums'] },
  editBtn: { width: 28, height: 28, backgroundColor: Colors.gray50, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderStyle: 'dashed', borderWidth: 2, borderColor: Colors.gray200, borderRadius: Radius.xl,
  },
  addBtnText: { fontSize: 14, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  footer: { padding: Spacing.lg, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  primaryBtn: { backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: Radius.xl, alignItems: 'center' },
  primaryBtnText: { color: Colors.textInverse, fontSize: 14, fontWeight: FontWeight.bold },
});

export default RxReviewScreen;
