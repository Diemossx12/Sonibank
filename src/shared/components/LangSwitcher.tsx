import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, Pressable
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, FadeIn
} from 'react-native-reanimated';
import { Icon }    from './Icon';
import { useLang } from '../i18n/langStore';
import { colors, radius } from '../theme';

const FLAGS: Record<string, string> = {
  fr: '\u{1F1F3}\u{1F1EA}',
  en: '\u{1F1EC}\u{1F1E7}',
};

const LANG_LABELS: Record<string, string> = {
  fr: 'Francais',
  en: 'English',
};

export const LangSwitcher: React.FC = () => {
  const { lang, setLang } = useLang();
  const [open, setOpen]   = useState(false);
  const scale             = useSharedValue(1);

  const btnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.94, { damping: 12 });
    setTimeout(() => { scale.value = withSpring(1); }, 120);
    setOpen(true);
  };

  const handleSelect = (l: 'fr' | 'en') => {
    setLang(l);
    setOpen(false);
  };

  return (
    <>
      <Animated.View style={btnAnimStyle}>
        <TouchableOpacity
          style={s.btn}
          onPress={handlePress}
          activeOpacity={0.85}
        >
          <Text style={s.flag}>{FLAGS[lang]}</Text>
          <Text style={s.btnLabel}>{lang.toUpperCase()}</Text>
          <Icon name="chevron-down" size={12} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={s.overlay} onPress={() => setOpen(false)}>
          <Animated.View
            entering={FadeIn.duration(180)}
            style={s.dropdown}
          >
            <View style={s.arrow} />

            {(['fr', 'en'] as const).map((l, i) => (
              <TouchableOpacity
                key={l}
                style={[
                  s.option,
                  i === 0 && s.optionFirst,
                  lang === l && s.optionActive,
                ]}
                onPress={() => handleSelect(l)}
                activeOpacity={0.7}
              >
                <Text style={s.optionFlag}>{FLAGS[l]}</Text>
                <Text style={[
                  s.optionLabel,
                  lang === l && s.optionLabelActive
                ]}>
                  {LANG_LABELS[l]}
                </Text>
                {lang === l && (
                  <View style={s.checkWrap}>
                    <Icon name="check" size={13} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};

const s = StyleSheet.create({
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.full,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  flag:     { fontSize: 15 },
  btnLabel: { fontSize: 12, fontWeight: '700', color: colors.white, letterSpacing: 0.5 },

  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'flex-end',
    paddingTop: 90, paddingRight: 20,
  },
  dropdown: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    overflow: 'hidden', minWidth: 160,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18, shadowRadius: 20, elevation: 12,
  },
  arrow: {
    position: 'absolute', top: -7, right: 18,
    width: 14, height: 14, backgroundColor: colors.white,
    transform: [{ rotate: '45deg' }],
    borderTopWidth: 0.5, borderLeftWidth: 0.5, borderColor: colors.border,
  },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 14, paddingHorizontal: 16,
    borderTopWidth: 1, borderTopColor: colors.borderLight,
  },
  optionFirst:  { borderTopWidth: 0 },
  optionActive: { backgroundColor: colors.primaryLight },
  optionFlag:   { fontSize: 18 },
  optionLabel:  { flex: 1, fontSize: 14, fontWeight: '500', color: colors.text },
  optionLabelActive: { color: colors.primary, fontWeight: '700' },
  checkWrap: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
});
