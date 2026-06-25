import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, radius, spacing } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title, onPress, variant = 'primary', loading = false, disabled = false, style
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'secondary':
        return { container: styles.secondaryContainer, text: styles.secondaryText };
      case 'ghost':
        return { container: styles.ghostContainer, text: styles.ghostText };
      case 'danger':
        return { container: styles.dangerContainer, text: styles.primaryText };
      default:
        return { container: styles.primaryContainer, text: styles.primaryText };
    }
  };
  const s = getStyles();
  return (
    <TouchableOpacity
      style={[styles.base, s.container, (disabled || loading) && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? colors.primary : colors.white} size="small" />
        : <Text style={[styles.baseText, s.text]}>{title}</Text>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: { height: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  primaryContainer: { backgroundColor: colors.primary },
  secondaryContainer: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  ghostContainer: { backgroundColor: 'transparent' },
  dangerContainer: { backgroundColor: colors.danger },
  disabled: { opacity: 0.5 },
  baseText: { ...typography.h4 },
  primaryText: { color: colors.white },
  secondaryText: { color: colors.primary },
  ghostText: { color: colors.primary },
});
