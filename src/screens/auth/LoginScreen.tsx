/**
 * LoginScreen.tsx
 * Figma: "Login" — phone + password, OTP option, forgot password
 * Mock: On submit → navigate to Home directly (bypasses auth)
 * Real API: POST /auth/login → set tokens → navigate to Main
 * MOCK_MARKER: Replace navigation.navigate(Routes.HOME_TAB) with real API call
 */
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff, Phone } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Config } from '@/constants/config';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [showPass, setShowPass] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (Config.USE_MOCK) {
      // ── MOCK: Skip auth, go straight to Main ──────────────────────────────
      // TODO: Replace with real API call when backend is ready
      // await authApi.login({ phone, password }); useAuthStore.setUser(...)
      navigation.navigate(Routes.LOCATION_PERM);
      return;
    }
    // Real API call goes here
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Status bar spacer */}
      <View style={styles.statusSpacer} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={styles.logoBox}>
          <View style={styles.logoInner}>
            <View style={[styles.bar, styles.barTall]} />
            <View style={[styles.bar, styles.barMid]} />
            <View style={[styles.bar, styles.barShort]} />
          </View>
        </View>

        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subheading}>Sign in to find medicines near you</Text>

        {/* Phone field */}
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

        {/* Password field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPass(p => !p)}>
              {showPass
                ? <EyeOff size={16} color={Colors.textMuted} />
                : <Eye size={16} color={Colors.textMuted} />}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Sign In */}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
          <Text style={styles.primaryBtnText}>Sign In</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with OTP</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* OTP option */}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate(Routes.OTP, { phone: '' })}>
          <Phone size={16} color={Colors.textSecondary} />
          <Text style={styles.secondaryBtnText}>Sign in with OTP</Text>
        </TouchableOpacity>

        {/* Sign up link */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>No account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate(Routes.SIGNUP)}>
            <Text style={styles.signupLink}>Create one</Text>
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

  logoBox: {
    width: 40, height: 40,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoInner: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  bar: { width: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  barTall: { height: 16 },
  barMid: { height: 12, opacity: 0.5 },
  barShort: { height: 14, opacity: 0.7 },

  heading: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  subheading: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: Spacing.xxl,
  },

  fieldGroup: { marginBottom: Spacing.lg },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 6,
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
    flex: 1, backgroundColor: Colors.gray50,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: FontSize.sm, color: Colors.textPrimary,
  },
  passwordRow: {
    position: 'relative', flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.gray50, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  passwordInput: {
    flex: 1, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: FontSize.sm, color: Colors.textPrimary,
  },
  eyeBtn: { padding: Spacing.md },

  forgotBtn: { alignSelf: 'flex-end', marginTop: -Spacing.sm, marginBottom: Spacing.lg },
  forgotText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.semibold },

  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md,
    paddingVertical: 14, alignItems: 'center', marginBottom: Spacing.xl,
  },
  primaryBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },

  divider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.gray100 },
  dividerText: { fontSize: FontSize.xs, color: Colors.textMuted },

  secondaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, paddingVertical: 14, marginBottom: Spacing.xl,
  },
  secondaryBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },

  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signupText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  signupLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
});

export default LoginScreen;
