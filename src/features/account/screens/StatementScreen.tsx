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
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from '../../../shared/mock/data';

interface Props { onBack: () => void; }

const MOCK_STATEMENTS = [
  { id: 's1', month: 'Juin 2025',    period: '01/06 - 18/06', credits: 600000,  debits: 227500, balance: 1248500, available: true  },
  { id: 's2', month: 'Mai 2025',     period: '01/05 - 31/05', credits: 450000,  debits: 185000, balance: 848500,  available: true  },
  { id: 's3', month: 'Avril 2025',   period: '01/04 - 30/04', credits: 450000,  debits: 210000, balance: 583500,  available: true  },
  { id: 's4', month: 'Mars 2025',    period: '01/03 - 31/03', credits: 450000,  debits: 198000, balance: 343500,  available: true  },
  { id: 's5', month: 'Fevrier 2025', period: '01/02 - 28/02', credits: 450000,  debits: 165000, balance: 91500,   available: true  },
  { id: 's6', month: 'Janvier 2025', period: '01/01 - 31/01', credits: 450000,  debits: 244000, balance: -193500, available: true  },
];

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.abs(n));

const CATEGORY_ICON: Record<string, string> = {
  virement: 'repeat', retrait: 'credit-card', achat: 'shopping-bag', frais: 'file-text',
};

export const StatementScreen: React.FC<Props> = ({ onBack }) => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const account = MOCK_ACCOUNTS[0];

  const filteredTx = MOCK_TRANSACTIONS.filter(tx =>
    activeFilter === 'all' ? true : tx.type === activeFilter
  );

  const handleDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 2000);
  };

  const totalCredits = MOCK_TRANSACTIONS.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebits  = Math.abs(MOCK_TRANSACTIONS.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0));

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.gradStart} />

      <LinearGradient
        colors={[colors.gradStart, colors.gradMid, colors.gradEnd]}
        style={s.header}
        start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
      >
        <FadeInView delay={0} from="top" style={s.headerRow}>
          <TouchableOpacity onPress={onBack} style={s.backBtn}>
            <Icon name="chevron-left" size={20} color={colors.white} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <BrandMark size={32} variant="white" />
            <Text style={s.headerTitle}>Releves bancaires</Text>
          </View>
          <View style={{ width: 36 }} />
        </FadeInView>

        <FadeInView delay={100} from="bottom" style={s.summaryCard}>
          <View style={s.summaryRow}>
            <View>
              <Text style={s.summaryLabel}>Compte courant</Text>
              <Text style={s.summaryAccount}>{account.number}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.summaryLabel}>Solde actuel</Text>
              <Text style={s.summaryBalance}>
                {fmt(account.balance)} FCFA
              </Text>
            </View>
          </View>
          <View style={s.summaryStats}>
            <View style={s.statItem}>
              <View style={[s.statDot, { backgroundColor: colors.success }]} />
              <Text style={s.statLabel}>Entrees ce mois</Text>
              <Text style={[s.statValue, { color: colors.success }]}>
                +{fmt(totalCredits)} FCFA
              </Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <View style={[s.statDot, { backgroundColor: colors.danger }]} />
              <Text style={s.statLabel}>Sorties ce mois</Text>
              <Text style={[s.statValue, { color: colors.danger }]}>
                -{fmt(totalDebits)} FCFA
              </Text>
            </View>
          </View>
        </FadeInView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: colors.surface }}>

        <FadeInView delay={200} from="bottom" style={s.section}>
          <Text style={s.sectionLabel}>RELEVES MENSUELS</Text>
          <AnimatedCard delay={220} padding={0}>
            {MOCK_STATEMENTS.map((stmt, i) => (
              <View key={stmt.id} style={[s.stmtRow, i < MOCK_STATEMENTS.length - 1 && s.rowBorder]}>
                <View style={s.stmtIcon}>
                  <Icon name="file-text" size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.stmtMonth}>{stmt.month}</Text>
                  <Text style={s.stmtPeriod}>{stmt.period}</Text>
                  <View style={s.stmtAmounts}>
                    <Text style={[s.stmtAmt, { color: colors.success }]}>
                      +{fmt(stmt.credits)}
                    </Text>
                    <Text style={s.stmtAmtSep}>·</Text>
                    <Text style={[s.stmtAmt, { color: colors.danger }]}>
                      -{fmt(stmt.debits)}
                    </Text>
                  </View>
                </View>
                <PressableScale
                  onPress={() => handleDownload(stmt.id)}
                  style={[
                    s.downloadBtn,
                    downloading === stmt.id && { backgroundColor: colors.success }
                  ]}
                >
                  <Icon
                    name={downloading === stmt.id ? 'check' : 'download'}
                    size={15}
                    color={downloading === stmt.id ? colors.white : colors.primary}
                  />
                </PressableScale>
              </View>
            ))}
          </AnimatedCard>
        </FadeInView>

        <FadeInView delay={300} from="bottom" style={s.section}>
          <Text style={s.sectionLabel}>HISTORIQUE DES OPERATIONS</Text>

          <View style={s.filtersRow}>
            {([['all','Toutes'], ['credit','Entrees'], ['debit','Sorties']] as const).map(([key, lbl]) => (
              <TouchableOpacity
                key={key}
                style={[s.filterChip, activeFilter === key && s.filterChipActive]}
                onPress={() => setActiveFilter(key)}
              >
                <Text style={[s.filterText, activeFilter === key && s.filterTextActive]}>
                  {lbl}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <AnimatedCard delay={320} padding={0}>
            {filteredTx.map((tx, i) => (
              <View key={tx.id} style={[s.txRow, i < filteredTx.length - 1 && s.rowBorder]}>
                <View style={[
                  s.txIcon,
                  { backgroundColor: tx.type === 'credit' ? colors.successLight : colors.surface }
                ]}>
                  <Icon
                    name={CATEGORY_ICON[tx.category] ?? 'activity'}
                    size={15}
                    color={tx.type === 'credit' ? colors.success : colors.textMuted}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.txLabel} numberOfLines={1}>{tx.label}</Text>
                  <Text style={s.txDate}>
                    {new Date(tx.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </Text>
                </View>
                <Text style={[
                  s.txAmount,
                  { color: tx.type === 'credit' ? colors.success : colors.text }
                ]}>
                  {tx.type === 'credit' ? '+' : '-'}{fmt(tx.amount)} F
                </Text>
              </View>
            ))}
          </AnimatedCard>
        </FadeInView>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.gradStart },
  header:      { paddingTop: 12, paddingBottom: 24, paddingHorizontal: 20 },
  headerRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.white },
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },

  summaryCard: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  summaryRow:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  summaryLabel:{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: '500', marginBottom: 3 },
  summaryAccount: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  summaryBalance: { fontSize: 18, fontWeight: '800', color: colors.white, letterSpacing: -0.5 },
  summaryStats:{ flexDirection: 'row' },
  statItem:    { flex: 1, gap: 4 },
  statDot:     { width: 6, height: 6, borderRadius: 3 },
  statLabel:   { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  statValue:   { fontSize: 13, fontWeight: '700' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 16 },

  section:     { padding: 20, paddingBottom: 0 },
  sectionLabel:{ fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.2, marginBottom: 12 },
  rowBorder:   { borderBottomWidth: 1, borderBottomColor: colors.borderLight },

  stmtRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 12 },
  stmtIcon:    { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  stmtMonth:   { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 },
  stmtPeriod:  { fontSize: 11, color: colors.textMuted, marginBottom: 4 },
  stmtAmounts: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stmtAmt:     { fontSize: 12, fontWeight: '600' },
  stmtAmtSep:  { color: colors.textMuted, fontSize: 12 },
  downloadBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },

  filtersRow:  { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filterChip:  { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.full, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText:  { fontSize: 12, color: colors.textSub, fontWeight: '600' },
  filterTextActive: { color: colors.white },

  txRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 16, gap: 12 },
  txIcon:      { width: 36, height: 36, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  txLabel:     { fontSize: 13, fontWeight: '500', color: colors.text, marginBottom: 2 },
  txDate:      { fontSize: 11, color: colors.textMuted },
  txAmount:    { fontSize: 13, fontWeight: '700', letterSpacing: -0.3 },
});
