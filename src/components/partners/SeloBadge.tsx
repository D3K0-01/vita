import React from 'react';
import { View, Text } from 'react-native';
import { Award } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import type { Selo } from '../../data/partners';

type Props = {
  selo: Selo;
  /** `pill` é a versão sobre a foto (1c); `inline` é a usada nos cards. */
  variant?: 'inline' | 'pill';
  size?: number;
};

// "Vita recomenda" = equipe visitou e confirmou. "Indicado pela comunidade"
// não ganha ícone nem cor de destaque — é informativo, não um selo menor.
export function SeloBadge({ selo, variant = 'inline', size = 10 }: Props) {
  const { colors, palette } = useTheme();

  if (selo === 'comunidade') {
    return (
      <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: size, letterSpacing: 0.8, textTransform: 'uppercase', color: palette.hint }}>
        Indicado pela comunidade
      </Text>
    );
  }

  if (variant === 'pill') {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: colors.darkAzure,
          borderRadius: 20,
          paddingVertical: 6,
          paddingHorizontal: 11,
        }}
      >
        <Award size={13} color={colors.pastelGreen} strokeWidth={2} />
        <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: colors.white }}>
          Vita recomenda
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Award size={size + 2} color={colors.accent2} strokeWidth={2.2} />
      <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: size, letterSpacing: 0.9, textTransform: 'uppercase', color: colors.accent2 }}>
        Vita recomenda
      </Text>
    </View>
  );
}
