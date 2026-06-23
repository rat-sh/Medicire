/**
 * OtpScreen.tsx — Figma: "OTP Verification"
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  NativeSyntheticEvent, TextInputKeyPressEventData,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Phone } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList } from '@/navigation/types';
import { Routes } from '@/constants/routes';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Config } from '@/constants/config';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Button } from '@/components/ui/Button';
import { otpSchema } from '@/utils/validators';
import { useSendOtp, useVerifyOtp } from '@/hooks/useAuth';

type Nav = NativeStackNavigationProp<AuthStackParamList>;
type RouteProps = RouteProp<AuthStackParamList, typeof Routes.OTP>;

const OTP_LENGTH = Config.OTP_LENGTH;

const OtpScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { phone, name, mode = 'signup' } = route.params;

  const verifyOtp = useVerifyOtp();
  const sendOtp = useSendOtp();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [seconds, setSeconds] = useState<number>(Config.OTP_RESEND_TIMEOUT);
  const [focused, setFocused] = useState(0);
  const [error, setError] = useState('');
  const inputRefs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));

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

  const handleVerify = async () => {
    const code = otp.join('');
    const parsed = otpSchema.safeParse(code);
    if (!parsed.success) {
      setError(parsed.error.flatten().formErrors[0] ?? 'Enter a valid OTP');
      return;
    }

    setError('');
    try {
      await verifyOtp.mutateAsync({ phone, otp: parsed.data, name, mode });
      if (mode === 'login') {
        return;
      }
      navigation.navigate(Routes.LOCATION_PERM);
    } catch {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp.mutateAsync({ phone });
      setSeconds(Config.OTP_RESEND_TIMEOUT);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch {
      setError('Could not resend OTP. Please try again.');
    }
  };

  const formatPhone = (value: string) => {
    if (value.length <= 5) return value;
    return `${value.slice(0, 5)} ${value.slice(5)}`;
  };

  const maskedPhone = phone ? `+91 ${formatPhone(phone)}` : '+91 —';

  return (
    <ScreenLayout contentStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <ChevronLeft size={16} color={Colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.iconBox}>
        <Phone size={24} color={Colors.primary} />
      </View>

      <Text style={styles.heading}>Verify your number</Text>
      <Text style={styles.sub}>
        We sent a 6-digit code to{' '}
        <Text style={styles.phoneText}>{maskedPhone}</Text>
      </Text>

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

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.resendText}>
        {seconds > 0
          ? `Resend code in 0:${seconds.toString().padStart(2, '0')}`
          : ''}
      </Text>
      {seconds === 0 && (
        <TouchableOpacity onPress={handleResend} disabled={sendOtp.isPending}>
          <Text style={styles.resendLink}>Resend OTP</Text>
        </TouchableOpacity>
      )}

      <Button
        title="Verify & Continue"
        onPress={handleVerify}
        loading={verifyOtp.isPending}
        fullWidth
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
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
  otpRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: Spacing.lg },
  otpBox: {
    width: 46, height: 52, borderWidth: 2, borderRadius: Radius.md,
    borderColor: Colors.border, backgroundColor: Colors.gray50,
    fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary,
  },
  otpBoxFocused: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  errorText: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.error, marginBottom: Spacing.md },
  resendText: { textAlign: 'center', fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.lg },
  resendLink: { textAlign: 'center', fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold, marginBottom: Spacing.xxl },
});

export default OtpScreen;
