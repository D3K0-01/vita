import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { useApp } from '../../state/AppContext';
import { Illustration } from '../../components/Illustration';
import { getTrack } from '../../data/tracks';

export default function NotYet6d({ navigation, route }: any) {
  const { palette, colors, type } = useTheme();
  const { state } = useApp();
  const trackId = route.params?.id ?? 'alimentacao';
  const track = getTrack(trackId);
  const progress = state.tracks[trackId] ?? { step: 1, attempts: 0, history: [] };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 }}>
        <Pressable onPress={() => navigation.navigate('TrilhaDetail6b', { id: trackId })} accessibilityLabel="Fechar" style={{ alignSelf: 'flex-end', width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -10 }}>
          <X size={22} color={palette.hint} strokeWidth={2} />
        </Pressable>

        <View style={{ flex: 1, justifyContent: 'center', gap: 22, alignItems: 'center', paddingVertical: 12 }}>
          <Illustration variant="sprout" height={170} />
          <View style={{ alignItems: 'center' }}>
            <Text style={[type.title, { color: palette.text, fontSize: 32, textAlign: 'center' }]}>Cada tempo é um tempo</Text>
            <Text style={[type.body, { color: palette.textMuted, fontSize: 14.5, opacity: 0.78, marginTop: 12, textAlign: 'center', lineHeight: 23 }]}>
              A fase continua. Registramos a tentativa — ela conta, mesmo sem o próximo passo.
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 16, marginTop: 20 }}>
              <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 18, color: palette.text }}>{progress.attempts}</Text>
              <Text style={[type.caption, { fontSize: 12.5, color: palette.textMuted, opacity: 0.7, lineHeight: 16 }]}>tentativas{'\n'}nesta fase</Text>
            </View>
            <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, opacity: 0.85, marginTop: 14 }]}>nenhuma comparação, só o caminho de vocês</Text>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Pressable onPress={() => navigation.navigate('TrilhaDetail6b', { id: trackId })} style={{ backgroundColor: colors.darkAzure, borderRadius: 30, padding: 17, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 15, color: colors.offWhite }}>Voltar para a trilha</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate('IATab', {
                prefill: `Estamos na trilha "${track.name}", fase ${progress.step} (${track.phases[progress.step - 1]?.title ?? ''}). ${state.childName} ainda não aceitou avançar. Me dá uma ideia simples para a próxima tentativa?`,
              })
            }
            accessibilityRole="button"
            style={{ borderWidth: 1.5, borderColor: palette.chipBorder, borderRadius: 30, padding: 15, alignItems: 'center' }}
          >
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 14, color: palette.text }}>Pedir uma ideia à IA para a próxima vez</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
