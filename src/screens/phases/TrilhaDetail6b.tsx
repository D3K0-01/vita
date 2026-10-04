import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { BackHeader } from '../../components/BackHeader';
import { SOSButton } from '../../components/SOSButton';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { getTrack } from '../../data/tracks';
import { formatDayMonth } from '../../utils/date';

export default function TrilhaDetail6b({ navigation, route }: any) {
  const { palette, colors, type } = useTheme();
  const { state, startTrack } = useApp();
  const { toast } = useUI();
  const track = getTrack(route.params?.id ?? 'alimentacao');
  const progress = state.tracks[track.id] ?? { step: 0, attempts: 0, history: [] };
  const started = progress.step > 0;
  const finished = progress.step > track.phases.length;
  const lastInPhase = [...progress.history].reverse().find((h) => h.phase === progress.step);
  const firstInPhase = progress.history.find((h) => h.phase === progress.step);

  return (
    <ScreenContainer floating={<SOSButton />} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 18 }}>
      <BackHeader
        title={track.area}
        size="sm"
        onBack={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('TrilhasList6a'))}
        right={
          <Pressable onPress={() => navigation.navigate('TrackHistory', { id: track.id })} hitSlop={8} style={{ paddingVertical: 10, paddingLeft: 10 }}>
            <Text style={[type.bodySm, { fontSize: 13, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>histórico</Text>
          </Pressable>
        }
      />

      <View>
        <Text style={[type.title, { color: palette.text, fontSize: 30 }]}>{track.name}</Text>
        <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5, marginTop: 8, lineHeight: 21 }]}>{track.intro}</Text>
      </View>

      <View>
        {track.phases.map((p, i) => {
          const n = i + 1;
          const done = started && (n < progress.step || finished);
          const active = started && !finished && n === progress.step;
          const isLast = i === track.phases.length - 1;
          return (
            <View key={p.title} style={{ flexDirection: 'row', gap: 16 }}>
              <View style={{ alignItems: 'center', width: 38 }}>
                {done ? (
                  <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={18} color="#fff" strokeWidth={3} />
                  </LinearGradient>
                ) : (
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      backgroundColor: palette.surface,
                      borderWidth: 2,
                      borderColor: active ? colors.accent2 : colors.pastelGreen,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 14, color: active ? colors.accent2 : colors.greyAzure }}>{n}</Text>
                  </View>
                )}
                {!isLast && <View style={{ flex: 1, width: 2, backgroundColor: done ? colors.accent2 : colors.pastelGreen, marginTop: 2 }} />}
              </View>
              <View style={{ flex: 1, paddingBottom: 22 }}>
                <Text style={[type.eyebrow, { color: done || active ? colors.accent2 : palette.hint, fontSize: 10, marginBottom: 5 }]}>
                  Fase {n}
                  {done ? ' · concluída' : active ? ` · onde o(a) ${state.childName} está` : ''}
                </Text>
                {active ? (
                  <View style={{ backgroundColor: palette.surface, borderWidth: 1.5, borderColor: colors.pastelGreen, borderRadius: 18, padding: 18 }}>
                    <Text style={[type.cardTitle, { color: palette.text, fontSize: 19 }]}>{p.title}</Text>
                    <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5, marginTop: 6, lineHeight: 21 }]}>{p.desc}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: palette.divider, gap: 8 }}>
                      <Text style={[type.bodySm, { fontSize: 13, color: palette.text }]}>
                        {progress.attempts} {progress.attempts === 1 ? 'tentativa registrada' : 'tentativas registradas'}
                      </Text>
                      {firstInPhase ? <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint }]}>desde {formatDayMonth(new Date(firstInPhase.date))}</Text> : null}
                    </View>
                    {lastInPhase?.note ? <Text style={[type.caption, { color: palette.textMuted, marginTop: 8 }]}>última nota: "{lastInPhase.note}"</Text> : null}
                  </View>
                ) : (
                  <>
                    <Text style={[type.cardTitle, { color: palette.text, fontSize: 18, opacity: done ? 1 : 0.85 }]}>{p.title}</Text>
                    <Text style={[type.body, { color: palette.textMuted, fontSize: 13, marginTop: 4, lineHeight: 19 }]}>{p.desc}</Text>
                  </>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ gap: 12 }}>
        {!started ? (
          <Button
            label="Começar esta trilha"
            onPress={() => {
              startTrack(track.id);
              toast('Trilha iniciada. Sem prazo, no ritmo de vocês.');
            }}
          />
        ) : finished ? (
          <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18 }}>
            <Text style={[type.cardTitle, { color: colors.darkAzure }]}>Trilha concluída</Text>
            <Text style={[type.caption, { color: colors.darkAzure, marginTop: 4 }]}>Tudo o que vocês construíram fica no histórico.</Text>
          </View>
        ) : (
          <Button label="Registrar tentativa mais recente" onPress={() => navigation.navigate('RegisterAttempt6c', { id: track.id })} />
        )}
        <Pressable
          onPress={() => navigation.navigate('TrackHistory', { id: track.id })}
          accessibilityRole="button"
          style={({ pressed }) => ({ borderWidth: 1, borderColor: palette.chipBorder, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', opacity: pressed ? 0.7 : 1 })}
        >
          <Text style={[type.body, { fontSize: 14, color: palette.text }]}>Histórico desta trilha</Text>
          <ChevronRight size={16} color={palette.hint} />
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
