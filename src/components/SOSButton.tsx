import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../state/AppContext';

// Botão SOS flutuante — canto inferior direito, acima da barra de abas.
// Abre o Modo Crise direto (5b) ou retoma a sessão deixada no meio (5e).
// Use dentro de `ScreenContainer floating={...}` para não sobrepor conteúdo.
export function SOSButton({ bottom = 16 }: { bottom?: number }) {
  const { colors, palette } = useTheme();
  const navigation = useNavigation<any>();
  const { state } = useApp();
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', right: 16, bottom, alignItems: 'center', gap: 2 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="SOS: abrir o Modo Crise"
        onPress={() => navigation.navigate('CrisisStack', { screen: state.crisisSession ? 'Resume5e' : 'Triage5b' })}
        style={({ pressed }) => ({
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: colors.darkAzure,
          borderWidth: 2,
          borderColor: palette.bg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.85 : 1,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
        })}
      >
        <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 14, color: colors.offWhite }}>SOS</Text>
      </Pressable>
    </View>
  );
}
