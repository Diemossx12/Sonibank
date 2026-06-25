import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSequence, withTiming, FadeIn
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon }           from '../../../shared/components/Icon';
import { BrandMark }      from '../../../shared/components/BrandMark';
import { FadeInView }     from '../../../shared/components/FadeInView';
import { PressableScale } from '../../../shared/components/PressableScale';
import { LangSwitcher }   from '../../../shared/components/LangSwitcher';
import { useLang }        from '../../../shared/i18n/langStore';
import { colors, radius } from '../../../shared/theme';

interface Props {
  onNext: (accountNumber: string) => void;
  onBack: () => void;
}

export const LoginScreen: React.FC<Props> = ({ onNext, onBack }) => {
  const { t } = useLang();
  const [account, setAccount] = useState('');
  const [error,   setError]   = useState('');
  const [focused, setFocused] = useState(false);

  const shakeX  = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const shake = () => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 60 }),
      withTiming( 10, { duration: 60 }),
      withTiming(-8,  { duration: 60 }),
      withTiming( 8,  { duration: 60 }),
      withTiming( 0,  { duration: 60 }),
    );
  };

  const validate = () => {
    if (!account.trim())          { setError(t('login_error_empty'));   shake(); return false; }
    if (account.trim().length < 8){ setError(t('login_error_invalid')); shake(); return false; }
    return true;
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[colors.gradStart, colors.gradMid, colors.gradEnd]}
        style={s.gradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      >
        <View style={s.circle1} />
        <View style={s.circle2} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={s.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <FadeInView delay={0} from="top" style={s.header}>
              <TouchableOpacity onPress={onBack} style={s.backBtn}>
                <Icon name="chevron-left" size={20} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
              <View style={s.brandRow}>
                <BrandMark size={40} variant="white" />
                <Text style={s.brandName}>SONIBANK</Text>
              </View>
              <LangSwitcher />
            </FadeInView>

            <FadeInView delay={200} from="bottom" style={s.card}>

              <View style={s.cardIconWrap}>
                <Icon name="lock" size={24} color={colors.primary} />
              </View>

              <Text style={s.cardTitle}>{t('login_title')}</Text>
              <Text style={s.cardSub}>{t('login_subtitle')}</Text>

              <Animated.View style={shakeStyle}>
                <View style={[
                  s.inputWrap,
                  focused && s.inputFocused,
                  error   && s.inputError,
                ]}>
                  <Icon name="credit-card" size={18} color={error ? colors.danger : focused ? colors.primary : colors.textMuted} />
                  <TextInput
                    style={s.input}
                    placeholder={t('login_placeholder')}
                    placeholderTextColor={colors.textMuted}
                    value={account}
                    onChangeText={txt => { setAccount(txt.replace(/[^0-9]/g,'')); setError(''); }}
                    keyboardType="numeric"
                    maxLength={20}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                  />
                  {account.length > 0 && (
                    <TouchableOpacity onPress={() => { setAccount(''); setError(''); }}>
                      <Icon name="x-circle" size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>

              {error ? (
                <Animated.View entering={FadeIn.duration(200)} style={s.errorRow}>
                  <Icon name="alert-circle" size={13} color={colors.danger} />
                  <Text style={s.errorText}>{error}</Text>
                </Animated.View>
              ) : (
                <Text style={s.hint}>{t('login_hint')}</Text>
              )}

              <PressableScale
                onPress={() => { if (validate()) onNext(account.trim()); }}
                style={[s.continueBtn, (!account || account.length < 8) && { opacity: 0.5 }]}
              >
                <Text style={s.continueBtnText}>{t('login_btn_continue')}</Text>
                <View style={s.continueBtnArrow}>
                  <Icon name="arrow-right" size={17} color={colors.primary} />
                </View>
              </PressableScale>

              <View style={s.separator}>
                <View style={s.sepLine} />
                <Text style={s.sepText}>{t('login_or')}</Text>
                <View style={s.sepLine} />
              </View>

              <TouchableOpacity style={s.helpBtn}>
                <Icon name="help-circle" size={16} color={colors.textMuted} />
                <Text style={s.helpText}>{t('login_help')}</Text>
              </TouchableOpacity>
            </FadeInView>

            <FadeInView delay={400} from="bottom" style={s.secureFooter}>
              <Icon name="shield" size={14} color="rgba(255,255,255,0.5)" />
              <Text style={s.secureText}>{t('login_security')}</Text>
            </FadeInView>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: colors.gradStart },
  gradient:   { flex: 1 },
  scroll:     { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },

  circle1:    { position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(255,255,255,0.04)', top: -120, right: -80 },
  circle2:    { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.04)', bottom: 40, left: -60 },

  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  backBtn:    { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  brandRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandName:  { fontSize: 18, fontWeight: '800', color: colors.white, letterSpacing: 3 },

  card:       { backgroundColor: colors.white, borderRadius: 28, padding: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 32, elevation: 12 },

  cardIconWrap: { width: 56, height: 56, borderRadius: radius.lg, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  cardTitle:  { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 6, letterSpacing: -0.5 },
  cardSub:    { fontSize: 14, color: colors.textSub, lineHeight: 20, marginBottom: 24 },

  inputWrap:  { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: 14, height: 56, backgroundColor: colors.surface, marginBottom: 8 },
  inputFocused: { borderColor: colors.primary, backgroundColor: colors.white },
  inputError: { borderColor: colors.danger, backgroundColor: colors.dangerLight },
  input:      { flex: 1, fontSize: 16, color: colors.text, fontWeight: '500' },

  errorRow:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  errorText:  { fontSize: 12, color: colors.danger, fontWeight: '500' },
  hint:       { fontSize: 12, color: colors.textMuted, marginBottom: 20, lineHeight: 18 },

  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 56, borderRadius: radius.lg, backgroundColor: colors.primary, marginBottom: 20 },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: colors.white },
  continueBtnArrow: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

  separator:  { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  sepLine:    { flex: 1, height: 1, backgroundColor: colors.border },
  sepText:    { fontSize: 12, color: colors.textMuted, fontWeight: '500' },

  helpBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  helpText:   { fontSize: 14, color: colors.textMuted, fontWeight: '500' },

  secureFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24 },
  secureText: { fontSize: 11, color: 'rgba(255,255,255,0.45)' },
});
