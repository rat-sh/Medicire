/**
 * DeleteAccountScreen.tsx
 * Figma: "Delete Account" — red warning card, confirmation checkbox + input
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, AlertTriangle, Check } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Config } from '@/constants/config';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

const DeleteAccountScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [agreed, setAgreed] = useState(false);
  const [confirm, setConfirm] = useState('');

  const canDelete = agreed && confirm === 'DELETE';

  const handleDelete = () => {
    Alert.alert(
      'Account Deleted',
      Config.USE_MOCK
        ? 'MOCK: Account deletion simulated. Redirecting to login.'
        : 'Your account has been deleted.',
      [{ text: 'OK', onPress: () => navigation.navigate(Routes.LOGIN as any) }],
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delete Account</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Warning card */}
        <View style={styles.warningCard}>
          <AlertTriangle size={28} color={Colors.error} />
          <Text style={styles.warningTitle}>This action is irreversible</Text>
          <Text style={styles.warningText}>
            Deleting your account will permanently remove all your data including prescriptions, reservation history, and saved addresses. This cannot be undone.
          </Text>
        </View>

        {/* What will be deleted */}
        <Text style={styles.sectionTitle}>What will be deleted</Text>
        {[
          'All saved prescriptions in your vault',
          'Reservation history and pending reservations',
          'Saved addresses and chronic conditions',
          'Your login credentials and profile',
        ].map(item => (
          <View key={item} style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}

        {/* Confirm checkbox */}
        <TouchableOpacity style={styles.checkRow} onPress={() => setAgreed(p => !p)}>
          <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
            {agreed && <Check size={12} color={Colors.textInverse} />}
          </View>
          <Text style={styles.checkLabel}>I understand that this action cannot be undone</Text>
        </TouchableOpacity>

        {/* Confirm input */}
        <Text style={styles.inputLabel}>Type DELETE to confirm</Text>
        <TextInput
          style={styles.input}
          value={confirm}
          onChangeText={setConfirm}
          placeholder="DELETE"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="characters"
        />

        <TouchableOpacity
          style={[styles.deleteBtn, !canDelete && styles.deleteBtnDisabled]}
          onPress={handleDelete}
          disabled={!canDelete}>
          <Text style={styles.deleteBtnText}>Delete My Account</Text>
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
  headerRight: { width: 32 },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  warningCard: {
    backgroundColor: Colors.errorLight, borderWidth: 1, borderColor: Colors.errorBorder,
    borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl,
  },
  warningTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.error, textAlign: 'center' },
  warningText: { fontSize: FontSize.sm, color: '#7f1d1d', textAlign: 'center', lineHeight: 20 },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: Spacing.md },
  bulletRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start', marginBottom: 8 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.error, marginTop: 6 },
  bulletText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary },
  checkRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, marginTop: Spacing.xl, marginBottom: Spacing.lg,
  },
  checkbox: {
    width: 20, height: 20, borderRadius: 6, borderWidth: 2,
    borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  checkboxActive: { backgroundColor: Colors.error, borderColor: Colors.error },
  checkLabel: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  inputLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 },
  input: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: FontSize.sm, color: Colors.textPrimary, marginBottom: Spacing.lg,
    fontWeight: FontWeight.bold, letterSpacing: 2,
  },
  deleteBtn: { backgroundColor: Colors.error, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center' },
  deleteBtnDisabled: { opacity: 0.4 },
  deleteBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});

export default DeleteAccountScreen;
