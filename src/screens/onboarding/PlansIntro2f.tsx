import React from 'react';
import { View, Text } from 'react-native';
import { Check, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { OnboardingShell } from './OnboardingShell';
import { Button } from '../../components/Button';
import { useApp } from '../../state/AppContext';

// Demonstração: toda conta nova entra no Premium, com tudo liberado.
// Dá para ver o app em outro plano em Perfil → Assinatura.
export default function PlansIntro2f() {
  const { palette, colors, gradients, type, radii } = useTheme();
  const { state, completeOnboarding } = useApp();

  const Feature = ({ text }: { text: string }) => (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
      <Check size={16} color={colors.pastelGreen} strokeWidth={2.6} style={{ marginTop: 3 }} />
      <Text style={[type.body, { flex: 1, fontSize: 13.5, color: colors.offWhite, opacity: 0.95 }]}>{text}</Text>
    </View>
  );

  return (
    <OnboardingShell
      step={7}
      title={`Tudo pronto, ${state.parentName}`}
      subtitle="Sua conta de demonstração já começa com tudo liberado."
      footer={
        <>
          <Text style={[type.caption, { fontSize: 11, color: palette.textFaint, textAlign: 'center', opacity: 0.85 }]}>
            Protótipo: nenhuma cobrança é feita. Valores fictícios, sujeitos à definição do time de produto.
          </Text>
          <Button label="Entrar no Vita" onPress={() => completeOnboarding({ plan: 'premium' })} />
        </>
      }
    >
      <View style={{ backgroundColor: colors.darkAzure, borderRadius: radii.xl, padding: 22, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[type.titleSm, { color: '#fff', fontSize: 22 }]}>Premium</Text>
          <LinearGradient colors={gradients.achievement} style={{ borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={[type.caption, { color: '#fff', fontSize: 11.5 }]}>ativo na demonstração</Text>
          </LinearGradient>
        </View>
        <View style={{ gap: 11 }}>
          <Feature text="tarefas ilimitadas + acompanhantes (outro responsável, avó…)" />
          <Feature text="todas as trilhas e grupos exclusivos com selo" />
          <Feature text="histórico completo + relatório para consultas" />
          <Feature text="até 5 perfis de filhos" />
          <Feature text="profissional de referência: mensagens e orientação por vídeo" />
        </View>
        <Text style={[type.caption, { fontSize: 11.5, color: colors.offWhite, opacity: 0.65 }]}>R$ 64,90/mês no app final · Plus R$ 27,90 · Gratuito para sempre.</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.lg, padding: 16 }}>
        <Info size={18} color={palette.text} strokeWidth={1.8} style={{ marginTop: 2 }} />
        <Text style={[type.bodySm, { flex: 1, color: palette.textMuted, fontSize: 13, lineHeight: 20 }]}>
          Quer ver como o app fica no Gratuito ou no Plus? Troque de plano quando quiser em <Text style={{ color: palette.text, fontFamily: 'Lexend_500Medium' }}>Perfil → Assinatura</Text>.
        </Text>
      </View>

      <View style={{ backgroundColor: colors.pastelGreen, borderRadius: radii.lg, padding: 18 }}>
        <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 15.5 }]}>O Modo Crise nunca fica atrás de um plano</Text>
        <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.8, marginTop: 5, lineHeight: 18 }]}>
          Passo a passo, telefones de emergência e Chat ficam abertos em todos os planos, e o Modo Crise funciona sem internet.
        </Text>
      </View>
    </OnboardingShell>
  );
}
