import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Dimensions, RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, withSequence
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon }           from '../../../shared/components/Icon';
import { FadeInView }     from '../../../shared/components/FadeInView';
import { AnimatedCard }   from '../../../shared/components/AnimatedCard';
import { PressableScale } from '../../../shared/components/PressableScale';
import { BrandMark }  from '../../../shared/components/BrandMark';
import { colors, radius, shadow } from '../../../shared/theme';
import { formatCurrency, formatDate } from '../../../shared/utils';
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS, MOCK_USER } from '../../../shared/mock/data';
import { useAuthStore } from '../../auth/store/authStore';

const CATEGORY_CONFIG: Record<string, { icon: string; bg: string; color: string }> = {
  virement: { icon: 'repeat',       bg: '#EBF4FF', color: '#2563EB' },
  retrait:  { icon: 'credit-card',  bg: '#F0FDF4', color: '#16A34A' },
  achat:    { icon: 'shopping-bag', bg: '#FFF7ED', color: '#EA580C' },
  frais:    { icon: 'file-text',    bg: '#F5F3FF', color: '#7C3AED' },
};

const QUICK_ACTIONS = [
  { icon: 'send',        label: 'Envoyer',  key: 'transfers', color: colors.primary },
  { icon: 'download',    label: 'Releve',   key: 'statement', color: '#7C3AED'      },
  { icon: 'file-text',   label: 'Chequier', key: 'checkbook', color: '#EA580C'      },
  { icon: 'credit-card', label: 'Ma carte', key: 'card',      color: '#16A34A'      },
];

interface Props { onNavigate: (screen: string) => void; }

export const DashboardScreen: React.FC<Props> = ({ onNavigate }) => {
  const [refreshing, setRefreshing]     = useState(false);
  const [balanceVisible, setBVisible]   = useState(true);
  const [activeAccount, setActiveAcc]   = useState(0);
  const { user } = useAuthStore();

  const account  = MOCK_ACCOUNTS[activeAccount];
  const recentTx = MOCK_TRANSACTIONS.slice(0, 5);

  const totalCredits = MOCK_TRANSACTIONS.filter(t => t.type === 'credit').reduce((s,t) => s + t.amount, 0);
  const totalDebits  = Math.abs(MOCK_TRANSACTIONS.filter(t => t.type === 'debit').reduce((s,t) => s + t.amount, 0));

  const firstName = user?.firstName ?? MOCK_USER.firstName;
  const lastName  = user?.lastName  ?? MOCK_USER.lastName;
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon apres-midi' : 'Bonsoir';

  const balanceScale = useSharedValue(1);
  const toggleBalance = () => {
    balanceScale.value = withSequence(
      withTiming(0.92, { duration: 100 }),
      withSpring(1, { damping: 12 })
    );
    setBVisible(v => !v);
  };

  const balAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: balanceScale.value }],
  }));

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const fmtBalance = (n: number) =>
    new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDeep} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.white} />}
      >

        {/* HEADER */}
        <LinearGradient
          colors={[colors.gradStart, colors.gradMid, colors.gradEnd]}
          style={s.headerGrad}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
        >
          <FadeInView delay={0} from="top" style={s.topRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <BrandMark size={36} variant="white" />
              <View>
                <Text style={s.greeting}>{greeting}</Text>
                <Text style={s.userName}>{firstName} {lastName}</Text>
              </View>
            </View>
            <PressableScale onPress={() => onNavigate('profile')}>
              <View style={s.avatar}>
                <Text style={s.avatarInitials}>{firstName[0]}{lastName[0]}</Text>
              </View>
            </PressableScale>
          </FadeInView>

          <FadeInView delay={80} from="none" style={s.accountPills}>
            {MOCK_ACCOUNTS.map((acc, i) => (
              <TouchableOpacity
                key={acc.id}
                style={[s.pill, activeAccount === i && s.pillActive]}
                onPress={() => setActiveAcc(i)}
                activeOpacity={0.8}
              >
                <Text style={[s.pillText, activeAccount === i && s.pillTextActive]}>
                  {acc.type}
                </Text>
              </TouchableOpacity>
            ))}
          </FadeInView>

          <FadeInView delay={150} from="none">
            <TouchableOpacity onPress={toggleBalance} activeOpacity={1} style={s.balanceArea}>
              <Text style={s.balanceLabel}>Solde disponible</Text>
              <Animated.View style={[s.balanceRow, balAnimStyle]}>
                <Text style={s.balanceAmount}>
                  {balanceVisible ? fmtBalance(account.availableBalance) : '•  •  •  •  •  •'}
                </Text>
                <View style={s.eyeBtn}>
                  <Icon
                    name={balanceVisible ? 'eye' : 'eye-off'}
                    size={16}
                    color="rgba(255,255,255,0.7)"
                  />
                </View>
              </Animated.View>
              <Text style={s.accountRef}>{account.number} · {account.type}</Text>
            </TouchableOpacity>
          </FadeInView>

          <FadeInView delay={220} from="bottom" style={s.quickActions}>
            {QUICK_ACTIONS.map((a) => (
              <PressableScale key={a.key} onPress={() => onNavigate(a.key)} style={s.actionWrap}>
                <View style={s.actionIconCircle}>
                  <Icon name={a.icon} size={20} color={colors.white} />
                </View>
                <Text style={s.actionLabel}>{a.label}</Text>
              </PressableScale>
            ))}
          </FadeInView>
        </LinearGradient>

        {/* RESUME MENSUEL */}
        <FadeInView delay={300} from="bottom" style={s.section}>
          <Text style={s.sectionTitle}>CE MOIS</Text>
          <View style={s.summaryRow}>
            <AnimatedCard style={[s.summaryCard, s.summaryCredit]} delay={320} padding={16}>
              <View style={s.summaryTop}>
                <View style={[s.summaryDot, { backgroundColor: colors.success }]} />
                <Text style={s.summaryTypeLabel}>Entrees</Text>
              </View>
              <Text style={[s.summaryAmount, { color: colors.success }]}>
                +{fmtBalance(totalCredits)}
              </Text>
            </AnimatedCard>
            <AnimatedCard style={[s.summaryCard, s.summaryDebit]} delay={380} padding={16}>
              <View style={s.summaryTop}>
                <View style={[s.summaryDot, { backgroundColor: colors.danger }]} />
                <Text style={s.summaryTypeLabel}>Sorties</Text>
              </View>
              <Text style={[s.summaryAmount, { color: colors.danger }]}>
                -{fmtBalance(totalDebits)}
              </Text>
            </AnimatedCard>
          </View>
        </FadeInView>

        {/* TRANSACTIONS */}
        <FadeInView delay={400} from="bottom" style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>OPERATIONS RECENTES</Text>
            <TouchableOpacity onPress={() => onNavigate('history')}>
              <Text style={s.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <AnimatedCard delay={420} padding={0}>
            {recentTx.map((tx, i) => {
              const cfg = CATEGORY_CONFIG[tx.category] ?? CATEGORY_CONFIG['frais'];
              return (
                <View
                  key={tx.id}
                  style={[s.txRow, i < recentTx.length - 1 && s.txBorder]}
                >
                  <View style={[s.txIconWrap, { backgroundColor: cfg.bg }]}>
                    <Icon name={cfg.icon} size={16} color={cfg.color} />
                  </View>
                  <View style={s.txInfo}>
                    <Text style={s.txLabel} numberOfLines={1}>{tx.label}</Text>
                    <Text style={s.txDate}>{formatDate(tx.date)}</Text>
                  </View>
                  <Text style={[
                    s.txAmount,
                    { color: tx.type === 'credit' ? colors.success : colors.text }
                  ]}>
                    {tx.type === 'credit' ? '+' : '−'}
                    {new Intl.NumberFormat('fr-FR').format(Math.abs(tx.amount))}
                  </Text>
                </View>
              );
            })}
          </AnimatedCard>
        </FadeInView>

        {/* BANNIERE CREDIT */}
        <FadeInView delay={500} from="bottom" style={[s.section, { paddingTop: 0 }]}>
          <PressableScale onPress={() => onNavigate('credit')}>
            <LinearGradient
              colors={['#00C896', '#009E77']}
              style={s.creditBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View>
                <Text style={s.creditTag}>FINANCEMENT</Text>
                <Text style={s.creditTitle}>Besoin d'un credit ?</Text>
                <Text style={s.creditSub}>Simulation en 30 secondes</Text>
              </View>
              <View style={s.creditArrowCircle}>
                <Icon name="arrow-right" size={20} color={colors.success} />
              </View>
            </LinearGradient>
          </PressableScale>
        </FadeInView>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.surface },
  headerGrad:     { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },

  topRow:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting:       { fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: '500', marginBottom: 2 },
  userName:       { fontSize: 20, fontWeight: '700', color: colors.white, letterSpacing: -0.3 },
  avatar:         { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' },
  avatarInitials: { fontSize: 15, fontWeight: '700', color: colors.white },

  accountPills:   { flexDirection: 'row', gap: 8, marginBottom: 24 },
  pill:           { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  pillActive:     { backgroundColor: colors.white },
  pillText:       { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  pillTextActive: { color: colors.primary, fontWeight: '700' },

  balanceArea:    { marginBottom: 28 },
  balanceLabel:   { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginBottom: 6, letterSpacing: 0.4 },
  balanceRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  balanceAmount:  { fontSize: 32, fontWeight: '800', color: colors.white, letterSpacing: -1 },
  eyeBtn:         { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  accountRef:     { fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: '500' },

  quickActions:   { flexDirection: 'row', justifyContent: 'space-between' },
  actionWrap:     { alignItems: 'center', gap: 7, flex: 1 },
  actionIconCircle: { width: 52, height: 52, borderRadius: radius.lg, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  actionLabel:    { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600', textAlign: 'center' },

  section:        { paddingHorizontal: 20, paddingTop: 24 },
  sectionHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle:   { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.2 },
  seeAll:         { fontSize: 13, color: colors.primary, fontWeight: '600' },

  summaryRow:     { flexDirection: 'row', gap: 12 },
  summaryCard:    { flex: 1 },
  summaryCredit:  { borderLeftWidth: 3, borderLeftColor: colors.success },
  summaryDebit:   { borderLeftWidth: 3, borderLeftColor: colors.danger  },
  summaryTop:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  summaryDot:     { width: 7, height: 7, borderRadius: 4 },
  summaryTypeLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
  summaryAmount:  { fontSize: 14, fontWeight: '700', letterSpacing: -0.3 },

  txRow:          { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  txBorder:       { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  txIconWrap:     { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txInfo:         { flex: 1, marginRight: 8 },
  txLabel:        { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: 3 },
  txDate:         { fontSize: 11, color: colors.textMuted, fontWeight: '500' },
  txAmount:       { fontSize: 14, fontWeight: '700', letterSpacing: -0.3 },

  creditBanner:   { borderRadius: radius.xl, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  creditTag:      { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1.5, marginBottom: 4 },
  creditTitle:    { fontSize: 18, fontWeight: '700', color: colors.white, marginBottom: 2, letterSpacing: -0.3 },
  creditSub:      { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  creditArrowCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
});
