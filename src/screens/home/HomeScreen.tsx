import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronDown, ChevronRight, Bell, Calendar, LayoutGrid } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { CheckRow } from '../../components/CheckRow';
import { Button } from '../../components/Button';
import { SOSButton } from '../../components/SOSButton';
import { Avatar } from '../../components/Avatar';
import { useApp } from '../../state/AppContext';
import { defaultTasks } from '../../data/mock';

const MOODS = [
  { key: 'tranquilo', label: 'tranquilo' },
  { key: 'agitado', label: 'agitado' },
  { key: 'dificil', label: 'difícil' },
] as const;

export default function HomeScreen({ navigation }: any) {
  const { palette, colors, gradients, type, radii } = useTheme();
  const { state, setMood, toggleTask, addTask } = useApp();

  const doneCount = state.tasks.filter((t) => t.done).length;

  const startWithFirstTask = () => {
    addTask('rotina de dormir', '20h30');
  };

  const AvatarRow = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Avatar person="camila" name={state.parentName} size={40} ring />
      <Pressable
        onPress={() => navigation.navigate('SettingsStack')}
        style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, alignItems: 'center', justifyContent: 'center' }}
      >
        <LayoutGrid size={18} color={palette.text} strokeWidth={1.8} />
      </Pressable>
    </View>
  );

  // ---- 3c: dia difícil, tela curta ----
  if (state.mood === 'dificil' && state.hasFirstTask) {
    const focusTask = state.tasks.find((t) => !t.done) ?? state.tasks[state.tasks.length - 1];
    return (
      <ScreenContainer contentStyle={{ paddingHorizontal: 20, paddingTop: 14, gap: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={[type.title, { color: palette.text }]}>Oi, {state.parentName}</Text>
            <Text style={[type.caption, { color: palette.textMuted, marginTop: 2, fontSize: 13 }]}>terça, 12 de agosto</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-start' }}>
              <Text style={[type.bodySm, { fontSize: 13, color: palette.text }]}>{state.childName} · {state.childAge} anos</Text>
              <ChevronDown size={14} color={palette.hint} />
            </View>
          </View>
          {AvatarRow}
        </View>

        <Pressable
          onPress={() => setMood(null)}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.greyAzure + '2E', borderRadius: 14, padding: 14 }}
        >
          <Text style={[type.bodyLg, { fontSize: 13, fontFamily: 'Lexend_500Medium', color: palette.text }]}>hoje: difícil</Text>
          <Text style={[type.caption, { color: colors.accent2, fontSize: 12.5 }]}>trocar</Text>
        </Pressable>

        <Card radius={radii.xl} padding={24}>
          <Text style={[type.title, { color: palette.text, fontSize: 26, lineHeight: 33 }]}>Hoje, uma coisa só já basta.</Text>
          {focusTask && (
            <View style={{ marginTop: 20, borderWidth: 1.5, borderColor: colors.pastelGreen, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <Pressable onPress={() => toggleTask(focusTask.id)} style={{ width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: colors.accent1 }} />
              <View style={{ flex: 1 }}>
                <Text style={[type.cardTitle, { color: palette.text, fontSize: 17 }]}>{focusTask.label}</Text>
                <Text style={[type.caption, { color: palette.textMuted, fontSize: 12.5, marginTop: 3 }]}>{focusTask.time} · a que mais ajuda amanhã</Text>
              </View>
            </View>
          )}
          <Text style={[type.caption, { color: palette.textMuted, fontSize: 12, marginTop: 16, opacity: 0.85 }]}>
            As outras tarefas continuam salvas na Rotina. Ninguém precisa vê-las agora.
          </Text>
        </Card>

        <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ flex: 1 }}>
            <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 17 }]}>Quer respirar 2 minutos?</Text>
            <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.75, marginTop: 3 }]}>guiado, sem som se você preferir</Text>
          </View>
          <ChevronRight size={18} color={colors.darkAzure} />
        </View>

        <Pressable
          onPress={() => setMood(null)}
          style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: 18, padding: 18, marginBottom: 110 }}
        >
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 15, opacity: 0.8 }]}>Fases e avisos ficam de lado hoje</Text>
          <Text style={[type.caption, { color: palette.textMuted, fontSize: 12, marginTop: 4 }]}>Voltam amanhã, ou quando você quiser: toque aqui.</Text>
        </Pressable>

        <SOSButton />
      </ScreenContainer>
    );
  }

  // ---- 3b: primeira vez, sem rotina ----
  if (!state.hasFirstTask) {
    return (
      <ScreenContainer contentStyle={{ paddingHorizontal: 20, paddingTop: 14, gap: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={[type.title, { color: palette.text }]}>Bom dia, {state.parentName}</Text>
            <Text style={[type.caption, { color: palette.textMuted, marginTop: 4, fontSize: 13 }]}>um filho cadastrado · {state.childName}, {state.childAge} anos</Text>
          </View>
          {AvatarRow}
        </View>

        <Card radius={22} padding={22} style={{ gap: 16 }}>
          <LinearGradient colors={[colors.pastelGreen, colors.greyAzure]} style={{ height: 176, borderRadius: 16 }} />
          <View>
            <Text style={[type.title, { color: palette.text, fontSize: 24, lineHeight: 29 }]}>Vamos começar com uma tarefa só</Text>
            <Text style={[type.body, { color: palette.textMuted, fontSize: 14, marginTop: 10, lineHeight: 23 }]}>
              Escolha algo que já acontece no dia do {state.childName}. Uma tarefa é suficiente para começar — o resto vem com o tempo.
            </Text>
          </View>
          <View style={{ gap: 10 }}>
            <Button label="Criar a primeira tarefa" onPress={startWithFirstTask} />
            <Button label="Ver exemplos de rotina" variant="secondary" onPress={startWithFirstTask} />
          </View>
        </Card>

        <Pressable onPress={() => navigation.navigate('FasesTab')} style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ flex: 1 }}>
            <Text style={[type.eyebrow, { color: colors.accent2, fontSize: 10 }]}>Trilha sugerida · {state.childAge} anos</Text>
            <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 17, marginTop: 6 }]}>Autonomia no dia a dia</Text>
            <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12, opacity: 0.7, marginTop: 4 }]}>6 fases · comece quando quiser</Text>
          </View>
          <ChevronRight size={18} color={colors.darkAzure} />
        </Pressable>

        <View>
          <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 9 }]}>Avisos</Text>
          <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 14, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Bell size={17} color={palette.hint} strokeWidth={1.8} />
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { fontSize: 13.5, color: palette.text }]}>Encontro da comunidade amanhã, 20h</Text>
              <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 2 }]}>Primeiros passos com rotina</Text>
            </View>
          </View>
        </View>

        <Pressable style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: 18, padding: 18, marginBottom: 110 }}>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 16 }]}>Acompanhamento</Text>
          <Text style={[type.caption, { color: palette.textMuted, fontSize: 12, marginTop: 4, lineHeight: 18 }]}>Assim que houver alguns dias marcados, o resumo aparece aqui.</Text>
        </Pressable>

        <SOSButton />
      </ScreenContainer>
    );
  }

  // ---- 3a: estado com conteúdo ----
  return (
    <ScreenContainer contentStyle={{ paddingHorizontal: 20, paddingTop: 14, gap: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Text style={[type.title, { color: palette.text }]}>Bom dia, {state.parentName}</Text>
          <Text style={[type.caption, { color: palette.textMuted, marginTop: 2, fontSize: 13 }]}>terça, 12 de agosto</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-start' }}>
            <Text style={[type.bodySm, { fontSize: 13, color: palette.text }]}>{state.childName} · {state.childAge} anos</Text>
            <ChevronDown size={14} color={palette.hint} />
          </View>
        </View>
        {AvatarRow}
      </View>

      <Card>
        <Text style={[type.cardTitle, { color: palette.text, fontSize: 18 }]}>Como está o dia por aí?</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
          {MOODS.map((m) => (
            <Pressable
              key={m.key}
              onPress={() => setMood(m.key)}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 11,
                borderRadius: 14,
                backgroundColor: state.mood === m.key ? colors.pastelGreen : palette.bg,
                borderWidth: 1,
                borderColor: state.mood === m.key ? colors.accent1 : palette.surfaceBorder,
              }}
            >
              <Text style={[type.bodySm, { fontSize: 13, color: palette.text }]}>{m.label}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={[type.caption, { color: palette.textMuted, fontSize: 11.5, marginTop: 12, opacity: 0.8 }]}>Leva 5 segundos. Só pra ajustar as sugestões de hoje.</Text>
      </Card>

      <Card padding={18}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 17 }]}>Resumo do dia</Text>
          <Pressable onPress={() => navigation.navigate('RotinaTab')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[type.bodySm, { fontSize: 12, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>
              {doneCount} de {state.tasks.length} · Rotina
            </Text>
            <ChevronRight size={13} color={colors.accent2} />
          </Pressable>
        </View>
        <View style={{ gap: 11 }}>
          {state.tasks.map((t) => (
            <CheckRow key={t.id} label={t.label} time={t.time} done={t.done} onToggle={() => toggleTask(t.id)} />
          ))}
        </View>
        <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: palette.divider }]}>
          Marque aqui mesmo. Dá pra ajustar depois.
        </Text>
      </Card>

      <Pressable onPress={() => navigation.navigate('FasesTab')} style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ flex: 1 }}>
          <Text style={[type.eyebrow, { color: colors.accent2, fontSize: 10 }]}>Trilha · autonomia no dia a dia</Text>
          <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 17, marginTop: 6 }]}>{state.phase.phaseLabel}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <View style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: 'rgba(46,75,82,.15)', overflow: 'hidden' }}>
              <View style={{ width: `${(state.phase.stepIndex / state.phase.stepTotal) * 100}%`, height: '100%', backgroundColor: colors.darkAzure }} />
            </View>
            <Text style={[type.caption, { fontSize: 11.5, color: colors.darkAzure, opacity: 0.7 }]}>
              {state.phase.stepIndex} de {state.phase.stepTotal}
            </Text>
          </View>
        </View>
        <ChevronRight size={18} color={colors.darkAzure} />
      </Pressable>

      <View>
        <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 9 }]}>Avisos</Text>
        <View style={{ gap: 9 }}>
          <Pressable onPress={() => navigation.navigate('ComunidadeTab')} style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 14, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Bell size={17} color={palette.hint} strokeWidth={1.8} />
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { fontSize: 13.5, color: palette.text }]}>Encontro da comunidade amanhã, 20h</Text>
              <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 2 }]}>Sono e hora de dormir · Comunidade</Text>
            </View>
            <ChevronRight size={15} color={palette.hint} />
          </Pressable>
          <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 14, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Calendar size={17} color={palette.hint} strokeWidth={1.8} />
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { fontSize: 13.5, color: palette.text }]}>Consulta da Lia na quinta</Text>
              <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 2 }]}>quer levar um resumo?</Text>
            </View>
            <ChevronRight size={15} color={palette.hint} />
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => navigation.navigate('TrackingStack')}
        style={{ borderWidth: 1, borderColor: palette.chipBorder, borderRadius: 18, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 110 }}
      >
        <View style={{ flex: 1 }}>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 16 }]}>Ver o acompanhamento</Text>
          <Text style={[type.caption, { color: palette.textMuted, fontSize: 12, marginTop: 3, lineHeight: 18 }]}>Duas semanas de constância por aqui. Vale olhar junto.</Text>
        </View>
        <ChevronRight size={18} color={palette.text} />
      </Pressable>

      <SOSButton />
    </ScreenContainer>
  );
}
