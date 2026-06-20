/**
 * SignupScreen.tsx
 * Figma: "Sign Up" — name, phone, password, agree to terms
 * Mock: Submit → navigate to OTP screen
 * Real API: POST /auth/signup → navigate to OTP
 * MOCK_MARKER: Replace navigation.navigate(OTP) with real API call
 */
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Check } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Config } from '@/constants/config';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSignup = () => {
    if (Config.USE_MOCK) {
      // ── MOCK: Skip signup, go to OTP ──────────────────────────────────────
      // TODO: POST /auth/signup when backend is ready
      navigation.navigate(Routes.OTP, { phone });
      return;
    }
    // Real API call goes here
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.statusSpacer} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.heading}>Create account</Text>
        <Text style={styles.subheading}>Find your medicines in under 60 seconds</Text>

        {/* Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>FULL NAME</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Arjun Sharma"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="words"
          />
        </View>

        {/* Phone */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>PHONE NUMBER</Text>
          <View style={styles.phoneRow}>
            <View style={styles.dialCode}>
              <Text style={styles.dialFlag}>🇮🇳</Text>
              <Text style={styles.dialText}>+91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="98765 43210"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Min. 8 characters"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
          />
        </View>

        {/* Terms */}
        <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(p => !p)}>
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Check size={12} color={Colors.textInverse} />}
          </View>
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryBtn, !agreed && styles.primaryBtnDisabled]}
          onPress={handleSignup}
          disabled={!agreed}>
          <Text style={styles.primaryBtnText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate(Routes.LOGIN)}>
            <Text style={styles.loginLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  statusSpacer: { height: 44 },
  scroll: { flex: 1 },
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
  termsRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: Spacing.md, marginBottom: Spacing.xl,
  },
  checkbox: {
    width: 20, height: 20, borderRadius: 6,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  termsText: { flex: 1, fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
  termsLink: { color: Colors.primary, fontWeight: FontWeight.semibold },
  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md,
    paddingVertical: 14, alignItems: 'center', marginBottom: Spacing.lg,
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  loginLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
});

export default SignupScreen;
