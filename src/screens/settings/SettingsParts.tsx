import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';

// Peças compartilhadas pelas telas de Perfil e de Configurações.

export function Row({ title, sub, onPress, first, icon }: { title: string; sub?: string; onPress: () => void; first?: boolean; icon?: React.ReactNode }) {
  const { palette, type } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        minHeight: 56,
        paddingVertical: 13,
        paddingHorizontal: 17,
        borderTopWidth: first ? 0 : 1,
        borderTopColor: palette.divider,
        backgroundColor: pressed ? palette.chipSelectedBg : 'transparent',
      })}
    >
      {icon}
      <View style={{ flex: 1 }}>
        <Text style={[type.body, { fontSize: 14.5, color: palette.text }]}>{title}</Text>
        {sub ? <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 2 }]}>{sub}</Text> : null}
      </View>
      <ChevronRight size={16} color={palette.hint} />
    </Pressable>
  );
}

export function Section({ label, right, children }: { label: string; right?: React.ReactNode; children: React.ReactNode }) {
  const { palette, type } = useTheme();
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, minHeight: 28 }}>
        <Text style={[type.eyebrow, { color: palette.hint }]}>{label}</Text>
        {right}
      </View>
      <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, overflow: 'hidden' }}>{children}</View>
    </View>
  );
}

/** Cartão discreto que leva de uma tela para a outra (Perfil ↔ Configurações). */
export function CrossLink({ title, sub, icon, onPress }: { title: string; sub: string; icon: React.ReactNode; onPress: () => void }) {
  const { palette, type } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: 16, padding: 15, opacity: pressed ? 0.7 : 1 })}
    >
      {icon}
      <View style={{ flex: 1 }}>
        <Text style={[type.body, { fontSize: 14, color: palette.text, fontFamily: 'Lexend_500Medium' }]}>{title}</Text>
        <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 2 }]}>{sub}</Text>
      </View>
      <ChevronRight size={16} color={palette.hint} />
    </Pressable>
  );
}
