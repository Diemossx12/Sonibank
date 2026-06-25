import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../shared/components';
import { colors, spacing, radius } from '../../../shared/theme';
import { OTP_VALIDITY } from '../../../shared/constants';
import { useLang } from '../../../shared/i18n/langStore';

interface Props {
  phoneNumber: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
}

export const OtpScreen: React.FC<Props> = ({ phoneNumber, onVerify, onResend, onBack }) => {
  const { t } = useLang();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(OTP_VALIDITY);
  const [error, setError] = useState('');
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputs.current[index + 1]?.focus();
    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      onVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(OTP_VALIDITY);
    setOtp(['', '', '', '', '', '']);
    setError('');
    onResend();
    inputs.current[0]?.focus();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.title}>{t('otp_title')}</Text>
          <Text style={styles.subtitle}>
            {t('otp_subtitle')}{'\n'}
            <Text style={styles.phone}>{phoneNumber}</Text>
          </Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={r => { inputs.current[i] = r; }}
                style={[styles.otpInput, digit ? styles.otpFilled : null, error ? styles.otpError : null]}
                value={digit}
                onChangeText={v => handleChange(v.slice(-1), i)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.timerRow}>
            {timer > 0
              ? <Text style={styles.timerText}>{t('otp_valid')} <Text style={styles.timerBold}>{formatTimer(timer)}</Text></Text>
              : <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendText}>{t('otp_resend')}</Text>
                </TouchableOpacity>
            }
          </View>
          <Button
            title={t('otp_btn_verify')}
            onPress={() => onVerify(otp.join(''))}
            disabled={otp.some(d => d === '')}
            style={styles.button}
          />
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{t('otp_info')}</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  backBtn: { padding: spacing.xl, paddingBottom: 0 },
  backText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
  content: { flex: 1, padding: spacing.xl },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  subtitle: { fontSize: 15, color: colors.textSub, lineHeight: 24, marginBottom: spacing.xl },
  phone: { color: colors.primary, fontWeight: '600' },
  otpContainer: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: spacing.md },
  otpInput: {
    width: 48, height: 58, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.white, textAlign: 'center',
    fontSize: 24, fontWeight: '700', color: colors.text,
  },
  otpFilled: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  otpError: { borderColor: colors.danger },
  errorText: { color: colors.danger, fontSize: 13, textAlign: 'center', marginBottom: spacing.sm },
  timerRow: { alignItems: 'center', marginBottom: spacing.xl },
  timerText: { fontSize: 13, color: colors.textSub },
  timerBold: { fontWeight: '700', color: colors.primary },
  resendText: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  button: { marginBottom: spacing.lg },
  infoBox: {
    backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: spacing.md,
  },
  infoText: { fontSize: 13, color: colors.primary, lineHeight: 20 },
});
