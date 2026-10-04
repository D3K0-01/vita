import React from 'react';
import { View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';

export function Switch({ value, onValueChange, achievement, label }: { value: boolean; onValueChange: (v: boolean) => void; achievement?: boolean; label?: string }) {
  const { colors, gradients, palette, scheme } = useTheme();
  const knob = <View style={{ width: 21, height: 21, borderRadius: 11, backgroundColor: '#fff' }} />;
  const track = { width: 48, height: 28, borderRadius: 14, justifyContent: 'center' as const, padding: 3.5 };
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      hitSlop={10}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
    >
      {value ? (
        achievement !== false ? (
          <LinearGradient colors={gradients.achievement} style={[track, { alignItems: 'flex-end' }]}>
            {knob}
          </LinearGradient>
        ) : (
          <View style={[track, { alignItems: 'flex-end', backgroundColor: scheme === 'dark' ? colors.accent1 : colors.darkAzure }]}>{knob}</View>
        )
      ) : (
        <View style={[track, { backgroundColor: palette.divider, borderWidth: 1, borderColor: palette.chipBorder }]}>{knob}</View>
      )}
    </Pressable>
  );
}
