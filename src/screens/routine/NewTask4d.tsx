import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { X, ChevronDown } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { useApp } from '../../state/AppContext';

const CATEGORIES = ['escola', 'terapia', 'lazer', 'autocuidado'];
const REPEATS = ['todo dia', 'dias úteis', 'escolher'];
const REMINDERS = ['na hora', '10 min antes', '30 min'];

export default function NewTask4d({ navigation }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { addTask } = useApp();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('escola');
  const [repeat, setRepeat] = useState('dias úteis');
  const [reminder, setReminder] = useState('10 min antes');

  const save = () => {
    addTask(title.trim() || 'nova tarefa', '16h00');
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.darkAzure, justifyContent: 'flex-end' }}>
      <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()} />
      <View style={{ backgroundColor: palette.bg, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 22, paddingTop: 20, paddingBottom: 40, gap: 20, maxHeight: '88%' }}>
        <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: palette.chipBorder, alignSelf: 'center' }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[type.title, { color: palette.text, fontSize: 24 }]}>Nova tarefa</Text>
          <Pressable onPress={() => navigation.goBack()}>
            <X size={22} color={palette.hint} strokeWidth={2} />
          </Pressable>
        </View>

        <View>
          <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 7 }]}>Título</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="ex: lição de casa"
            placeholderTextColor={palette.textFaint}
            style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.chipBorder, borderRadius: radii.md, padding: 15, fontFamily: 'Lexend_400Regular', fontSize: 14.5, color: palette.text }}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 7 }]}>Horário</Text>
            <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.chipBorder, borderRadius: radii.md, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 14.5, color: palette.text }}>16h00</Text>
              <ChevronDown size={15} color={palette.hint} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 7 }]}>Duração</Text>
            <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.chipBorder, borderRadius: radii.md, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 14.5, color: palette.textFaint }}>opcional</Text>
              <ChevronDown size={15} color={palette.hint} />
            </View>
          </View>
        </View>

        <View>
          <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 10 }]}>Categoria</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map((c) => (
              <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
            ))}
          </View>
        </View>

        <View>
          <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 10 }]}>Repete</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {REPEATS.map((r) => (
              <Chip key={r} label={r} selected={repeat === r} onPress={() => setRepeat(r)} />
            ))}
          </View>
        </View>

        <View>
          <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 10 }]}>Lembrete</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {REMINDERS.map((r) => (
              <Chip key={r} label={r} selected={reminder === r} onPress={() => setReminder(r)} />
            ))}
          </View>
          <Text style={[type.caption, { color: palette.textMuted, fontSize: 11.5, marginTop: 10, opacity: 0.8 }]}>O aviso chega para você, não para a criança.</Text>
        </View>

        <Button label="Salvar tarefa" onPress={save} />
      </View>
    </View>
  );
}
