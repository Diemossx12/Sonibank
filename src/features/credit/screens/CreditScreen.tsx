import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { Icon }           from '../../../shared/components/Icon';
import { BrandMark }      from '../../../shared/components/BrandMark';
import { FadeInView }     from '../../../shared/components/FadeInView';
import { AnimatedCard }   from '../../../shared/components/AnimatedCard';
import { PressableScale } from '../../../shared/components/PressableScale';
import { colors, radius }  from '../../../shared/theme';

type Tab = 'simulator' | 'savings';

const CREDIT_TYPES = [
  { key: 'conso', label: 'Consommation', icon: 'shopping-bag', rate: 14.5, maxMonths: 36,  color: '#7C3AED' },
  { key: 'immo',  label: 'Immobilier',   icon: 'home',         rate: 10.5, maxMonths: 120, color: '#0F6E56' },
  { key: 'pro',   label: 'Professionnel',icon: 'briefcase',    rate: 12.0, maxMonths: 60,  color: '#EA580C' },
  { key: 'auto',  label: 'Auto / Moto',  icon: 'truck',        rate: 13.0, maxMonths: 48,  color: '#2563EB' },
];

const SAVINGS_GOALS = [
  { icon: 'home',      label: 'Logement',   color: '#1A5A9A' },
  { icon: 'map',       label: 'Voyage',     color: '#0F6E56' },
  { icon: 'book-open', label: 'Education',  color: '#7A4500' },
  { icon: 'briefcase', label: 'Projet pro', color: '#4A3A9A' },
  { icon: 'heart',     label: 'Sante',      color: '#C0392B' },
  { icon: 'star',      label: 'Autre',      color: '#555555' },
];

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
const AMOUNT_MIN = 100000;

export const CreditScreen: React.FC = () => {
  const [tab,          setTab]         = useState<Tab>('simulator');
  const [creditType,   setCreditType]  = useState(CREDIT_TYPES[0]);
  const [amountVal,    setAmountVal]   = useState(1000000);
  const [monthsVal,    setMonthsVal]   = useState(12);
  const [showResult,   setShowResult]  = useState(false);
  const [savingsAmt,   setSavingsAmt]  = useState('50000');
  const [savingsGoal,  setSavingsGoal] = useState(SAVINGS_GOALS[0]);
  const [savingsTarget,setSavingsTarget] = useState('2000000');

  const AMOUNT_MAX = creditType.key === 'immo' ? 50000000
                   : creditType.key === 'pro'  ? 20000000
                   : creditType.key === 'auto' ? 10000000
                   : 5000000;
  const MONTHS_MAX = creditType.maxMonths;

  const calcLoan = () => {
    const P = amountVal;
    const r = creditType.rate / 100 / 12;
    const n = monthsVal;
    if (r === 0 || P === 0) return { monthly: 0, total: 0, interest: 0 };
    const monthly = Math.round(P * r * Math.pow(1+r,n) / (Math.pow(1+r,n) - 1));
    return { monthly, total: monthly * n, interest: monthly * n - P };
  };

  const calcSavings = () => {
    const monthly = parseInt(savingsAmt, 10) || 0;
    const target  = parseInt(savingsTarget, 10) || 0;
    const mos     = monthly > 0 && target > 0 ? Math.ceil(target / monthly) : 0;
    return { monthly, target, months: mos, years: Math.floor(mos / 12), remainMonths: mos % 12 };
  };

  const loan    = calcLoan();
  const savings = calcSavings();

  const amortissement = () => {
    const P   = amountVal;
    const r   = creditType.rate / 100 / 12;
    const M   = loan.monthly;
    const rows: { month: number; monthly: number; interest: number; principal: number; balance: number }[] = [];
    let balance = P;
    for (let i = 1; i <= Math.min(monthsVal, 6); i++) {
      const interestPart  = Math.round(balance * r);
      const principalPart = M - interestPart;
      balance -= principalPart;
      rows.push({ month: i, monthly: M, interest: interestPart, principal: principalPart, balance: Math.max(0, balance) });
    }
    return rows;
  };

  return (
    <SafeAreaView style={cr.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.gradStart} />

      <LinearGradient
        colors={[colors.gradStart, colors.gradMid, colors.gradEnd]}
        style={cr.header}
        start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
      >
        <FadeInView delay={0} from="top">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <BrandMark size={34} variant="white" />
            <View>
              <Text style={cr.headerTitle}>Credit & Epargne</Text>
              <Text style={cr.headerSub}>Simulez et planifiez votre financement</Text>
            </View>
          </View>
        </FadeInView>

        <FadeInView delay={80} from="none">
          <View style={cr.tabsWrap}>
            {([['simulator', 'Simulateur credit'], ['savings', 'Epargne programmee']] as [Tab, string][]).map(([key, lbl]) => (
              <PressableScale
                key={key}
                onPress={() => setTab(key)}
                style={[cr.tabBtn, tab === key && cr.tabBtnActive]}
              >
                <Icon
                  name={key === 'simulator' ? 'trending-up' : 'target'}
                  size={14}
                  color={tab === key ? colors.primary : 'rgba(255,255,255,0.8)'}
                />
                <Text style={[cr.tabText, tab === key && cr.tabTextActive]}>{lbl}</Text>
              </PressableScale>
            ))}
          </View>
        </FadeInView>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {tab === 'simulator' ? (
            <>
              {/* Types en grille 2x2 */}
              <FadeInView delay={0} from="bottom" style={{ padding: 20, paddingBottom: 0 }}>
                <Text style={cr.sectionLabel}>TYPE DE CREDIT</Text>
                <View style={cr.typesGrid}>
                  {CREDIT_TYPES.map((ct) => (
                    <PressableScale
                      key={ct.key}
                      onPress={() => { setCreditType(ct); setShowResult(false); setAmountVal(AMOUNT_MIN); setMonthsVal(12); }}
                      style={{ width: '48%' }}
                    >
                      <View style={[
                        cr.typeGridCard,
                        creditType.key === ct.key && {
                          backgroundColor: ct.color,
                          borderColor: ct.color,
                        }
                      ]}>
                        <View style={[
                          cr.typeGridIcon,
                          { backgroundColor: creditType.key === ct.key ? 'rgba(255,255,255,0.25)' : ct.color + '18' }
                        ]}>
                          <Icon
                            name={ct.icon}
                            size={20}
                            color={creditType.key === ct.key ? colors.white : ct.color}
                          />
                        </View>
                        <Text style={[
                          cr.typeGridLabel,
                          creditType.key === ct.key && { color: colors.white }
                        ]}>
                          {ct.label}
                        </Text>
                        <Text style={[
                          cr.typeGridRate,
                          creditType.key === ct.key && { color: 'rgba(255,255,255,0.85)' }
                        ]}>
                          {ct.rate}% / an
                        </Text>
                      </View>
                    </PressableScale>
                  ))}
                </View>
              </FadeInView>

              {/* Parametres avec sliders */}
              <FadeInView delay={150} from="bottom" style={{ padding: 20, paddingBottom: 0 }}>
                <Text style={[cr.sectionLabel, { marginBottom: 14 }]}>PARAMETRES</Text>
                <AnimatedCard delay={170} padding={20}>

                  {/* Montant avec jauge */}
                  <View style={cr.sliderSection}>
                    <View style={cr.sliderHeader}>
                      <Text style={cr.sliderLabel}>Montant souhaite</Text>
                      <View style={cr.sliderValueBadge}>
                        <Text style={cr.sliderValue}>
                          {new Intl.NumberFormat('fr-FR').format(amountVal)} FCFA
                        </Text>
                      </View>
                    </View>

                    <View style={cr.gaugeWrap}>
                      <View style={cr.gaugeTrack}>
                        <View
                          style={[
                            cr.gaugeFill,
                            {
                              width: `${((amountVal - AMOUNT_MIN) / (AMOUNT_MAX - AMOUNT_MIN)) * 100}%`,
                              backgroundColor: creditType.color,
                            }
                          ]}
                        />
                      </View>
                    </View>

                    <Slider
                      style={cr.slider}
                      minimumValue={AMOUNT_MIN}
                      maximumValue={AMOUNT_MAX}
                      step={50000}
                      value={amountVal}
                      onValueChange={(v: number) => { setAmountVal(Math.round(v)); setShowResult(false); }}
                      minimumTrackTintColor={creditType.color}
                      maximumTrackTintColor={colors.borderLight}
                      thumbTintColor={creditType.color}
                    />

                    <View style={cr.sliderMinMax}>
                      <Text style={cr.sliderMin}>{new Intl.NumberFormat('fr-FR').format(AMOUNT_MIN)}</Text>
                      <Text style={cr.sliderMax}>{new Intl.NumberFormat('fr-FR').format(AMOUNT_MAX)}</Text>
                    </View>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={{ marginTop: 10 }}
                      contentContainerStyle={{ gap: 8 }}
                    >
                      {[500000, 1000000, 2000000, 5000000].filter(v => v <= AMOUNT_MAX).map(v => (
                        <PressableScale
                          key={v}
                          onPress={() => { setAmountVal(v); setShowResult(false); }}
                        >
                          <View style={[
                            cr.quickChip,
                            amountVal === v && { backgroundColor: creditType.color, borderColor: creditType.color }
                          ]}>
                            <Text style={[
                              cr.quickChipText,
                              amountVal === v && { color: colors.white }
                            ]}>
                              {new Intl.NumberFormat('fr-FR').format(v / 1000)}K
                            </Text>
                          </View>
                        </PressableScale>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={cr.sliderDivider} />

                  {/* Duree avec jauge */}
                  <View style={cr.sliderSection}>
                    <View style={cr.sliderHeader}>
                      <Text style={cr.sliderLabel}>Duree de remboursement</Text>
                      <View style={cr.sliderValueBadge}>
                        <Text style={cr.sliderValue}>
                          {monthsVal} mois{Math.floor(monthsVal/12) > 0 ? ` · ${Math.floor(monthsVal/12)} an${Math.floor(monthsVal/12)>1?'s':''}` : ''}
                        </Text>
                      </View>
                    </View>

                    <View style={cr.gaugeWrap}>
                      <View style={cr.gaugeTrack}>
                        <View
                          style={[
                            cr.gaugeFill,
                            {
                              width: `${((monthsVal - 6) / (MONTHS_MAX - 6)) * 100}%`,
                              backgroundColor: creditType.color,
                              opacity: 0.7,
                            }
                          ]}
                        />
                      </View>
                    </View>

                    <Slider
                      style={cr.slider}
                      minimumValue={6}
                      maximumValue={MONTHS_MAX}
                      step={6}
                      value={monthsVal}
                      onValueChange={(v: number) => { setMonthsVal(Math.round(v)); setShowResult(false); }}
                      minimumTrackTintColor={creditType.color}
                      maximumTrackTintColor={colors.borderLight}
                      thumbTintColor={creditType.color}
                    />

                    <View style={cr.sliderMinMax}>
                      <Text style={cr.sliderMin}>6 mois</Text>
                      <Text style={cr.sliderMax}>{MONTHS_MAX} mois</Text>
                    </View>
                  </View>

                  <View style={cr.sliderDivider} />

                  {/* Taux avec jauge comparative */}
                  <View style={cr.sliderSection}>
                    <View style={cr.sliderHeader}>
                      <Text style={cr.sliderLabel}>Taux annuel (TEG)</Text>
                      <View style={[cr.sliderValueBadge, { backgroundColor: creditType.color + '18' }]}>
                        <Text style={[cr.sliderValue, { color: creditType.color }]}>
                          {creditType.rate}%
                        </Text>
                      </View>
                    </View>
                    <View style={cr.ratesCompare}>
                      {CREDIT_TYPES.map(ct => (
                        <View key={ct.key} style={cr.rateBar}>
                          <View style={[cr.rateBarFill, {
                            height: `${(ct.rate / 16) * 100}%`,
                            backgroundColor: creditType.key === ct.key ? ct.color : colors.borderLight,
                          }]} />
                          <Text style={[cr.rateBarLabel, creditType.key === ct.key && { color: ct.color, fontWeight: '700' }]}>
                            {ct.rate}%
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                </AnimatedCard>
              </FadeInView>

              {/* Bouton calcul */}
              <FadeInView delay={300} from="bottom" style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                <PressableScale onPress={() => setShowResult(true)} style={cr.primaryBtn}>
                  <Icon name="trending-up" size={18} color={colors.white} />
                  <Text style={cr.primaryBtnText}>Calculer ma mensualite</Text>
                </PressableScale>
              </FadeInView>

              {/* Resultats */}
              {showResult && loan.monthly > 0 && (
                <FadeInView delay={0} from="bottom" style={{ padding: 20 }}>
                  <Text style={[cr.sectionLabel, { marginBottom: 12 }]}>RESULTAT DE LA SIMULATION</Text>

                  <AnimatedCard delay={50} padding={0}>
                    <LinearGradient
                      colors={[colors.gradStart, colors.gradMid, colors.gradEnd]}
                      style={cr.resultHero}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    >
                      <Text style={cr.resultLabel}>Mensualite estimee</Text>
                      <Text style={cr.resultAmount}>{fmt(loan.monthly)}</Text>
                      <Text style={cr.resultSub}>pendant {monthsVal} mois</Text>
                    </LinearGradient>
                  </AnimatedCard>

                  <AnimatedCard delay={100} padding={0} style={{ marginTop: 12 }}>
                    {[
                      { label: 'Montant emprunte',     value: fmt(amountVal),      icon: 'dollar-sign'  },
                      { label: 'Cout total du credit', value: fmt(loan.total),     icon: 'bar-chart-2'  },
                      { label: 'Total des interets',   value: fmt(loan.interest),  icon: 'trending-up', danger: true },
                      { label: 'Taux annuel (TEG)',    value: `${creditType.rate}%`, icon: 'percent'    },
                      { label: 'Duree',                value: `${monthsVal} mois`, icon: 'calendar'     },
                    ].map((row, i, arr) => (
                      <View key={row.label} style={[cr.infoRow, i < arr.length - 1 && cr.rowBorder]}>
                        <Icon name={row.icon} size={14} color={row.danger ? colors.danger : colors.textMuted} />
                        <Text style={cr.infoLabel}>{row.label}</Text>
                        <Text style={[cr.infoValue, row.danger && { color: colors.danger }]}>{row.value}</Text>
                      </View>
                    ))}
                  </AnimatedCard>

                  <Text style={[cr.sectionLabel, { marginTop: 20, marginBottom: 12 }]}>
                    AMORTISSEMENT (6 PREMIERES MENSUALITES)
                  </Text>
                  <AnimatedCard delay={150} padding={0}>
                    <LinearGradient
                      colors={[colors.gradStart, colors.gradMid]}
                      style={cr.tableHeader}
                    >
                      {['Mois', 'Mens.', 'Interets', 'Capital', 'Restant'].map(h => (
                        <Text key={h} style={cr.tableHeaderText}>{h}</Text>
                      ))}
                    </LinearGradient>
                    {amortissement().map((row, i, arr) => (
                      <View key={row.month} style={[cr.tableRow, i < arr.length - 1 && cr.rowBorder, i % 2 === 1 && { backgroundColor: colors.surface }]}>
                        <Text style={cr.tableCell}>{row.month}</Text>
                        <Text style={cr.tableCell}>{Math.round(row.monthly / 1000)}K</Text>
                        <Text style={[cr.tableCell, { color: colors.danger }]}>{Math.round(row.interest / 1000)}K</Text>
                        <Text style={[cr.tableCell, { color: colors.success }]}>{Math.round(row.principal / 1000)}K</Text>
                        <Text style={cr.tableCell}>{Math.round(row.balance / 1000)}K</Text>
                      </View>
                    ))}
                    <View style={cr.tableFootnote}>
                      <Icon name="info" size={10} color={colors.textMuted} />
                      <Text style={cr.tableFootnoteText}>Montants en milliers de FCFA · Simulation indicative</Text>
                    </View>
                  </AnimatedCard>

                  <PressableScale style={[cr.primaryBtn, { backgroundColor: colors.success, marginTop: 16 }]}>
                    <Icon name="send" size={16} color={colors.white} />
                    <Text style={cr.primaryBtnText}>Faire une demande de credit</Text>
                  </PressableScale>

                  <View style={cr.disclaimerBox}>
                    <Icon name="info" size={14} color={colors.textMuted} />
                    <Text style={cr.disclaimerText}>
                      Simulation indicative. Les conditions definitives seront fixees apres etude de votre dossier par votre conseiller SONIBANK.
                    </Text>
                  </View>
                </FadeInView>
              )}
            </>
          ) : (
            <>
              {/* Objectif d'epargne */}
              <FadeInView delay={120} from="bottom" style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                <Text style={cr.sectionLabel}>VOTRE OBJECTIF</Text>
              </FadeInView>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20, marginTop: 10 }}>
                {SAVINGS_GOALS.map((g, i) => (
                  <FadeInView key={g.label} delay={150 + i * 40} from="bottom">
                    <PressableScale onPress={() => setSavingsGoal(g)}>
                      <View style={[cr.goalChip, savingsGoal.label === g.label && { backgroundColor: g.color, borderColor: g.color }]}>
                        <Icon
                          name={g.icon}
                          size={16}
                          color={savingsGoal.label === g.label ? colors.white : g.color}
                        />
                        <Text style={[cr.goalLabel, savingsGoal.label === g.label && { color: colors.white }]}>
                          {g.label}
                        </Text>
                      </View>
                    </PressableScale>
                  </FadeInView>
                ))}
              </View>

              {/* Parametres epargne */}
              <FadeInView delay={350} from="bottom" style={{ padding: 20 }}>
                <Text style={[cr.sectionLabel, { marginBottom: 12 }]}>PARAMETRES D'EPARGNE</Text>
                <AnimatedCard delay={370} padding={0}>
                  <View style={cr.paramBlock}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Icon name="calendar" size={14} color={colors.textMuted} />
                      <Text style={cr.paramLabel}>Montant mensuel</Text>
                    </View>
                    <View style={cr.paramInputWrap}>
                      <TextInput
                        style={cr.paramInput}
                        value={savingsAmt}
                        onChangeText={t => setSavingsAmt(t.replace(/[^0-9]/g, ''))}
                        keyboardType="numeric"
                        maxLength={8}
                      />
                      <Text style={cr.paramSuffix}>FCFA</Text>
                    </View>
                  </View>

                  <View style={cr.divider} />

                  <View style={cr.paramBlock}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Icon name="target" size={14} color={colors.textMuted} />
                      <Text style={cr.paramLabel}>Objectif total</Text>
                    </View>
                    <View style={cr.paramInputWrap}>
                      <TextInput
                        style={cr.paramInput}
                        value={savingsTarget}
                        onChangeText={t => setSavingsTarget(t.replace(/[^0-9]/g, ''))}
                        keyboardType="numeric"
                        maxLength={10}
                      />
                      <Text style={cr.paramSuffix}>FCFA</Text>
                    </View>
                  </View>
                </AnimatedCard>
              </FadeInView>

              {/* Resultats epargne */}
              {savings.months > 0 && (
                <FadeInView delay={0} from="bottom" style={{ paddingHorizontal: 20 }}>
                  <AnimatedCard delay={50} padding={0}>
                    <LinearGradient
                      colors={[savingsGoal.color, savingsGoal.color + 'CC']}
                      style={cr.resultHero}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    >
                      <Icon name="target" size={24} color="rgba(255,255,255,0.4)" />
                      <Text style={cr.resultLabel}>Vous atteindrez votre objectif en</Text>
                      <Text style={cr.resultAmount}>
                        {savings.years > 0 ? `${savings.years} an${savings.years > 1 ? 's' : ''} ` : ''}
                        {savings.remainMonths > 0 ? `${savings.remainMonths} mois` : ''}
                      </Text>
                      <Text style={cr.resultSub}>en epargnant {fmt(savings.monthly)} / mois</Text>
                    </LinearGradient>
                  </AnimatedCard>

                  <AnimatedCard delay={100} padding={0} style={{ marginTop: 12 }}>
                    <View style={{ padding: 16 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={cr.infoLabel}>Progression</Text>
                        <Text style={[cr.infoValue, { color: savingsGoal.color }]}>0 / {fmt(savings.target)}</Text>
                      </View>
                      <View style={cr.progressBarWrap}>
                        <View style={[cr.progressBarFill, { width: '0%', backgroundColor: savingsGoal.color }]} />
                      </View>
                      <Text style={{ fontSize: 12, color: colors.textSub, marginTop: 10, textAlign: 'center' }}>
                        Apres 3 mois : {fmt(savings.monthly * 3)} epargnes
                      </Text>
                    </View>
                  </AnimatedCard>

                  <AnimatedCard delay={150} padding={0} style={{ marginTop: 12 }}>
                    {[
                      { label: 'Epargne mensuelle',  value: fmt(savings.monthly),  icon: 'calendar' },
                      { label: 'Objectif',            value: fmt(savings.target),   icon: 'target'   },
                      { label: 'Duree estimee',       value: `${savings.months} mois`, icon: 'clock' },
                      { label: 'Apres 6 mois',        value: fmt(savings.monthly * 6), icon: 'trending-up' },
                      { label: 'Apres 12 mois',       value: fmt(savings.monthly * 12), icon: 'trending-up' },
                    ].map((row, i, arr) => (
                      <View key={row.label} style={[cr.infoRow, i < arr.length - 1 && cr.rowBorder]}>
                        <Icon name={row.icon} size={14} color={colors.textMuted} />
                        <Text style={cr.infoLabel}>{row.label}</Text>
                        <Text style={cr.infoValue}>{row.value}</Text>
                      </View>
                    ))}
                  </AnimatedCard>

                  <PressableScale style={[cr.primaryBtn, { backgroundColor: savingsGoal.color, marginTop: 16 }]}>
                    <Icon name="check-circle" size={16} color={colors.white} />
                    <Text style={cr.primaryBtnText}>Activer cette epargne</Text>
                  </PressableScale>
                </FadeInView>
              )}
            </>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const cr = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.surface },
  header:        { paddingTop: 16, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle:   { fontSize: 22, fontWeight: '700', color: colors.white, letterSpacing: -0.4, marginBottom: 3 },
  headerSub:     { fontSize: 13, color: 'rgba(255,255,255,0.7)' },

  tabsWrap:      { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.lg, padding: 3, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  tabBtn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: radius.md },
  tabBtnActive:  { backgroundColor: colors.white },
  tabText:       { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  tabTextActive: { color: colors.primary, fontWeight: '700' },

  sectionLabel:  { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.2, marginBottom: 4 },

  typesGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  typeGridCard:   { borderRadius: radius.lg, padding: 16, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card, gap: 8, alignItems: 'flex-start' },
  typeGridIcon:   { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  typeGridLabel:  { fontSize: 13, fontWeight: '700', color: colors.text },
  typeGridRate:   { fontSize: 11, color: colors.textMuted, fontWeight: '600' },

  sliderSection:  { paddingBottom: 4 },
  sliderHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sliderLabel:    { fontSize: 13, fontWeight: '600', color: colors.textSub },
  sliderValueBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.full },
  sliderValue:    { fontSize: 13, fontWeight: '700', color: colors.primary },
  sliderDivider:  { height: 1, backgroundColor: colors.borderLight, marginVertical: 18 },
  sliderMinMax:   { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  sliderMin:      { fontSize: 10, color: colors.textMuted },
  sliderMax:      { fontSize: 10, color: colors.textMuted },
  slider:         { width: '100%', height: 40, marginTop: -8 },

  gaugeWrap:      { height: 6, borderRadius: 3, overflow: 'visible', marginTop: 4, position: 'relative' },
  gaugeTrack:     { flex: 1, position: 'relative', height: 6, borderRadius: 3, backgroundColor: colors.borderLight, overflow: 'hidden' },
  gaugeFill:      { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 3 },

  ratesCompare:   { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 60, marginTop: 12, gap: 8 },
  rateBar:        { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4, height: '100%' },
  rateBarFill:    { width: '100%', borderRadius: 4, minHeight: 8 },
  rateBarLabel:   { fontSize: 10, color: colors.textMuted },

  quickChip:      { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.full, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
  quickChipText:  { fontSize: 12, color: colors.textSub, fontWeight: '600' },

  paramBlock:    { padding: 16 },
  paramLabel:    { fontSize: 12, fontWeight: '600', color: colors.textSub, letterSpacing: 0.3 },
  paramInputWrap:{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14, marginTop: 6 },
  paramInput:    { flex: 1, fontSize: 20, fontWeight: '700', color: colors.text, height: 52 },
  paramSuffix:   { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  divider:       { height: 1, backgroundColor: colors.borderLight },

  primaryBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 54, borderRadius: radius.lg, backgroundColor: colors.primary },
  primaryBtnText:{ fontSize: 15, fontWeight: '700', color: colors.white },

  resultHero:    { borderRadius: radius.xl, padding: 24, alignItems: 'center', gap: 6 },
  resultLabel:   { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  resultAmount:  { fontSize: 32, fontWeight: '800', color: colors.white, letterSpacing: -1.5 },
  resultSub:     { fontSize: 13, color: 'rgba(255,255,255,0.7)' },

  infoRow:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, paddingHorizontal: 16 },
  infoLabel:     { flex: 1, fontSize: 13, color: colors.textSub },
  infoValue:     { fontSize: 13, fontWeight: '600', color: colors.text },
  rowBorder:     { borderBottomWidth: 1, borderBottomColor: colors.borderLight },

  tableHeader:     { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  tableHeaderText: { flex: 1, fontSize: 10, fontWeight: '700', color: colors.white, textAlign: 'center' },
  tableRow:        { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12 },
  tableCell:       { flex: 1, fontSize: 11, color: colors.text, textAlign: 'center', fontWeight: '500' },
  tableFootnote:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 10, borderTopWidth: 1, borderTopColor: colors.borderLight },
  tableFootnoteText: { fontSize: 10, color: colors.textMuted },

  disclaimerBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 12, padding: 14, backgroundColor: colors.surface, borderRadius: radius.md },
  disclaimerText:{ flex: 1, fontSize: 11, color: colors.textSub, lineHeight: 16 },

  goalChip:      { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border },
  goalLabel:     { fontSize: 13, fontWeight: '600', color: colors.text },

  progressBarWrap: { height: 8, backgroundColor: colors.borderLight, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: 8, borderRadius: 4 },
});
