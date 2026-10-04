import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SOSButton } from '../../components/SOSButton';
import { ChildPill } from '../../components/ChildPill';
import { useApp } from '../../state/AppContext';
import { TRACKS } from '../../data/tracks';
import { monthName } from '../../utils/date';

export default function TrilhasList6a({ navigation }: any) {
  const { palette, colors, type } = useTheme();
  const { state } = useApp();

  const advances = [
    ...TRACKS.flatMap((t) => (state.tracks[t.id]?.history ?? []).filter((h) => h.advanced).map((h) => ({ id: h.id, label: `${t.name} · fase ${h.phase}`, date: h.date }))),
    ...state.conquests,
  ].sort((a, b) => b.date.localeCompare(a.date));
  const since = advances.length ? new Date(advances[advances.length - 1].date) : null;

  return (
    <ScreenContainer floating={<SOSButton />} contentStyle={{ paddingHorizontal: 20, paddingTop: 10, gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={[type.title, { color: palette.text }]}>Fases</Text>
        <ChildPill showAge={false} />
      </View>
      <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5, lineHeight: 21 }]}>
        Cada trilha anda no ritmo do(a) {state.childName}. Não existe fase atrasada.
      </Text>

      <View style={{ gap: 11 }}>
        {TRACKS.map((t) => {
          const p = state.tracks[t.id];
          const started = (p?.step ?? 0) > 0;
          const finished = started && p.step > t.phases.length;
          const progress = started ? Math.min(1, (p.step - 1 + (finished ? 0 : 0.5)) / t.phases.length) : 0;
          return (
            <Pressable
              key={t.id}
              onPress={() => navigation.navigate('TrilhaDetail6b', { id: t.id })}
              accessibilityRole="button"
              style={({ pressed }) => ({
                backgroundColor: palette.surface,
                borderWidth: 1,
                borderStyle: started ? 'solid' : 'dashed',
                borderColor: started ? palette.surfaceBorder : palette.chipBorder,
                borderRadius: 18,
                padding: 18,
                opacity: pressed ? 0.75 : 1,
              })}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Text style={[type.cardTitle, { color: palette.text, fontSize: 18 }]}>{t.area}</Text>
                <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5 }]}>{t.count}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: palette.divider }}>
                <View style={{ flex: 1 }}>
                  <Text style={[type.body, { fontSize: 14.5, color: palette.text }]}>{t.name}</Text>
                  {started ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <View style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: 'rgba(127,160,172,.2)', overflow: 'hidden' }}>
                        <LinearGradient colors={[colors.accent1, colors.accent2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: `${progress * 100}%`, height: '100%' }} />
                      </View>
                      <Text style={[type.caption, { fontSize: 11, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>
                        {finished ? 'concluída' : `fase ${p.step}`}
                      </Text>
                    </View>
                  ) : (
                    <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 4 }]}>ainda não começou · comece quando fizer sentido</Text>
                  )}
                </View>
                <ChevronRight size={16} color={palette.hint} />
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => navigation.navigate('TrackHistory')}
        accessibilityRole="button"
        style={({ pressed }) => ({ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18, opacity: pressed ? 0.85 : 1 })}
      >
        <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 16.5 }]}>Tudo que já aconteceu</Text>
        <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.75, marginTop: 5 }]}>
          {advances.length} {advances.length === 1 ? 'conquista registrada' : 'conquistas registradas'}
          {since ? ` desde ${monthName(since)}` : ''}.
        </Text>
        <View style={{ flexDirection: 'row', gap: 9, marginTop: 14, flexWrap: 'wrap' }}>
          {advances.slice(0, 3).map((a) => (
            <View key={a.id} style={{ backgroundColor: colors.offWhite, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14 }}>
              <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 12.5, color: colors.darkAzure }}>{a.label}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 }}>
          <Text style={[type.bodySm, { color: colors.accent2, fontSize: 12.5, fontFamily: 'Lexend_500Medium' }]}>ver histórico</Text>
          <ChevronRight size={13} color={colors.accent2} />
        </View>
      </Pressable>
    </ScreenContainer>
  );
}
