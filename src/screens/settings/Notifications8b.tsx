import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { Switch } from '../../components/Switch';
import { useApp } from '../../state/AppContext';

const ITEMS = [
  { key: 'routine', title: 'Lembretes de rotina', sub: 'no horário que você definiu' },
  { key: 'phases', title: 'Fases e trilhas', sub: 'quando faz sentido registrar algo' },
  { key: 'community', title: 'Comunidade', sub: 'respostas e encontros' },
  { key: 'news', title: 'Novidades do app', sub: 'no máximo uma vez por mês' },
];

export default function Notifications8b() {
  const { palette, colors, type } = useTheme();
  const { state, setPrefs } = useApp();
  const { notifications, quietHours } = state.prefs;

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 18 }}>
      <BackHeader title="Notificações" />
      <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5, lineHeight: 21 }]}>Você escolhe o que chega. Nada de cobrança por dia sem uso.</Text>

      <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, overflow: 'hidden' }}>
        {ITEMS.map((it, i) => (
          <View key={it.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 17, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: palette.divider }}>
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { fontSize: 14.5, color: palette.text }]}>{it.title}</Text>
              <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 3 }]}>{it.sub}</Text>
            </View>
            <Switch label={it.title} value={!!notifications[it.key]} onValueChange={(v) => setPrefs({ notifications: { ...notifications, [it.key]: v } })} />
          </View>
        ))}
      </View>

      <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 16 }]}>Horário de silêncio</Text>
          <Switch label="Horário de silêncio" value={quietHours} onValueChange={(v) => setPrefs({ quietHours: v })} achievement={false} />
        </View>
        <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.8, marginTop: 6 }]}>22h às 7h · nada chega nesse período</Text>
      </View>
    </ScreenContainer>
  );
}
