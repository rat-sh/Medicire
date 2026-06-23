/**
 * LoginScreen.tsx — Figma: "Login"
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff, Phone } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Button } from '@/components/ui/Button';
import { loginSchema } from '@/utils/validators';
import { useLogin, useSendOtp } from '@/hooks/useAuth';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const login = useLogin();
  const sendOtp = useSendOtp();

  const [showPass, setShowPass] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ phone?: string; password?: string; form?: string }>({});

  const handleLogin = async () => {
    const parsed = loginSchema.safeParse({ phone, password });
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        phone: fieldErrors.phone?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    try {
      await login.mutateAsync(parsed.data);
    } catch {
      setErrors({ form: 'Sign in failed. Check your credentials and try again.' });
    }
  };

  const handleOtpLogin = async () => {
    const phoneResult = loginSchema.shape.phone.safeParse(phone);
    if (!phoneResult.success) {
      setErrors({ phone: phoneResult.error.flatten().formErrors[0] });
      return;
    }

    setErrors({});
    try {
      await sendOtp.mutateAsync({ phone: phoneResult.data });
      navigation.navigate(Routes.OTP, { phone: phoneResult.data, mode: 'login' });
    } catch {
      setErrors({ form: 'Could not send OTP. Please try again.' });
    }
  };

  return (
    <ScreenLayout scroll keyboardAvoid contentStyle={styles.content}>
      <View style={styles.logoBox}>
        <View style={styles.logoInner}>
          <View style={[styles.bar, styles.barTall]} />
          <View style={[styles.bar, styles.barMid]} />
          <View style={[styles.bar, styles.barShort]} />
        </View>
      </View>

      <Text style={styles.heading}>Welcome back</Text>
      <Text style={styles.subheading}>Sign in to find medicines near you</Text>

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
        <View style={[styles.passwordRow, errors.password && styles.inputError]}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry={!showPass}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(p => !p)}>
            {showPass
              ? <EyeOff size={16} color={Colors.textMuted} />
              : <Eye size={16} color={Colors.textMuted} />}
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      </View>

      {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}

      <TouchableOpacity style={styles.forgotBtn}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <Button
        title="Sign In"
        onPress={handleLogin}
        loading={login.isPending}
        fullWidth
      />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with OTP</Text>
        <View style={styles.dividerLine} />
      </View>

      <Button
        title="Sign in with OTP"
        onPress={handleOtpLogin}
        variant="outline"
        icon={Phone}
        loading={sendOtp.isPending}
        fullWidth
      />

      <View style={styles.signupRow}>
        <Text style={styles.signupText}>No account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate(Routes.SIGNUP)}>
          <Text style={styles.signupLink}>Create one</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  logoBox: {
    width: 40, height: 40, backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoInner: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  bar: { width: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  barTall: { height: 16 },
  barMid: { height: 12, opacity: 0.5 },
  barShort: { height: 14, opacity: 0.7 },
  heading: { fontSize: FontSize['3xl'], fontWeight: FontWeight.bold, color: Colors.textPrimary },
  subheading: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4, marginBottom: Spacing.xxl },
  fieldGroup: { marginBottom: Spacing.lg },
  label: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold,
    color: Colors.textSecondary, letterSpacing: 0.8, marginBottom: 6,
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
  passwordRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.gray50, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  passwordInput: {
    flex: 1, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: FontSize.sm, color: Colors.textPrimary,
  },
  eyeBtn: { padding: Spacing.md },
  inputError: { borderColor: Colors.error },
  errorText: { fontSize: FontSize.xs, color: Colors.error, marginTop: 4 },
  formError: { fontSize: FontSize.xs, color: Colors.error, marginBottom: Spacing.md, textAlign: 'center' },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -Spacing.sm, marginBottom: Spacing.lg },
  forgotText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.semibold },
  divider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginVertical: Spacing.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.gray100 },
  dividerText: { fontSize: FontSize.xs, color: Colors.textMuted },
  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing.xl },
  signupText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  signupLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
});

export default LoginScreen;
