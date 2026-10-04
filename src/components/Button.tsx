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
};

export function Button({ label, onPress, variant = 'primary', style, disabled, loading }: Props) {
  const { palette, gradients, type, radii, colors } = useTheme();

  if (variant === 'primary') {
    return (
      <Pressable onPress={onPress} disabled={disabled || loading} style={({ pressed }) => [{ opacity: pressed ? 0.85 : disabled ? 0.5 : 1 }, style]}>
        <LinearGradient colors={gradients.achievement} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.base, { borderRadius: radii.pill }]}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={[type.button, styles.primaryText]}>{label}</Text>}
        </LinearGradient>
      </Pressable>
    );
  }

  if (variant === 'dark') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.base,
          { borderRadius: radii.pill, backgroundColor: colors.darkAzure, opacity: pressed ? 0.85 : 1 },
          style,
        ]}
      >
        <Text style={[type.button, styles.primaryText]}>{label}</Text>
      </Pressable>
    );
  }

  if (variant === 'secondary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.base,
          {
            borderRadius: radii.pill,
            borderWidth: 1.5,
            borderColor: palette.chipBorder,
            backgroundColor: 'transparent',
            opacity: pressed ? 0.6 : 1,
          },
          style,
        ]}
      >
        <Text style={[type.body, { color: palette.text, fontFamily: type.button.fontFamily, fontSize: 14 }]}>{label}</Text>
      </Pressable>
    );
  }

  // ghost — text-only, used for "pular", "configurar depois" etc.
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, alignItems: 'center', paddingVertical: 8 }, style]}>
      <Text style={[type.bodySm, { color: palette.textMuted, fontSize: 13.5 }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#fff',
  },
});
