import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, TextInput, Modal,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, withSequence, withDelay,
  Easing, FadeIn, SlideInUp
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon }           from '../../../shared/components/Icon';
import { BrandMark }      from '../../../shared/components/BrandMark';
import { FadeInView }     from '../../../shared/components/FadeInView';
import { AnimatedCard }   from '../../../shared/components/AnimatedCard';
import { PressableScale } from '../../../shared/components/PressableScale';
import { colors, radius, spacing, shadow } from '../../../shared/theme';
import { formatCurrency }                  from '../../../shared/utils';
import { MOCK_BENEFICIARIES, MOCK_ACCOUNTS, MOCK_USER } from '../../../shared/mock/data';

type TransferType = 'internal' | 'external';
type Step = 'home' | 'beneficiary' | 'form' | 'summary' | 'success';

const LIMITS = {
  internal: { perOp: 5000000,  daily: 10000000 },
  external: { perOp: 2000000,  daily: 5000000  },
};

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

const HomeView: React.FC<{ onStart: (t: TransferType) => void }> = ({ onStart }) => (
  <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

    <FadeInView delay={0} from="bottom" style={{ paddingHorizontal: 20, paddingTop: 24 }}>
      <Text style={s.sectionLabel}>TYPE DE VIREMENT</Text>
    </FadeInView>

    <FadeInView delay={80} from="bottom" style={{ paddingHorizontal: 20, marginBottom: 12 }}>
      <PressableScale onPress={() => onStart('internal')}>
        <LinearGradient
          colors={[colors.gradStart, colors.gradMid, colors.gradEnd]}
          style={s.typeCard}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          <View style={s.typeIconWrap}>
            <Icon name="repeat" size={22} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.typeTitle}>Virement SONIBANK</Text>
            <Text style={s.typeSub}>Vers un autre compte · Instantane</Text>
            <View style={s.typePill}>
              <Icon name="zap" size={10} color={colors.primary} />
              <Text style={s.typePillText}>Plafond {fmt(LIMITS.internal.perOp)}</Text>
            </View>
          </View>
          <View style={s.typeArrow}>
            <Icon name="arrow-right" size={18} color={colors.white} />
          </View>
        </LinearGradient>
      </PressableScale>
    </FadeInView>

    <FadeInView delay={150} from="bottom" style={{ paddingHorizontal: 20, marginBottom: 28 }}>
      <PressableScale onPress={() => onStart('external')}>
        <View style={[s.typeCard, { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border }]}>
          <View style={[s.typeIconWrap, { backgroundColor: colors.primaryLight }]}>
            <Icon name="globe" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.typeTitle, { color: colors.text }]}>Virement Interbancaire</Text>
            <Text style={[s.typeSub, { color: colors.textSub }]}>Zone UEMOA · J+1 ouvre</Text>
            <View style={[s.typePill, { backgroundColor: colors.surface }]}>
              <Icon name="globe" size={10} color={colors.textMuted} />
              <Text style={[s.typePillText, { color: colors.textMuted }]}>Plafond {fmt(LIMITS.external.perOp)}</Text>
            </View>
          </View>
          <View style={[s.typeArrow, { backgroundColor: colors.primaryLight }]}>
            <Icon name="arrow-right" size={18} color={colors.primary} />
          </View>
        </View>
      </PressableScale>
    </FadeInView>

    <FadeInView delay={220} from="bottom" style={{ paddingHorizontal: 20 }}>
      <Text style={s.sectionLabel}>BENEFICIAIRES FREQUENTS</Text>
    </FadeInView>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginTop: 12 }}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
    >
      {MOCK_BENEFICIARIES.map((b, i) => (
        <FadeInView key={b.id} delay={260 + i * 60} from="bottom">
          <PressableScale style={s.benefChip}>
            <View style={s.benefChipAvatar}>
              <Text style={s.benefChipInitial}>{b.name[0]}</Text>
            </View>
            <Text style={s.benefChipName} numberOfLines={1}>
              {b.name.split(' ')[0]}
            </Text>
            <Text style={s.benefChipBank} numberOfLines={1}>{b.bank}</Text>
          </PressableScale>
        </FadeInView>
      ))}
    </ScrollView>

    <FadeInView delay={400} from="bottom" style={{ padding: 20 }}>
      <Text style={[s.sectionLabel, { marginBottom: 12 }]}>PLAFONDS EN VIGUEUR</Text>
      <AnimatedCard delay={420} padding={0}>
        {([
          ['Virement SONIBANK / operation', fmt(LIMITS.internal.perOp), 'repeat'],
          ['Virement SONIBANK / jour',       fmt(LIMITS.internal.daily), 'repeat'],
          ['Interbancaire / operation',       fmt(LIMITS.external.perOp), 'globe'],
          ['Interbancaire / jour',            fmt(LIMITS.external.daily), 'globe'],
        ] as const).map(([label, value, icon], i, arr) => (
          <View key={label} style={[s.limitRow, i < arr.length - 1 && s.rowBorder]}>
            <Icon name={icon} size={14} color={colors.textMuted} />
            <Text style={s.limitLabel}>{label}</Text>
            <Text style={s.limitValue}>{value}</Text>
          </View>
        ))}
      </AnimatedCard>
    </FadeInView>
    <View style={{ height: 100 }} />
  </ScrollView>
);

const BeneficiaryView: React.FC<{
  type: TransferType;
  onSelect: (b: typeof MOCK_BENEFICIARIES[0]) => void;
}> = ({ type, onSelect }) => {
  const [search, setSearch] = useState('');
  const list = MOCK_BENEFICIARIES
    .filter(b => type === 'internal' ? b.bank === 'SONIBANK' : true)
    .filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={{ flex: 1 }}>
      <FadeInView delay={0} from="top" style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 }}>
        <View style={s.searchBar}>
          <Icon name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Nom, banque..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon name="x" size={15} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </FadeInView>

      <FadeInView delay={80} from="none" style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <PressableScale>
          <View style={s.newBenefCard}>
            <View style={s.newBenefIcon}>
              <Icon name="user-plus" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.newBenefTitle}>Nouveau beneficiaire</Text>
              <Text style={s.newBenefSub}>
                Saisir un {type === 'internal' ? 'numero de compte' : 'RIB / IBAN'}
              </Text>
            </View>
            <Icon name="chevron-right" size={18} color={colors.textMuted} />
          </View>
        </PressableScale>
      </FadeInView>

      <Text style={[s.sectionLabel, { paddingHorizontal: 20, marginBottom: 10 }]}>
        MES BENEFICIAIRES
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <AnimatedCard delay={150} padding={0} style={{ marginHorizontal: 20 }}>
          {list.map((b, i) => (
            <PressableScale key={b.id} onPress={() => onSelect(b)}>
              <View style={[s.benefRow, i < list.length - 1 && s.rowBorder]}>
                <View style={s.benefAvatar}>
                  <Text style={s.benefInitial}>{b.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.benefName}>{b.name}</Text>
                  <Text style={s.benefMeta}>
                    {b.bank} · ****{b.accountNumber.slice(-4)}
                  </Text>
                </View>
                <Icon name="chevron-right" size={16} color={colors.textMuted} />
              </View>
            </PressableScale>
          ))}
        </AnimatedCard>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const FormView: React.FC<{
  type: TransferType;
  beneficiary: typeof MOCK_BENEFICIARIES[0] | null;
  onSubmit: (amount: number, label: string) => void;
}> = ({ type, beneficiary, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [label,  setLabel]  = useState('');
  const [error,  setError]  = useState('');
  const account = MOCK_ACCOUNTS[0];
  const limit   = LIMITS[type].perOp;

  const errorShake = useSharedValue(0);
  const errorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: errorShake.value }],
  }));

  const shake = () => {
    errorShake.value = withSequence(
      withTiming(-8, { duration: 60 }),
      withTiming( 8, { duration: 60 }),
      withTiming(-6, { duration: 60 }),
      withTiming( 6, { duration: 60 }),
      withTiming( 0, { duration: 60 }),
    );
  };

  const validate = () => {
    const num = parseInt(amount, 10);
    if (!num || num <= 0)              { setError('Montant invalide');                    return false; }
    if (num > account.availableBalance){ setError('Solde insuffisant');                   shake(); return false; }
    if (num > limit)                   { setError(`Plafond depasse (max ${fmt(limit)})`); shake(); return false; }
    return true;
  };

  const QUICK = [25000, 50000, 100000, 250000];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {beneficiary && (
          <FadeInView delay={0} from="top" style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            <View style={s.selectedBenef}>
              <View style={s.benefAvatar}>
                <Text style={s.benefInitial}>{beneficiary.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.benefName}>{beneficiary.name}</Text>
                <Text style={s.benefMeta}>{beneficiary.bank} · ****{beneficiary.accountNumber.slice(-4)}</Text>
              </View>
              <View style={[s.speedBadge, { backgroundColor: type === 'internal' ? colors.successLight : colors.warningLight }]}>
                <Icon name={type === 'internal' ? 'zap' : 'clock'} size={11} color={type === 'internal' ? colors.success : colors.warning} />
                <Text style={[s.speedText, { color: type === 'internal' ? colors.success : colors.warning }]}>
                  {type === 'internal' ? 'Instantane' : 'J+1'}
                </Text>
              </View>
            </View>
          </FadeInView>
        )}

        <FadeInView delay={100} from="bottom" style={{ padding: 20 }}>
          <Text style={s.fieldLabel}>Montant</Text>
          <Animated.View style={errorStyle}>
            <View style={[s.amountWrap, error ? { borderColor: colors.danger } : null]}>
              <TextInput
                style={s.amountInput}
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                value={amount}
                onChangeText={t => { setAmount(t.replace(/[^0-9]/g, '')); setError(''); }}
                keyboardType="numeric"
                maxLength={9}
              />
              <Text style={s.amountUnit}>FCFA</Text>
            </View>
          </Animated.View>

          {error
            ? <Text style={s.errorText}>{error}</Text>
            : <Text style={s.balanceHint}>
                Disponible : <Text style={{ fontWeight: '700', color: colors.text }}>{fmt(account.availableBalance)}</Text>
              </Text>
          }

          <View style={s.quickRow}>
            {QUICK.map(q => (
              <PressableScale key={q} onPress={() => { setAmount(String(q)); setError(''); }}>
                <View style={[s.quickChip, amount === String(q) && s.quickChipActive]}>
                  <Text style={[s.quickChipText, amount === String(q) && s.quickChipTextActive]}>
                    {new Intl.NumberFormat('fr-FR').format(q)}
                  </Text>
                </View>
              </PressableScale>
            ))}
          </View>

          <Text style={[s.fieldLabel, { marginTop: 20 }]}>Motif <Text style={{ color: colors.textMuted, fontWeight: '400' }}>(optionnel)</Text></Text>
          <TextInput
            style={s.motifInput}
            placeholder="Ex : Loyer, Remboursement..."
            placeholderTextColor={colors.textMuted}
            value={label}
            onChangeText={setLabel}
            maxLength={80}
          />

          <View style={s.sourceRow}>
            <Icon name="credit-card" size={15} color={colors.textMuted} />
            <Text style={s.sourceText}>{account.type} · {account.number}</Text>
          </View>
        </FadeInView>

        <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
          <PressableScale
            onPress={() => { if (validate()) onSubmit(parseInt(amount), label); }}
            style={[s.primaryBtn, (!amount || parseInt(amount) <= 0) && { opacity: 0.4 }]}
          >
            <Text style={s.primaryBtnText}>Continuer</Text>
            <Icon name="arrow-right" size={18} color={colors.white} />
          </PressableScale>
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const SummaryView: React.FC<{
  type: TransferType;
  beneficiary: typeof MOCK_BENEFICIARIES[0] | null;
  amount: number;
  label: string;
  onConfirm: () => void;
  onEdit: () => void;
}> = ({ type, beneficiary, amount, label, onConfirm, onEdit }) => {
  const fees = type === 'external' ? Math.round(amount * 0.005) : 0;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>

      <FadeInView delay={0} from="top" style={s.summaryHero}>
        <Text style={s.summaryLabel}>Vous envoyez</Text>
        <Text style={s.summaryAmount}>{fmt(amount)}</Text>
        <Text style={s.summaryTo}>a {beneficiary?.name ?? '—'}</Text>
      </FadeInView>

      <FadeInView delay={100} from="bottom" style={{ padding: 20 }}>
        <AnimatedCard delay={120} padding={0}>
          {[
            { label: 'Beneficiaire',  value: beneficiary?.name ?? '—',                     icon: 'user'          },
            { label: 'Banque',        value: beneficiary?.bank ?? '—',                      icon: 'home'          },
            { label: 'Compte',        value: `****${beneficiary?.accountNumber.slice(-4)}`, icon: 'credit-card'   },
            { label: 'Motif',         value: label || 'Virement SONIBANK',                  icon: 'file-text'     },
            { label: 'Frais',         value: fees > 0 ? fmt(fees) : 'Gratuit',              icon: 'percent'       },
            { label: 'Total debite',  value: fmt(amount + fees),                            icon: 'trending-down' },
            { label: 'Delai',         value: type === 'internal' ? 'Instantane' : 'J+1 ouvre', icon: 'clock'      },
          ].map((row, i, arr) => (
            <View key={row.label} style={[s.summaryRow, i < arr.length - 1 && s.rowBorder]}>
              <View style={s.summaryRowIcon}>
                <Icon name={row.icon} size={14} color={colors.textMuted} />
              </View>
              <Text style={s.summaryRowLabel}>{row.label}</Text>
              <Text style={[
                s.summaryRowValue,
                row.label === 'Total debite' && { color: colors.primary, fontWeight: '700' }
              ]}>
                {row.value}
              </Text>
            </View>
          ))}
        </AnimatedCard>

        <FadeInView delay={200} from="bottom">
          <View style={s.warningBox}>
            <Icon name="alert-triangle" size={16} color={colors.warning} />
            <Text style={s.warningText}>
              Un virement confirme ne peut pas etre annule. Verifiez les informations avant de valider.
            </Text>
          </View>
        </FadeInView>

        <View style={s.twoButtons}>
          <PressableScale onPress={onEdit} style={s.secondaryBtn}>
            <Icon name="edit-2" size={15} color={colors.primary} />
            <Text style={s.secondaryBtnText}>Modifier</Text>
          </PressableScale>
          <PressableScale onPress={onConfirm} style={[s.primaryBtn, { flex: 2 }]}>
            <Icon name="lock" size={15} color={colors.white} />
            <Text style={s.primaryBtnText}>Valider par SMS</Text>
          </PressableScale>
        </View>
      </FadeInView>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const OtpModal: React.FC<{
  visible: boolean;
  onVerify: (code: string) => void;
  onClose: () => void;
}> = ({ visible, onVerify, onClose }) => {
  const [otp, setOtp] = useState('');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={s.modalOverlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Animated.View entering={SlideInUp.springify().damping(20)} style={s.modalSheet}>
            <View style={s.modalHandle} />
            <View style={s.modalHeader}>
              <View style={s.modalIconWrap}>
                <Icon name="message-square" size={22} color={colors.primary} />
              </View>
              <Text style={s.modalTitle}>Code de confirmation</Text>
              <Text style={s.modalSub}>
                Entrez le code a 6 chiffres envoye au {MOCK_USER.phone}
              </Text>
            </View>
            <TextInput
              style={s.otpInput}
              placeholder="------"
              placeholderTextColor={colors.textMuted}
              value={otp}
              onChangeText={t => setOtp(t.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={6}
              textAlign="center"
              autoFocus
            />
            <PressableScale
              onPress={() => { if (otp.length === 6) { onVerify(otp); setOtp(''); }}}
              style={[s.primaryBtn, { marginBottom: 12 }, otp.length < 6 && { opacity: 0.4 }]}
            >
              <Icon name="check" size={17} color={colors.white} />
              <Text style={s.primaryBtnText}>Confirmer le virement</Text>
            </PressableScale>
            <TouchableOpacity onPress={onClose} style={{ alignItems: 'center', padding: 12 }}>
              <Text style={{ color: colors.textSub, fontSize: 14 }}>Annuler</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const SuccessView: React.FC<{
  amount: number;
  beneficiary: typeof MOCK_BENEFICIARIES[0] | null;
  type: TransferType;
  onDone: () => void;
}> = ({ amount, beneficiary, type, onDone }) => {
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 180 });
  }, []);
  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={s.successWrap}>
      <Animated.View style={[s.successCircle, circleStyle]}>
        <LinearGradient
          colors={[colors.success, '#009E77']}
          style={s.successGrad}
        >
          <Icon name="check" size={36} color={colors.white} />
        </LinearGradient>
      </Animated.View>

      <FadeInView delay={300} from="bottom" style={{ alignItems: 'center' }}>
        <Text style={s.successTitle}>Virement effectue</Text>
        <Text style={s.successAmount}>{fmt(amount)}</Text>
        <Text style={s.successSub}>envoye a {beneficiary?.name}</Text>
      </FadeInView>

      <FadeInView delay={450} from="bottom" style={{ width: '100%', marginTop: 28 }}>
        <AnimatedCard delay={460} padding={0}>
          {[
            { label: 'Reference', value: `SBK${Date.now().toString().slice(-8)}` },
            { label: 'Date',      value: new Date().toLocaleDateString('fr-FR') },
            { label: 'Heure',     value: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) },
            { label: 'Delai',     value: type === 'internal' ? 'Instantane' : 'J+1 ouvre' },
          ].map((row, i, arr) => (
            <View key={row.label} style={[s.summaryRow, i < arr.length - 1 && s.rowBorder]}>
              <Text style={s.summaryRowLabel}>{row.label}</Text>
              <Text style={s.summaryRowValue}>{row.value}</Text>
            </View>
          ))}
        </AnimatedCard>
      </FadeInView>

      <FadeInView delay={600} from="bottom" style={{ width: '100%', marginTop: 20 }}>
        <PressableScale onPress={onDone} style={s.primaryBtn}>
          <Text style={s.primaryBtnText}>Retour a l'accueil</Text>
        </PressableScale>
      </FadeInView>
    </View>
  );
};

export const TransfersScreen: React.FC = () => {
  const [step,        setStep]        = useState<Step>('home');
  const [type,        setType]        = useState<TransferType>('internal');
  const [beneficiary, setBeneficiary] = useState<typeof MOCK_BENEFICIARIES[0] | null>(null);
  const [amount,      setAmount]      = useState(0);
  const [label,       setLabel]       = useState('');
  const [otpVisible,  setOtpVisible]  = useState(false);

  const TITLES: Record<Step, string> = {
    home:        'Virements',
    beneficiary: 'Beneficiaire',
    form:        'Montant',
    summary:     'Recapitulatif',
    success:     'Confirme',
  };

  const STEPS: Step[] = ['beneficiary', 'form', 'summary'];
  const stepIndex = STEPS.indexOf(step);

  const goBack = () => {
    const map: Partial<Record<Step, Step>> = {
      beneficiary: 'home', form: 'beneficiary', summary: 'form',
    };
    setStep(map[step] ?? 'home');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.gradStart} />

      <LinearGradient
        colors={[colors.gradStart, colors.gradMid, colors.gradEnd]}
        style={s.header}
        start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
      >
        <View style={s.headerRow}>
          {step !== 'home' && step !== 'success' ? (
            <TouchableOpacity onPress={goBack} style={s.backCircle}>
              <Icon name="chevron-left" size={20} color={colors.white} />
            </TouchableOpacity>
          ) : <BrandMark size={34} variant="white" />}

          <Text style={s.headerTitle}>{TITLES[step]}</Text>
          <View style={{ width: 36 }} />
        </View>

        {stepIndex >= 0 && (
          <View style={s.progressWrap}>
            {STEPS.map((st, i) => (
              <View
                key={st}
                style={[s.progressSeg, i <= stepIndex && s.progressSegActive]}
              />
            ))}
          </View>
        )}
      </LinearGradient>

      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        {step === 'home'        && <HomeView onStart={t => { setType(t); setStep('beneficiary'); }} />}
        {step === 'beneficiary' && <BeneficiaryView type={type} onSelect={b => { setBeneficiary(b); setStep('form'); }} />}
        {step === 'form'        && <FormView type={type} beneficiary={beneficiary} onSubmit={(a, l) => { setAmount(a); setLabel(l); setStep('summary'); }} />}
        {step === 'summary'     && <SummaryView type={type} beneficiary={beneficiary} amount={amount} label={label} onConfirm={() => setOtpVisible(true)} onEdit={() => setStep('form')} />}
        {step === 'success'     && <SuccessView amount={amount} beneficiary={beneficiary} type={type} onDone={() => { setStep('home'); setBeneficiary(null); setAmount(0); setLabel(''); }} />}
      </View>

      <OtpModal visible={otpVisible} onVerify={() => { setOtpVisible(false); setStep('success'); }} onClose={() => setOtpVisible(false)} />
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.surface },
  header:        { paddingTop: 12, paddingBottom: 20, paddingHorizontal: 20 },
  headerRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  headerTitle:   { fontSize: 18, fontWeight: '700', color: colors.white, letterSpacing: -0.3 },
  backCircle:    { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  progressWrap:  { flexDirection: 'row', gap: 6 },
  progressSeg:   { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)' },
  progressSegActive: { backgroundColor: colors.white },

  sectionLabel:  { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.2, marginBottom: 4 },

  typeCard:      { borderRadius: radius.xl, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  typeIconWrap:  { width: 48, height: 48, borderRadius: radius.lg, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  typeTitle:     { fontSize: 15, fontWeight: '700', color: colors.white, marginBottom: 3 },
  typeSub:       { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 8 },
  typePill:      { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.18)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full },
  typePillText:  { fontSize: 10, color: colors.primary, fontWeight: '600' },
  typeArrow:     { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

  benefChip:     { alignItems: 'center', width: 72 },
  benefChipAvatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 6, borderWidth: 2, borderColor: colors.border },
  benefChipInitial: { fontSize: 20, fontWeight: '700', color: colors.primary },
  benefChipName: { fontSize: 12, fontWeight: '600', color: colors.text, textAlign: 'center' },
  benefChipBank: { fontSize: 10, color: colors.textMuted, textAlign: 'center' },

  limitRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, paddingHorizontal: 16 },
  limitLabel:    { flex: 1, fontSize: 13, color: colors.textSub },
  limitValue:    { fontSize: 13, fontWeight: '600', color: colors.text },
  rowBorder:     { borderBottomWidth: 1, borderBottomColor: colors.borderLight },

  searchBar:     { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.lg, paddingHorizontal: 14, gap: 10, borderWidth: 1.5, borderColor: colors.border, height: 48 },
  searchInput:   { flex: 1, fontSize: 14, color: colors.text },

  newBenefCard:  { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radius.lg, padding: 16, gap: 14, borderWidth: 1, borderColor: colors.border },
  newBenefIcon:  { width: 42, height: 42, borderRadius: radius.md, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  newBenefTitle: { fontSize: 14, fontWeight: '700', color: colors.primary, marginBottom: 2 },
  newBenefSub:   { fontSize: 12, color: colors.primaryDark },

  benefRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 12 },
  benefAvatar:   { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  benefInitial:  { fontSize: 16, fontWeight: '700', color: colors.primary },
  benefName:     { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 2 },
  benefMeta:     { fontSize: 12, color: colors.textMuted },

  selectedBenef: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, gap: 12, borderWidth: 1.5, borderColor: colors.border },
  speedBadge:    { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.full },
  speedText:     { fontSize: 11, fontWeight: '700' },

  fieldLabel:    { fontSize: 12, fontWeight: '600', color: colors.textSub, marginBottom: 8, letterSpacing: 0.3 },
  amountWrap:    { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: 16, marginBottom: 8 },
  amountInput:   { flex: 1, fontSize: 32, fontWeight: '800', color: colors.text, height: 72, letterSpacing: -1 },
  amountUnit:    { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  errorText:     { fontSize: 12, color: colors.danger, fontWeight: '500', marginBottom: 12 },
  balanceHint:   { fontSize: 12, color: colors.textMuted, marginBottom: 16 },

  quickRow:      { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  quickChip:     { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border },
  quickChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  quickChipText: { fontSize: 12, color: colors.textSub, fontWeight: '600' },
  quickChipTextActive: { color: colors.white },

  motifInput:    { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: 16, height: 52, fontSize: 14, color: colors.text },
  sourceRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, padding: 12, backgroundColor: colors.surface, borderRadius: radius.md },
  sourceText:    { fontSize: 13, color: colors.textMuted, fontWeight: '500' },

  primaryBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 54, borderRadius: radius.lg, backgroundColor: colors.primary },
  primaryBtnText:{ fontSize: 15, fontWeight: '700', color: colors.white },
  secondaryBtn:  { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 54, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.primary, backgroundColor: colors.card },
  secondaryBtnText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  twoButtons:    { flexDirection: 'row', gap: 10, marginTop: 20 },

  summaryHero:   { alignItems: 'center', paddingVertical: 28, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  summaryLabel:  { fontSize: 12, color: colors.textMuted, fontWeight: '500', marginBottom: 8 },
  summaryAmount: { fontSize: 36, fontWeight: '800', color: colors.primary, letterSpacing: -1.5, marginBottom: 4 },
  summaryTo:     { fontSize: 14, color: colors.textSub },
  summaryRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 16, gap: 10 },
  summaryRowIcon:{ width: 24, alignItems: 'center' },
  summaryRowLabel: { flex: 1, fontSize: 13, color: colors.textSub },
  summaryRowValue: { fontSize: 13, fontWeight: '600', color: colors.text },
  warningBox:    { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: colors.warningLight, borderRadius: radius.md, padding: 14, marginTop: 16, borderWidth: 1, borderColor: colors.warning + '30' },
  warningText:   { flex: 1, fontSize: 12, color: colors.warning, lineHeight: 18 },

  modalOverlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet:    { backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  modalHandle:   { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 20 },
  modalHeader:   { alignItems: 'center', marginBottom: 24 },
  modalIconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  modalTitle:    { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 6 },
  modalSub:      { fontSize: 13, color: colors.textSub, textAlign: 'center' },
  otpInput:      { fontSize: 36, fontWeight: '800', letterSpacing: 14, color: colors.text, height: 72, borderBottomWidth: 2, borderBottomColor: colors.primary, marginBottom: 24, textAlign: 'center' },

  successWrap:   { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  successCircle: { marginBottom: 24 },
  successGrad:   { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  successTitle:  { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 8, letterSpacing: -0.5 },
  successAmount: { fontSize: 34, fontWeight: '800', color: colors.success, letterSpacing: -1.5, marginBottom: 4 },
  successSub:    { fontSize: 14, color: colors.textSub, marginBottom: 4 },
});
