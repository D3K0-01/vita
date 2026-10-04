import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { X, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { useApp } from '../../state/AppContext';

export default function Resume5e({ navigation }: any) {
  const { colors } = useTheme();
  const { state, setCrisisSession, addCrisisAttempt } = useApp();
  const session = state.crisisSession;

  const passou = () => {
    setCrisisSession(null);
    addCrisisAttempt(true);
    navigation.getParent()?.goBack();
  };

  const continua = () => {
    navigation.navigate('StepGuide5c', { category: session?.category ?? 'sensorial' });
  };

  const fechar = () => {
    setCrisisSession(null);
    navigation.getParent()?.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkAzure }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingHorizontal: 22, paddingTop: 8, gap: 24 }}>
        <Pressable onPress={fechar} style={{ alignItems: 'flex-end' }}>
          <X size={20} color={colors.offWhite} strokeWidth={2} />
        </Pressable>

        <View style={{ marginTop: 40 }}>
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 34, lineHeight: 39, color: colors.offWhite }}>Você tinha aberto o Modo Crise</Text>
          <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 15, lineHeight: 24, color: colors.offWhite, opacity: 0.75, marginTop: 12 }}>Sem pressa. Me diz só como terminou.</Text>
        </View>

        <View style={{ gap: 12 }}>
          <Pressable onPress={passou} style={{ backgroundColor: 'rgba(242,239,230,.1)', borderWidth: 1, borderColor: 'rgba(242,239,230,.18)', borderRadius: 20, padding: 22, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Text style={{ flex: 1, fontFamily: 'BricolageGrotesque_500Medium', fontSize: 21, color: colors.offWhite }}>passou</Text>
            <ChevronRight size={20} color={colors.offWhite} strokeWidth={2} />
          </Pressable>
          <Pressable onPress={continua} style={{ backgroundColor: 'rgba(242,239,230,.1)', borderWidth: 1, borderColor: 'rgba(242,239,230,.18)', borderRadius: 20, padding: 22, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 21, color: colors.offWhite }}>ainda está acontecendo</Text>
              <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 13, color: colors.offWhite, opacity: 0.7, marginTop: 4 }}>volta no passo {session?.step ?? 2} de 4</Text>
            </View>
            <ChevronRight size={20} color={colors.offWhite} strokeWidth={2} />
          </Pressable>
          <Pressable onPress={fechar} style={{ backgroundColor: 'rgba(242,239,230,.1)', borderWidth: 1, borderColor: 'rgba(242,239,230,.18)', borderRadius: 20, padding: 22 }}>
            <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 21, color: colors.offWhite }}>agora não quero falar disso</Text>
            <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 13, color: colors.offWhite, opacity: 0.7, marginTop: 4 }}>fecha e volta para a Home</Text>
          </Pressable>
        </View>

        <Text style={{ marginTop: 'auto', paddingBottom: 20, fontFamily: 'Lexend_300Light', fontSize: 12.5, lineHeight: 21, color: colors.offWhite, opacity: 0.65 }}>
          Nada fica registrado como falha. Se escolher “passou”, é só um fecho: sem métrica, sem parabéns.
        </Text>
      </View>
    </SafeAreaView>
  );
}
