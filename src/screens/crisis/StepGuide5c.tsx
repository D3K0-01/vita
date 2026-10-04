import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ChevronLeft, X, WifiOff } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { useApp } from '../../state/AppContext';

const STEPS = [
  'Avise com antecedência quando puder: "em 5 minutos a gente sai".',
  'Diminua os estímulos: baixe a luz e o som do ambiente.',
  'Fique perto, sem falar muito.',
  'Ofereça o objeto de conforto dele.',
];

const CATEGORY_LABEL: Record<string, string> = { sensorial: 'Crise sensorial', emocional: 'Explosão emocional' };

export default function StepGuide5c({ navigation, route }: any) {
  const { colors } = useTheme();
  const { state, setCrisisSession, addCrisisAttempt } = useApp();
  const category = route.params?.category ?? state.crisisSession?.category ?? 'sensorial';
  const [step, setStep] = useState(state.crisisSession?.step ?? 2);
  const [answer, setAnswer] = useState<'sim' | 'um pouco' | 'não' | null>(null);
  const offline = state.simulateOffline;

  const close = (resolved: boolean) => {
    setCrisisSession(null);
    if (resolved) addCrisisAttempt(true);
    navigation.getParent()?.goBack();
  };

  const nextStep = () => {
    if (step >= 4) {
      close(false);
      return;
    }
    const s = step + 1;
    setStep(s);
    setAnswer(null);
    setCrisisSession({ category, step: s });
  };

  const calmingBold = (text: string) => {
    if (!offline || step !== 4) return <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 16.5, lineHeight: 24, color: colors.offWhite, paddingTop: 3 }}>{text}</Text>;
    const parts = text.split(state.calmingThings[0] ?? '###');
    return (
      <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 16.5, lineHeight: 24, color: colors.offWhite, paddingTop: 3 }}>
        {parts[0]}
        <Text style={{ fontFamily: 'Lexend_500Medium' }}>{state.calmingThings[0]}</Text>
        {parts[1]}
      </Text>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkAzure }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 8, paddingBottom: 30, gap: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <ChevronLeft size={18} color={colors.offWhite} strokeWidth={2} />
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 13.5, color: colors.offWhite, opacity: 0.8 }}>voltar</Text>
          </Pressable>
          <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 15, color: colors.offWhite }}>{CATEGORY_LABEL[category]}</Text>
          <Pressable onPress={() => close(false)}>
            <X size={18} color={colors.offWhite} strokeWidth={2} />
          </Pressable>
        </View>

        {offline && (
          <View style={{ flexDirection: 'row', gap: 11, alignItems: 'center', backgroundColor: 'rgba(199,214,191,.16)', borderWidth: 1, borderColor: 'rgba(199,214,191,.3)', borderRadius: 14, padding: 13 }}>
            <WifiOff size={17} color={colors.pastelGreen} strokeWidth={1.8} />
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 13, lineHeight: 19, color: colors.offWhite, flex: 1 }}>Sem internet — os passos continuam funcionando.</Text>
          </View>
        )}

        <View>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: i <= step ? colors.pastelGreen : 'rgba(242,239,230,.2)' }} />
            ))}
          </View>
          <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: colors.offWhite, opacity: 0.65 }}>
            passo {step} de 4
          </Text>
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 32, lineHeight: 37, marginTop: 8, color: colors.offWhite }}>Diminua os estímulos</Text>
        </View>

        {!offline && (
          <View style={{ height: 180, borderRadius: 20, backgroundColor: 'rgba(199,214,191,.35)' }} />
        )}

        <View style={{ gap: 14 }}>
          {STEPS.slice(0, 3).map((s, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(242,239,230,.14)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 13, color: colors.offWhite }}>{i + 1}</Text>
              </View>
              {i === 2 ? calmingBold(`Ofereça o ${state.calmingThings[0] ?? 'objeto favorito'} do ${state.childName}.`) : (
                <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 16.5, lineHeight: 24, color: colors.offWhite, paddingTop: 3, flex: 1 }}>{s}</Text>
              )}
            </View>
          ))}
        </View>

        {offline ? (
          <View style={{ backgroundColor: 'rgba(242,239,230,.08)', borderRadius: 18, padding: 18 }}>
            <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.offWhite, opacity: 0.6, marginBottom: 12 }}>
              Telefones de emergência
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1, backgroundColor: colors.offWhite, borderRadius: 14, padding: 13, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 20, color: colors.darkAzure }}>192</Text>
                <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 11, color: colors.darkAzure, opacity: 0.7, marginTop: 2 }}>SAMU</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: colors.offWhite, borderRadius: 14, padding: 13, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 20, color: colors.darkAzure }}>188</Text>
                <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 11, color: colors.darkAzure, opacity: 0.7, marginTop: 2 }}>CVV</Text>
              </View>
            </View>
            {state.trustedContact && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(242,239,230,.12)' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 15, color: colors.offWhite }}>
                    {state.trustedContact.name} · {state.trustedContact.relation}
                  </Text>
                  <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 11.5, color: colors.offWhite, opacity: 0.65, marginTop: 2 }}>contato de confiança</Text>
                </View>
                <View style={{ backgroundColor: colors.offWhite, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20 }}>
                  <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 13, color: colors.darkAzure }}>ligar</Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={{ backgroundColor: 'rgba(242,239,230,.1)', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 14, lineHeight: 21, color: colors.offWhite, flex: 1 }}>Respire junto: 4 segundos entra, 6 sai.</Text>
            <View style={{ backgroundColor: colors.offWhite, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 16 }}>
              <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 13, color: colors.darkAzure }}>guiar</Text>
            </View>
          </View>
        )}

        <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(242,239,230,.14)', paddingTop: 20, gap: 14 }}>
          <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 19, color: colors.offWhite }}>Melhorou?</Text>
          <View style={{ flexDirection: 'row', gap: 9 }}>
            {(['sim', 'um pouco', 'não'] as const).map((a) => (
              <Pressable
                key={a}
                onPress={() => (a === 'sim' ? close(true) : setAnswer(a))}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 14,
                  borderRadius: 16,
                  backgroundColor: answer === a ? colors.offWhite : 'rgba(242,239,230,.12)',
                  borderWidth: 1,
                  borderColor: 'rgba(242,239,230,.2)',
                }}
              >
                <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 14, color: answer === a ? colors.darkAzure : colors.offWhite }}>{a}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 11.5, lineHeight: 18, color: colors.offWhite, opacity: 0.65 }}>
            Se não melhorou, seguimos: próximo passo ou conversar com a IA.
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable onPress={nextStep} style={{ flex: 2, alignItems: 'center', paddingVertical: 16, borderRadius: 30, backgroundColor: colors.offWhite }}>
              <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 15, color: colors.darkAzure }}>Próximo passo</Text>
            </Pressable>
            <Pressable onPress={() => navigation.goBack()} style={{ flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 30, borderWidth: 1.5, borderColor: 'rgba(242,239,230,.3)' }}>
              <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 14, color: colors.offWhite }}>voltar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
