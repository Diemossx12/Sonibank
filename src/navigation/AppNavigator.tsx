import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming
} from 'react-native-reanimated';
import { useAuthStore } from '../features/auth/store/authStore';
import { Icon } from '../shared/components/Icon';
import { colors } from '../shared/theme';

import { WelcomeScreen }   from '../features/auth/screens/WelcomeScreen';
import { LoginScreen }     from '../features/auth/screens/LoginScreen';
import { OtpScreen }       from '../features/auth/screens/OtpScreen';
import { PinScreen }       from '../features/auth/screens/PinScreen';
import { ProfileScreen }   from '../features/auth/screens/ProfileScreen';

import { DashboardScreen }  from '../features/account/screens/DashboardScreen';
import { StatementScreen } from '../features/account/screens/StatementScreen';
import { CheckbookScreen } from '../features/account/screens/CheckbookScreen';
import { CardScreen }      from '../features/account/screens/CardScreen';
import { TransfersScreen } from '../features/transfers/screens/TransfersScreen';
import { AgencyScreen }    from '../features/agency/screens/AgencyScreen';
import { CreditScreen }    from '../features/credit/screens/CreditScreen';

type AuthStep  = 'welcome' | 'login' | 'otp' | 'pin';
type AppTab    = 'home' | 'transfers' | 'agency' | 'credit' | 'profile';

const TABS_CONFIG = [
  { key: 'home'      as AppTab, icon: 'home',        label: 'Accueil'   },
  { key: 'transfers' as AppTab, icon: 'repeat',      label: 'Virements' },
  { key: 'agency'    as AppTab, icon: 'map-pin',     label: 'Agences'   },
  { key: 'credit'    as AppTab, icon: 'trending-up', label: 'Crédit'    },
  { key: 'profile'   as AppTab, icon: 'user',        label: 'Profil'    },
];

const TabItem: React.FC<{
  config: typeof TABS_CONFIG[0];
  isActive: boolean;
  onPress: () => void;
}> = ({ config, isActive, onPress }) => {
  const scale   = useSharedValue(1);
  const opacity = useSharedValue(isActive ? 1 : 0.5);

  useEffect(() => {
    scale.value   = withSpring(isActive ? 1.1 : 1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(isActive ? 1 : 0.45, { duration: 200 });
  }, [isActive]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity:   opacity.value,
  }));

  return (
    <TouchableOpacity
      style={tb2.tabItem}
      onPress={onPress}
      activeOpacity={1}
    >
      <Animated.View style={[tb2.tabInner, animStyle]}>
        {isActive && (
          <Animated.View style={tb2.activePill} />
        )}
        <Icon
          name={config.icon}
          size={22}
          color={isActive ? colors.primary : colors.textMuted}
          family="feather"
        />
        <Text style={[tb2.label, isActive && tb2.labelActive]}>
          {config.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const AnimatedTabBar: React.FC<{
  active: AppTab;
  onChange: (t: AppTab) => void;
}> = ({ active, onChange }) => (
  <View style={tb2.bar}>
    {TABS_CONFIG.map(t => (
      <TabItem
        key={t.key}
        config={t}
        isActive={active === t.key}
        onPress={() => onChange(t.key)}
      />
    ))}
  </View>
);

const tb2 = StyleSheet.create({
  bar: {
    flexDirection:   'row',
    backgroundColor: colors.white,
    borderTopWidth:  1,
    borderTopColor:  colors.border,
    paddingBottom:   Platform.OS === 'ios' ? 28 : 10,
    paddingTop:      10,
    paddingHorizontal: 8,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: -4 },
    shadowOpacity:   0.06,
    shadowRadius:    16,
    elevation:       16,
  },
  tabItem:  { flex: 1, alignItems: 'center' },
  tabInner: { alignItems: 'center', gap: 3, position: 'relative', paddingTop: 4 },
  activePill: {
    position:        'absolute',
    top:             -10,
    width:           32,
    height:          3,
    borderRadius:    2,
    backgroundColor: colors.primary,
  },
  label:      { fontSize: 10, color: colors.textMuted, fontWeight: '500', marginTop: 2 },
  labelActive:{ color: colors.primary, fontWeight: '700' },
});

type SubScreen = null | 'statement' | 'checkbook' | 'card';

/* ── App shell avec tabs ── */
const AppShell: React.FC = () => {
  const { logout } = useAuthStore();
  const [tab, setTab] = useState<AppTab>('home');
  const [subScreen, setSubScreen] = useState<SubScreen>(null);

  const navigate = (screen: string) => {
    if (screen === 'statement') { setSubScreen('statement'); return; }
    if (screen === 'checkbook') { setSubScreen('checkbook'); return; }
    if (screen === 'card')      { setSubScreen('card');      return; }
    if (screen === 'transfers') setTab('transfers');
    else if (screen === 'agency')   setTab('agency');
    else if (screen === 'credit')   setTab('credit');
    else if (screen === 'profile')  setTab('profile');
  };

  const renderScreen = () => {
    if (subScreen === 'statement') return <StatementScreen onBack={() => setSubScreen(null)} />;
    if (subScreen === 'checkbook') return <CheckbookScreen onBack={() => setSubScreen(null)} />;
    if (subScreen === 'card')      return <CardScreen      onBack={() => setSubScreen(null)} />;

    switch (tab) {
      case 'home':      return <DashboardScreen onNavigate={navigate} />;
      case 'transfers': return <TransfersScreen />;
      case 'agency':    return <AgencyScreen />;
      case 'credit':    return <CreditScreen />;
      case 'profile':   return <ProfileScreen onLogout={logout} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{renderScreen()}</View>
      {!subScreen && <AnimatedTabBar active={tab} onChange={t => { setTab(t); setSubScreen(null); }} />}
    </View>
  );
};

/* ── Auth flow ── */
export const AppNavigator: React.FC = () => {
  const { isAuthenticated, login } = useAuthStore();
  const [step, setStep]             = useState<AuthStep>('welcome');
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber]     = useState('');

  if (isAuthenticated) return <AppShell />;

  switch (step) {
    case 'welcome':
      return <WelcomeScreen onLogin={() => setStep('login')} />;

    case 'login':
      return (
        <LoginScreen
          onNext={acc => {
            setAccountNumber(acc);
            setPhoneNumber('+227 90 ** ** 56');
            setStep('otp');
          }}
          onBack={() => setStep('welcome')}
        />
      );

    case 'otp':
      return (
        <OtpScreen
          phoneNumber={phoneNumber}
          onVerify={code => { if (code.length === 6) setStep('pin'); }}
          onResend={() => {}}
          onBack={() => setStep('login')}
        />
      );

    case 'pin':
      return (
        <PinScreen
          mode="login"
          accountNumber={accountNumber}
          onSuccess={(_pin) =>
            login(
              {
                id: '001',
                firstName: 'Moussa',
                lastName: 'Mahamadou',
                accountNumber,
                agencyName: 'Agence Plateau Niamey',
                phone: phoneNumber,
                email: 'moussa@example.ne',
              },
              'mock_jwt_sonibank',
            )
          }
          onBack={() => setStep('otp')}
        />
      );

    default:
      return <WelcomeScreen onLogin={() => setStep('login')} />;
  }
};
