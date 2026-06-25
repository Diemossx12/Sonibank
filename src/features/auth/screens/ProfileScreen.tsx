import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandMark }  from '../../../shared/components/BrandMark';
import { colors, spacing, radius } from '../../../shared/theme';
import { MOCK_USER } from '../../../shared/mock/data';
import { useAuthStore } from '../store/authStore';

interface Props { onLogout: () => void; }

export const ProfileScreen: React.FC<Props> = ({ onLogout }) => {
  const { user } = useAuthStore();
  const firstName = user?.firstName ?? MOCK_USER.firstName;
  const lastName  = user?.lastName  ?? MOCK_USER.lastName;

  const INFO_ROWS = [
    { label: 'Numero de compte', value: MOCK_USER.accountNumber },
    { label: 'IBAN',             value: MOCK_USER.iban          },
    { label: 'Agence',           value: MOCK_USER.agencyName    },
    { label: 'Telephone',        value: MOCK_USER.phone         },
    { label: 'Email',            value: MOCK_USER.email         },
  ];

  const MENU = [
    { icon: 'bell',        label: 'Notifications et alertes'  },
    { icon: 'lock',        label: 'Securite et PIN'           },
    { icon: 'credit-card', label: 'Ma carte bancaire'         },
    { icon: 'file-text',   label: 'Documents et attestations' },
    { icon: 'map-pin',     label: 'Mon agence'                },
    { icon: 'help-circle', label: 'Aide et support'           },
  ];

  return (
    <SafeAreaView style={st.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[colors.primaryDeep, colors.primary]} style={st.header}>
          <View style={{ position: 'relative', marginBottom: 12 }}>
            <View style={st.avatarLarge}>
              <Text style={st.avatarText}>{firstName[0]}{lastName[0]}</Text>
            </View>
            <BrandMark
              size={24}
              variant="color"
              style={{
                position: 'absolute', bottom: 0, right: 0,
                shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2, elevation: 4,
              }}
            />
          </View>
          <Text style={st.name}>{firstName} {lastName}</Text>
          <Text style={st.agency}>{MOCK_USER.agencyName}</Text>
        </LinearGradient>

        <View style={st.section}>
          <Text style={st.sectionTitle}>Informations du compte</Text>
          <View style={st.card}>
            {INFO_ROWS.map((row, i) => (
              <View key={row.label} style={[st.infoRow, i < INFO_ROWS.length - 1 && st.infoBorder]}>
                <Text style={st.infoLabel}>{row.label}</Text>
                <Text style={st.infoValue} numberOfLines={1}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={st.section}>
          <Text style={st.sectionTitle}>Parametres</Text>
          <View style={st.card}>
            {MENU.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                style={[st.menuRow, i < MENU.length - 1 && st.infoBorder]}
                activeOpacity={0.7}
              >
                <Text style={st.menuLabel}>{item.label}</Text>
                <Text style={st.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={st.section}>
          <TouchableOpacity style={st.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
            <Text style={st.logoutText}>Se deconnecter</Text>
          </TouchableOpacity>
          <Text style={st.version}>SONIBANK v1.0.0</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { alignItems: 'center', paddingTop: 24, paddingBottom: 32 },
  avatarLarge: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: colors.white },
  name:    { fontSize: 20, fontWeight: '700', color: colors.white, marginBottom: 4 },
  agency:  { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textSub, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: {
    backgroundColor: colors.white, borderRadius: 16,
    shadowColor: '#09B5EA', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
    overflow: 'hidden',
  },
  infoRow: { paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  infoLabel: { fontSize: 13, color: colors.textSub, flex: 1 },
  infoValue: { fontSize: 13, fontWeight: '600', color: colors.text, flex: 1, textAlign: 'right' },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16 },
  menuLabel: { flex: 1, fontSize: 14, color: colors.text, fontWeight: '500' },
  menuArrow: { fontSize: 20, color: colors.textMuted },
  logoutBtn: {
    backgroundColor: colors.dangerLight, borderRadius: 14,
    padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: colors.danger + '40',
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: colors.danger },
  version: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 16 },
});
