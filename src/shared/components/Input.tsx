import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { colors, typography, radius, spacing } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({ label, error, rightIcon, onRightIconPress, style, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, focused && styles.focused, error ? styles.errorBorder : null]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.iconWrapper}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { ...typography.bodySm, color: colors.textSub, marginBottom: spacing.xs, fontWeight: '500' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.white, paddingHorizontal: spacing.md },
  focused: { borderColor: colors.primary, borderWidth: 1.5 },
  errorBorder: { borderColor: colors.danger },
  input: { flex: 1, height: 52, ...typography.body, color: colors.text },
  iconWrapper: { padding: spacing.sm },
  errorText: { ...typography.caption, color: colors.danger, marginTop: 4 },
});
