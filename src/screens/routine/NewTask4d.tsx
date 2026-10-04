import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { X, Trash2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { Chip } from '../../components/Chip';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import type { Repeat } from '../../data/mock';
import { formatHour, parseHour } from '../../utils/date';

const CATEGORIES = ['escola', 'terapia', 'lazer', 'autocuidado'];
const REPEATS: Repeat[] = ['todo dia', 'dias úteis', 'fins de semana'];
const REMINDERS = ['na hora', '10 min antes', '30 min antes', 'sem lembrete'];
const DURATIONS = [0, 15, 30, 60];
const QUICK_TIMES = ['07:00', '12:00', '16:00', '19:00', '20:30'];

// Criar e editar tarefa (4d). Recebe `taskId` para editar.
export default function NewTask4d({ navigation, route }: any) {
  const { palette, colors, type } = useTheme();
  const insets = useSafeAreaInsets();
  const { state, addTask, updateTask, deleteTask } = useApp();
  const { confirm, toast } = useUI();
  const editing = state.tasks.find((t) => t.id === route.params?.taskId);

  const [title, setTitle] = useState(editing?.label ?? '');
  const [time, setTime] = useState(editing ? formatHour(editing.time) : '');
  const [duration, setDuration] = useState(editing?.durationMin ?? 0);
  const [category, setCategory] = useState(editing?.category ?? 'escola');
  const [repeat, setRepeat] = useState<Repeat>(editing?.repeat ?? 'dias úteis');
  const [reminder, setReminder] = useState(editing?.reminder ?? '10 min antes');
  const [errors, setErrors] = useState<{ title?: string; time?: string }>({});

  const save = () => {
    const parsed = parseHour(time);
    const e: typeof errors = {};
    if (!title.trim()) e.title = 'Dê um nome curto para a tarefa';
    if (!parsed) e.time = 'Horário inválido. Ex: 7h30 ou 16:00';
    setErrors(e);
    if (e.title || e.time || !parsed) return;
    const data = { label: title.trim(), time: parsed, category, repeat, reminder, durationMin: duration || undefined };
    if (editing) {
      updateTask(editing.id, data);
      toast('Tarefa atualizada');
    } else {
      addTask(data);
      toast(`Tarefa criada · aparece ${repeat === 'todo dia' ? 'todo dia' : `nos ${repeat}`}`);
    }
    navigation.goBack();
  };

  const remove = async () => {
    if (!editing) return;
    const ok = await confirm({ title: 'Excluir tarefa?', message: `"${editing.label}" sai da rotina. O histórico dos dias já marcados também.`, confirmLabel: 'Excluir', destructive: true });
    if (ok) {
      deleteTask(editing.id);
      toast('Tarefa excluída');
      navigation.goBack();
    }
  };

  const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <View>
      <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 10 }]}>{label}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{children}</View>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: 'rgba(20,32,36,0.6)', justifyContent: 'flex-end' }}>
      <Pressable style={{ flex: 1, minHeight: 40 }} onPress={() => navigation.goBack()} accessibilityLabel="Fechar" />
      <View style={{ backgroundColor: palette.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '92%' }}>
        <View style={{ paddingHorizontal: 22, paddingTop: 12 }}>
          <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: palette.chipBorder, alignSelf: 'center' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={[type.title, { color: palette.text, fontSize: 24 }]}>{editing ? 'Editar tarefa' : 'Nova tarefa'}</Text>
            <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Fechar" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -10 }}>
              <X size={22} color={palette.hint} strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 8, paddingBottom: 16, gap: 20 }}>
          <TextField label="Título" value={title} onChangeText={setTitle} placeholder="ex: lição de casa" maxLength={50} error={errors.title} autoFocus={!editing} />

          <View>
            <TextField label="Horário" value={time} onChangeText={setTime} placeholder="ex: 16h ou 16:30" maxLength={5} error={errors.time} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {QUICK_TIMES.map((t) => (
                <Chip key={t} label={formatHour(t)} selected={parseHour(time) === t} onPress={() => setTime(formatHour(t))} />
              ))}
            </View>
          </View>

          <Section label="Duração">
            {DURATIONS.map((d) => (
              <Chip key={d} label={d ? `${d} min` : 'sem duração'} selected={duration === d} onPress={() => setDuration(d)} />
            ))}
          </Section>

          <Section label="Categoria">
            {CATEGORIES.map((c) => (
              <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
            ))}
          </Section>

          <Section label="Repete">
            {REPEATS.map((r) => (
              <Chip key={r} label={r} selected={repeat === r} onPress={() => setRepeat(r)} />
            ))}
          </Section>

          <View>
            <Section label="Lembrete">
              {REMINDERS.map((r) => (
                <Chip key={r} label={r} selected={reminder === r} onPress={() => setReminder(r)} />
              ))}
            </Section>
            <Text style={[type.caption, { color: palette.textMuted, fontSize: 11.5, marginTop: 10 }]}>O aviso chega para você, não para a criança.</Text>
          </View>

          {editing && (
            <Pressable onPress={remove} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 }}>
              <Trash2 size={16} color="#9B3D3D" />
              <Text style={[type.bodySm, { color: '#9B3D3D', fontFamily: 'Lexend_500Medium' }]}>Excluir tarefa</Text>
            </Pressable>
          )}
        </ScrollView>

        <View style={{ paddingHorizontal: 22, paddingTop: 10, paddingBottom: Math.max(insets.bottom, 16), borderTopWidth: 1, borderTopColor: palette.divider }}>
          <Button label={editing ? 'Salvar alterações' : 'Salvar tarefa'} onPress={save} />
        </View>
      </View>
      {/* espaço da cor do sheet atrás da área segura */}
      <View style={{ height: 0, backgroundColor: colors.offWhite }} />
    </KeyboardAvoidingView>
  );
}
