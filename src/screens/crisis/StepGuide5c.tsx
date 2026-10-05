import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions } from '@react-navigation/native';
import { ChevronLeft, X, WifiOff, Wind, Phone, MessageCircle } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { CRISIS_STEPS } from '../../data/crisis';
import { phoneDigits } from '../../utils/format';

const CATEGORY_LABEL: Record<string, string> = { sensorial: 'Crise sensorial', emocional: 'Explosão emocional' };

export default function StepGuide5c({ navigation, route }: any) {
  const { colors } = useTheme();
  const { state, setCrisisSession, addCrisisAttempt } = useApp();
  const { toast } = useUI();
  const category: 'sensorial' | 'emocional' = route.params?.category ?? state.crisisSession?.category ?? 'sensorial';
  const steps = CRISIS_STEPS[category];
  const [step, setStep] = useState(Math.min(state.crisisSession?.step ?? 1, steps.length));
  const [answer, setAnswer] = useState<'sim' | 'um pouco' | 'não' | null>(null);
  const offline = state.simulateOffline;
  const current = steps[step - 1];
  const calma = state.calmingThings[0] ?? 'o objeto favorito';
  const isLast = step >= steps.length;

  const closeAll = () => navigation.getParent()?.goBack();

  const finish = (resolved: boolean) => {
    setCrisisSession(null);
    if (resolved) {
      addCrisisAttempt(true);
      toast('Que bom que passou. Cuide de você também.');
    }
    // fecha o Modo Crise e abre o registro rápido do diário (pode pular)
    navigation.getParent()?.dispatch(StackActions.replace('CrisisLog', { fromCrisis: true, category }));
  };

  const goTo = (s: number) => {
    setStep(s);
    setAnswer(null);
    setCrisisSession({ category, step: s });
  };

  const call = (num: string) => Linking.openURL(`tel:${phoneDigits(num)}`).catch(() => toast(`Ligue para ${num}`));

  const tip = (t: string) => {
    if (!t.includes('{calma}')) return <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 16.5, lineHeight: 24, color: colors.offWhite, flex: 1 }}>{t}</Text>;
    const [a, b] = t.split('{calma}');
    return (
      <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 16.5, lineHeight: 24, color: colors.offWhite, flex: 1 }}>
        {a}
        <Text style={{ fontFamily: 'Lexend_500Medium' }}>{calma}</Text>
        {b}
      </Text>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkAzure }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 }}>
        <Pressable
          onPress={() => (step > 1 ? goTo(step - 1) : navigation.goBack())}
          accessibilityRole="button"
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 48, paddingHorizontal: 8 }}
        >
          <ChevronLeft size={18} color={colors.offWhite} strokeWidth={2} />
          <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 13.5, color: colors.offWhite, opacity: 0.85 }}>{step > 1 ? 'passo anterior' : 'voltar'}</Text>
        </Pressable>
        <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 15, color: colors.offWhite }}>{CATEGORY_LABEL[category]}</Text>
        <Pressable onPress={closeAll} accessibilityRole="button" accessibilityLabel="Fechar o Modo Crise" style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
          <X size={20} color={colors.offWhite} strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 4, paddingBottom: 30, gap: 20 }}>
        {offline && (
          <View style={{ flexDirection: 'row', gap: 11, alignItems: 'center', backgroundColor: 'rgba(199,214,191,.16)', borderWidth: 1, borderColor: 'rgba(199,214,191,.3)', borderRadius: 14, padding: 13 }}>
            <WifiOff size={17} color={colors.pastelGreen} strokeWidth={1.8} />
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 13, lineHeight: 19, color: colors.offWhite, flex: 1 }}>Sem internet — os passos continuam funcionando.</Text>
          </View>
        )}

        <View>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
            {steps.map((_, i) => (
              <View key={i} style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: i < step ? colors.pastelGreen : 'rgba(242,239,230,.2)' }} />
            ))}
          </View>
          <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: colors.offWhite, opacity: 0.7 }}>
            passo {step} de {steps.length}
          </Text>
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 32, lineHeight: 37, marginTop: 8, color: colors.offWhite }} accessibilityRole="header">
            {current.title}
          </Text>
        </View>

        <View style={{ gap: 14 }}>
          {current.tips.map((t, i) => (
            <View key={t} style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(242,239,230,.14)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 13, color: colors.offWhite }}>{i + 1}</Text>
              </View>
              {tip(t)}
            </View>
          ))}
        </View>

        {offline ? (
          <View style={{ backgroundColor: 'rgba(242,239,230,.08)', borderRadius: 18, padding: 18 }}>
            <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.offWhite, opacity: 0.65, marginBottom: 12 }}>
              Telefones de emergência
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[
                { n: '192', l: 'SAMU' },
                { n: '188', l: 'CVV' },
              ].map((e) => (
                <Pressable key={e.n} onPress={() => call(e.n)} accessibilityRole="button" accessibilityLabel={`Ligar para ${e.l}, ${e.n}`} style={{ flex: 1, backgroundColor: colors.offWhite, borderRadius: 14, padding: 13, alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 20, color: colors.darkAzure }}>{e.n}</Text>
                  <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 11, color: colors.darkAzure, opacity: 0.75, marginTop: 2 }}>{e.l}</Text>
                </Pressable>
              ))}
            </View>
            {state.trustedContact && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(242,239,230,.12)' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 15, color: colors.offWhite }}>
                    {state.trustedContact.name} · {state.trustedContact.relation}
                  </Text>
                  <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 11.5, color: colors.offWhite, opacity: 0.7, marginTop: 2 }}>contato de confiança</Text>
                </View>
                <Pressable onPress={() => call(state.trustedContact!.phone)} accessibilityRole="button" style={{ backgroundColor: colors.offWhite, borderRadius: 20, paddingVertical: 11, paddingHorizontal: 20 }}>
                  <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 13, color: colors.darkAzure }}>ligar</Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : (
          <Pressable
            onPress={() => navigation.navigate('Breathing')}
            accessibilityRole="button"
            style={{ backgroundColor: 'rgba(242,239,230,.1)', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}
          >
            <Wind size={20} color={colors.pastelGreen} />
            <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 14, lineHeight: 21, color: colors.offWhite, flex: 1 }}>Respire junto: 4 segundos entra, 6 sai.</Text>
            <View style={{ backgroundColor: colors.offWhite, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 16 }}>
              <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 13, color: colors.darkAzure }}>guiar</Text>
            </View>
          </Pressable>
        )}

        <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(242,239,230,.14)', paddingTop: 20, gap: 14 }}>
          <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 19, color: colors.offWhite }}>Melhorou?</Text>
          <View style={{ flexDirection: 'row', gap: 9 }}>
            {(['sim', 'um pouco', 'não'] as const).map((a) => (
              <Pressable
                key={a}
                onPress={() => (a === 'sim' ? finish(true) : setAnswer(a))}
                accessibilityRole="button"
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 50,
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
          <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 12, lineHeight: 18, color: colors.offWhite, opacity: 0.75 }}>
            {answer === 'um pouco'
              ? 'Já é um começo. Siga para o próximo passo quando sentir que dá.'
              : answer === 'não'
                ? isLast
                  ? 'Se houver risco, ligue agora. Você também pode conversar com a IA.'
                  : 'Tudo bem. Vamos para o próximo passo, ou converse com a IA.'
                : 'Se não melhorou, seguimos: próximo passo ou conversar com a IA.'}
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              onPress={() => (isLast ? finish(false) : goTo(step + 1))}
              accessibilityRole="button"
              style={{ flex: 2, alignItems: 'center', justifyContent: 'center', minHeight: 52, borderRadius: 30, backgroundColor: colors.offWhite }}
            >
              <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 15, color: colors.darkAzure }}>{isLast ? 'Encerrar' : 'Próximo passo'}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                // voltar para "Main" fecha o modal do Modo Crise e abre a aba da IA
                navigation.getParent()?.navigate('Main', { screen: 'IATab' });
              }}
              accessibilityRole="button"
              style={{ flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', minHeight: 52, borderRadius: 30, borderWidth: 1.5, borderColor: 'rgba(242,239,230,.3)' }}
            >
              <MessageCircle size={15} color={colors.offWhite} />
              <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 14, color: colors.offWhite }}>IA</Text>
            </Pressable>
          </View>
          {(answer === 'não' || isLast) && (
            <Pressable onPress={() => navigation.navigate('Safety5d')} accessibilityRole="button" style={{ flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
              <Phone size={15} color={colors.pastelGreen} />
              <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 13.5, color: colors.pastelGreen }}>Há risco? Ver telefones de emergência</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
