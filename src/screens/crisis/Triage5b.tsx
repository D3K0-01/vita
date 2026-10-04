import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { X, ChevronRight, TriangleAlert } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { useApp } from '../../state/AppContext';

function Option({ title, sub, onPress, inverted }: { title: string; sub: string; onPress: () => void; inverted?: boolean }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: inverted ? colors.offWhite : 'rgba(242,239,230,.1)',
        borderWidth: inverted ? 0 : 1,
        borderColor: 'rgba(242,239,230,.18)',
        borderRadius: 20,
        padding: 22,
        minHeight: 88,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
      }}
    >
      {inverted && <TriangleAlert size={24} color={colors.darkAzure} strokeWidth={2} />}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 21, color: inverted ? colors.darkAzure : colors.offWhite }}>{title}</Text>
        <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 13, color: inverted ? colors.darkAzure : colors.offWhite, opacity: 0.7, marginTop: 4 }}>{sub}</Text>
      </View>
      <ChevronRight size={20} color={inverted ? colors.darkAzure : colors.offWhite} strokeWidth={2} />
    </Pressable>
  );
}

export default function Triage5b({ navigation }: any) {
  const { colors } = useTheme();
  const { setCrisisSession } = useApp();

  const startGuide = (category: 'sensorial' | 'emocional') => {
    setCrisisSession({ category, step: 2 });
    navigation.navigate('StepGuide5c', { category });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkAzure }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingHorizontal: 22, paddingTop: 8, gap: 22 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.offWhite, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 11, color: colors.darkAzure }}>SOS</Text>
            </View>
            <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 16, color: colors.offWhite }}>Modo Crise</Text>
          </View>
          <Pressable onPress={() => navigation.getParent()?.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 13, color: colors.offWhite, opacity: 0.75 }}>fechar</Text>
            <X size={18} color={colors.offWhite} strokeWidth={2} />
          </Pressable>
        </View>

        <View>
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 34, lineHeight: 39, color: colors.offWhite }}>O que está acontecendo agora?</Text>
          <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 14, color: colors.offWhite, opacity: 0.7, marginTop: 10 }}>Toque em uma opção. Sem texto para ler.</Text>
        </View>

        <View style={{ gap: 12 }}>
          <Option title="Crise sensorial" sub="sobrecarga, som, luz, toque" onPress={() => startGuide('sensorial')} />
          <Option title="Explosão emocional" sub="birra, choro, desregulação" onPress={() => startGuide('emocional')} />
          <Option title="Dúvida urgente" sub="não é crise · vai para o chat" onPress={() => navigation.getParent()?.goBack()} />
          <Option title="Risco à segurança" sub="contatos de emergência agora" inverted onPress={() => navigation.navigate('Safety5d')} />
        </View>

        <View style={{ marginTop: 'auto', gap: 16, paddingBottom: 8 }}>
          <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 13, lineHeight: 20, color: colors.offWhite, opacity: 0.7, textAlign: 'center' }}>
            Você está cuidando de alguém e de você. Uma coisa por vez.
          </Text>
          <Pressable
            onPress={() => navigation.getParent()?.goBack()}
            style={{ borderWidth: 1.5, borderColor: 'rgba(242,239,230,.3)', borderRadius: 30, padding: 16, alignItems: 'center' }}
          >
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 14, color: colors.offWhite }}>Só quero conversar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
