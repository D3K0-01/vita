import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { useApp } from '../../state/AppContext';
import { Illustration } from '../../components/Illustration';
import { getTrack } from '../../data/tracks';

export default function Celebration6c2({ navigation, route }: any) {
  const { palette, colors, type } = useTheme();
  const { state } = useApp();
  const trackId = route.params?.id ?? 'alimentacao';
  const track = getTrack(trackId);
  const progress = state.tracks[trackId] ?? { step: 1, attempts: 0, history: [] };
  const finished = progress.step > track.phases.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 }}>
        <Pressable onPress={() => navigation.navigate('TrilhaDetail6b', { id: trackId })} accessibilityLabel="Fechar" style={{ alignSelf: 'flex-end', width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -10 }}>
          <X size={22} color={palette.hint} strokeWidth={2} />
        </Pressable>

        <View style={{ flex: 1, justifyContent: 'center', gap: 22, alignItems: 'center', paddingVertical: 12 }}>
          <Illustration variant="sparkles" height={170} />
          <View style={{ alignItems: 'center' }}>
            <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ borderRadius: 20, paddingVertical: 7, paddingHorizontal: 14 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 11.5, letterSpacing: 1, textTransform: 'uppercase', color: '#fff' }}>Pequenos Avanços</Text>
            </LinearGradient>
            <Text style={[type.title, { color: palette.text, fontSize: 32, marginTop: 16, textAlign: 'center' }]}>
              {finished ? `${state.childName} concluiu a trilha ${track.name}` : `${state.childName} avançou para a fase ${progress.step}`}
            </Text>
            <Text style={[type.body, { color: palette.textMuted, fontSize: 14.5, opacity: 0.78, marginTop: 12, textAlign: 'center', lineHeight: 23 }]}>
              {finished ? 'Cada tentativa até aqui contou. Que conquista.' : `Próxima: ${track.phases[progress.step - 1]?.title.toLowerCase()}. As tentativas da fase anterior foram o que abriu esta.`}
            </Text>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Pressable onPress={() => navigation.navigate('TrilhaDetail6b', { id: trackId })} style={{ backgroundColor: colors.darkAzure, borderRadius: 30, padding: 17, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 15, color: colors.offWhite }}>
              {finished ? 'Ver a trilha' : `Ver a fase ${progress.step}`}
            </Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('TrilhaDetail6b', { id: trackId })}>
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 13.5, color: palette.textMuted, opacity: 0.7, textAlign: 'center' }}>Voltar para a trilha</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
