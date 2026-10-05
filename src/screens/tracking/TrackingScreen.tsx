import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Platform, Share } from 'react-native';
import { ChevronRight, FileDown, NotebookPen } from 'lucide-react-native';
import { insightsFor } from '../../data/crisisLog';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { ChildPill } from '../../components/ChildPill';
import { Button } from '../../components/Button';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { taskOccursOn, Task } from '../../data/mock';
import { TRACKS } from '../../data/tracks';
import { addDays, dateKey, formatDayMonth, formatLongDate, formatWeekRange, monthName, startOfWeek, timeAgo, weekdayLong, weekdayShort } from '../../utils/date';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type DayStat = { date: Date; key: string; total: number; done: number; future: boolean };

function statFor(tasks: Task[], d: Date, todayKey: string): DayStat {
  const key = dateKey(d);
  const list = tasks.filter((t) => taskOccursOn(t, d));
  return { date: d, key, total: list.length, done: list.filter((t) => t.doneDates.includes(key)).length, future: key > todayKey };
}

export default function TrackingScreen({ navigation }: any) {
  const { palette, colors, type } = useTheme();
  const { state } = useApp();
  const { toast } = useUI();
  const [tab, setTab] = useState<'semana' | 'mês'>('semana');
  const today = new Date();
  const todayKey = dateKey(today);

  const tasks = useMemo(() => state.tasks.filter((t) => t.childId === state.activeChildId), [state.tasks, state.activeChildId]);
  const weekStart = startOfWeek(today);
  const week = Array.from({ length: 7 }, (_, i) => statFor(tasks, addDays(weekStart, i), todayKey));
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const month = Array.from({ length: today.getDate() }, (_, i) => statFor(tasks, addDays(monthStart, i), todayKey));

  const presentDays = month.filter((d) => d.done > 0).length;
  const weekDone = week.reduce((a, d) => a + d.done, 0);
  const weekTotal = week.filter((d) => !d.future).reduce((a, d) => a + d.total, 0);
  const best = [...week].filter((d) => !d.future && d.total).sort((a, b) => b.done / b.total - a.done / a.total)[0];
  const lightest = [...week].filter((d) => !d.future && d.total).sort((a, b) => a.done / a.total - b.done / b.total)[0];

  // maior pausa (dias sem marcação) neste mês, antes de voltar a marcar
  let gap = 0;
  let run = 0;
  month.forEach((d) => {
    if (d.total && d.done === 0 && d.key < todayKey) run += 1;
    else {
      if (d.done > 0) gap = Math.max(gap, run);
      run = 0;
    }
  });

  const advances = TRACKS.flatMap((t) =>
    (state.tracks[t.id]?.history ?? []).filter((h) => h.advanced).map((h) => ({ id: h.id, trackId: t.id, label: `${t.name} · fase ${h.phase + 1}`, date: h.date }))
  )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  const crisesThisMonth = state.crisisAttempts.filter((c) => new Date(c.date) >= monthStart).length;

  const summary = () => {
    const lines = [
      `Resumo Vita — ${state.childName}, ${state.childAge} anos (${state.diagnoses[0]})`,
      `Gerado em ${formatLongDate(today)}`,
      '',
      `Semana ${formatWeekRange(weekStart)}: ${weekDone} de ${weekTotal} tarefas feitas.`,
      ...week.filter((d) => !d.future && d.total).map((d) => `• ${weekdayLong(d.date)}: ${d.done}/${d.total}`),
      '',
      `${monthName(today)}: presença em ${presentDays} ${presentDays === 1 ? 'dia' : 'dias'}.`,
      `Modo Crise usado ${crisesThisMonth} ${crisesThisMonth === 1 ? 'vez' : 'vezes'} neste mês.`,
      '',
      'Trilhas:',
      ...TRACKS.filter((t) => (state.tracks[t.id]?.step ?? 0) > 0).map((t) => {
        const p = state.tracks[t.id];
        return `• ${t.name}: ${p.step > t.phases.length ? 'concluída' : `fase ${p.step} de ${t.phases.length} (${p.attempts} tentativas nesta fase)`}`;
      }),
      '',
      ...(() => {
        const log = state.crisisLog.filter((e) => e.childId === state.activeChildId);
        if (!log.length) return [];
        const ins = insightsFor(log);
        return [`Diário de crises: ${log.length} registros.`, ...ins.map((i) => `• ${i.title}: ${i.text}`), ''];
      })(),
      'Observações para a consulta:',
      '______________________________________________',
    ];
    return lines.join('\n');
  };

  const exportReport = async () => {
    const text = summary();
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const w = window.open('', '_blank');
      if (!w) {
        toast('Permita pop-ups para gerar o relatório');
        return;
      }
      const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      w.document.write(
        `<html lang="pt-BR"><head><meta charset="utf-8"><title>Resumo Vita</title><style>body{font-family:system-ui,sans-serif;color:#2E4B52;max-width:640px;margin:40px auto;padding:0 20px;line-height:1.6}h1{font-size:22px}pre{white-space:pre-wrap;font-family:inherit;font-size:15px}</style></head><body><h1>Vita · resumo para consulta</h1><pre>${esc(text)}</pre><script>setTimeout(()=>print(),300)</script></body></html>`
      );
      w.document.close();
    } else {
      await Share.share({ message: text, title: 'Resumo Vita' }).catch(() => {});
    }
  };

  const Bars = ({ data, height }: { data: DayStat[]; height: number }) => (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: data.length > 10 ? 3 : 9, height, marginTop: 18 }}>
      {data.map((d) => {
        const ratio = d.total ? d.done / d.total : 0;
        const pause = !d.future && d.total > 0 && d.done === 0;
        const h = d.future ? 0.06 : pause ? 0.12 : d.total ? Math.max(0.12, ratio) : 0.06;
        return (
          <View key={d.key} style={{ flex: 1, height: `${h * 100}%`, borderRadius: data.length > 10 ? 4 : 8, overflow: 'hidden' }}>
            {ratio > 0.75 ? (
              <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ flex: 1 }} />
            ) : (
              <View style={{ flex: 1, backgroundColor: ratio > 0 ? colors.pastelGreen : 'rgba(127,160,172,.22)' }} />
            )}
          </View>
        );
      })}
    </View>
  );

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 18 }}>
      <BackHeader title="Acompanhamento" onBack={() => navigation.getParent()?.goBack()} />
      <ChildPill />

      <View style={{ flexDirection: 'row', backgroundColor: colors.greyAzure + '29', borderRadius: 14, padding: 4 }}>
        {(['semana', 'mês'] as const).map((t) => (
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

      {!tasks.length ? (
        <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 20, gap: 12 }}>
          <Text style={[type.cardTitle, { color: palette.text }]}>Ainda não há rotina para {state.childName}</Text>
          <Text style={[type.bodySm, { color: palette.textMuted }]}>Assim que houver alguns dias marcados, os gráficos aparecem aqui.</Text>
          <Button label="Ir para a Rotina" variant="secondary" onPress={() => navigation.getParent()?.navigate('Main', { screen: 'RotinaTab' })} />
        </View>
      ) : (
        <>
          {tab === 'mês' && gap >= 3 && (
            <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 20, padding: 20 }}>
              <Text style={[type.title, { color: colors.darkAzure, fontSize: 24 }]}>Que bom te ver de volta</Text>
              <Text style={[type.body, { color: colors.darkAzure, fontSize: 13.5, opacity: 0.85, marginTop: 8, lineHeight: 21 }]}>
                Ficaram {gap} dias sem registro e o que vocês construíram continua aqui. Retomar de onde parou já basta.
              </Text>
            </View>
          )}

          <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <Text style={[type.cardTitle, { color: palette.text, fontSize: 17 }]}>Rotina cumprida</Text>
              <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5 }]}>{tab === 'semana' ? formatWeekRange(weekStart) : monthName(today)}</Text>
            </View>
            {tab === 'semana' ? (
              <>
                <Bars data={week} height={132} />
                <View style={{ flexDirection: 'row', gap: 9, marginTop: 8 }}>
                  {week.map((d) => (
                    <Text key={d.key} style={{ flex: 1, textAlign: 'center', fontFamily: d.key === todayKey ? 'Lexend_600SemiBold' : 'Lexend_400Regular', fontSize: 11, color: palette.textMuted }}>
                      {weekdayShort(d.date)}
                    </Text>
                  ))}
                </View>
                <Text style={[type.body, { color: palette.textMuted, fontSize: 13, marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: palette.divider, lineHeight: 21 }]}>
                  {weekTotal
                    ? `${weekDone} de ${weekTotal} tarefas até agora.${best && best.done ? ` ${cap(weekdayLong(best.date))} foi o dia mais firme.` : ''}${lightest && lightest !== best ? ` ${cap(weekdayLong(lightest.date))} foi mais leve — e está tudo bem.` : ''}`
                    : 'Nenhuma tarefa prevista até agora nesta semana.'}
                </Text>
              </>
            ) : (
              <>
                <Bars data={month} height={120} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text style={[type.caption, { fontSize: 10.5, color: palette.textMuted }]}>dia 1</Text>
                  <Text style={[type.caption, { fontSize: 10.5, color: palette.textMuted }]}>hoje</Text>
                </View>
                <Text style={[type.body, { color: palette.textMuted, fontSize: 12.5, marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: palette.divider, lineHeight: 21 }]}>
                  Dias sem marcação aparecem em cinza, sem alarme. O gráfico só mostra o caminho.
                </Text>
              </>
            )}
          </View>

          <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 20 }}>
            <Text style={[type.title, { color: colors.darkAzure, fontSize: 24 }]}>
              Você esteve presente {presentDays} {presentDays === 1 ? 'dia' : 'dias'} este mês
            </Text>
            <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.85, marginTop: 8 }]}>nos dias em que deu, você apareceu</Text>
          </View>
        </>
      )}

      <Pressable
        onPress={() => navigation.getParent()?.navigate('CrisisDiary')}
        accessibilityRole="button"
        style={({ pressed }) => ({ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.75 : 1 })}
      >
        <NotebookPen size={20} color={colors.accent2} strokeWidth={1.8} />
        <View style={{ flex: 1 }}>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 15.5 }]}>Diário de crises</Text>
          <Text style={[type.caption, { color: palette.textMuted, marginTop: 2 }]}>
            {(() => {
              const n = state.crisisLog.filter((e) => e.childId === state.activeChildId).length;
              return n ? `${n} ${n === 1 ? 'registro' : 'registros'} · ver padrões` : 'registre como foram as crises e descubra padrões';
            })()}
          </Text>
        </View>
        <ChevronRight size={16} color={palette.hint} />
      </Pressable>

      <View>
        <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 10 }]}>Fases que avançaram</Text>
        {advances.length ? (
          <View style={{ gap: 10 }}>
            {advances.map((a) => (
              <Pressable
                key={a.id}
                onPress={() => navigation.getParent()?.navigate('Main', { screen: 'FasesTab', params: { screen: 'TrilhaDetail6b', params: { id: a.trackId }, initial: false } })}
                accessibilityRole="button"
                style={({ pressed }) => ({ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.75 : 1 })}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[type.cardTitle, { color: palette.text, fontSize: 15 }]}>{a.label}</Text>
                  <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 3 }]}>{timeAgo(a.date)}</Text>
                </View>
                <ChevronRight size={16} color={palette.hint} />
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={[type.bodySm, { color: palette.textMuted }]}>Nenhum avanço registrado ainda — as tentativas também contam.</Text>
        )}
      </View>

      <Pressable
        onPress={exportReport}
        accessibilityRole="button"
        style={({ pressed }) => ({ borderWidth: 1, borderColor: palette.chipBorder, borderRadius: 18, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.7 : 1 })}
      >
        <FileDown size={20} color={palette.text} strokeWidth={1.8} />
        <View style={{ flex: 1 }}>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 15 }]}>Exportar relatório</Text>
          <Text style={[type.caption, { color: palette.textMuted, fontSize: 11.5, marginTop: 3, lineHeight: 17 }]}>
            {Platform.OS === 'web' ? 'abre uma versão para imprimir ou salvar em PDF' : 'compartilhe um resumo para levar às consultas'}
          </Text>
        </View>
        <ChevronRight size={16} color={palette.hint} />
      </Pressable>

      <Text style={[type.caption, { color: palette.textFaint, fontSize: 11, textAlign: 'center' }]}>
        Estes números são só para vocês. Nada aqui é comparado com outras famílias. Atualizado em {formatDayMonth(today)}.
      </Text>
    </ScreenContainer>
  );
}
