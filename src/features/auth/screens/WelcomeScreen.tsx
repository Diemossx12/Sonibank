import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSpring, withDelay,
  withRepeat, withSequence, Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView }       from 'expo-blur';
import { Icon }           from '../../../shared/components/Icon';
import { PressableScale } from '../../../shared/components/PressableScale';
import { FloatingBubble } from '../../../shared/components/FloatingBubble';
import { LangSwitcher }   from '../../../shared/components/LangSwitcher';
import { useLang }        from '../../../shared/i18n/langStore';
import { colors } from '../../../shared/theme';

const { width: W } = Dimensions.get('window');

const BUBBLES = [
  { size: 80,  x: -20,    y: 30,   delay: 0,    duration: 4200, opacity: 0.5,  color: 'rgba(9,181,234,0.18)'   },
  { size: 48,  x: W-60,   y: 60,   delay: 400,  duration: 3800, opacity: 0.45, color: 'rgba(255,255,255,0.12)' },
  { size: 32,  x: W-90,   y: 160,  delay: 700,  duration: 5000, opacity: 0.4,  color: 'rgba(9,181,234,0.22)'   },
  { size: 60,  x: 20,     y: 140,  delay: 300,  duration: 4600, opacity: 0.35, color: 'rgba(255,255,255,0.10)' },
  { size: 20,  x: W/2-10, y: 20,   delay: 900,  duration: 3400, opacity: 0.5,  color: 'rgba(255,255,255,0.20)' },
  { size: 14,  x: W/2+40, y: 80,   delay: 1200, duration: 3000, opacity: 0.55, color: 'rgba(9,181,234,0.30)'   },
  { size: 26,  x: 60,     y: 220,  delay: 600,  duration: 4800, opacity: 0.3,  color: 'rgba(255,255,255,0.08)' },
  { size: 18,  x: W-110,  y: 240,  delay: 1500, duration: 3600, opacity: 0.45, color: 'rgba(9,181,234,0.25)'   },
];

interface Props { onLogin: () => void; }

export const WelcomeScreen: React.FC<Props> = ({ onLogin }) => {
  const { t } = useLang();

  const logoScale   = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const nameOpacity = useSharedValue(0);
  const nameY       = useSharedValue(20);
  const glassOpacity= useSharedValue(0);
  const glassY      = useSharedValue(30);
  const btnOpacity  = useSharedValue(0);
  const btnY        = useSharedValue(20);
  const arrowX      = useSharedValue(0);
  const shimmer     = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withDelay(100, withTiming(1, { duration: 500 }));
    logoScale.value   = withDelay(100, withSpring(1, { damping: 13, stiffness: 160 }));
    nameOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
    nameY.value       = withDelay(400, withSpring(0, { damping: 20, stiffness: 200 }));
    glassOpacity.value= withDelay(650, withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) }));
    glassY.value      = withDelay(650, withSpring(0, { damping: 18, stiffness: 160 }));
    btnOpacity.value  = withDelay(900, withTiming(1, { duration: 400 }));
    btnY.value        = withDelay(900, withSpring(0, { damping: 18, stiffness: 200 }));

    arrowX.value = withDelay(1400, withRepeat(
      withSequence(
        withTiming(6, { duration: 800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.quad) }),
      ), -1, true
    ));

    shimmer.value = withDelay(1600, withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
      ), -1, true
    ));
  }, []);

  const logoStyle    = useAnimatedStyle(() => ({ opacity: logoOpacity.value,  transform: [{ scale: logoScale.value }] }));
  const nameStyle    = useAnimatedStyle(() => ({ opacity: nameOpacity.value,  transform: [{ translateY: nameY.value }] }));
  const glassStyle   = useAnimatedStyle(() => ({ opacity: glassOpacity.value, transform: [{ translateY: glassY.value }] }));
  const btnStyle     = useAnimatedStyle(() => ({ opacity: btnOpacity.value,   transform: [{ translateY: btnY.value }] }));
  const arrowStyle   = useAnimatedStyle(() => ({ transform: [{ translateX: arrowX.value }] }));
  const shimmerStyle = useAnimatedStyle(() => ({ opacity: 0.08 + shimmer.value * 0.12 }));

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#043A50', '#065F7D', '#0790BB', '#09B5EA']}
        style={s.gradient}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
      >
        {BUBBLES.map((b, i) => (
          <FloatingBubble key={i} {...b} />
        ))}

        <View style={s.inner}>

          {/* Lang switcher */}
          <View style={s.langBtn}>
            <LangSwitcher />
          </View>

          {/* Logo + nom + slogan */}
          <View style={s.brandSection}>
            <Animated.View style={logoStyle}>
              <View style={s.logoCard}>
                <Image
                  source={require('../../../shared/assets/logo.png')}
                  style={s.logo}
                  resizeMode="contain"
                />
              </View>
            </Animated.View>
            <Animated.View style={[{ alignItems: 'center' }, nameStyle]}>
              <Text style={s.bankName}>{t('welcome_bank_name')}</Text>
              <Text style={s.bankSub}>{t('welcome_bank_sub')}</Text>
              <Text style={s.slogan}>{t('welcome_slogan')}</Text>
            </Animated.View>
          </View>

          {/* Carte + glass panel */}
          <Animated.View style={[s.glassWrap, glassStyle]}>
            <View style={s.cardImageWrap}>
              <Image
                source={require('../../../shared/assets/card_preview.png')}
                style={s.cardImage}
                resizeMode="contain"
              />
              {/* Liquid glass blur overlay on card */}
              <BlurView intensity={18} tint="light" style={s.cardBlur}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.12)']}
                  style={s.cardBlurGrad}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              </BlurView>
            </View>

            <View style={s.glassPanel}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.03)', 'transparent']}
                style={s.glassReflect}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
              <View style={s.glassContent}>
                <View style={s.glassTitleRow}>
                  <View style={s.glassIconWrap}>
                    <Icon name="smartphone" size={15} color={colors.primary} />
                  </View>
                  <Text style={s.glassTitle}>{t('welcome_glass_title')}</Text>
                </View>
                <Text style={s.glassSub}>{t('welcome_glass_sub')}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Bouton + securite */}
          <Animated.View style={[s.bottomSection, btnStyle]}>
            <PressableScale onPress={onLogin} style={s.loginBtn}>
              <Animated.View style={[s.btnShimmer, shimmerStyle]} />
              <LinearGradient
                colors={['#FFFFFF', '#F0F8FF']}
                style={s.btnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <View style={s.btnContent}>
                  <View style={s.btnIconLeft}>
                    <Icon name="log-in" size={18} color={colors.primary} />
                  </View>
                  <Text style={s.loginBtnText}>{t('welcome_btn_login')}</Text>
                  <Animated.View style={[s.btnArrowWrap, arrowStyle]}>
                    <Icon name="chevron-right" size={20} color={colors.white} />
                  </Animated.View>
                </View>
              </LinearGradient>
            </PressableScale>

            <View style={s.secureRow}>
              <Icon name="lock" size={10} color="rgba(255,255,255,0.4)" />
              <Text style={s.secureText}>{t('welcome_security')}</Text>
            </View>
          </Animated.View>

        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: '#043A50' },
  gradient: { flex: 1 },
  inner:    {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    justifyContent: 'space-between',
    position: 'relative',
  },

  langBtn: { position: 'absolute', top: 0, right: 0, zIndex: 99 },

  brandSection: { alignItems: 'center', gap: 12 },
  logoCard: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 12,
  },
  logo:     { width: 58, height: 58 },
  bankName: { fontSize: 28, fontWeight: '900', color: colors.white, letterSpacing: 5 },
  bankSub:  { fontSize: 9,  color: 'rgba(255,255,255,0.55)', letterSpacing: 2, marginBottom: 6 },
  slogan:   { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', letterSpacing: 0.3 },

  glassWrap: {
    borderRadius: 22, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35, shadowRadius: 24, elevation: 16,
  },

  cardImageWrap: { backgroundColor: '#0790BB', padding: 20, alignItems: 'center', position: 'relative', overflow: 'hidden' },
  cardImage:     { width: '100%', height: undefined, aspectRatio: 1.586, borderRadius: 14 },
  cardBlur:      { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 14 },
  cardBlurGrad:  { flex: 1 },

  glassPanel: {
    backgroundColor: 'rgba(4,58,80,0.85)',
    borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  glassReflect: { position: 'absolute', top: 0, left: 0, right: 0, height: 30 },
  glassContent: { padding: 16, gap: 8 },
  glassTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  glassIconWrap: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: 'rgba(9,181,234,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  glassTitle: { fontSize: 14, fontWeight: '700', color: colors.white, flex: 1 },
  glassSub:   { fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 18 },

  bottomSection: { gap: 12 },

  loginBtn: {
    borderRadius: 20, overflow: 'hidden', position: 'relative',
    shadowColor: '#09B5EA', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 10,
  },
  btnShimmer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#09B5EA', zIndex: 0, borderRadius: 20,
  },
  btnGradient: { borderRadius: 20, borderWidth: 1, borderColor: 'rgba(9,181,234,0.15)' },
  btnContent:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60, paddingHorizontal: 20, gap: 12 },
  btnIconLeft: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  loginBtnText:{ flex: 1, fontSize: 17, fontWeight: '800', color: colors.primary, letterSpacing: 0.3 },
  btnArrowWrap:{ width: 36, height: 36, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },

  secureRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  secureText: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
});
