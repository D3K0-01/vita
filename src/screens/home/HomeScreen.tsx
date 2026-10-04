import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight, Bell, FileText, LayoutGrid, Wind, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { CheckRow } from '../../components/CheckRow';
import { Button } from '../../components/Button';
import { SOSButton } from '../../components/SOSButton';
import { Avatar } from '../../components/Avatar';
import { ChildPill } from '../../components/ChildPill';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { upcomingMeetings } from '../../data/mock';
import { TRACKS } from '../../data/tracks';
import { formatHour, formatLongDate, greeting, nowHHMM, weekdayLong } from '../../utils/date';

const MOODS = [
  { key: 'tranquilo', label: 'tranquilo' },
  { key: 'agitado', label: 'agitado' },
  { key: 'dificil', label: 'difícil' },
] as const;

export default function HomeScreen({ navigation }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { state, setMood, toggleTask, loadExampleRoutine } = useApp();
  const { choose, toast } = useUI();
  const today = new Date();

  const tasks = state.todayTasks;
  const doneCount = tasks.filter((t) => t.done).length;

  // trilha em andamento mais recente
  const activeTrack = useMemo(() => {
    const started = TRACKS.filter((t) => (state.tracks[t.id]?.step ?? 0) > 0);
    const last = (id: string) => state.tracks[id]?.history.at(-1)?.date ?? state.tracks[id]?.startedAt ?? '';
    return started.sort((a, b) => last(b.id).localeCompare(last(a.id)))[0];
  }, [state.tracks]);
  const trackProgress = activeTrack ? state.tracks[activeTrack.id] : null;

  const nextMeeting = upcomingMeetings(today)[0];
  const enrolled = state.meetings.includes(nextMeeting.id);

  const openMenu = () =>
    choose('Menu', [
      { label: 'Acompanhamento', hint: 'semana, mês e relatório para consultas', onPress: () => navigation.navigate('TrackingStack') },
      { label: 'Perfil e ajustes', hint: 'conta, filhos, notificações', onPress: () => navigation.navigate('SettingsStack') },
      { label: 'Acessibilidade', hint: 'texto, contraste, modo escuro', onPress: () => navigation.navigate('SettingsStack', { screen: 'Accessibility8c' }) },
      { label: 'Planos', hint: `plano atual: ${state.plan === 'plus' ? 'Plus' : 'Base'}`, onPress: () => navigation.navigate('PlansStack') },
      { label: 'Respirar 2 minutos', onPress: () => navigation.navigate('Breathing') },
    ]);

  const Header = (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Text style={[type.title, { color: palette.text }]} numberOfLines={1}>
          {state.mood === 'dificil' ? `Oi, ${state.parentName}` : `${greeting(today)}, ${state.parentName}`}
        </Text>
        <Text style={[type.caption, { color: palette.textMuted, marginTop: 2, fontSize: 13 }]}>{formatLongDate(today)}</Text>
        <View style={{ marginTop: 10 }}>
          <ChildPill />
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pressable onPress={() => navigation.navigate('SettingsStack')} accessibilityRole="button" accessibilityLabel="Perfil e ajustes">
          <Avatar person="camila" name={state.parentName} size={44} ring />
        </Pressable>
        <Pressable
          onPress={openMenu}
          accessibilityRole="button"
          accessibilityLabel="Abrir menu"
          style={({ pressed }) => ({ width: 44, height: 44, borderRadius: 22, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}
        >
          <LayoutGrid size={18} color={palette.text} strokeWidth={1.8} />
        </Pressable>
      </View>
    </View>
  );

  const BreatheCard = (
    <Pressable
      onPress={() => navigation.navigate('Breathing')}
      accessibilityRole="button"
      style={({ pressed }) => ({ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, opacity: pressed ? 0.85 : 1 })}
    >
      <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.offWhite, alignItems: 'center', justifyContent: 'center' }}>
        <Wind size={20} color={colors.darkAzure} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 17 }]}>Quer respirar 2 minutos?</Text>
        <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.75, marginTop: 3 }]}>guiado, sem som</Text>
      </View>
      <ChevronRight size={18} color={colors.darkAzure} />
    </Pressable>
  );

  // ---- 3c: dia difícil, tela curta ----
  if (state.mood === 'dificil' && state.hasFirstTask) {
    const now = nowHHMM();
    const focusTask = tasks.find((t) => !t.done && t.time >= now) ?? tasks.find((t) => !t.done);
    return (
      <ScreenContainer floating={<SOSButton />} contentStyle={{ paddingHorizontal: 20, paddingTop: 10, gap: 20 }}>
        {Header}

        <Pressable
          onPress={() => setMood(null)}
          accessibilityRole="button"
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.greyAzure + '2E', borderRadius: 14, padding: 14, minHeight: 48 }}
        >
          <Text style={[type.bodyLg, { fontSize: 13.5, fontFamily: 'Lexend_500Medium', color: palette.text }]}>hoje: difícil</Text>
          <Text style={[type.caption, { color: colors.accent2, fontSize: 13, fontFamily: 'Lexend_500Medium' }]}>trocar</Text>
        </Pressable>

        <Card radius={radii.xl} padding={24}>
          <Text style={[type.title, { color: palette.text, fontSize: 26, lineHeight: 33 }]}>Hoje, uma coisa só já basta.</Text>
          {focusTask ? (
            <Pressable
              onPress={() => {
                toggleTask(focusTask.id);
                toast('Feito. Isso já conta muito.');
              }}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: focusTask.done }}
              style={{ marginTop: 20, borderWidth: 1.5, borderColor: colors.pastelGreen, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}
            >
              <View style={{ width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: colors.accent1 }} />
              <View style={{ flex: 1 }}>
                <Text style={[type.cardTitle, { color: palette.text, fontSize: 17 }]}>{focusTask.label}</Text>
                <Text style={[type.caption, { color: palette.textMuted, fontSize: 12.5, marginTop: 3 }]}>{formatHour(focusTask.time)} · toque para marcar</Text>
              </View>
            </Pressable>
          ) : (
            <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Check size={18} color={colors.accent2} />
              <Text style={[type.body, { color: palette.text }]}>Tudo de hoje já foi feito. Descansa.</Text>
            </View>
          )}
          <Text style={[type.caption, { color: palette.textMuted, fontSize: 12, marginTop: 16 }]}>
            As outras tarefas continuam salvas na Rotina. Ninguém precisa vê-las agora.
          </Text>
        </Card>

        {BreatheCard}

        <Pressable
          onPress={() => setMood(null)}
          accessibilityRole="button"
          style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: 18, padding: 18 }}
        >
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 15, opacity: 0.85 }]}>Fases e avisos ficam de lado hoje</Text>
          <Text style={[type.caption, { color: palette.textMuted, fontSize: 12, marginTop: 4 }]}>Voltam amanhã, ou quando você quiser: toque aqui.</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  const TrackCard =
    activeTrack && trackProgress ? (
      <Pressable
        onPress={() => navigation.navigate('FasesTab', { screen: 'TrilhaDetail6b', params: { id: activeTrack.id }, initial: false })}
        accessibilityRole="button"
        style={({ pressed }) => ({ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, opacity: pressed ? 0.85 : 1 })}
      >
        <View style={{ flex: 1 }}>
          <Text style={[type.eyebrow, { color: colors.accent2, fontSize: 10 }]}>Trilha · {activeTrack.name}</Text>
          <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 17, marginTop: 6 }]}>
            {trackProgress.step > activeTrack.phases.length
              ? 'Trilha concluída'
              : `Fase ${trackProgress.step}: ${activeTrack.phases[trackProgress.step - 1].title.toLowerCase()}`}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <View style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: 'rgba(46,75,82,.15)', overflow: 'hidden' }}>
              <View style={{ width: `${Math.min(1, (trackProgress.step - 1) / activeTrack.phases.length) * 100}%`, height: '100%', backgroundColor: colors.darkAzure }} />
            </View>
            <Text style={[type.caption, { fontSize: 11.5, color: colors.darkAzure, opacity: 0.75 }]}>
              {Math.min(trackProgress.step, activeTrack.phases.length)} de {activeTrack.phases.length}
            </Text>
          </View>
        </View>
        <ChevronRight size={18} color={colors.darkAzure} />
      </Pressable>
    ) : null;

  const MeetingNotice = (
    <Pressable
      onPress={() => navigation.navigate('ComunidadeTab', { tab: 'Encontros' })}
      accessibilityRole="button"
      style={({ pressed }) => ({ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.7 : 1 })}
    >
      <Bell size={17} color={palette.hint} strokeWidth={1.8} />
      <View style={{ flex: 1 }}>
        <Text style={[type.body, { fontSize: 13.5, color: palette.text }]}>
          {nextMeeting.title} · {weekdayLong(new Date(nextMeeting.date))}, {new Date(nextMeeting.date).getHours()}h
        </Text>
        <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 2 }]}>
          {enrolled ? 'você está inscrita(o) · lembrete ativado' : 'Comunidade · toque para se inscrever'}
        </Text>
      </View>
      <ChevronRight size={15} color={palette.hint} />
    </Pressable>
  );

  // ---- 3b: primeira vez, sem rotina ----
  if (!state.hasFirstTask) {
    return (
      <ScreenContainer floating={<SOSButton />} contentStyle={{ paddingHorizontal: 20, paddingTop: 10, gap: 18 }}>
        {Header}

        <Card radius={22} padding={22} style={{ gap: 16 }}>
          <LinearGradient colors={[colors.pastelGreen, colors.greyAzure]} style={{ height: 140, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {['7h', '16h', '20h30'].map((h, i) => (
                <View key={h} style={{ backgroundColor: colors.offWhite, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, opacity: 1 - i * 0.2 }}>
                  <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 12, color: colors.darkAzure }}>{h}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
          <View>
            <Text style={[type.title, { color: palette.text, fontSize: 24, lineHeight: 29 }]}>Vamos começar com uma tarefa só</Text>
            <Text style={[type.body, { color: palette.textMuted, fontSize: 14, marginTop: 10, lineHeight: 23 }]}>
              Escolha algo que já acontece no dia do(a) {state.childName}. Uma tarefa é suficiente para começar — o resto vem com o tempo.
            </Text>
          </View>
          <View style={{ gap: 10 }}>
            <Button label="Criar a primeira tarefa" onPress={() => navigation.navigate('NewTask4d')} />
            <Button
              label="Usar uma rotina de exemplo"
              variant="secondary"
              onPress={() => {
                loadExampleRoutine();
                toast('Rotina de exemplo criada. Dá para editar tudo.');
              }}
            />
          </View>
        </Card>

        {TrackCard}

        <View>
          <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 9 }]}>Avisos</Text>
          {MeetingNotice}
        </View>

        <Pressable
          onPress={() => navigation.navigate('TrackingStack')}
          accessibilityRole="button"
          style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12 }}
        >
          <View style={{ flex: 1 }}>
            <Text style={[type.cardTitle, { color: palette.text, fontSize: 16 }]}>Acompanhamento</Text>
            <Text style={[type.caption, { color: palette.textMuted, fontSize: 12, marginTop: 4, lineHeight: 18 }]}>Assim que houver alguns dias marcados, o resumo aparece aqui.</Text>
          </View>
          <ChevronRight size={18} color={palette.hint} />
        </Pressable>
      </ScreenContainer>
    );
  }

  // ---- 3a: estado com conteúdo ----
  return (
    <ScreenContainer floating={<SOSButton />} contentStyle={{ paddingHorizontal: 20, paddingTop: 10, gap: 16 }}>
      {Header}

      <Card>
        <Text style={[type.cardTitle, { color: palette.text, fontSize: 18 }]}>Como está o dia por aí?</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
          {MOODS.map((m) => {
            const on = state.mood === m.key;
            return (
              <Pressable
                key={m.key}
                onPress={() => setMood(on ? null : m.key)}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 46,
                  borderRadius: 14,
                  backgroundColor: on ? palette.chipSelectedBg : palette.bg,
                  borderWidth: 1,
                  borderColor: on ? colors.accent1 : palette.surfaceBorder,
                }}
              >
                <Text style={[type.bodySm, { fontSize: 13, color: palette.text, fontFamily: on ? 'Lexend_500Medium' : 'Lexend_400Regular' }]}>{m.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[type.caption, { color: palette.textMuted, fontSize: 11.5, marginTop: 12 }]}>
          {state.mood === 'agitado' ? 'Anotado. Que tal uma pausa curta entre as tarefas de hoje?' : 'Leva 5 segundos. Só pra ajustar as sugestões de hoje.'}
        </Text>
      </Card>

      {state.mood === 'agitado' && BreatheCard}

      <Card padding={18}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 17 }]}>Resumo do dia</Text>
          <Pressable onPress={() => navigation.navigate('RotinaTab')} hitSlop={10} accessibilityRole="link" style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 }}>
            <Text style={[type.bodySm, { fontSize: 12.5, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>
              {doneCount} de {tasks.length} · Rotina
            </Text>
            <ChevronRight size={13} color={colors.accent2} />
          </Pressable>
        </View>
        {tasks.length ? (
          <View style={{ gap: 4 }}>
            {tasks.map((t) => (
              <CheckRow key={t.id} label={t.label} time={formatHour(t.time)} done={t.done} onToggle={() => toggleTask(t.id)} />
            ))}
          </View>
        ) : (
          <Text style={[type.bodySm, { color: palette.textMuted }]}>Nenhuma tarefa para hoje. Aproveitem o dia livre.</Text>
        )}
        <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: palette.divider }]}>
          Marque aqui mesmo. Dá pra ajustar depois.
        </Text>
      </Card>

      {TrackCard}

      <View>
        <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 9 }]}>Avisos</Text>
        <View style={{ gap: 9 }}>
          {MeetingNotice}
          <Pressable
            onPress={() => navigation.navigate('TrackingStack')}
            accessibilityRole="button"
            style={({ pressed }) => ({ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.7 : 1 })}
          >
            <FileText size={17} color={palette.hint} strokeWidth={1.8} />
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { fontSize: 13.5, color: palette.text }]}>Tem consulta chegando?</Text>
              <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 2 }]}>gere um resumo da semana do(a) {state.childName}</Text>
            </View>
            <ChevronRight size={15} color={palette.hint} />
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={() => navigation.navigate('TrackingStack')}
        accessibilityRole="button"
        style={({ pressed }) => ({ borderWidth: 1, borderColor: palette.chipBorder, borderRadius: 18, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 14, opacity: pressed ? 0.7 : 1 })}
      >
        <View style={{ flex: 1 }}>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 16 }]}>Ver o acompanhamento</Text>
          <Text style={[type.caption, { color: palette.textMuted, fontSize: 12, marginTop: 3, lineHeight: 18 }]}>Semana e mês, sem comparação com ninguém.</Text>
        </View>
        <ChevronRight size={18} color={palette.text} />
      </Pressable>
    </ScreenContainer>
  );
}
