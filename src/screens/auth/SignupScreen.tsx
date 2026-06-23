/**
 * SignupScreen.tsx — Figma: "Sign Up"
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Check } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Button } from '@/components/ui/Button';
import { signupSchema } from '@/utils/validators';
import { useSendOtp } from '@/hooks/useAuth';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const sendOtp = useSendOtp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSignup = async () => {
    const parsed = signupSchema.safeParse({ name, phone, password, agreeToTerms: agreed });
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0] ?? '',
        phone: fieldErrors.phone?.[0] ?? '',
        password: fieldErrors.password?.[0] ?? '',
        agreeToTerms: fieldErrors.agreeToTerms?.[0] ?? '',
      });
      return;
    }

    setErrors({});
    try {
      await sendOtp.mutateAsync({ phone: parsed.data.phone });
      navigation.navigate(Routes.OTP, {
        phone: parsed.data.phone,
        name: parsed.data.name,
        mode: 'signup',
      });
    } catch {
      setErrors({ form: 'Could not create account. Please try again.' });
    }
  };

  return (
    <ScreenLayout scroll keyboardAvoid contentStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <ChevronLeft size={16} color={Colors.textPrimary} />
      </TouchableOpacity>

      <Text style={styles.heading}>Create account</Text>
      <Text style={styles.subheading}>Find your medicines in under 60 seconds</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>FULL NAME</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={setName}
          placeholder="Your full name"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="words"
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>PHONE NUMBER</Text>
        <View style={styles.phoneRow}>
          <View style={styles.dialCode}>
            <Text style={styles.dialFlag}>🇮🇳</Text>
            <Text style={styles.dialText}>+91</Text>
          </View>
          <TextInput
            style={[styles.phoneInput, errors.phone && styles.inputError]}
            value={phone}
            onChangeText={setPhone}
            placeholder="98765 43210"
            placeholderTextColor={Colors.textMuted}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
        {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          value={password}
          onChangeText={setPassword}
          placeholder="Min. 8 characters"
          placeholderTextColor={Colors.textMuted}
          secureTextEntry
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      </View>

      <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(p => !p)}>
        <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
          {agreed && <Check size={12} color={Colors.textInverse} />}
        </View>
        <Text style={styles.termsText}>
          I agree to the <Text style={styles.termsLink}>Terms of Service</Text>
          {' '}and <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </TouchableOpacity>
      {errors.agreeToTerms ? <Text style={styles.errorText}>{errors.agreeToTerms}</Text> : null}
      {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}

      <Button
        title="Create Account"
        onPress={handleSignup}
        disabled={!agreed}
        loading={sendOtp.isPending}
        fullWidth
      />

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate(Routes.LOGIN)}>
          <Text style={styles.loginLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  backBtn: {
    width: 32, height: 32, backgroundColor: Colors.gray100,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  heading: { fontSize: FontSize['3xl'], fontWeight: FontWeight.bold, color: Colors.textPrimary },
  subheading: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4, marginBottom: Spacing.xl },
  fieldGroup: { marginBottom: Spacing.lg },
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
  phoneRow: { flexDirection: 'row', gap: Spacing.sm },
  dialCode: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.gray50, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
  },
  dialFlag: { fontSize: FontSize.base },
  dialText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  phoneInput: {
    flex: 1, backgroundColor: Colors.gray50, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: FontSize.sm, color: Colors.textPrimary,
  },
  inputError: { borderColor: Colors.error },
  errorText: { fontSize: FontSize.xs, color: Colors.error, marginTop: 4 },
  formError: { fontSize: FontSize.xs, color: Colors.error, marginBottom: Spacing.md, textAlign: 'center' },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginBottom: Spacing.sm },
  checkbox: {
    width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  termsText: { flex: 1, fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
  termsLink: { color: Colors.primary, fontWeight: FontWeight.semibold },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing.lg },
  loginText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  loginLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
});

export default SignupScreen;
