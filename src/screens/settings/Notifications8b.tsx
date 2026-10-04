import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { Switch } from '../../components/Switch';

const ITEMS = [
  { key: 'routine', title: 'Lembretes de rotina', sub: 'no horário que você definiu', def: true },
  { key: 'phases', title: 'Fases e trilhas', sub: 'quando faz sentido registrar algo', def: true },
  { key: 'community', title: 'Comunidade', sub: 'respostas e encontros', def: false },
  { key: 'news', title: 'Novidades do app', sub: 'no máximo uma vez por mês', def: false },
];

export default function Notifications8b({ navigation }: any) {
  const { palette, colors, type } = useTheme();
  const [values, setValues] = useState<Record<string, boolean>>(Object.fromEntries(ITEMS.map((i) => [i.key, i.def])));
  const [silence, setSilence] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40, gap: 20 }}>
        <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ChevronLeft size={20} color={palette.text} strokeWidth={2} />
          <Text style={[type.title, { color: palette.text, fontSize: 22 }]}>Notificações</Text>
        </Pressable>
        <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5, opacity: 0.75, lineHeight: 21 }]}>Você escolhe o que chega. Nada de cobrança por dia sem uso.</Text>

        <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, overflow: 'hidden' }}>
          {ITEMS.map((it, i) => (
            <View key={it.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 17, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: palette.divider }}>
              <View style={{ flex: 1 }}>
                <Text style={[type.body, { fontSize: 14.5, color: palette.text }]}>{it.title}</Text>
                <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, opacity: 0.85, marginTop: 3 }]}>{it.sub}</Text>
              </View>
              <Switch value={values[it.key]} onValueChange={(v) => setValues((s) => ({ ...s, [it.key]: v }))} />
            </View>
          ))}
        </View>

        <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 16 }]}>Horário de silêncio</Text>
            <Switch value={silence} onValueChange={setSilence} achievement={false} />
          </View>
          <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.75, marginTop: 6 }]}>22h às 7h · nada chega nesse período</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
