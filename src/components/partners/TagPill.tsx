import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

// Tag rápida de adaptação ("ruído baixo", "sem fila") — informativa, não clicável.
export function TagPill({ label }: { label: string }) {
  const { colors, alpha } = useTheme();
  return (
    <View style={{ backgroundColor: alpha(colors.pastelGreen, 0.55), borderRadius: 8, paddingVertical: 3.5, paddingHorizontal: 8 }}>
      <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 11, color: colors.darkAzure }}>{label}</Text>
    </View>
  );
}
