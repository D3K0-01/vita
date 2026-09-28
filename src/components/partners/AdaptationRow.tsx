import React from 'react';
import { View, Text } from 'react-native';
import { Check, Info } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import type { Adaptacao } from '../../data/partners';

// Ressalva ("sem sala de descompressão") NÃO é erro: ícone neutro, sem vermelho.
// Serve para a família decidir, não para desencorajar o local.
export function AdaptationRow({ item, isLast }: { item: Adaptacao; isLast?: boolean }) {
  const { palette, colors, type, alpha } = useTheme();
  const confirmado = item.status === 'confirmado';

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 11,
        alignItems: 'flex-start',
        paddingVertical: 11,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: palette.divider,
      }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: confirmado ? colors.pastelGreen : alpha(colors.greyAzure, 0.28),
        }}
      >
        {confirmado ? (
          <Check size={13} color={colors.accent2} strokeWidth={3} />
        ) : (
          <Info size={13} color={colors.darkAzure} strokeWidth={2.2} />
        )}
      </View>
      <Text style={[type.bodySm, { flex: 1, fontSize: 13, lineHeight: 19, color: confirmado ? palette.text : palette.textMuted }]}>
        {item.descricao}
      </Text>
    </View>
  );
}
