import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Check, MinusCircle, PlusCircle } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { PLANS, COMPARISON, Level, PlanId } from '../../data/plans';

function LevelIcon({ level, onDark }: { level: Level; onDark?: boolean }) {
  const { colors, palette } = useTheme();
  if (level === 'limited') return <MinusCircle size={15} color={palette.hint} strokeWidth={1.8} />;
  if (level === 'extra') return <PlusCircle size={16} color={onDark ? colors.offWhite : colors.darkAzure} fill={onDark ? 'transparent' : 'transparent'} strokeWidth={2.2} />;
  return (
    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: onDark ? colors.darkAzure : colors.pastelGreen, alignItems: 'center', justifyContent: 'center' }}>
      <Check size={10} color={onDark ? '#fff' : colors.darkAzure} strokeWidth={3} />
    </View>
  );
}

export default function PlansScreen({ navigation }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { state, setState } = useApp();
  const { confirm, toast } = useUI();
  const current = state.plan as PlanId;

  const choosePlan = async (id: PlanId) => {
    if (id === current) return toast('Esse já é o seu plano');
    if (id === 'base') {
      if (await confirm({ title: 'Voltar para o Gratuito?', message: 'Nada do que foi registrado se perde. Alguns recursos ficam só para leitura, como o histórico completo.', confirmLabel: 'Mudar para o Gratuito', destructive: true })) {
        setState((s) => ({ ...s, plan: 'base' }));
        toast('Plano alterado para Gratuito');
      }
      return;
    }
    navigation.navigate('Checkout10c', { plan: id });
  };

  const colW = 150;

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 16 }}>
      <BackHeader title="Planos" onBack={() => navigation.getParent()?.goBack()} />
      <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5, lineHeight: 21, marginTop: -6 }]}>
        O Gratuito funciona para sempre. O Modo Crise e o Chat nunca ficam atrás de um plano.
      </Text>

      {PLANS.map((p) => {
        const isCurrent = p.id === current;
        const dark = !!p.recommended;
        const fg = dark ? colors.offWhite : palette.text;
        return (
          <View
            key={p.id}
            style={{
              backgroundColor: dark ? colors.darkAzure : palette.surface,
              borderWidth: isCurrent ? 2 : 1,
              borderColor: isCurrent ? colors.accent1 : dark ? colors.darkAzure : palette.surfaceBorder,
              borderRadius: radii.xl,
              padding: 18,
              gap: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={[type.titleSm, { color: fg, fontSize: 21 }]}>{p.name}</Text>
              {p.recommended && (
                <View style={{ backgroundColor: colors.offWhite, borderRadius: 12, paddingVertical: 3, paddingHorizontal: 9 }}>
                  <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 9.5, letterSpacing: 0.8, color: colors.darkAzure }}>RECOMENDADO</Text>
                </View>
              )}
              {isCurrent && (
                <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 12, paddingVertical: 3, paddingHorizontal: 9 }}>
                  <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 9.5, color: colors.darkAzure }}>SEU PLANO</Text>
                </View>
              )}
            </View>
            <Text style={[type.cardTitle, { color: fg, fontSize: 17, opacity: 0.9 }]}>{p.price}</Text>
            <Text style={[type.bodySm, { color: fg, opacity: 0.8 }]}>{p.tagline}</Text>
            <View style={{ gap: 7, marginTop: 2 }}>
              {p.highlights.map((h) => (
                <View key={h} style={{ flexDirection: 'row', gap: 9, alignItems: 'flex-start' }}>
                  <Check size={15} color={dark ? colors.pastelGreen : colors.accent2} strokeWidth={2.6} style={{ marginTop: 3 }} />
                  <Text style={[type.bodySm, { flex: 1, color: fg, fontSize: 13 }]}>{h}</Text>
                </View>
              ))}
            </View>
            <Pressable
              onPress={() => choosePlan(p.id)}
              disabled={isCurrent}
              accessibilityRole="button"
              style={({ pressed }) => ({
                marginTop: 6,
                minHeight: 48,
                borderRadius: radii.pill,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isCurrent ? 'transparent' : dark ? colors.offWhite : 'transparent',
                borderWidth: dark && !isCurrent ? 0 : 1.5,
                borderColor: dark ? 'rgba(242,239,230,.4)' : palette.chipBorder,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={[type.button, { fontSize: 14, color: isCurrent ? fg : dark ? colors.darkAzure : palette.text }]}>
                {isCurrent ? 'Seu plano atual' : p.id === 'base' ? 'Continuar grátis' : `Assinar ${p.name} · 7 dias grátis`}
              </Text>
            </Pressable>
          </View>
        );
      })}

      <View>
        <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 10 }]}>Comparar recursos · arraste para o lado</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
          <View style={{ borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: palette.surfaceBorder }}>
            <View style={{ flexDirection: 'row', backgroundColor: colors.darkAzure }}>
              <View style={{ width: 148, padding: 12 }}>
                <Text style={[type.cardTitle, { color: colors.offWhite, fontSize: 14 }]}>Recurso</Text>
              </View>
              {PLANS.map((p) => (
                <View key={p.id} style={{ width: colW, padding: 12, backgroundColor: p.recommended ? '#1E3A41' : 'transparent' }}>
                  <Text style={[type.cardTitle, { color: colors.offWhite, fontSize: 14 }]}>{p.name}</Text>
                  <Text style={[type.caption, { color: colors.offWhite, opacity: 0.75, fontSize: 11.5 }]}>{p.price}</Text>
                </View>
              ))}
            </View>
            {COMPARISON.map((row, i) => (
              <View key={row.label} style={{ flexDirection: 'row', backgroundColor: i % 2 ? palette.bg : palette.surface }}>
                <View style={{ width: 148, padding: 12, justifyContent: 'center' }}>
                  <Text style={[type.bodySm, { color: palette.text, fontFamily: 'Lexend_500Medium', fontSize: 12.5 }]}>{row.label}</Text>
                </View>
                {(['base', 'plus', 'premium'] as const).map((id) => {
                  const [level, text] = row[id];
                  return (
                    <View key={id} style={{ width: colW, padding: 12, flexDirection: 'row', gap: 7, alignItems: 'flex-start', backgroundColor: id === 'plus' ? colors.pastelGreen + '40' : 'transparent' }}>
                      <View style={{ marginTop: 2 }}>
                        <LevelIcon level={level} />
                      </View>
                      <Text style={[type.caption, { flex: 1, color: palette.text, fontSize: 12, fontFamily: id === 'plus' || level === 'extra' ? 'Lexend_500Medium' : 'Lexend_400Regular' }]}>{text}</Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18 }}>
        <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 15.5 }]}>O Modo Crise nunca fica atrás de um plano</Text>
        <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.85, marginTop: 5, lineHeight: 18 }]}>
          Passo a passo, telefones de emergência e Chat ficam abertos no Gratuito, e o Modo Crise funciona sem internet.
        </Text>
      </View>
      <Text style={[type.caption, { color: palette.textFaint, fontSize: 10.5, textAlign: 'center' }]}>Valores e benefícios fictícios, sujeitos à definição do time de produto.</Text>
    </ScreenContainer>
  );
}
