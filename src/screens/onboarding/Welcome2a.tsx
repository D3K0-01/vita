import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../../components/Button';
import { VitaMark } from '../../components/VitaMark';

export default function Welcome2a({ navigation }: any) {
  const { colors, type } = useTheme();
  return (
    <LinearGradient colors={[colors.darkAzure, '#243C42']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', gap: 22 }}>
          <VitaMark size={64} />
          <Text style={[type.h1, { color: colors.offWhite, fontSize: 52, lineHeight: 56 }]}>Vita</Text>
          <Text style={[type.bodyLg, { color: colors.offWhite, opacity: 0.85, fontSize: 18, lineHeight: 28 }]}>
            Rotina leve, apoio na hora difícil e pequenos avanços para famílias de crianças neurodivergentes.
          </Text>
          <View style={{ gap: 10, marginTop: 8 }}>
            {['Rotina sem cobrança, no ritmo da criança', 'Modo Crise a um toque, mesmo offline', 'Comunidade e lugares que acolhem de verdade'].map((t) => (
              <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.pastelGreen }} />
                <Text style={[type.bodySm, { color: colors.offWhite, opacity: 0.8 }]}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ gap: 6, paddingBottom: 12 }}>
          <Button label="Começar" onPress={() => navigation.navigate('Login2b', { mode: 'criar' })} />
          <Button label="Já tenho conta" variant="ghost" textColor={colors.offWhite} onPress={() => navigation.navigate('Login2b', { mode: 'entrar' })} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
