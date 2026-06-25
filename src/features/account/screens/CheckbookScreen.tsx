import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon }           from '../../../shared/components/Icon';
import { BrandMark }      from '../../../shared/components/BrandMark';
import { FadeInView }     from '../../../shared/components/FadeInView';
import { AnimatedCard }   from '../../../shared/components/AnimatedCard';
import { PressableScale } from '../../../shared/components/PressableScale';
import { colors, radius } from '../../../shared/theme';
import { MOCK_USER }      from '../../../shared/mock/data';

interface Props { onBack: () => void; }

const CHECKBOOK_OPTIONS = [
  { id: 'cb25', leaves: 25, label: '25 feuilles',  desc: 'Usage courant',  fee: 3500,  delay: '5 jours ouvres' },
  { id: 'cb50', leaves: 50, label: '50 feuilles',  desc: 'Usage intensif', fee: 6000,  delay: '7 jours ouvres' },
];

const AGENCIES = [
  { id: 'a1', name: 'Agence Plateau',    address: 'Avenue de la Mairie, Niamey' },
  { id: 'a2', name: 'Agence Universite', address: "Route de l'Universite, Niamey" },
  { id: 'a3', name: 'Agence Wadata',     address: 'Quartier Wadata, Niamey' },
];

const HISTORY = [
  { id: 'h1', leaves: 25, date: '12/03/2025', status: 'delivered' as const, agency: 'Agence Plateau'    },
  { id: 'h2', leaves: 50, date: '08/11/2024', status: 'delivered' as const, agency: 'Agence Universite' },
  { id: 'h3', leaves: 25, date: '22/06/2024', status: 'delivered' as const, agency: 'Agence Plateau'    },
];

const STATUS_CONFIG = {
  delivered: { label: 'Remis',      color: colors.success, icon: 'check-circle' },
  ready:     { label: 'Disponible', color: colors.warning, icon: 'clock'        },
  pending:   { label: 'En cours',   color: colors.primary, icon: 'loader'       },
};

export const CheckbookScreen: React.FC<Props> = ({ onBack }) => {
  const [selected,  setSelected]  = useState<string | null>(null);
  const [delivery,  setDelivery]  = useState<'agency' | 'mail'>('agency');
  const [agency,    setAgency]    = useState(AGENCIES[0].id);
  const [step,      setStep]      = useState<'form' | 'confirm' | 'success'>('form');

  const option = CHECKBOOK_OPTIONS.find(o => o.id === selected);

  return (
    <SafeAreaView style={st.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.gradStart} />

      <LinearGradient
        colors={[colors.gradStart, colors.gradMid, colors.gradEnd]}
        style={st.header}
        start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
      >
        <FadeInView delay={0} from="top" style={st.headerRow}>
          <TouchableOpacity
            onPress={step === 'form' ? onBack : () => setStep('form')}
            style={st.backBtn}
          >
            <Icon name="chevron-left" size={20} color={colors.white} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <BrandMark size={32} variant="white" />
            <Text style={st.headerTitle}>Demande de chequier</Text>
          </View>
          <View style={{ width: 36 }} />
        </FadeInView>

        <FadeInView delay={80} from="none" style={st.stepsRow}>
          {['Choix', 'Confirmation', 'Valide'].map((lbl, i) => {
            const stepIdx = step === 'form' ? 0 : step === 'confirm' ? 1 : 2;
            return (
              <React.Fragment key={lbl}>
                <View style={st.stepItem}>
                  <View style={[st.stepDot, i <= stepIdx && st.stepDotActive]}>
                    {i < stepIdx
                      ? <Icon name="check" size={10} color={colors.white} />
                      : <Text style={[st.stepNum, i <= stepIdx && st.stepNumActive]}>{i+1}</Text>
                    }
                  </View>
                  <Text style={[st.stepLabel, i <= stepIdx && st.stepLabelActive]}>{lbl}</Text>
                </View>
                {i < 2 && <View style={[st.stepLine, i < stepIdx && st.stepLineActive]} />}
              </React.Fragment>
            );
          })}
        </FadeInView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: colors.surface }}>

        {step === 'form' && (
          <>
            <FadeInView delay={150} from="bottom" style={st.section}>
              <Text style={st.sectionLabel}>NOMBRE DE FEUILLES</Text>
              <View style={st.optionsRow}>
                {CHECKBOOK_OPTIONS.map(opt => (
                  <PressableScale
                    key={opt.id}
                    onPress={() => setSelected(opt.id)}
                    style={{ flex: 1 }}
                  >
                    <View style={[st.optCard, selected === opt.id && st.optCardActive]}>
                      <View style={[st.checkbookIllus, selected === opt.id && { backgroundColor: colors.primary }]}>
                        <View style={st.checkLines}>
                          {[...Array(4)].map((_, i) => (
                            <View key={i} style={[st.checkLine, { width: `${70 - i * 10}%`, opacity: 1 - i * 0.2, backgroundColor: selected === opt.id ? 'rgba(255,255,255,0.7)' : colors.border }]} />
                          ))}
                        </View>
                        <Text style={[st.checkCount, selected === opt.id && { color: colors.white }]}>
                          {opt.leaves}
                        </Text>
                      </View>
                      <Text style={[st.optLabel, selected === opt.id && { color: colors.primary }]}>
                        {opt.label}
                      </Text>
                      <Text style={st.optDesc}>{opt.desc}</Text>
                      <Text style={[st.optFee, selected === opt.id && { color: colors.primary }]}>
                        {new Intl.NumberFormat('fr-FR').format(opt.fee)} FCFA
                      </Text>
                      {selected === opt.id && (
                        <View style={st.optCheck}>
                          <Icon name="check" size={12} color={colors.white} />
                        </View>
                      )}
                    </View>
                  </PressableScale>
                ))}
              </View>
            </FadeInView>

            <FadeInView delay={220} from="bottom" style={st.section}>
              <Text style={st.sectionLabel}>MODE DE REMISE</Text>
              <AnimatedCard delay={230} padding={0}>
                {([['agency','Retrait en agence','home','Disponible sous 5 a 7 jours'], ['mail','Envoi postal','mail','Delai supplementaire de 3 jours']] as const).map(([key, lbl, icon, sub], i) => (
                  <TouchableOpacity
                    key={key}
                    style={[st.delivRow, i === 0 && st.rowBorder]}
                    onPress={() => setDelivery(key)}
                  >
                    <View style={[st.delivIcon, delivery === key && { backgroundColor: colors.primaryLight }]}>
                      <Icon name={icon} size={18} color={delivery === key ? colors.primary : colors.textMuted} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[st.delivLabel, delivery === key && { color: colors.primary }]}>{lbl}</Text>
                      <Text style={st.delivSub}>{sub}</Text>
                    </View>
                    <View style={[st.radio, delivery === key && st.radioActive]}>
                      {delivery === key && <View style={st.radioDot} />}
                    </View>
                  </TouchableOpacity>
                ))}
              </AnimatedCard>
            </FadeInView>

            {delivery === 'agency' && (
              <FadeInView delay={280} from="bottom" style={st.section}>
                <Text style={st.sectionLabel}>AGENCE DE RETRAIT</Text>
                <AnimatedCard delay={290} padding={0}>
                  {AGENCIES.map((ag, i) => (
                    <TouchableOpacity
                      key={ag.id}
                      style={[st.agRow, i < AGENCIES.length - 1 && st.rowBorder]}
                      onPress={() => setAgency(ag.id)}
                    >
                      <View style={[st.agIcon, agency === ag.id && { backgroundColor: colors.primaryLight }]}>
                        <Icon name="map-pin" size={15} color={agency === ag.id ? colors.primary : colors.textMuted} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[st.agName, agency === ag.id && { color: colors.primary }]}>{ag.name}</Text>
                        <Text style={st.agAddr}>{ag.address}</Text>
                      </View>
                      <View style={[st.radio, agency === ag.id && st.radioActive]}>
                        {agency === ag.id && <View style={st.radioDot} />}
                      </View>
                    </TouchableOpacity>
                  ))}
                </AnimatedCard>
              </FadeInView>
            )}

            <View style={st.section}>
              <PressableScale
                onPress={() => { if (selected) setStep('confirm'); }}
                style={[st.submitBtn, !selected && { opacity: 0.4 }]}
              >
                <Text style={st.submitBtnText}>Continuer</Text>
                <Icon name="arrow-right" size={18} color={colors.white} />
              </PressableScale>
            </View>

            <FadeInView delay={350} from="bottom" style={st.section}>
              <Text style={st.sectionLabel}>HISTORIQUE DES DEMANDES</Text>
              <AnimatedCard delay={360} padding={0}>
                {HISTORY.map((h, i) => {
                  const cfg = STATUS_CONFIG[h.status];
                  return (
                    <View key={h.id} style={[st.histRow, i < HISTORY.length - 1 && st.rowBorder]}>
                      <View style={[st.histIcon, { backgroundColor: cfg.color + '18' }]}>
                        <Icon name={cfg.icon} size={15} color={cfg.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={st.histLabel}>Chequier {h.leaves} feuilles</Text>
                        <Text style={st.histSub}>{h.date} · {h.agency}</Text>
                      </View>
                      <View style={[st.statusBadge, { backgroundColor: cfg.color + '18' }]}>
                        <Text style={[st.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                      </View>
                    </View>
                  );
                })}
              </AnimatedCard>
            </FadeInView>
            <View style={{ height: 40 }} />
          </>
        )}

        {step === 'confirm' && option && (
          <FadeInView delay={0} from="bottom" style={st.section}>
            <AnimatedCard delay={50} padding={24}>
              <View style={st.confirmIcon}>
                <Icon name="file-text" size={28} color={colors.primary} />
              </View>
              <Text style={st.confirmTitle}>Recapitulatif</Text>
              {[
                ['Type',          `${option.leaves} feuilles`],
                ['Frais',         `${new Intl.NumberFormat('fr-FR').format(option.fee)} FCFA`],
                ['Delai',         option.delay],
                ['Mode de remise',delivery === 'agency' ? 'Retrait en agence' : 'Envoi postal'],
                ['Agence',        delivery === 'agency' ? AGENCIES.find(a => a.id === agency)?.name ?? '-' : '-'],
                ['Compte debite', MOCK_USER.accountNumber],
              ].map(([lbl, val], i, arr) => (
                <View key={lbl} style={[st.confRow, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.borderLight, paddingBottom: 12, marginBottom: 12 }]}>
                  <Text style={st.confLabel}>{lbl}</Text>
                  <Text style={st.confValue}>{val}</Text>
                </View>
              ))}
              <PressableScale onPress={() => setStep('success')} style={[st.submitBtn, { marginTop: 20 }]}>
                <Icon name="check" size={17} color={colors.white} />
                <Text style={st.submitBtnText}>Confirmer la demande</Text>
              </PressableScale>
            </AnimatedCard>
          </FadeInView>
        )}

        {step === 'success' && option && (
          <FadeInView delay={0} from="bottom" style={[st.section, { alignItems: 'center', paddingTop: 40 }]}>
            <LinearGradient colors={[colors.primary, colors.primaryDark]} style={st.successCircle}>
              <Icon name="check" size={36} color={colors.white} />
            </LinearGradient>
            <Text style={st.successTitle}>Demande envoyee</Text>
            <Text style={st.successSub}>
              Votre chequier de {option.leaves} feuilles sera disponible sous {option.delay}.
            </Text>
            <View style={st.successRef}>
              <Icon name="hash" size={13} color={colors.textMuted} />
              <Text style={st.successRefText}>Ref: CHQ{Date.now().toString().slice(-8)}</Text>
            </View>
            <PressableScale onPress={onBack} style={st.submitBtn}>
              <Text style={st.submitBtnText}>Retour a l'accueil</Text>
            </PressableScale>
          </FadeInView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const st = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.gradStart },
  header:      { paddingTop: 12, paddingBottom: 24, paddingHorizontal: 20 },
  headerRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.white },
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },

  stepsRow:    { flexDirection: 'row', alignItems: 'center' },
  stepItem:    { alignItems: 'center', gap: 4 },
  stepDot:     { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: colors.white },
  stepNum:     { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  stepNumActive: { color: colors.primary },
  stepLabel:   { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  stepLabelActive: { color: colors.white, fontWeight: '700' },
  stepLine:    { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 14 },
  stepLineActive: { backgroundColor: colors.white },

  section:     { padding: 20, paddingBottom: 0 },
  sectionLabel:{ fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.2, marginBottom: 12 },
  rowBorder:   { borderBottomWidth: 1, borderBottomColor: colors.borderLight },

  optionsRow:  { flexDirection: 'row', gap: 12 },
  optCard:     { borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: 16, alignItems: 'center', backgroundColor: colors.card, position: 'relative' },
  optCardActive:{ borderColor: colors.primary, borderWidth: 2 },
  checkbookIllus: { width: 80, height: 56, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 10, overflow: 'hidden', position: 'relative', padding: 8 },
  checkLines:  { position: 'absolute', left: 8, right: 8, top: 10, gap: 5 },
  checkLine:   { height: 2, borderRadius: 1 },
  checkCount:  { fontSize: 22, fontWeight: '800', color: colors.textMuted, zIndex: 1 },
  optLabel:    { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  optDesc:     { fontSize: 11, color: colors.textMuted, marginBottom: 6 },
  optFee:      { fontSize: 13, fontWeight: '700', color: colors.textSub },
  optCheck:    { position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },

  delivRow:    { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  delivIcon:   { width: 42, height: 42, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  delivLabel:  { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 2 },
  delivSub:    { fontSize: 12, color: colors.textMuted },
  radio:       { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.primary },
  radioDot:    { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },

  agRow:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  agIcon:      { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  agName:      { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 2 },
  agAddr:      { fontSize: 11, color: colors.textMuted },

  submitBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 54, borderRadius: radius.lg, backgroundColor: colors.primary, marginTop: 16 },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: colors.white },

  histRow:     { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  histIcon:    { width: 38, height: 38, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  histLabel:   { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 2 },
  histSub:     { fontSize: 11, color: colors.textMuted },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  statusText:  { fontSize: 11, fontWeight: '700' },

  confirmIcon: { width: 60, height: 60, borderRadius: radius.lg, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 16, alignSelf: 'center' },
  confirmTitle:{ fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 20, textAlign: 'center' },
  confRow:     { flexDirection: 'row', justifyContent: 'space-between' },
  confLabel:   { fontSize: 13, color: colors.textSub },
  confValue:   { fontSize: 13, fontWeight: '600', color: colors.text },

  successCircle: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 20, alignSelf: 'center' },
  successTitle:{ fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 8, textAlign: 'center' },
  successSub:  { fontSize: 14, color: colors.textSub, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  successRef:  { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.full, marginBottom: 24 },
  successRefText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
});
