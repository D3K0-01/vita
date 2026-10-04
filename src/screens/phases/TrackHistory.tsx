import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { useApp } from '../../state/AppContext';
import { TRACKS, getTrack } from '../../data/tracks';
import { formatDayMonth } from '../../utils/date';

// Histórico de tentativas e avanços — de uma trilha (param `id`) ou de todas.
export default function TrackHistory({ route }: any) {
  const { palette, colors, type } = useTheme();
  const { state } = useApp();
  const only = route.params?.id as string | undefined;
  const tracks = only ? [getTrack(only)] : TRACKS;

  const events = [
    ...tracks.flatMap((t) =>
      (state.tracks[t.id]?.history ?? []).map((h) => ({
        id: h.id,
        date: h.date,
        title: h.advanced ? `Avançou: ${t.name} · fase ${h.phase + 1}` : `Tentativa · ${t.name}, fase ${h.phase}`,
        note: h.note,
        advanced: h.advanced,
      }))
    ),
    ...(only ? [] : state.conquests.map((c) => ({ id: c.id, date: c.date, title: c.label, note: undefined, advanced: true }))),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <ScreenContainer contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 14 }}>
      <BackHeader title={only ? `Histórico · ${getTrack(only).name}` : 'Tudo que já aconteceu'} />
      <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5 }]}>Cada tentativa conta, mesmo as que não avançaram.</Text>
      {events.length === 0 ? (
        <Text style={[type.body, { color: palette.textMuted, marginTop: 20 }]}>Nada registrado ainda. A primeira tentativa aparece aqui.</Text>
      ) : (
        events.map((e) => (
          <View key={e.id} style={{ flexDirection: 'row', gap: 14 }}>
            <View style={{ width: 12, alignItems: 'center', paddingTop: 6 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: e.advanced ? colors.accent2 : colors.greyAzure }} />
            </View>
            <View style={{ flex: 1, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, padding: 14 }}>
              <Text style={[type.caption, { color: palette.textFaint }]}>{formatDayMonth(new Date(e.date))}</Text>
              <Text style={[type.body, { color: palette.text, marginTop: 2 }]}>{e.title}</Text>
              {e.note ? <Text style={[type.caption, { color: palette.textMuted, marginTop: 4 }]}>"{e.note}"</Text> : null}
            </View>
          </View>
        ))
      )}
    </ScreenContainer>
  );
}
