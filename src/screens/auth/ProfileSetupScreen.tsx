/**
 * ProfileSetupScreen.tsx
 * Figma: "Profile Setup" — age, gender, chronic condition chips, skip option
 * Mock: Submit or skip → navigate to Main (Home)
 * Real API: PATCH /users/profile → navigate to Main
 * MOCK_MARKER: Replace navigation reset with real profile save + auth state
 */
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Config } from '@/constants/config';

const CONDITIONS = [
  'Diabetes', 'Hypertension', 'Asthma', 'Thyroid',
  'Heart Disease', 'Arthritis',
];
const GENDERS = ['Male', 'Female', 'Other'];

const ProfileSetupScreen: React.FC = () => {
  const navigation = useNavigation();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selected, setSelected] = useState<string[]>(['Diabetes', 'Hypertension']);

  const toggleCondition = (c: string) => {
    setSelected(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const handleContinue = () => {
    if (Config.USE_MOCK) {
      // ── MOCK: Skip profile save, reset to Main navigator ──────────────────
      // TODO: PATCH /users/profile when backend is ready
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] }));
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.statusSpacer} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <View style={styles.headerRow}>
          <Text style={styles.heading}>Complete your profile</Text>
          <TouchableOpacity onPress={handleContinue}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sub}>
          This helps us give you better medicine recommendations. You can always update this later.
        </Text>

        {/* Age + Gender row */}
        <View style={styles.rowFields}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>AGE</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="32"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>GENDER</Text>
            <View style={styles.genderRow}>
              {GENDERS.map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderChip, gender === g && styles.genderChipActive]}
                  onPress={() => setGender(g)}>
                  <Text style={[styles.genderChipText, gender === g && styles.genderChipTextActive]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Chronic conditions */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>CHRONIC CONDITIONS (OPTIONAL)</Text>
          <View style={styles.chipsWrap}>
            {CONDITIONS.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, selected.includes(c) && styles.chipActive]}
                onPress={() => toggleCondition(c)}>
                <Text style={[styles.chipText, selected.includes(c) && styles.chipTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleContinue}>
          <Text style={styles.primaryBtnText}>Continue to App</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  statusSpacer: { height: 44 },
  content: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.sm,
  },
  heading: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  skipText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xl, lineHeight: 20 },
  rowFields: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.sm },
  fieldGroup: { marginBottom: Spacing.xl },
  label: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold,
    color: Colors.textSecondary, letterSpacing: 0.8, marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.gray50, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: FontSize.sm, color: Colors.textPrimary,
  },
  genderRow: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  genderChip: {
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderRadius: Radius.full, borderWidth: 1,
    borderColor: Colors.border, backgroundColor: Colors.gray50,
  },
  genderChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  genderChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  genderChipTextActive: { color: Colors.primary },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: 6,
    borderRadius: Radius.full, borderWidth: 1,
    borderColor: Colors.border, backgroundColor: Colors.gray50,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  chipTextActive: { color: Colors.textInverse },
  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md,
    paddingVertical: 14, alignItems: 'center',
  },
  primaryBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});

export default ProfileSetupScreen;
