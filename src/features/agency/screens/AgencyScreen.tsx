import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, TextInput, Linking, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon }           from '../../../shared/components/Icon';
import { BrandMark }      from '../../../shared/components/BrandMark';
import { FadeInView }     from '../../../shared/components/FadeInView';
import { AnimatedCard }   from '../../../shared/components/AnimatedCard';
import { PressableScale } from '../../../shared/components/PressableScale';
import { colors, radius } from '../../../shared/theme';
import { MOCK_BRANCHES }  from '../../../shared/mock/data';

type Filter = 'all' | 'atm';

export const AgencyScreen: React.FC = () => {
  const [filter,   setFilter]   = useState<Filter>('all');
  const [search,   setSearch]   = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const list = MOCK_BRANCHES
    .filter(b => filter === 'atm' ? b.hasATM : true)
    .filter(b =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase())
    );

  const openMaps = (b: typeof MOCK_BRANCHES[0]) => {
    const url = Platform.select({
      ios:     `maps:0,0?q=${b.lat},${b.lng}`,
      android: `geo:${b.lat},${b.lng}?q=${b.lat},${b.lng}(${b.name})`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <SafeAreaView style={ag.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.gradStart} />

      <LinearGradient
        colors={[colors.gradStart, colors.gradMid, colors.gradEnd]}
        style={ag.header}
        start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
      >
        <FadeInView delay={0} from="top">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <BrandMark size={34} variant="white" />
            <View>
              <Text style={ag.headerTitle}>Agences & DAB</Text>
              <Text style={ag.headerSub}>{MOCK_BRANCHES.length} points de service au Niger</Text>
            </View>
          </View>
        </FadeInView>

        <FadeInView delay={80} from="none" style={ag.searchWrap}>
          <Icon name="search" size={16} color="rgba(255,255,255,0.7)" />
          <TextInput
            style={ag.searchInput}
            placeholder="Ville, quartier..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon name="x" size={14} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          )}
        </FadeInView>

        <FadeInView delay={150} from="none" style={ag.filtersRow}>
          {([['all','Toutes'], ['atm','Avec DAB']] as [Filter,string][]).map(([key, lbl]) => (
            <TouchableOpacity
              key={key}
              style={[ag.filterChip, filter === key && ag.filterChipActive]}
              onPress={() => setFilter(key)}
            >
              <Icon
                name={key === 'atm' ? 'credit-card' : 'map-pin'}
                size={12}
                color={filter === key ? colors.primary : 'rgba(255,255,255,0.8)'}
              />
              <Text style={[ag.filterText, filter === key && ag.filterTextActive]}>{lbl}</Text>
            </TouchableOpacity>
          ))}
        </FadeInView>
      </LinearGradient>

      <FadeInView delay={200} from="none">
        <View style={ag.statsBar}>
          {[
            { icon: 'home',        label: 'Agences',        value: MOCK_BRANCHES.length },
            { icon: 'credit-card', label: 'DAB',            value: MOCK_BRANCHES.filter(b => b.hasATM).length },
            { icon: 'check-circle',label: 'DAB en service', value: MOCK_BRANCHES.filter(b => b.atmAvailable).length },
          ].map((stat, i, arr) => (
            <React.Fragment key={stat.label}>
              <View style={ag.stat}>
                <Text style={ag.statNum}>{stat.value}</Text>
                <Text style={ag.statLabel}>{stat.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={ag.statDiv} />}
            </React.Fragment>
          ))}
        </View>
      </FadeInView>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ padding: 16, gap: 12 }}>
          {list.map((branch, i) => {
            const isOpen = expanded === branch.id;

            return (
              <FadeInView key={branch.id} delay={i * 60} from="bottom">
                <AnimatedCard delay={i * 60} padding={0} style={isOpen ? { borderWidth: 1.5, borderColor: colors.primary } : {}}>

                  <TouchableOpacity
                    style={ag.branchHead}
                    onPress={() => setExpanded(isOpen ? null : branch.id)}
                    activeOpacity={0.8}
                  >
                    <View style={ag.branchIconWrap}>
                      <Icon name="home" size={18} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={ag.branchName}>{branch.name}</Text>
                      <Text style={ag.branchAddr} numberOfLines={1}>{branch.address}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      {branch.hasATM && (
                        <View style={[ag.atmDot, { backgroundColor: branch.atmAvailable ? colors.successLight : colors.dangerLight }]}>
                          <View style={[ag.atmDotInner, { backgroundColor: branch.atmAvailable ? colors.success : colors.danger }]} />
                          <Text style={[ag.atmText, { color: branch.atmAvailable ? colors.success : colors.danger }]}>
                            DAB {branch.atmAvailable ? 'OK' : 'HS'}
                          </Text>
                        </View>
                      )}
                      <Icon
                        name={isOpen ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color={colors.textMuted}
                      />
                    </View>
                  </TouchableOpacity>

                  {!isOpen && (
                    <View style={ag.branchHoursRow}>
                      <Icon name="clock" size={12} color={colors.textMuted} />
                      <Text style={ag.branchHours}>{branch.hours}</Text>
                    </View>
                  )}

                  {isOpen && (
                    <Animated.View entering={FadeIn.duration(200)} style={ag.details}>
                      <View style={ag.detailsDivider} />
                      {[
                        { icon: 'clock',    text: branch.hours   },
                        { icon: 'phone',    text: branch.phone   },
                        { icon: 'map-pin',  text: branch.address },
                      ].map(row => (
                        <View key={row.text} style={ag.detailRow}>
                          <Icon name={row.icon} size={14} color={colors.textMuted} />
                          <Text style={ag.detailText}>{row.text}</Text>
                        </View>
                      ))}

                      <View style={ag.actionsRow}>
                        <PressableScale
                          onPress={() => Linking.openURL(`tel:${branch.phone.replace(/\s/g,'')}`)}
                          style={ag.actionBtn}
                        >
                          <Icon name="phone" size={16} color={colors.primary} />
                          <Text style={ag.actionText}>Appeler</Text>
                        </PressableScale>

                        <PressableScale
                          onPress={() => openMaps(branch)}
                          style={[ag.actionBtn, ag.actionBtnPrimary]}
                        >
                          <Icon name="navigation" size={16} color={colors.white} />
                          <Text style={[ag.actionText, { color: colors.white }]}>Itineraire</Text>
                        </PressableScale>

                        <PressableScale style={ag.actionBtn}>
                          <Icon name="calendar" size={16} color={colors.primary} />
                          <Text style={ag.actionText}>RDV</Text>
                        </PressableScale>
                      </View>
                    </Animated.View>
                  )}
                </AnimatedCard>
              </FadeInView>
            );
          })}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const ag = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.surface },
  header:        { paddingTop: 16, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle:   { fontSize: 22, fontWeight: '700', color: colors.white, letterSpacing: -0.4, marginBottom: 3 },
  headerSub:     { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16 },
  searchWrap:    { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.lg, paddingHorizontal: 14, height: 46, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  searchInput:   { flex: 1, fontSize: 14, color: colors.white },
  filtersRow:    { flexDirection: 'row', gap: 8 },
  filterChip:    { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  filterChipActive: { backgroundColor: colors.white },
  filterText:    { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  filterTextActive: { color: colors.primary, fontWeight: '700' },

  statsBar:      { flexDirection: 'row', backgroundColor: colors.card, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  stat:          { flex: 1, alignItems: 'center' },
  statNum:       { fontSize: 24, fontWeight: '800', color: colors.primary, letterSpacing: -0.5 },
  statLabel:     { fontSize: 11, color: colors.textMuted, fontWeight: '500', marginTop: 2 },
  statDiv:       { width: 1, backgroundColor: colors.borderLight },

  branchHead:    { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  branchIconWrap:{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  branchName:    { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 },
  branchAddr:    { fontSize: 12, color: colors.textMuted },
  atmDot:        { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: radius.full },
  atmDotInner:   { width: 6, height: 6, borderRadius: 3 },
  atmText:       { fontSize: 10, fontWeight: '700' },
  branchHoursRow:{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingBottom: 14 },
  branchHours:   { fontSize: 12, color: colors.textMuted },

  details:       { paddingHorizontal: 16, paddingBottom: 16 },
  detailsDivider:{ height: 1, backgroundColor: colors.borderLight, marginBottom: 14 },
  detailRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  detailText:    { fontSize: 13, color: colors.textSub, flex: 1 },

  actionsRow:    { flexDirection: 'row', gap: 8, marginTop: 14 },
  actionBtn:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: radius.md, backgroundColor: colors.primaryLight },
  actionBtnPrimary: { backgroundColor: colors.primary },
  actionText:    { fontSize: 12, fontWeight: '700', color: colors.primary },
});
