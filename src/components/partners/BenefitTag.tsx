import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import type { BeneficioTipo } from '../../data/partners';

// A cor varia por tipo de benefício, dentro da paleta da marca.
export function useBenefitTone(tipo: BeneficioTipo) {
  const { colors } = useTheme();
  switch (tipo) {
    case 'desconto_percentual':
      return { bg: colors.accent1, fg: colors.white, border: colors.accent1 };
    case 'cupom_codigo':
      return { bg: colors.darkAzure, fg: colors.white, border: colors.darkAzure };
    case 'primeira_gratis':
      return { bg: colors.greyAzure, fg: colors.white, border: colors.greyAzure };
    case 'brinde':
      return { bg: colors.pastelGreen, fg: colors.darkAzure, border: colors.pastelGreen };
    case 'horario_reservado':
      return { bg: colors.accent2, fg: colors.white, border: colors.accent2 };
    default:
      return { bg: 'transparent', fg: colors.darkAzure, border: colors.greyAzure };
  }
}

export function BenefitTag({ tipo, label }: { tipo: BeneficioTipo; label: string }) {
  const tone = useBenefitTone(tipo);
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: tone.bg,
        borderWidth: 1,
        borderColor: tone.border,
        borderRadius: 9,
        paddingVertical: 3,
        paddingHorizontal: 8,
      }}
    >
      <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 11, color: tone.fg }}>{label}</Text>
    </View>
  );
}
