import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { SOSButton } from '../../components/SOSButton';
import { useApp } from '../../state/AppContext';

const PHASES = [
  { n: 1, title: 'Apresentar', desc: 'o alimento aparece na mesa, sem cobrança' },
  { n: 2, title: 'Preparar junto', desc: 'Ele participa do preparo: lavar, mexer, escolher o prato. Provar não é o objetivo agora.' },
  { n: 3, title: 'Convidar a experimentar', desc: 'encostar, cheirar, lamber já conta' },
  { n: 4, title: 'Avançar', desc: 'o alimento entra no cardápio de vez em quando' },
];

export default function TrilhaDetail6b({ navigation }: any) {
  const { palette, colors, type } = useTheme();
  const { state } = useApp();
  const current = state.phase.stepIndex <= 4 ? state.phase.stepIndex : 4;

  return (
    <ScreenContainer contentStyle={{ paddingHorizontal: 20, paddingTop: 14, gap: 18 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <ChevronLeft size={18} color={palette.text} strokeWidth={2} />
          <Text style={[type.bodySm, { fontSize: 13.5, color: palette.text, opacity: 0.75 }]}>Alimentação</Text>
        </Pressable>
        <Text style={[type.bodySm, { fontSize: 12.5, color: colors.accent2 }]}>histórico</Text>
      </View>

      <View>
        <Text style={[type.title, { color: palette.text, fontSize: 30 }]}>Novo alimento</Text>
        <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5, opacity: 0.75, marginTop: 8, lineHeight: 21 }]}>
          Quatro fases, sem prazo. Repetir a mesma fase também é progresso.
        </Text>
      </View>

      <View>
        {PHASES.map((p, i) => {
          const done = p.n < current;
          const active = p.n === current;
          const isLast = i === PHASES.length - 1;
          return (
            <View key={p.n} style={{ flexDirection: 'row', gap: 16 }}>
              <View style={{ alignItems: 'center', width: 38 }}>
                {done ? (
                  <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={18} color="#fff" strokeWidth={3} />
                  </LinearGradient>
                ) : (
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      backgroundColor: '#fff',
                      borderWidth: 2,
                      borderColor: active ? colors.accent2 : colors.pastelGreen,
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...(active ? { shadowColor: colors.accent2, shadowOpacity: 0.15, shadowRadius: 5, elevation: 2 } : {}),
                    }}
                  >
                    <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 14, color: active ? colors.accent2 : colors.greyAzure }}>{p.n}</Text>
                  </View>
                )}
                {!isLast && <View style={{ flex: 1, width: 2, backgroundColor: done ? colors.accent2 : colors.pastelGreen, marginTop: 2 }} />}
              </View>
              <View style={{ flex: 1, paddingBottom: 22 }}>
                <Text style={[type.eyebrow, { color: done || active ? colors.accent2 : palette.hint, fontSize: 10, marginBottom: 5 }]}>
                  Fase {p.n}{done ? ' · concluída' : active ? ` · onde o ${state.childName} está` : ''}
                </Text>
                {active ? (
                  <View style={{ backgroundColor: palette.surface, borderWidth: 1.5, borderColor: colors.pastelGreen, borderRadius: 18, padding: 18 }}>
                    <Text style={[type.cardTitle, { color: palette.text, fontSize: 19 }]}>{p.title}</Text>
                    <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5, opacity: 0.8, marginTop: 6, lineHeight: 21 }]}>{p.desc}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: palette.divider }}>
                      <Text style={[type.bodySm, { fontSize: 13, color: palette.text }]}>{state.phaseAttempts} tentativas registradas</Text>
                      <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, opacity: 0.85 }]}>desde 2 de julho</Text>
                    </View>
                  </View>
                ) : (
                  <>
                    <Text style={[type.cardTitle, { color: palette.text, fontSize: 18, opacity: done ? 1 : 0.85 }]}>{p.title}</Text>
                    <Text style={[type.body, { color: palette.textMuted, fontSize: 13, opacity: 0.65, marginTop: 4, lineHeight: 19 }]}>{p.desc}</Text>
                  </>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ gap: 12, marginBottom: 130 }}>
        <Button label="Registrar tentativa mais recente" onPress={() => navigation.navigate('RegisterAttempt6c')} />
        <View style={{ borderWidth: 1, borderColor: palette.chipBorder, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[type.body, { fontSize: 14, color: palette.text }]}>Histórico desta trilha</Text>
          <ChevronRight size={16} color={palette.hint} />
        </View>
      </View>

      <SOSButton />
    </ScreenContainer>
  );
}
