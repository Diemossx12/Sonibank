import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Dimensions, Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, withSequence,
  withDelay, interpolate, Easing, runOnJS
} from 'react-native-reanimated';
import {
  GestureDetector, Gesture
} from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon }           from '../../../shared/components/Icon';
import { BrandMark }      from '../../../shared/components/BrandMark';
import { FadeInView }     from '../../../shared/components/FadeInView';
import { AnimatedCard }   from '../../../shared/components/AnimatedCard';
import { PressableScale } from '../../../shared/components/PressableScale';
import { colors, radius } from '../../../shared/theme';
import { MOCK_USER, MOCK_ACCOUNTS } from '../../../shared/mock/data';

interface Props { onBack: () => void; }

const { width: W } = Dimensions.get('window');
const CARD_W = W - 48;
const CARD_H = CARD_W * 0.58;

const Card3D: React.FC<{ blocked: boolean }> = ({ blocked }) => {
  const rotateY = useSharedValue(0);
  const rotateX = useSharedValue(0);
  const scale   = useSharedValue(1);
  const flipped = useSharedValue(0);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    rotateY.value = withSequence(
      withTiming(-15, { duration: 600, easing: Easing.out(Easing.cubic) }),
      withSpring(0, { damping: 12, stiffness: 100 })
    );
    scale.value = withSequence(
      withTiming(0.85, { duration: 0 }),
      withDelay(100, withSpring(1, { damping: 14, stiffness: 120 }))
    );
  }, []);

  const pan = Gesture.Pan()
    .onUpdate(e => {
      rotateY.value = interpolate(e.translationX, [-W/2, W/2], [-20, 20]);
      rotateX.value = interpolate(e.translationY, [-100, 100], [10, -10]);
    })
    .onEnd(() => {
      rotateY.value = withSpring(0, { damping: 12 });
      rotateX.value = withSpring(0, { damping: 12 });
    });

  const flipFace = (toBack: boolean) => {
    setTimeout(() => setShowBack(toBack), 300);
  };

  const tap = Gesture.Tap()
    .onEnd(() => {
      const toBack = flipped.value === 0;
      flipped.value = withTiming(toBack ? 1 : 0, { duration: 600, easing: Easing.inOut(Easing.cubic) });
      runOnJS(flipFace)(toBack);
    });

  const composed = Gesture.Simultaneous(pan, tap);

  const frontStyle = useAnimatedStyle(() => {
    const rot = interpolate(flipped.value, [0, 1], [0, 180]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY.value + rot}deg` },
        { rotateX: `${rotateX.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[{ width: CARD_W, height: CARD_H }, frontStyle]}>
        {!showBack ? (
          <LinearGradient
            colors={blocked
              ? ['#555555', '#333333', '#222222']
              : [colors.gradStart, colors.gradMid, '#0DC5FF']
            }
            style={cd.face}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.9, y: 0.9 }}
          >
            <View style={cd.circle1} />
            <View style={cd.circle2} />

            <View style={cd.row}>
              <BrandMark size={36} variant="white" />
              {blocked && (
                <View style={cd.blockedBadge}>
                  <Icon name="lock" size={11} color={colors.white} />
                  <Text style={cd.blockedText}>BLOQUEE</Text>
                </View>
              )}
            </View>

            <View style={cd.chip}>
              <View style={cd.chipInner}>
                <View style={cd.chipLine} />
                <View style={[cd.chipLine, { opacity: 1 }]} />
                <View style={cd.chipLine} />
              </View>
            </View>

            <Text style={cd.number}>{MOCK_USER.cardNumber}</Text>

            <View style={cd.row}>
              <View>
                <Text style={cd.labelSmall}>TITULAIRE</Text>
                <Text style={cd.value}>
                  {MOCK_USER.firstName.toUpperCase()} {MOCK_USER.lastName.toUpperCase()}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={cd.labelSmall}>EXPIRE</Text>
                <Text style={cd.value}>{MOCK_USER.cardExpiry}</Text>
              </View>
              <View style={cd.network}>
                <View style={[cd.networkCircle, { backgroundColor: '#EB001B', marginRight: -10 }]} />
                <View style={[cd.networkCircle, { backgroundColor: '#F79E1B', opacity: 0.9 }]} />
              </View>
            </View>

            <Text style={cd.flipHint}>Toucher pour retourner</Text>
          </LinearGradient>
        ) : (
          <LinearGradient
            colors={blocked
              ? ['#333333', '#444444', '#333333']
              : ['#054D6F', '#065F7D', '#0790BB']
            }
            style={cd.face}
          >
            <View style={cd.magStripe} />
            <View style={cd.cvvRow}>
              <View style={cd.cvvWhite}>
                <Text style={cd.cvvText}>* * *</Text>
              </View>
              <Text style={cd.cvvLabel}>CVV</Text>
            </View>
            <View style={cd.ibanRow}>
              <Text style={cd.ibanLabel}>IBAN</Text>
              <Text style={cd.ibanValue}>{MOCK_USER.iban}</Text>
            </View>
            <View style={[cd.row, { marginTop: 'auto' }]}>
              <Text style={cd.flipHint}>Toucher pour retourner</Text>
              <BrandMark size={28} variant="white" />
            </View>
          </LinearGradient>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const cd = StyleSheet.create({
  face:        { width: CARD_W, height: CARD_H, borderRadius: 20, padding: 20, justifyContent: 'space-between', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.35, shadowRadius: 24, elevation: 16 },
  circle1:     { position: 'absolute', width: CARD_H * 1.4, height: CARD_H * 1.4, borderRadius: CARD_H * 0.7, backgroundColor: 'rgba(255,255,255,0.05)', top: -CARD_H * 0.4, right: -CARD_H * 0.3 },
  circle2:     { position: 'absolute', width: CARD_H * 0.9, height: CARD_H * 0.9, borderRadius: CARD_H * 0.45, backgroundColor: 'rgba(255,255,255,0.04)', bottom: -CARD_H * 0.3, left: -CARD_H * 0.1 },
  row:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  blockedBadge:{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.danger, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  blockedText: { fontSize: 9, fontWeight: '800', color: colors.white, letterSpacing: 1 },
  chip:        { width: 38, height: 28, borderRadius: 6, backgroundColor: '#D4AF37', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  chipInner:   { width: 34, height: 24, borderRadius: 4, borderWidth: 1, borderColor: '#B8960C', gap: 5, padding: 3 },
  chipLine:    { height: 1, backgroundColor: '#B8960C', opacity: 0.7 },
  number:      { fontSize: 17, fontWeight: '700', color: colors.white, letterSpacing: 2.5 },
  labelSmall:  { fontSize: 9, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, marginBottom: 3 },
  value:       { fontSize: 12, fontWeight: '700', color: colors.white, letterSpacing: 0.5 },
  network:     { flexDirection: 'row', alignItems: 'center' },
  networkCircle: { width: 28, height: 28, borderRadius: 14 },
  magStripe:   { height: 42, backgroundColor: '#1A1A1A', marginHorizontal: -20, marginTop: 16 },
  cvvRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  cvvWhite:    { flex: 1, height: 36, backgroundColor: colors.white, borderRadius: 4, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 12 },
  cvvText:     { fontSize: 16, color: colors.black, fontWeight: '700', letterSpacing: 4 },
  cvvLabel:    { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  ibanRow:     { marginTop: 12 },
  ibanLabel:   { fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, marginBottom: 3 },
  ibanValue:   { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '600', letterSpacing: 1 },
  flipHint:    { fontSize: 9, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' },
});

export const CardScreen: React.FC<Props> = ({ onBack }) => {
  const [blocked,       setBlocked]       = useState(false);
  const [onlinePayment, setOnlinePayment] = useState(true);
  const [intl,          setIntl]          = useState(false);
  const [showLimits,    setShowLimits]    = useState(false);

  const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

  const QUICK_ACTIONS = [
    { icon: 'lock',       label: 'Bloquer',    color: colors.danger,  action: () => setBlocked(true)  },
    { icon: 'unlock',     label: 'Debloquer',  color: colors.success, action: () => setBlocked(false) },
    { icon: 'refresh-cw', label: 'Renouveler', color: colors.warning, action: () => {}                },
    { icon: 'eye',        label: 'PIN',        color: colors.primary, action: () => {}                },
  ];

  const SETTINGS = [
    { icon: 'globe',  label: 'Paiement en ligne',     sub: 'E-commerce et abonnements',    value: onlinePayment, setter: setOnlinePayment, color: '#7C3AED'      },
    { icon: 'map',    label: 'Paiement international', sub: 'Hors zone UEMOA',             value: intl,          setter: setIntl,          color: '#EA580C'      },
  ];

  const TRANSACTIONS = [
    { label: 'Retrait DAB Plateau',    date: "Aujourd'hui - 09:12", amount: -50000,  icon: 'credit-card'  },
    { label: 'Achat Score Niamey',     date: 'Hier - 15:44',        amount: -32500,  icon: 'shopping-bag' },
    { label: 'Retrait DAB Universite', date: '10 juin - 11:20',     amount: -25000,  icon: 'credit-card'  },
  ];

  const LIMITS = [
    { label: 'Retrait DAB / jour', current: 200000, max: 500000,  color: colors.primary },
    { label: 'Paiement / jour',    current: 500000, max: 1000000, color: '#7C3AED'      },
  ];

  return (
    <SafeAreaView style={cs.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.gradStart} />

      <LinearGradient
        colors={[colors.gradStart, colors.gradMid, colors.gradEnd]}
        style={cs.header}
        start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
      >
        <FadeInView delay={0} from="top" style={cs.headerRow}>
          <TouchableOpacity onPress={onBack} style={cs.backBtn}>
            <Icon name="chevron-left" size={20} color={colors.white} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <BrandMark size={32} variant="white" />
            <Text style={cs.headerTitle}>Ma carte bancaire</Text>
          </View>
          <View style={{ width: 36 }} />
        </FadeInView>

        <FadeInView delay={100} from="bottom" style={cs.cardWrap}>
          <Card3D blocked={blocked} />
        </FadeInView>

        <FadeInView delay={600} from="none" style={cs.gestureHints}>
          <View style={cs.gestureHint}>
            <Icon name="move" size={12} color="rgba(255,255,255,0.6)" />
            <Text style={cs.gestureText}>Incliner</Text>
          </View>
          <View style={cs.gestureHint}>
            <Icon name="refresh-cw" size={12} color="rgba(255,255,255,0.6)" />
            <Text style={cs.gestureText}>Retourner</Text>
          </View>
        </FadeInView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: colors.surface }}>

        <FadeInView delay={200} from="bottom" style={cs.section}>
          <Text style={cs.sectionLabel}>ACTIONS RAPIDES</Text>
          <View style={cs.quickGrid}>
            {QUICK_ACTIONS.map((a, i) => (
              <PressableScale key={i} onPress={a.action} style={{ flex: 1 }}>
                <View style={cs.quickCard}>
                  <View style={[cs.quickIcon, { backgroundColor: a.color + '18' }]}>
                    <Icon name={a.icon} size={20} color={a.color} />
                  </View>
                  <Text style={cs.quickLabel}>{a.label}</Text>
                </View>
              </PressableScale>
            ))}
          </View>
        </FadeInView>

        {blocked && (
          <FadeInView delay={0} from="bottom" style={cs.section}>
            <View style={cs.blockedBanner}>
              <Icon name="alert-octagon" size={18} color={colors.danger} />
              <View style={{ flex: 1 }}>
                <Text style={cs.blockedTitle}>Carte bloquee</Text>
                <Text style={cs.blockedSub}>Aucune transaction ne peut etre effectuee</Text>
              </View>
              <PressableScale onPress={() => setBlocked(false)} style={cs.unblockBtn}>
                <Text style={cs.unblockText}>Debloquer</Text>
              </PressableScale>
            </View>
          </FadeInView>
        )}

        <FadeInView delay={260} from="bottom" style={cs.section}>
          <TouchableOpacity
            style={cs.sectionHeaderRow}
            onPress={() => setShowLimits(v => !v)}
          >
            <Text style={cs.sectionLabel}>PLAFONDS</Text>
            <Icon name={showLimits ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textMuted} />
          </TouchableOpacity>

          {showLimits && (
            <AnimatedCard delay={0} padding={20}>
              {LIMITS.map((lim, i) => (
                <View key={lim.label} style={[{ marginBottom: i === 0 ? 20 : 0 }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={cs.limLabel}>{lim.label}</Text>
                    <Text style={[cs.limValue, { color: lim.color }]}>{fmt(lim.current)}</Text>
                  </View>
                  <View style={cs.limTrack}>
                    <View style={[cs.limFill, {
                      width: `${(lim.current / lim.max) * 100}%`,
                      backgroundColor: lim.color,
                    }]} />
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                    <Text style={cs.limMin}>0</Text>
                    <Text style={cs.limMin}>{fmt(lim.max)}</Text>
                  </View>
                </View>
              ))}
            </AnimatedCard>
          )}
        </FadeInView>

        <FadeInView delay={320} from="bottom" style={cs.section}>
          <Text style={cs.sectionLabel}>PARAMETRES DE LA CARTE</Text>
          <AnimatedCard delay={340} padding={0}>
            {SETTINGS.map((setting, i) => (
              <View key={setting.label} style={[cs.settingRow, i < SETTINGS.length - 1 && cs.rowBorder]}>
                <View style={[cs.settingIcon, { backgroundColor: setting.color + '18' }]}>
                  <Icon name={setting.icon} size={18} color={setting.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={cs.settingLabel}>{setting.label}</Text>
                  <Text style={cs.settingSub}>{setting.sub}</Text>
                </View>
                <Switch
                  value={setting.value}
                  onValueChange={setting.setter}
                  trackColor={{ false: colors.borderLight, true: setting.color + '40' }}
                  thumbColor={setting.value ? setting.color : colors.textMuted}
                />
              </View>
            ))}
          </AnimatedCard>
        </FadeInView>

        <FadeInView delay={400} from="bottom" style={cs.section}>
          <Text style={cs.sectionLabel}>DERNIERES OPERATIONS CARTE</Text>
          <AnimatedCard delay={420} padding={0}>
            {TRANSACTIONS.map((tx, i) => (
              <View key={i} style={[cs.txRow, i < TRANSACTIONS.length - 1 && cs.rowBorder]}>
                <View style={cs.txIcon}>
                  <Icon name={tx.icon} size={15} color={colors.textMuted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={cs.txLabel}>{tx.label}</Text>
                  <Text style={cs.txDate}>{tx.date}</Text>
                </View>
                <Text style={cs.txAmount}>
                  -{new Intl.NumberFormat('fr-FR').format(Math.abs(tx.amount))} F
                </Text>
              </View>
            ))}
          </AnimatedCard>
        </FadeInView>

        <FadeInView delay={460} from="bottom" style={cs.section}>
          <AnimatedCard delay={470} padding={16}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={[cs.settingIcon, { backgroundColor: colors.dangerLight }]}>
                <Icon name="alert-triangle" size={18} color={colors.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={cs.settingLabel}>Carte perdue ou volee ?</Text>
                <Text style={cs.settingSub}>Bloquez immediatement et commandez un remplacement</Text>
              </View>
              <Icon name="chevron-right" size={16} color={colors.textMuted} />
            </View>
          </AnimatedCard>
        </FadeInView>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const cs = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.gradStart },
  header:      { paddingTop: 12, paddingBottom: 20, paddingHorizontal: 20 },
  headerRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.white },
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },

  cardWrap:    { alignItems: 'center', marginBottom: 10 },
  gestureHints:{ flexDirection: 'row', justifyContent: 'center', gap: 24 },
  gestureHint: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  gestureText: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: '500' },

  section:     { padding: 20, paddingBottom: 0 },
  sectionLabel:{ fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.2, marginBottom: 12 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  rowBorder:   { borderBottomWidth: 1, borderBottomColor: colors.borderLight },

  quickGrid:   { flexDirection: 'row', gap: 8 },
  quickCard:   { backgroundColor: colors.card, borderRadius: radius.lg, padding: 10, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.border },
  quickIcon:   { width: 38, height: 38, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  quickLabel:  { fontSize: 9, fontWeight: '700', color: colors.text, textAlign: 'center' },

  blockedBanner:{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.dangerLight, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.danger + '30' },
  blockedTitle: { fontSize: 14, fontWeight: '700', color: colors.danger, marginBottom: 2 },
  blockedSub:   { fontSize: 12, color: colors.danger },
  unblockBtn:   { backgroundColor: colors.danger, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.md },
  unblockText:  { fontSize: 12, fontWeight: '700', color: colors.white },

  limLabel:    { fontSize: 13, color: colors.textSub, fontWeight: '500' },
  limValue:    { fontSize: 13, fontWeight: '700' },
  limTrack:    { height: 6, backgroundColor: colors.borderLight, borderRadius: 3, overflow: 'hidden' },
  limFill:     { height: 6, borderRadius: 3 },
  limMin:      { fontSize: 10, color: colors.textMuted },

  settingRow:  { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  settingIcon: { width: 42, height: 42, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  settingLabel:{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 2 },
  settingSub:  { fontSize: 12, color: colors.textMuted },

  txRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 16, gap: 12 },
  txIcon:      { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  txLabel:     { fontSize: 13, fontWeight: '500', color: colors.text, marginBottom: 2 },
  txDate:      { fontSize: 11, color: colors.textMuted },
  txAmount:    { fontSize: 13, fontWeight: '700', color: colors.text },
});
