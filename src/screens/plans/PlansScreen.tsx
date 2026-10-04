import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ChevronLeft, Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../../components/Button';
import { useApp } from '../../state/AppContext';

const FEATURES = [
  { cat: 'Rotina', base: 'tarefas ilimitadas, para cada filho', plus: 'quebras saudáveis de rotina programadas' },
  { cat: 'Perfis de filhos', base: 'ilimitados', plus: 'ilimitados' },
  { cat: 'Modo Crise (SOS)', base: 'completo, sempre disponível, offline', plus: 'completo, sempre disponível, offline', highlight: true },
  { cat: 'Fases de desenvolvimento', base: '1 trilha ativa por vez', plus: 'todas as trilhas em paralelo' },
  { cat: 'Comunidade', base: 'participação completa: ler, comentar, publicar, grupos e encontros', plus: 'rodas menores com mediação, prioridade de vaga e selo de apoiador' },
  { cat: 'IA / Chat', base: '20 mensagens por dia', plus: 'mensagens ilimitadas + a IA lembra do histórico da família' },
  { cat: 'Acompanhamento', base: 'semana e mês atuais', plus: 'histórico completo + exportar relatório para consultas' },
];

const PLUS_BULLETS = [
  'IA sem limite, com o histórico da família',
  'todas as trilhas em paralelo',
  'quebras saudáveis programadas',
  'rodas mediadas + selo de apoiador',
  'relatório para consultas',
];

const BASE_BULLETS = ['Rotina · tarefas ilimitadas', 'Modo Crise · completo e offline', 'Comunidade · participação completa', 'Filhos · perfis ilimitados'];

export default function PlansScreen({ navigation }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { state } = useApp();
  const [mode, setMode] = useState<'tabela' | 'cards'>('tabela');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40, gap: 18 }}>
        <Pressable onPress={() => navigation.getParent()?.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ChevronLeft size={20} color={palette.text} strokeWidth={2} />
          <Text style={[type.title, { color: palette.text, fontSize: 22 }]}>Planos</Text>
        </Pressable>
        <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5, opacity: 0.75, lineHeight: 21 }]}>
          O Base continua funcionando para sempre. O Plus só amplia o que você já usa.
        </Text>

        <View style={{ flexDirection: 'row', backgroundColor: colors.greyAzure + '29', borderRadius: 14, padding: 4 }}>
          {(['tabela', 'cards'] as const).map((m) => (
            <Pressable key={m} onPress={() => setMode(m)} style={{ flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 11, backgroundColor: mode === m ? palette.surface : 'transparent' }}>
              <Text style={[type.bodySm, { fontSize: 13.5, color: palette.text }]}>{m}</Text>
            </Pressable>
          ))}
        </View>

        {mode === 'tabela' ? (
          <>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1, backgroundColor: palette.surface, borderWidth: 1.5, borderColor: colors.pastelGreen, borderRadius: 16, padding: 14 }}>
                <Text style={[type.cardTitle, { color: palette.text, fontSize: 18 }]}>Base</Text>
                <Text style={[type.bodySm, { color: palette.text, fontSize: 13, marginTop: 4 }]}>grátis</Text>
                <Text style={[type.caption, { color: palette.textFaint, fontSize: 10.5, opacity: 0.8, marginTop: 6 }]}>{state.plan === 'base' ? 'seu plano atual' : ' '}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: colors.darkAzure, borderRadius: 16, padding: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                  <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 18, color: '#fff' }}>Plus</Text>
                  <View style={{ backgroundColor: colors.accent2, borderRadius: 12, paddingVertical: 3, paddingHorizontal: 7 }}>
                    <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 9, color: '#fff' }}>7 dias grátis</Text>
                  </View>
                </View>
                <Text style={[type.bodySm, { color: colors.offWhite, fontSize: 13, marginTop: 4 }]}>R$ 39,90</Text>
                <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 10.5, lineHeight: 14, color: colors.offWhite, opacity: 0.7, marginTop: 6 }}>por mês · cancela quando quiser</Text>
              </View>
            </View>

            <View style={{ gap: 14 }}>
              {FEATURES.map((f) => (
                <View key={f.cat}>
                  <Text style={[type.eyebrow, { fontSize: 9.5, color: f.highlight ? colors.accent2 : palette.hint, marginBottom: 7 }]}>{f.cat}</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1, backgroundColor: f.highlight ? colors.pastelGreen : palette.surface, borderWidth: f.highlight ? 0 : 1, borderColor: palette.surfaceBorder, borderRadius: 12, padding: 12 }}>
                      <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 12, lineHeight: 17, color: palette.text }}>{f.base}</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: f.highlight ? colors.pastelGreen : palette.surface, borderWidth: f.highlight ? 0 : 1, borderColor: palette.surfaceBorder, borderRadius: 12, padding: 12 }}>
                      <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 12, lineHeight: 17, color: palette.text }}>{f.plus}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={{ gap: 16 }}>
            <View style={{ backgroundColor: colors.darkAzure, borderRadius: 20, padding: 22 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 24, color: '#fff' }}>Plus</Text>
                <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 16, color: colors.offWhite }}>R$ 39,90/mês</Text>
              </View>
              <View style={{ gap: 10, marginTop: 16 }}>
                {PLUS_BULLETS.map((b) => (
                  <View key={b} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                    <Check size={16} color={colors.pastelGreen} strokeWidth={2.6} style={{ marginTop: 3 }} />
                    <Text style={{ flex: 1, fontFamily: 'Lexend_300Light', fontSize: 13, lineHeight: 20, color: colors.offWhite }}>{b}</Text>
                  </View>
                ))}
              </View>
              <Pressable onPress={() => navigation.navigate('Checkout10c')} style={{ backgroundColor: '#fff', borderRadius: radii.pill, paddingVertical: 15, alignItems: 'center', marginTop: 22 }}>
                <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 15, color: colors.darkAzure }}>Começar teste grátis</Text>
              </Pressable>
            </View>

            <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, padding: 22 }}>
              <Text style={[type.cardTitle, { color: palette.text, fontSize: 22 }]}>Base</Text>
              <Text style={[type.bodySm, { color: palette.text, fontSize: 13, marginTop: 4 }]}>grátis para sempre</Text>
              <View style={{ gap: 10, marginTop: 16 }}>
                {BASE_BULLETS.map((b) => (
                  <View key={b} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.greyAzure, marginTop: 7 }} />
                    <Text style={{ flex: 1, fontFamily: 'Lexend_300Light', fontSize: 13, lineHeight: 20, color: palette.text }}>{b}</Text>
                  </View>
                ))}
              </View>
              <Pressable onPress={() => navigation.getParent()?.goBack()} style={{ borderWidth: 1.5, borderColor: palette.chipBorder, borderRadius: radii.pill, paddingVertical: 15, alignItems: 'center', marginTop: 22 }}>
                <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 14, color: palette.text }}>Seguir no Base</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18 }}>
          <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 15.5 }]}>O Modo Crise nunca fica atrás de um plano</Text>
          <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.8, marginTop: 5, lineHeight: 18 }]}>
            Passo a passo e telefones de emergência ficam abertos no Base, e funcionam sem internet.
          </Text>
        </View>

        {mode === 'tabela' && (
          <View style={{ gap: 12 }}>
            <Button label="Começar teste grátis do Plus" onPress={() => navigation.navigate('Checkout10c')} />
            <Pressable onPress={() => navigation.getParent()?.goBack()}>
              <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 13.5, color: palette.textMuted, opacity: 0.7, textAlign: 'center' }}>Seguir no plano Base</Text>
            </Pressable>
          </View>
        )}
        <Text style={[type.caption, { color: palette.textFaint, fontSize: 10.5, opacity: 0.75, textAlign: 'center' }]}>Valores e benefícios fictícios, sujeitos à definição do time de produto.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
