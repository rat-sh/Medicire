/**
 * ProfileSetupScreen.tsx — Figma: "Profile Setup"
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { CHRONIC_CONDITIONS, GENDER_OPTIONS } from '@/constants/profile';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Button } from '@/components/ui/Button';
import { profileSetupSchema } from '@/utils/validators';
import { useCompleteOnboarding, useUpdateProfile } from '@/hooks/useAuth';

const ProfileSetupScreen: React.FC = () => {
  const updateProfile = useUpdateProfile();
  const completeOnboarding = useCompleteOnboarding();

  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState('');

  const toggleCondition = (c: string) => {
    setSelected(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c],
    );
  };

  const finish = async (skipProfile: boolean) => {
    if (skipProfile) {
      completeOnboarding();
      return;
    }

    const parsed = profileSetupSchema.safeParse({
      age: age || undefined,
      gender: gender || undefined,
      conditions: selected,
    });

    if (!parsed.success) {
      setError(parsed.error.flatten().formErrors[0] ?? 'Please check your input');
      return;
    }

    setError('');
    try {
      await updateProfile.mutateAsync({
        age: parsed.data.age ? Number(parsed.data.age) : undefined,
        gender: parsed.data.gender,
        conditions: parsed.data.conditions,
      });
    } catch {
      setError('Could not save profile. Please try again.');
    }
  };

  return (
    <ScreenLayout scroll keyboardAvoid contentStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Complete your profile</Text>
        <TouchableOpacity onPress={() => finish(true)} disabled={updateProfile.isPending}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sub}>
        This helps us give you better medicine recommendations. You can always update this later.
      </Text>

      <View style={styles.rowFields}>
        <View style={[styles.fieldGroup, styles.flex]}>
          <Text style={styles.label}>AGE</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Age"
            placeholderTextColor={Colors.textMuted}
            keyboardType="number-pad"
            maxLength={3}
          />
        </View>
        <View style={[styles.fieldGroup, styles.flex]}>
          <Text style={styles.label}>GENDER</Text>
          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map(g => (
              <TouchableOpacity
                key={g.value}
                style={[styles.genderChip, gender === g.value && styles.genderChipActive]}
                onPress={() => setGender(g.value)}>
                <Text style={[styles.genderChipText, gender === g.value && styles.genderChipTextActive]}>
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>CHRONIC CONDITIONS (OPTIONAL)</Text>
        <View style={styles.chipsWrap}>
          {CHRONIC_CONDITIONS.map(c => (
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

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        title="Continue to App"
        onPress={() => finish(false)}
        loading={updateProfile.isPending}
        fullWidth
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  heading: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  skipText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xl, lineHeight: 20 },
  rowFields: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.sm },
  flex: { flex: 1 },
  fieldGroup: { marginBottom: Spacing.xl },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.gray50,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  genderRow: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  genderChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.gray50,
  },
  genderChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  genderChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  genderChipTextActive: { color: Colors.primary },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.gray50,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  chipTextActive: { color: Colors.textInverse },
  errorText: { fontSize: FontSize.xs, color: Colors.error, marginBottom: Spacing.md, textAlign: 'center' },
});

export default ProfileSetupScreen;
