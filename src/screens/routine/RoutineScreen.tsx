import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, Plus, X, Check, Pencil } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { SOSButton } from '../../components/SOSButton';
import { ChildPill } from '../../components/ChildPill';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { taskOccursOn, Task } from '../../data/mock';
import { addDays, dateKey, formatDayMonth, formatHour, formatLongDate, formatWeekRange, minutesOf, startOfWeek, weekdayShort } from '../../utils/date';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const PERIODS = [
  { label: 'manhã', from: 0, to: 12 * 60 },
  { label: 'tarde', from: 12 * 60, to: 18 * 60 },
  { label: 'noite', from: 18 * 60, to: 24 * 60 },
];

type Cell = 'all' | 'part' | 'none' | 'empty' | 'future';

function cellFor(tasks: Task[], day: Date, from: number, to: number, todayKey: string): Cell {
  const key = dateKey(day);
  if (key > todayKey) return 'future';
  const list = tasks.filter((t) => taskOccursOn(t, day) && minutesOf(t.time) >= from && minutesOf(t.time) < to);
  if (!list.length) return 'empty';
  const done = list.filter((t) => t.doneDates.includes(key)).length;
  if (done === list.length) return 'all';
  return done > 0 ? 'part' : 'none';
}

export default function RoutineScreen({ navigation }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { state, toggleTask, addBreak, removeBreak } = useApp();
  const { prompt, choose, toast } = useUI();
  const [tab, setTab] = useState<'dia' | 'semana'>('dia');
  const today = new Date();
  const todayKey = dateKey(today);
  const [selected, setSelected] = useState<Date>(today);
  const weekStart = startOfWeek(selected);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const selKey = dateKey(selected);

  const childTasks = useMemo(() => state.tasks.filter((t) => t.childId === state.activeChildId), [state.tasks, state.activeChildId]);
  const dayTasks = childTasks.filter((t) => taskOccursOn(t, selected)).sort((a, b) => a.time.localeCompare(b.time));
  const doneCount = dayTasks.filter((t) => t.doneDates.includes(selKey)).length;
  const weekKeys = days.map(dateKey);
  const childBreaks = state.breaks.filter((b) => b.childId === state.activeChildId);
  const dayBreaks = childBreaks.filter((b) => b.date === selKey);
  const weekBreaks = childBreaks.filter((b) => weekKeys.includes(b.date)).sort((a, b) => a.date.localeCompare(b.date));

  const toggle = (t: Task) => {
    if (selKey > todayKey) {
      toast('Esse dia ainda não chegou. Dá para marcar quando for a hora.');
      return;
    }
    toggleTask(t.id, selKey);
  };

  const newBreak = async () => {
    const r = await prompt({
      title: 'Programar uma quebra saudável',
      message: 'Uma pequena variação combinada antes. Avisar a criança com antecedência é o que faz funcionar.',
      fields: [{ key: 'label', label: 'O que muda', placeholder: 'ex: banho 20 minutos mais tarde', maxLength: 60 }],
      confirmLabel: 'Escolher o dia',
      validate: (v) => (v.label ? null : 'Descreva a variação'),
    });
    if (!r) return;
    const options = [0, 1, 2, 3].map((n) => addDays(today, n));
    choose(
      'Para quando?',
      options.map((d, i) => ({
        label: i === 0 ? 'hoje' : i === 1 ? 'amanhã' : `${weekdayShort(d)}, ${formatDayMonth(d)}`,
        onPress: () => {
          addBreak(r.label, dateKey(d));
          toast('Quebra programada. Lembre de avisar antes.');
        },
      }))
    );
  };

  const shiftWeek = (n: number) => setSelected((d) => addDays(d, n * 7));

  const WeekNav = (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Pressable onPress={() => shiftWeek(-1)} accessibilityLabel="Semana anterior" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
        <ChevronLeft size={18} color={palette.text} />
      </Pressable>
      <Pressable onPress={() => setSelected(today)} accessibilityLabel="Voltar para hoje" style={{ paddingVertical: 8 }}>
        <Text style={[type.cardTitle, { color: palette.text, fontSize: 15, textAlign: 'center' }]}>{formatWeekRange(weekStart)}</Text>
        {selKey !== todayKey && <Text style={[type.caption, { color: colors.accent2, fontSize: 11.5, textAlign: 'center' }]}>voltar para hoje</Text>}
      </Pressable>
      <Pressable onPress={() => shiftWeek(1)} accessibilityLabel="Próxima semana" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
        <ChevronRight size={18} color={palette.text} />
      </Pressable>
    </View>
  );

  return (
    <ScreenContainer floating={<SOSButton />} contentStyle={{ paddingHorizontal: 20, paddingTop: 10, gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <Text style={[type.title, { color: palette.text }]}>Rotina</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ChildPill showAge={false} />
          <Pressable
            onPress={() => navigation.navigate('NewTask4d')}
            accessibilityRole="button"
            accessibilityLabel="Nova tarefa"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={20} color="#fff" strokeWidth={2.4} />
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <View style={{ flexDirection: 'row', backgroundColor: colors.greyAzure + '29', borderRadius: 14, padding: 4 }}>
        {(['dia', 'semana'] as const).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === t }}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 11, backgroundColor: tab === t ? palette.surface : 'transparent' }}
          >
            <Text style={[type.bodySm, { fontSize: 13.5, color: palette.text, fontFamily: tab === t ? 'Lexend_500Medium' : 'Lexend_400Regular' }]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {WeekNav}

      {tab === 'dia' ? (
        <>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {days.map((d) => {
              const key = dateKey(d);
              const on = key === selKey;
              const isToday = key === todayKey;
              return (
                <Pressable
                  key={key}
                  onPress={() => setSelected(d)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={formatLongDate(d)}
                  style={{ flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12, backgroundColor: on ? colors.darkAzure : 'transparent', borderWidth: isToday && !on ? 1 : 0, borderColor: palette.chipBorder }}
                >
                  <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 11, color: on ? colors.offWhite : palette.textMuted }}>{weekdayShort(d)}</Text>
                  <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 15, marginTop: 2, color: on ? colors.offWhite : palette.text }}>{d.getDate()}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
            <Text style={[type.cardTitle, { color: palette.text, fontSize: 17, flex: 1 }]}>{capitalize(formatLongDate(selected))}</Text>
            <Text style={[type.caption, { color: palette.textMuted, fontSize: 12.5 }]}>
              {doneCount} de {dayTasks.length} feitos
            </Text>
          </View>

          {dayTasks.length ? (
            <View style={{ gap: 10 }}>
              {dayTasks.map((t) => {
                const done = t.doneDates.includes(selKey);
                return (
                  <View key={t.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, minHeight: 58 }}>
                    <Pressable
                      onPress={() => toggle(t)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: done }}
                      accessibilityLabel={`Marcar ${t.label}`}
                      style={{ width: 56, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {done ? (
                        <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={16} color="#fff" strokeWidth={3} />
                        </LinearGradient>
                      ) : (
                        <View style={{ width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: colors.pastelGreen }} />
                      )}
                    </Pressable>
                    <Pressable
                      onPress={() => navigation.navigate('NewTask4d', { taskId: t.id })}
                      accessibilityRole="button"
                      accessibilityLabel={`Editar ${t.label}`}
                      style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingRight: 14, alignSelf: 'stretch' }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[type.body, { fontSize: 14.5, color: palette.text, opacity: done ? 0.55 : 1, textDecorationLine: done ? 'line-through' : 'none' }]}>{t.label}</Text>
                        <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 1 }]}>
                          {t.category} · {t.repeat}
                        </Text>
                      </View>
                      <Text style={[type.caption, { fontSize: 12.5, color: palette.textMuted }]}>{formatHour(t.time)}</Text>
                      <Pencil size={14} color={palette.hint} />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          ) : (
            <Card tone="dashed" padding={18}>
              <Text style={[type.body, { color: palette.text }]}>Nenhuma tarefa neste dia.</Text>
              <Pressable onPress={() => navigation.navigate('NewTask4d')} hitSlop={8} style={{ marginTop: 8, alignSelf: 'flex-start' }}>
                <Text style={[type.bodySm, { color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>+ criar uma tarefa</Text>
              </Pressable>
            </Card>
          )}
          {dayTasks.length > 0 && <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5 }]}>toque no quadrado para marcar · toque no nome para editar</Text>}

          <Card tone="muted" radius={18}>
            <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 16.5 }]}>Quebras saudáveis de rotina</Text>
            <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12, opacity: 0.75, marginTop: 5, lineHeight: 18 }]}>
              Pequenas variações combinadas antes. Não contam como falha — treinam flexibilidade.
            </Text>
            <View style={{ gap: 9, marginTop: 14 }}>
              {dayBreaks.length ? (
                dayBreaks.map((b) => (
                  <View key={b.id} style={{ backgroundColor: colors.offWhite, borderRadius: 13, paddingLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, paddingVertical: 12 }}>
                      <Text style={[type.body, { fontSize: 13.5, color: colors.darkAzure }]}>{b.label}</Text>
                      <Text style={[type.caption, { fontSize: 11, color: colors.darkAzure, opacity: 0.6, marginTop: 2 }]}>avisar o(a) {state.childName} antes</Text>
                    </View>
                    <Pressable onPress={() => removeBreak(b.id)} accessibilityLabel="Remover quebra" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
                      <X size={16} color={colors.darkAzure} />
                    </Pressable>
                  </View>
                ))
              ) : (
                <Text style={[type.caption, { fontSize: 12, color: colors.darkAzure, opacity: 0.7 }]}>Nenhuma quebra programada para este dia.</Text>
              )}
            </View>
            <Pressable onPress={newBreak} accessibilityRole="button" hitSlop={8} style={{ marginTop: 14, alignSelf: 'flex-start', paddingVertical: 4 }}>
              <Text style={[type.bodySm, { color: colors.accent2, fontSize: 13, fontFamily: 'Lexend_500Medium' }]}>+ Programar uma quebra</Text>
            </Pressable>
          </Card>

          <Pressable
            onPress={() => navigation.navigate('LockScreenReminder4e')}
            accessibilityRole="button"
            style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: 16, padding: 15, alignItems: 'center' }}
          >
            <Text style={[type.bodySm, { color: colors.accent2, fontSize: 13 }]}>ver como fica o lembrete na tela de bloqueio</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Card>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <View style={{ width: 42 }} />
              {days.map((d) => (
                <Text
                  key={dateKey(d)}
                  style={{ flex: 1, textAlign: 'center', fontFamily: dateKey(d) === todayKey ? 'Lexend_600SemiBold' : 'Lexend_500Medium', fontSize: 11, opacity: dateKey(d) === todayKey ? 1 : 0.6, color: palette.text }}
                >
                  {weekdayShort(d).charAt(0).toUpperCase()}
                </Text>
              ))}
            </View>
            {PERIODS.map((p) => (
              <View key={p.label} style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 8 }}>
                <Text style={{ width: 42, fontFamily: 'Lexend_300Light', fontSize: 11.5, color: palette.text }}>{p.label}</Text>
                {days.map((d) => {
                  const c = cellFor(childTasks, d, p.from, p.to, todayKey);
                  const key = dateKey(d);
                  return (
                    <Pressable
                      key={key}
                      onPress={() => {
                        setSelected(d);
                        setTab('dia');
                      }}
                      accessibilityLabel={`${formatLongDate(d)}, ${p.label}`}
                      style={{ flex: 1 }}
                    >
                      {c === 'all' ? (
                        <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ height: 28, borderRadius: 8 }} />
                      ) : (
                        <View
                          style={{
                            height: 28,
                            borderRadius: 8,
                            backgroundColor: c === 'part' ? colors.pastelGreen : c === 'future' ? 'transparent' : 'rgba(127,160,172,.16)',
                            borderWidth: c === 'future' ? 1 : 0,
                            borderStyle: 'dashed',
                            borderColor: palette.chipBorder,
                          }}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            ))}
            <View style={{ flexDirection: 'row', gap: 14, marginTop: 16, flexWrap: 'wrap' }}>
              {[
                { c: colors.accent2, label: 'tudo feito' },
                { c: colors.pastelGreen, label: 'parcial' },
                { c: 'rgba(127,160,172,.3)', label: 'sem marcação' },
              ].map((l) => (
                <View key={l.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 11, height: 11, borderRadius: 4, backgroundColor: l.c }} />
                  <Text style={[type.caption, { fontSize: 11, color: palette.textMuted }]}>{l.label}</Text>
                </View>
              ))}
            </View>
            <Text style={[type.caption, { fontSize: 11, color: palette.textFaint, marginTop: 10 }]}>toque em um quadrado para abrir o dia</Text>
          </Card>

          <Card tone="muted">
            <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 16.5 }]}>Quebras da semana</Text>
            <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12, opacity: 0.75, marginTop: 5, lineHeight: 18 }]}>
              {weekBreaks.length ? 'Variações combinadas. Isso mantém a consistência, não interrompe.' : 'Nenhuma quebra programada nesta semana.'}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 14 }}>
              {weekBreaks.map((b) => (
                <View key={b.id} style={{ backgroundColor: colors.offWhite, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14 }}>
                  <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 12.5, color: colors.darkAzure }}>
                    {weekdayShort(new Date(b.date + 'T12:00:00'))} · {b.label}
                  </Text>
                </View>
              ))}
            </View>
            <Pressable onPress={newBreak} accessibilityRole="button" hitSlop={8} style={{ marginTop: 14, alignSelf: 'flex-start', paddingVertical: 4 }}>
              <Text style={[type.bodySm, { color: colors.accent2, fontSize: 13, fontFamily: 'Lexend_500Medium' }]}>+ Programar uma quebra</Text>
            </Pressable>
          </Card>
        </>
      )}
    </ScreenContainer>
  );
}
