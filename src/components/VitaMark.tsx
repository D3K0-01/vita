import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';

// Marca do Vita: quadrado arredondado no Verde de Conquista com um "broto".
export function VitaMark({ size = 40 }: { size?: number }) {
  const { gradients, colors } = useTheme();
  const s = size;
  return (
    <LinearGradient colors={gradients.achievement} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: s, height: s, borderRadius: s * 0.3, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: s * 0.2 }}>
      <View style={{ flexDirection: 'row', gap: s * 0.04, marginBottom: -s * 0.02 }}>
        <View style={{ width: s * 0.2, height: s * 0.3, borderTopLeftRadius: s * 0.2, borderBottomRightRadius: s * 0.2, backgroundColor: colors.pastelGreen, transform: [{ rotate: '-20deg' }] }} />
        <View style={{ width: s * 0.2, height: s * 0.3, borderTopRightRadius: s * 0.2, borderBottomLeftRadius: s * 0.2, backgroundColor: colors.offWhite, transform: [{ rotate: '20deg' }] }} />
      </View>
      <View style={{ width: s * 0.06, height: s * 0.22, borderRadius: s * 0.03, backgroundColor: colors.offWhite }} />
    </LinearGradient>
  );
}
