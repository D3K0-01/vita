import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { CheckRow } from '../../components/CheckRow';
import { SOSButton } from '../../components/SOSButton';
import { useApp } from '../../state/AppContext';
import { weekTasks } from '../../data/mock';

const WEEK = [
  { d: 'seg', n: 11 },
  { d: 'ter', n: 12 },
  { d: 'qua', n: 13 },
  { d: 'qui', n: 14 },
  { d: 'sex', n: 15 },
  { d: 'sáb', n: 16 },
];

const MONTH_GRID = [
  { label: 'manhã', cells: [1, 1, 0.5, 1, 0.5, 0, 0] },
  { label: 'tarde', cells: [0.5, 0.5, 0.5, 0, 0.5, 0.5, 0] },
  { label: 'noite', cells: [1, 0.5, 0.5, 0.5, 0.5, 0, 0] },
];

function CellColor(v: number, colors: any) {
  if (v === 1) return { gradient: true };
  if (v === 0.5) return { bg: colors.pastelGreen };
  return { bg: 'rgba(46,75,82,.07)' };
}

export default function RoutineScreen({ navigation }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { state, toggleTask } = useApp();
  const [tab, setTab] = useState<'dia' | 'semana'>('dia');

  const doneCount = state.tasks.filter((t) => t.done).length;

  return (
    <ScreenContainer contentStyle={{ paddingHorizontal: 20, paddingTop: 14, gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={[type.title, { color: palette.text }]}>Rotina</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 }}>
          <Text style={[type.bodySm, { fontSize: 13, color: palette.text }]}>{state.childName}</Text>
          <ChevronDown size={14} color={palette.hint} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', backgroundColor: colors.greyAzure + '29', borderRadius: 14, padding: 4 }}>
        {(['dia', 'semana'] as const).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={{ flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 11, backgroundColor: tab === t ? palette.surface : 'transparent' }}>
            <Text style={[type.bodySm, { fontSize: 13.5, color: palette.text }]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {tab === 'dia' ? (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={16} color={palette.hint} />
            <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
              {WEEK.map((w) => (
                <View key={w.d} style={{ flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12, backgroundColor: w.n === 12 ? colors.darkAzure : 'transparent' }}>
                  <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 11, color: w.n === 12 ? colors.offWhite : palette.textMuted }}>{w.d}</Text>
                  <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 15, marginTop: 2, color: w.n === 12 ? colors.offWhite : palette.text }}>{w.n}</Text>
                </View>
              ))}
            </View>
            <ChevronRight size={16} color={palette.hint} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={[type.cardTitle, { color: palette.text, fontSize: 17 }]}>Terça, 12 de agosto</Text>
            <Text style={[type.caption, { color: palette.textMuted, fontSize: 12.5 }]}>
              {doneCount} de {state.tasks.length} feitos
            </Text>
          </View>

          <View style={{ gap: 10 }}>
            {state.tasks.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => toggleTask(t.id)}
                style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, padding: 14 }}
              >
                <CheckRow label={t.label} time={t.time} done={t.done} onToggle={() => toggleTask(t.id)} size={24} />
              </Pressable>
            ))}
          </View>
          <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5 }]}>tocar em uma tarefa abre a edição dela</Text>

          <Card tone="muted" radius={18}>
            <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 16.5 }]}>Quebras saudáveis de rotina</Text>
            <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12, opacity: 0.75, marginTop: 5, lineHeight: 18 }]}>
              Pequenas variações combinadas antes. Não contam como falha — treinam flexibilidade.
            </Text>
            <View style={{ gap: 9, marginTop: 14 }}>
              <View style={{ backgroundColor: colors.offWhite, borderRadius: 13, padding: 12 }}>
                <Text style={[type.body, { fontSize: 13.5, color: colors.darkAzure }]}>banho 20 minutos mais tarde</Text>
                <Text style={[type.caption, { fontSize: 11, color: colors.darkAzure, opacity: 0.6, marginTop: 2 }]}>hoje · avisar o {state.childName} antes</Text>
              </View>
              <View style={{ backgroundColor: colors.offWhite, borderRadius: 13, padding: 12 }}>
                <Text style={[type.body, { fontSize: 13.5, color: colors.darkAzure }]}>trocar a ordem: lição depois do parquinho</Text>
                <Text style={[type.caption, { fontSize: 11, color: colors.darkAzure, opacity: 0.6, marginTop: 2 }]}>hoje</Text>
              </View>
            </View>
            <Text style={[type.bodySm, { color: colors.accent2, fontSize: 12.5, marginTop: 14, fontFamily: 'Lexend_500Medium' }]}>Programar outra quebra</Text>
          </Card>

          <Pressable
            onPress={() => navigation.navigate('LockScreenReminder4e')}
            style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: 16, padding: 15, alignItems: 'center', marginBottom: 130 }}
          >
            <Text style={[type.bodySm, { color: colors.accent2, fontSize: 13 }]}>ver como fica o lembrete na tela de bloqueio</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ChevronLeft size={16} color={palette.hint} />
            <Text style={[type.cardTitle, { color: palette.text, fontSize: 15 }]}>11 – 17 de agosto</Text>
            <ChevronRight size={16} color={palette.hint} />
          </View>

          <Card>
            <View style={{ flexDirection: 'row', gap: 7 }}>
              <View style={{ width: 40 }} />
              {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
                <Text key={i} style={{ flex: 1, textAlign: 'center', fontFamily: i === 1 ? 'Lexend_600SemiBold' : 'Lexend_500Medium', fontSize: 11, opacity: i === 1 ? 1 : 0.6, color: palette.text }}>
                  {d}
                </Text>
              ))}
            </View>
            {MONTH_GRID.map((row) => (
              <View key={row.label} style={{ flexDirection: 'row', gap: 7, alignItems: 'center', marginTop: 8 }}>
                <Text style={{ width: 40, fontFamily: 'Lexend_300Light', fontSize: 11.5, opacity: 0.7, color: palette.text }}>{row.label}</Text>
                {row.cells.map((v, i) => {
                  const c = CellColor(v, colors);
                  return c.gradient ? (
                    <LinearGradient key={i} colors={[colors.accent1, colors.accent2]} style={{ flex: 1, height: 26, borderRadius: 8 }} />
                  ) : (
                    <View key={i} style={{ flex: 1, height: 26, borderRadius: 8, backgroundColor: c.bg }} />
                  );
                })}
              </View>
            ))}
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
              {[
                { c: colors.accent2, label: 'tudo feito' },
                { c: colors.pastelGreen, label: 'parcial' },
                { c: 'rgba(46,75,82,.15)', label: 'sem tarefa' },
              ].map((l) => (
                <View key={l.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 11, height: 11, borderRadius: 4, backgroundColor: l.c }} />
                  <Text style={[type.caption, { fontSize: 11, color: palette.textMuted }]}>{l.label}</Text>
                </View>
              ))}
            </View>
          </Card>

          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <Text style={[type.cardTitle, { color: palette.text, fontSize: 17 }]}>Terça, 12</Text>
              <Pressable onPress={() => setTab('dia')} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={[type.bodySm, { fontSize: 12, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>ver o dia</Text>
                <ChevronRight size={13} color={colors.accent2} />
              </Pressable>
            </View>
            <View style={{ gap: 11 }}>
              {(weekTasks.ter ?? state.tasks).slice(0, 3).map((t) => (
                <CheckRow key={t.id} label={t.label} time={t.time} done={t.done} size={20} />
              ))}
            </View>
          </Card>

          <Card tone="muted" style={{ marginBottom: 130 }}>
            <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 16.5 }]}>Quebras da semana</Text>
            <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12, opacity: 0.75, marginTop: 5, lineHeight: 18 }]}>
              Duas variações combinadas. Isso mantém a consistência, não interrompe.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 14 }}>
              <View style={{ backgroundColor: colors.offWhite, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14 }}>
                <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 12.5, color: colors.darkAzure }}>ter · banho mais tarde</Text>
              </View>
              <View style={{ backgroundColor: colors.offWhite, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14 }}>
                <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 12.5, color: colors.darkAzure }}>sáb · café diferente</Text>
              </View>
            </View>
          </Card>
        </>
      )}

      <SOSButton bottom={104} />
      <Pressable
        onPress={() => navigation.navigate('NewTask4d')}
        style={{ position: 'absolute', right: 18, bottom: 100, width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center' }}
      >
        <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={26} color="#fff" strokeWidth={2.4} />
        </LinearGradient>
      </Pressable>
    </ScreenContainer>
  );
}
