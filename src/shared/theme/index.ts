export const colors = {
  // Brand
  primary:      '#09B5EA',
  primaryDark:  '#0790BB',
  primaryDeep:  '#054D6F',
  primaryLight: '#E0F6FD',

  // Sémantiques
  success:      '#00C896',
  successLight: '#E6FAF5',
  danger:       '#FF4D6A',
  dangerLight:  '#FFF0F3',
  warning:      '#FFB020',
  warningLight: '#FFF8EC',

  // Neutres
  white:        '#FFFFFF',
  black:        '#0A0E1A',
  surface:      '#F7FAFC',
  card:         '#FFFFFF',
  border:       '#E8EEF4',
  borderLight:  '#F0F5F9',

  // Texte
  text:         '#0A0E1A',
  textSub:      '#4A5568',
  textMuted:    '#A0AEC0',
  textOnDark:   '#FFFFFF',

  // Gradients (définis ici pour référence)
  gradStart:    '#054D6F',
  gradMid:      '#0790BB',
  gradEnd:      '#09B5EA',
};

export const typography = {
  // Display
  display:   { fontSize: 36, fontWeight: '800' as const, letterSpacing: -1   },
  h1:        { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2:        { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3:        { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.2 },
  h4:        { fontSize: 16, fontWeight: '600' as const, letterSpacing: 0    },

  // Corps
  body:      { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyMed:   { fontSize: 15, fontWeight: '500' as const, lineHeight: 22 },
  bodySm:    { fontSize: 13, fontWeight: '400' as const, lineHeight: 19 },
  bodySmMed: { fontSize: 13, fontWeight: '500' as const, lineHeight: 19 },

  // Utilitaire
  caption:   { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.3 },
  label:     { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.8 },
  amount:    { fontSize: 38, fontWeight: '800' as const, letterSpacing: -1.5 },
  amountSm:  { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.5 },
  mono:      { fontSize: 13, fontWeight: '500' as const, letterSpacing: 0.5  },
};

export const spacing = {
  xs:  4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64,
};

export const radius = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, full: 999,
};

export const shadow = {
  sm: {
    shadowColor: '#09B5EA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#09B5EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};
