import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { useApp } from '../../state/AppContext';

export default function Celebration6c2({ navigation }: any) {
  const { palette, colors, type } = useTheme();
  const { state } = useApp();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 14, paddingBottom: 34 }}>
        <Pressable onPress={() => navigation.navigate('TrilhaDetail6b')} style={{ alignItems: 'flex-end' }}>
          <X size={22} color={palette.hint} strokeWidth={2} />
        </Pressable>

        <View style={{ flex: 1, justifyContent: 'center', gap: 26, alignItems: 'center' }}>
          <LinearGradient colors={[colors.pastelGreen, colors.greyAzure]} style={{ width: '100%', height: 230, borderRadius: 24 }} />
          <View style={{ alignItems: 'center' }}>
            <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ borderRadius: 20, paddingVertical: 7, paddingHorizontal: 14 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 11.5, letterSpacing: 1, textTransform: 'uppercase', color: '#fff' }}>Pequenos Avanços</Text>
            </LinearGradient>
            <Text style={[type.title, { color: palette.text, fontSize: 32, marginTop: 16, textAlign: 'center' }]}>
              O {state.childName} avançou para a fase {Math.min(state.phase.stepIndex, state.phase.stepTotal)}
            </Text>
            <Text style={[type.body, { color: palette.textMuted, fontSize: 14.5, opacity: 0.78, marginTop: 12, textAlign: 'center', lineHeight: 23 }]}>
              Vocês repetiram a fase anterior por seis semanas. Foi isso que abriu a próxima.
            </Text>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Pressable onPress={() => navigation.navigate('TrilhaDetail6b')} style={{ backgroundColor: colors.darkAzure, borderRadius: 30, padding: 17, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 15, color: colors.offWhite }}>
              Ver a fase {Math.min(state.phase.stepIndex, state.phase.stepTotal)}
            </Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('TrilhaDetail6b')}>
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 13.5, color: palette.textMuted, opacity: 0.7, textAlign: 'center' }}>Voltar para a trilha</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
