import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withSequence, withTiming
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon }        from '../../../shared/components/Icon';
import { FadeInView }  from '../../../shared/components/FadeInView';
import { colors, radius } from '../../../shared/theme';
import { useLang }     from '../../../shared/i18n/langStore';

const PIN_LENGTH = 6;

interface Props {
  mode: 'login' | 'create' | 'confirm';
  onSuccess: (pin: string) => void;
  onBack: () => void;
  accountNumber?: string;
}

const KEYPAD = [
  ['1','2','3'],
  ['4','5','6'],
  ['7','8','9'],
  ['','0','⌫'],
];

export const PinScreen: React.FC<Props> = ({ mode, onSuccess, onBack, accountNumber }) => {
  const { t } = useLang();
  const [pin, setPin]       = useState('');
  const [error, setError]   = useState('');

  const dotsShake  = useSharedValue(0);
  const dotsScale  = useSharedValue(1);

  const dotsStyle  = useAnimatedStyle(() => ({
    transform: [{ translateX: dotsShake.value }, { scale: dotsScale.value }],
  }));

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      dotsScale.value = withSequence(
        withSpring(1.06, { damping: 10 }),
        withSpring(1,    { damping: 12 })
      );
      setTimeout(() => onSuccess(pin), 250);
    }
  }, [pin]);

  const handleKey = (key: string) => {
    if (key === '') return;
    if (key === '⌫') {
      setPin(p => p.slice(0, -1));
      setError('');
      return;
    }
    if (pin.length < PIN_LENGTH) {
      setPin(p => p + key);
    }
  };

  const titles: Record<string, string> = {
    login:   t('pin_login'),
    create:  t('pin_create'),
    confirm: t('pin_confirm'),
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[colors.gradStart, colors.gradMid, colors.gradEnd]}
        style={s.gradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      >
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Icon name="chevron-left" size={22} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        <FadeInView delay={0} from="top" style={s.header}>
          <View style={s.logoCard}>
            <Image source={require('../../../shared/assets/logo.png')} style={s.logo} resizeMode="contain" />
          </View>
          {accountNumber && (
            <View style={s.accountBadge}>
              <Icon name="credit-card" size={12} color={colors.primary} />
              <Text style={s.accountBadgeText}>****{accountNumber.slice(-4)}</Text>
            </View>
          )}
          <Text style={s.title}>{titles[mode]}</Text>
        </FadeInView>

        <FadeInView delay={150} from="none" style={s.dotsSection}>
          <Animated.View style={[s.dotsRow, dotsStyle]}>
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <View key={i} style={[s.dot, i < pin.length && s.dotFilled]}>
                {i < pin.length && <View style={s.dotInner} />}
              </View>
            ))}
          </Animated.View>
          {error ? <Text style={s.errorText}>{error}</Text> : null}
        </FadeInView>

        <FadeInView delay={250} from="bottom" style={s.keypad}>
          {KEYPAD.map((row, ri) => (
            <View key={ri} style={s.keyRow}>
              {row.map((key, ki) => (
                key === '' ? (
                  <View key={ki} style={s.keyPlaceholder} />
                ) : (
                  <TouchableOpacity
                    key={ki}
                    style={[s.key, key === '⌫' && s.keyDelete]}
                    onPress={() => handleKey(key)}
                    activeOpacity={0.65}
                  >
                    {key === '⌫'
                      ? <Icon name="delete" size={20} color="rgba(255,255,255,0.85)" />
                      : <Text style={s.keyText}>{key}</Text>
                    }
                  </TouchableOpacity>
                )
              ))}
            </View>
          ))}
        </FadeInView>

        <View style={s.secureRow}>
          <Icon name="lock" size={11} color="rgba(255,255,255,0.4)" />
          <Text style={s.secureNote}>
            {'  '}{t('pin_secure')}
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: colors.gradStart },
  gradient:   { flex: 1, paddingHorizontal: 24 },
  backBtn:    { marginTop: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },

  header:     { alignItems: 'center', marginTop: 16, marginBottom: 32 },
  logoCard:   { width: 72, height: 72, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
  logo:       { width: 52, height: 52 },
  accountBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.white, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 12 },
  accountBadgeText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  title:      { fontSize: 18, fontWeight: '600', color: colors.white, textAlign: 'center' },

  dotsSection:{ alignItems: 'center', marginBottom: 40 },
  dotsRow:    { flexDirection: 'row', gap: 14, marginBottom: 12 },
  dot:        { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center' },
  dotFilled:  { borderColor: colors.white, backgroundColor: 'rgba(255,255,255,0.15)' },
  dotInner:   { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.white },
  errorText:  { color: '#FF8FA3', fontSize: 13, fontWeight: '500' },

  keypad:     { gap: 14 },
  keyRow:     { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  key:        { width: 76, height: 76, borderRadius: 38, backgroundColor: 'rgba(255,255,255,0.13)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  keyDelete:  { backgroundColor: 'transparent', borderColor: 'transparent' },
  keyPlaceholder: { width: 76, height: 76 },
  keyText:    { fontSize: 26, fontWeight: '500', color: colors.white },

  secureRow:  { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, marginBottom: 16 },
  secureNote: { textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.4)' },
});
