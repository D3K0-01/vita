import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Plus, Sparkles, MoreHorizontal, Lightbulb, NotebookPen } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { Button } from '../../components/Button';
import { ChildPill } from '../../components/ChildPill';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { insightsFor, summaryFor, periodOf, CrisisLogEntry } from '../../data/crisisLog';
import { formatDayMonth, weekdayShort } from '../../utils/date';

const INTENSITY_COLOR: Record<string, string> = { leve: '#C7D6BF', média: '#E6D9B8', forte: '#E3C1B8' };

function Entry({ e, onMenu }: { e: CrisisLogEntry; onMenu: () => void }) {
  const { palette, colors, type } = useTheme();
  const d = new Date(e.date);
  return (
    <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, padding: 14, gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 46, alignItems: 'center', backgroundColor: palette.bg, borderRadius: 10, paddingVertical: 6 }}>
          <Text style={[type.eyebrow, { fontSize: 9.5, color: palette.hint }]}>{weekdayShort(d)}</Text>
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 17, color: palette.text }}>{d.getDate()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.body, { color: palette.text, fontFamily: 'Lexend_500Medium', fontSize: 14 }]}>
            Crise {e.category === 'outro' ? '' : e.category} · {periodOf(e.date)}
          </Text>
          <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5 }]}>
            {formatDayMonth(d)} · {e.duration}
            {e.example ? ' · exemplo' : ''}
          </Text>
        </View>
        <View style={{ backgroundColor: INTENSITY_COLOR[e.intensity], borderRadius: 10, paddingVertical: 4, paddingHorizontal: 9 }}>
          <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 11, color: colors.darkAzure }}>{e.intensity}</Text>
        </View>
        <Pressable onPress={onMenu} accessibilityLabel="Opções do registro" style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: -8 }}>
          <MoreHorizontal size={17} color={palette.textFaint} />
        </Pressable>
      </View>
      {e.triggers.length > 0 && (
        <Text style={[type.bodySm, { color: palette.text, fontSize: 13 }]}>
          <Text style={{ color: palette.textMuted }}>Antes: </Text>
          {e.triggers.join(', ')}
        </Text>
      )}
      {e.helped.length > 0 && (
        <Text style={[type.bodySm, { color: palette.text, fontSize: 13 }]}>
          <Text style={{ color: palette.textMuted }}>Ajudou: </Text>
          {e.helped.join(', ')}
        </Text>
      )}
      {e.note ? <Text style={[type.caption, { color: palette.textMuted, fontStyle: 'italic' }]}>"{e.note}"</Text> : null}
    </View>
  );
}

export default function CrisisDiary({ navigation }: any) {
  const { palette, colors, type } = useTheme();
  const { state, removeCrisisLog, loadExampleCrisisLog, clearExampleCrisisLog } = useApp();
  const { choose, confirm, toast } = useUI();
  const entries = state.crisisLog.filter((e) => e.childId === state.activeChildId);
  const insights = insightsFor(entries);
  const hasExamples = entries.some((e) => e.example);
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const thisMonth = entries.filter((e) => new Date(e.date) >= monthStart).length;

  const askAI = () =>
    navigation.navigate('Main', {
      screen: 'IATab',
      params: {
        prefill: `${summaryFor(entries, state.childName)}\n\nVocê consegue me ajudar a entender possíveis padrões e sugerir 2 ou 3 coisas para prevenir as próximas?`,
      },
    });

  const menu = (e: CrisisLogEntry) =>
    choose(undefined, [
      {
        label: 'Apagar este registro',
        destructive: true,
        onPress: async () => {
          if (await confirm({ title: 'Apagar registro?', confirmLabel: 'Apagar', destructive: true })) {
            removeCrisisLog(e.id);
            toast('Registro apagado');
          }
        },
      },
    ]);

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 16 }}>
      <BackHeader title="Diário de crises" />
      <ChildPill />

      <View style={{ backgroundColor: colors.darkAzure, borderRadius: 20, padding: 18, gap: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <NotebookPen size={16} color={colors.pastelGreen} />
          <Text style={[type.eyebrow, { color: colors.pastelGreen }]}>Este mês</Text>
        </View>
        <Text style={[type.title, { color: colors.offWhite, fontSize: 24 }]}>
          {thisMonth} {thisMonth === 1 ? 'crise registrada' : 'crises registradas'}
        </Text>
        <Text style={[type.bodySm, { color: colors.offWhite, opacity: 0.85 }]}>Registrar não é cobrar. É juntar pistas para os próximos dias serem mais leves.</Text>
      </View>

      <Button label="Registrar uma crise" icon={<Plus size={17} color="#fff" />} onPress={() => navigation.navigate('CrisisLog')} />

      {entries.length === 0 ? (
        <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: 18, padding: 18, gap: 10 }}>
          <Text style={[type.cardTitle, { color: palette.text }]}>Nenhum registro ainda</Text>
          <Text style={[type.bodySm, { color: palette.textMuted }]}>
            Ao sair do Modo Crise, o Vita pergunta em 3 toques como foi. Com 3 registros, os padrões começam a aparecer aqui.
          </Text>
          <Pressable
            onPress={() => {
              loadExampleCrisisLog();
              toast('Exemplos carregados. Dá para apagar quando quiser.');
            }}
            accessibilityRole="button"
            style={{ alignSelf: 'flex-start', minHeight: 40, justifyContent: 'center' }}
          >
            <Text style={[type.bodySm, { color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>Ver como fica com registros de exemplo</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Lightbulb size={17} color={colors.darkAzure} />
              <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 16.5 }]}>Padrões percebidos</Text>
            </View>
            {insights.length ? (
              insights.map((i) => (
                <View key={i.title}>
                  <Text style={[type.eyebrow, { color: colors.accent2, fontSize: 10 }]}>{i.title}</Text>
                  <Text style={[type.bodySm, { color: colors.darkAzure, marginTop: 2 }]}>{i.text}</Text>
                </View>
              ))
            ) : (
              <Text style={[type.bodySm, { color: colors.darkAzure }]}>
                Faltam {3 - entries.length} {3 - entries.length === 1 ? 'registro' : 'registros'} para os primeiros padrões aparecerem.
              </Text>
            )}
            <Text style={[type.caption, { color: colors.darkAzure, opacity: 0.75 }]}>Calculado só no seu aparelho. Não é diagnóstico.</Text>
          </View>

          <Pressable
            onPress={askAI}
            accessibilityRole="button"
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: palette.chipBorder, borderRadius: 18, padding: 16, opacity: pressed ? 0.7 : 1 })}
          >
            <Sparkles size={20} color={colors.accent2} />
            <View style={{ flex: 1 }}>
              <Text style={[type.cardTitle, { color: palette.text, fontSize: 15.5 }]}>Pedir análise à IA</Text>
              <Text style={[type.caption, { color: palette.textMuted, marginTop: 2 }]}>leva o resumo do diário para o Chat, você revisa antes de enviar</Text>
            </View>
          </Pressable>

          <Text style={[type.eyebrow, { color: palette.hint }]}>Registros · {entries.length}</Text>
          {entries.map((e) => (
            <Entry key={e.id} e={e} onMenu={() => menu(e)} />
          ))}
          {hasExamples && (
            <Pressable onPress={clearExampleCrisisLog} accessibilityRole="button" style={{ alignSelf: 'center', minHeight: 44, justifyContent: 'center' }}>
              <Text style={[type.bodySm, { color: palette.textMuted }]}>Apagar registros de exemplo</Text>
            </Pressable>
          )}
        </>
      )}
    </ScreenContainer>
  );
}
