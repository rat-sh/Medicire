/**
 * VaultScreen.tsx
 * Figma: "Prescription Vault" — thumbnail grid of saved prescriptions,
 *        floating upload FAB, sorted by date
 * Mock: MOCK_PRESCRIPTIONS list
 * Real API: GET /prescriptions (paginated)
 * MOCK_MARKER: Replace MOCK_PRESCRIPTIONS with useQuery(() => prescriptionsApi.list())
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, FileText } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { VaultStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

type Nav = NativeStackNavigationProp<VaultStackParamList>;

// ── MOCK_MARKER ───────────────────────────────────────────────────────────────
const MOCK_PRESCRIPTIONS = [
  { id: 'rx_001', date: 'Jun 14, 2025', doctor: 'Dr. Subrata Bose', hospital: 'AMRI Hospitals', medicines: 5 },
  { id: 'rx_002', date: 'May 2, 2025', doctor: 'Dr. Rajesh Kumar', hospital: 'Apollo Hospital', medicines: 3 },
  { id: 'rx_003', date: 'Apr 18, 2025', doctor: 'Dr. Ananya Das', hospital: 'Fortis Hospital', medicines: 7 },
  { id: 'rx_004', date: 'Mar 10, 2025', doctor: 'Dr. P. Sharma', hospital: 'SSKM Hospital', medicines: 4 },
  { id: 'rx_005', date: 'Jan 22, 2025', doctor: 'Dr. M. Roy', hospital: 'RN Tagore Hospital', medicines: 2 },
  { id: 'rx_006', date: 'Dec 5, 2024', doctor: 'Dr. S. Ghosh', hospital: 'Medica Hospital', medicines: 6 },
];
// ─────────────────────────────────────────────────────────────────────────────

const VaultScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <View style={styles.statusSpacer} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Prescription Vault</Text>
          <Text style={styles.sub}>{MOCK_PRESCRIPTIONS.length} prescriptions saved</Text>
        </View>
      </View>

      {/* Grid */}
      <FlatList
        data={MOCK_PRESCRIPTIONS}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate(Routes.VAULT_DETAIL, { prescriptionId: item.id })}>
            {/* Thumbnail */}
            <View style={styles.thumb}>
              <FileText size={28} color={Colors.textMuted} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text style={styles.cardDoc} numberOfLines={1}>{item.doctor}</Text>
              <Text style={styles.cardHosp} numberOfLines={1}>{item.hospital}</Text>
              <View style={styles.medCountChip}>
                <Text style={styles.medCountText}>{item.medicines} medicines</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Floating upload FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(Routes.RX_UPLOAD as any)}>
        <Plus size={20} color={Colors.textInverse} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  statusSpacer: { height: 44 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  heading: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  row: { gap: Spacing.md, marginBottom: Spacing.md },
  card: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden',
  },
  thumb: {
    height: 100, backgroundColor: Colors.gray100,
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { padding: Spacing.md },
  cardDate: { fontSize: 10, fontWeight: FontWeight.semibold, color: Colors.primary },
  cardDoc: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginTop: 2 },
  cardHosp: { fontSize: 10, color: Colors.textSecondary, marginTop: 1 },
  medCountChip: {
    marginTop: Spacing.sm, paddingHorizontal: 6, paddingVertical: 2,
    backgroundColor: Colors.primaryLight, borderRadius: Radius.full, alignSelf: 'flex-start',
  },
  medCountText: { fontSize: 9, fontWeight: FontWeight.semibold, color: Colors.primary },
  fab: {
    position: 'absolute', right: Spacing.xl, bottom: 80,
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    elevation: 6,
  },
});

export default VaultScreen;
