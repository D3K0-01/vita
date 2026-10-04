import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
  /** Cor do texto no variant ghost (ex.: sobre fundo escuro). */
  textColor?: string;
  icon?: React.ReactNode;
};

export function Button({ label, onPress, variant = 'primary', style, disabled, loading, textColor, icon }: Props) {
  const { palette, gradients, type, radii, colors } = useTheme();
  const a11y = { accessibilityRole: 'button' as const, accessibilityLabel: label, accessibilityState: { disabled: !!disabled } };

  if (variant === 'primary') {
    return (
      <Pressable {...a11y} onPress={onPress} disabled={disabled || loading} style={({ pressed }) => [{ opacity: pressed ? 0.85 : disabled ? 0.45 : 1 }, style]}>
        <LinearGradient colors={gradients.achievement} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.base, { borderRadius: radii.pill }]}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              {icon}
              <Text style={[type.button, styles.primaryText]}>{label}</Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  if (variant === 'dark') {
    return (
      <Pressable
        {...a11y}
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [styles.base, { borderRadius: radii.pill, backgroundColor: colors.darkAzure, opacity: pressed ? 0.85 : disabled ? 0.45 : 1 }, style]}
      >
        {icon}
        <Text style={[type.button, styles.primaryText]}>{label}</Text>
      </Pressable>
    );
  }

  if (variant === 'secondary') {
    return (
      <Pressable
        {...a11y}
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.base,
          { borderRadius: radii.pill, borderWidth: 1.5, borderColor: palette.chipBorder, backgroundColor: 'transparent', opacity: pressed ? 0.6 : disabled ? 0.45 : 1 },
          style,
        ]}
      >
        {icon}
        <Text style={[type.button, { color: textColor ?? palette.text, fontSize: 14 }]}>{label}</Text>
      </Pressable>
    );
  }

  // ghost — só texto, para "pular", "configurar depois" etc.
  return (
    <Pressable
      {...a11y}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, alignItems: 'center', justifyContent: 'center', minHeight: 44, paddingVertical: 8 }, style]}
    >
      <Text style={[type.bodySm, { color: textColor ?? palette.textMuted, fontSize: 14 }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#fff',
  },
});
