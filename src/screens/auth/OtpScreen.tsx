/**
 * OtpScreen.tsx
 * Figma: "OTP Verification" — 6 digit boxes, countdown timer, resend
 * Mock: Submit → navigate to LocationPerm
 * Real API: POST /auth/verify-otp → navigate to LocationPerm
 * MOCK_MARKER: Replace navigation.navigate with real OTP verification call
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Phone } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Config } from '@/constants/config';

type Nav = NativeStackNavigationProp<AuthStackParamList>;
type RouteProps = RouteProp<AuthStackParamList, typeof Routes.OTP>;

const OTP_LENGTH = 6;

const OtpScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const phone = route.params?.phone ?? '';
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [seconds, setSeconds] = useState(29);
  const [focused, setFocused] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));

  // Countdown
  useEffect(() => {
    if (seconds > 0) {
      const t = setTimeout(() => setSeconds(s => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [seconds]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocused(index + 1);
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocused(index - 1);
    }
  };

  const handleVerify = () => {
    if (Config.USE_MOCK) {
      // ── MOCK: Skip OTP verification ────────────────────────────────────────
      // TODO: POST /auth/verify-otp when backend is ready
      navigation.navigate(Routes.LOCATION_PERM);
      return;
    }
  };

  const maskedPhone = phone ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}` : '+91 98765 43210';

  return (
    <View style={styles.root}>
      <View style={styles.statusSpacer} />
      <View style={styles.content}>
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={16} color={Colors.textPrimary} />
        </TouchableOpacity>

        {/* Icon */}
        <View style={styles.iconBox}>
          <Phone size={24} color={Colors.primary} />
        </View>

        <Text style={styles.heading}>Verify your number</Text>
        <Text style={styles.sub}>
          We sent a 6-digit code to{' '}
          <Text style={styles.phoneText}>{maskedPhone}</Text>
        </Text>

        {/* OTP boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={ref => { inputRefs.current[i] = ref; }}
              style={[styles.otpBox, i === focused && styles.otpBoxFocused]}
              value={digit}
              onChangeText={text => handleChange(text, i)}
              onKeyPress={e => handleKeyPress(e, i)}
              onFocus={() => setFocused(i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectionColor={Colors.primary}
            />
          ))}
        </View>

        {/* Countdown / Resend */}
        <Text style={styles.resendText}>
          {seconds > 0 ? (
            `Resend code in 0:${seconds.toString().padStart(2, '0')}`
          ) : null}
        </Text>
        {seconds === 0 && (
          <TouchableOpacity onPress={() => setSeconds(29)}>
            <Text style={styles.resendLink}>Resend OTP</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.primaryBtn} onPress={handleVerify}>
          <Text style={styles.primaryBtnText}>Verify &amp; Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  statusSpacer: { height: 44 },
  content: { flex: 1, paddingHorizontal: Spacing.xl },
  backBtn: {
    width: 32, height: 32, backgroundColor: Colors.gray100,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  iconBox: {
    width: 48, height: 48, backgroundColor: Colors.primaryLight,
    borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  heading: { fontSize: FontSize['3xl'], fontWeight: FontWeight.bold, color: Colors.textPrimary },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4, marginBottom: Spacing.xxl },
  phoneText: { fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  otpRow: {
    flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: Spacing.xl,
  },
  otpBox: {
    width: 46, height: 52, borderWidth: 2, borderRadius: Radius.md,
    borderColor: Colors.border, backgroundColor: Colors.gray50,
    fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary,
  },
  otpBoxFocused: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  resendText: {
    textAlign: 'center', fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xxl,
  },
  resendLink: {
    textAlign: 'center', fontSize: FontSize.sm, color: Colors.primary,
    fontWeight: FontWeight.semibold, marginBottom: Spacing.xxl,
  },
  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md,
    paddingVertical: 14, alignItems: 'center',
  },
  primaryBtnText: { color: Colors.textInverse, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});

export default OtpScreen;
