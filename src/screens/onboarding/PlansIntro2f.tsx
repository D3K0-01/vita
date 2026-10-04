import React from 'react';
import { View, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { OnboardingShell } from './OnboardingShell';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useApp } from '../../state/AppContext';

export default function PlansIntro2f() {
  const { palette, colors, gradients, type, radii } = useTheme();
  const { completeOnboarding } = useApp();

  const Feature = ({ text }: { text: string }) => (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
      <Check size={16} color={colors.pastelGreen} strokeWidth={2.6} style={{ marginTop: 3 }} />
      <Text style={[type.body, { flex: 1, fontSize: 13.5, color: colors.offWhite, opacity: 0.95 }]}>{text}</Text>
    </View>
  );

  return (
    <OnboardingShell
      step={7}
      title="Tudo pronto, Camila"
      subtitle="Você já pode entrar. Escolha o plano quando quiser."
      footer={
        <>
          <Text style={[type.caption, { fontSize: 11, color: palette.textFaint, textAlign: 'center', opacity: 0.85 }]}>
            Sem cobrança agora. Avisamos antes de qualquer cobrança. Valores fictícios, sujeitos à definição do time de produto.
          </Text>
          <Button label="Começar teste grátis" onPress={() => completeOnboarding({ plan: 'plus' })} />
          <Button label="Continuar com o plano gratuito" variant="ghost" onPress={() => completeOnboarding({ plan: 'base' })} />
        </>
      }
    >
      <View style={{ backgroundColor: colors.darkAzure, borderRadius: radii.xl, padding: 22, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[type.titleSm, { color: '#fff', fontSize: 22 }]}>Plus</Text>
          <LinearGradient colors={gradients.achievement} style={{ borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={[type.caption, { color: '#fff', fontSize: 11.5 }]}>7 dias grátis</Text>
          </LinearGradient>
        </View>
        <View style={{ gap: 11 }}>
          <Feature text="quebras saudáveis de rotina programadas" />
          <Feature text="IA sem limite, com o histórico da família" />
          <Feature text="todas as trilhas em paralelo + relatório para consultas" />
        </View>
        <Text style={[type.caption, { fontSize: 11.5, color: colors.offWhite, opacity: 0.65 }]}>Depois R$ 39,90/mês · cancela quando quiser</Text>
      </View>

      <Card>
        <Text style={[type.titleSm, { color: palette.text, fontSize: 19 }]}>Base · gratuito para sempre</Text>
        <View style={{ gap: 8, marginTop: 12 }}>
          <Text style={[type.bodySm, { color: palette.textMuted, fontSize: 13, opacity: 0.8 }]}>tarefas ilimitadas, para cada filho · filhos ilimitados</Text>
          <Text style={[type.bodySm, { color: palette.textMuted, fontSize: 13, opacity: 0.8 }]}>1 trilha por vez · comunidade completa · 20 mensagens de IA por dia</Text>
          <Text style={[type.bodySm, { color: palette.textMuted, fontSize: 13, opacity: 0.8 }]}>Modo Crise completo, sempre disponível, offline</Text>
        </View>
      </Card>

      <View style={{ backgroundColor: colors.pastelGreen, borderRadius: radii.lg, padding: 18 }}>
        <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 15.5 }]}>O Modo Crise nunca fica atrás de um plano</Text>
        <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.8, marginTop: 5, lineHeight: 18 }]}>
          Passo a passo e telefones de emergência ficam abertos no Base, mesmo sem internet.
        </Text>
      </View>
    </OnboardingShell>
  );
}
