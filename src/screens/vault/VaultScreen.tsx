/**
 * VaultScreen.tsx — Figma: "Prescription Vault"
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, FileText } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { VaultStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { EmptyState } from '@/components/ui/EmptyState';

type Nav = NativeStackNavigationProp<VaultStackParamList>;

const VaultScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const prescriptions: never[] = [];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.heading}>Prescription Vault</Text>
        <Text style={styles.sub}>{prescriptions.length} prescriptions saved</Text>
      </View>

      {prescriptions.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No prescriptions saved"
          subtitle="Upload your first prescription to find medicines and keep a record of your health documents."
          action="Upload Prescription"
          onAction={() => navigation.navigate(Routes.RX_UPLOAD)}
        />
      ) : (
        <FlatList
          data={prescriptions}
          numColumns={2}
          keyExtractor={item => (item as { id: string }).id}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          renderItem={() => null}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 80 }]}
        onPress={() => navigation.navigate(Routes.RX_UPLOAD)}>
        <Plus size={20} color={Colors.textInverse} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  heading: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  row: { gap: Spacing.md, marginBottom: Spacing.md },
  fab: {
    position: 'absolute', right: Spacing.xl,
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    elevation: 6,
  },
});

export default VaultScreen;
