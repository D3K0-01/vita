import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import type { NivelEstimulo } from '../../data/partners';

const OPTIONS: { key: NivelEstimulo; label: string; hint: string }[] = [
  { key: 'baixo', label: 'Baixo', hint: 'silencioso' },
  { key: 'medio', label: 'Médio', hint: 'movimento' },
  { key: 'alto', label: 'Alto', hint: 'tudo bem' },
];

export function SensoryLevelSelector({ value, onChange }: { value: NivelEstimulo; onChange: (v: NivelEstimulo) => void }) {
  const { palette, colors, type, radii } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 4, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.md, padding: 4 }}>
      {OPTIONS.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 11, backgroundColor: active ? colors.pastelGreen : 'transparent' }}
          >
            <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 13.5, color: active ? colors.accent2 : palette.text }}>{o.label}</Text>
            <Text style={[type.caption, { fontSize: 10.5, color: active ? colors.accent2 : palette.textFaint }]}>{o.hint}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
