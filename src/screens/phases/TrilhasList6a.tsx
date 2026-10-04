import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SOSButton } from '../../components/SOSButton';
import { useApp } from '../../state/AppContext';

const TRACKS = [
  { area: 'Alimentação', count: '3 trilhas', name: 'Novo alimento', phase: 'fase 2', progress: 0.5, id: 'alimentacao', active: true },
  { area: 'Fala e comunicação', count: '4 trilhas', name: 'Pedir com palavras', phase: 'fase 1', progress: 0.25, id: 'fala', active: false },
  { area: 'Socialização', count: '3 trilhas', name: 'Brincar junto', phase: 'fase 3', progress: 0.75, id: 'social', active: false },
];

export default function TrilhasList6a({ navigation }: any) {
  const { palette, colors, type } = useTheme();
  const { state } = useApp();

  return (
    <ScreenContainer contentStyle={{ paddingHorizontal: 20, paddingTop: 14, gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={[type.title, { color: palette.text }]}>Fases</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 }}>
          <Text style={[type.bodySm, { fontSize: 13, color: palette.text }]}>{state.childName}</Text>
          <ChevronDown size={14} color={palette.hint} />
        </View>
      </View>
      <Text style={[type.body, { color: palette.textMuted, fontSize: 13.5, opacity: 0.75, lineHeight: 21 }]}>
        Cada trilha anda no ritmo do {state.childName}. Não existe fase atrasada.
      </Text>

      <View style={{ gap: 11 }}>
        {TRACKS.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => t.active && navigation.navigate('TrilhaDetail6b', { id: t.id })}
            style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 18 }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text style={[type.cardTitle, { color: palette.text, fontSize: 18 }]}>{t.area}</Text>
              <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, opacity: 0.85 }]}>{t.count}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: palette.divider }}>
              <View style={{ flex: 1 }}>
                <Text style={[type.body, { fontSize: 14.5, color: palette.text }]}>{t.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <View style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: 'rgba(46,75,82,.1)', overflow: 'hidden' }}>
                    {t.active ? (
                      <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ width: `${t.progress * 100}%`, height: '100%' }} />
                    ) : (
                      <View style={{ width: `${t.progress * 100}%`, height: '100%', backgroundColor: colors.pastelGreen }} />
                    )}
                  </View>
                  <Text style={[type.caption, { fontSize: 11, color: t.active ? colors.accent2 : palette.textMuted, fontFamily: 'Lexend_500Medium' }]}>{t.phase}</Text>
                </View>
              </View>
              <ChevronRight size={16} color={palette.hint} />
            </View>
          </Pressable>
        ))}

        <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: 18, padding: 18 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={[type.cardTitle, { color: palette.text, fontSize: 18, opacity: 0.85 }]}>Autonomia</Text>
            <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, opacity: 0.85 }]}>5 trilhas</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { fontSize: 14, color: palette.text, opacity: 0.7 }]}>ainda não começou</Text>
              <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, opacity: 0.85, marginTop: 2 }]}>comece quando fizer sentido</Text>
            </View>
            <ChevronRight size={16} color={palette.hint} />
          </View>
        </View>
      </View>

      <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 18, marginBottom: 130 }}>
        <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 16.5 }]}>Tudo que já aconteceu</Text>
        <Text style={[type.caption, { color: colors.darkAzure, fontSize: 12.5, opacity: 0.75, marginTop: 5 }]}>14 conquistas registradas desde março.</Text>
        <View style={{ flexDirection: 'row', gap: 9, marginTop: 14, flexWrap: 'wrap' }}>
          <View style={{ backgroundColor: colors.offWhite, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14 }}>
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 12.5, color: colors.darkAzure }}>provou abobrinha</Text>
          </View>
          <View style={{ backgroundColor: colors.offWhite, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14 }}>
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 12.5, color: colors.darkAzure }}>dormiu sozinho</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 }}>
          <Text style={[type.bodySm, { color: colors.accent2, fontSize: 12.5, fontFamily: 'Lexend_500Medium' }]}>ver histórico</Text>
          <ChevronRight size={13} color={colors.accent2} />
        </View>
      </View>

      <SOSButton />
    </ScreenContainer>
  );
}
