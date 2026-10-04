import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ChevronLeft, ChevronDown, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { weekProgress } from '../../data/mock';

const MONTH_BARS = [70, 82, 60, 74, 46, 14, 14, 14, 14, 14, 14, 52, 66];

export default function TrackingScreen({ navigation }: any) {
  const { palette, colors, type } = useTheme();
  const [child, setChild] = useState<'Téo' | 'Lia'>('Téo');
  const [tab, setTab] = useState<'semana' | 'mês'>('semana');

  const selectChild = (c: 'Téo' | 'Lia') => {
    setChild(c);
    setTab(c === 'Lia' ? 'mês' : 'semana');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40, gap: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => navigation.getParent()?.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ChevronLeft size={20} color={palette.text} strokeWidth={2} />
            <Text style={[type.title, { color: palette.text, fontSize: 22 }]}>Acompanhamento</Text>
          </Pressable>
          <Pressable onPress={() => selectChild(child === 'Téo' ? 'Lia' : 'Téo')} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 11 }}>
            <Text style={[type.bodySm, { fontSize: 12.5, color: palette.text }]}>{child}</Text>
            <ChevronDown size={13} color={palette.hint} />
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', backgroundColor: colors.greyAzure + '29', borderRadius: 14, padding: 4 }}>
          {(['semana', 'mês'] as const).map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} style={{ flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 11, backgroundColor: tab === t ? palette.surface : 'transparent' }}>
              <Text style={[type.bodySm, { fontSize: 13.5, color: palette.text }]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        {tab === 'mês' && child === 'Lia' && (
          <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 20, padding: 22 }}>
            <Text style={[type.title, { color: colors.darkAzure, fontSize: 26 }]}>Que bom te ver de volta</Text>
            <Text style={[type.body, { color: colors.darkAzure, fontSize: 13.5, opacity: 0.8, marginTop: 10, lineHeight: 21 }]}>
              Ficaram 6 dias sem registro e o que vocês construíram continua aqui. Retomar de onde parou já basta.
            </Text>
          </View>
        )}

        {tab === 'semana' ? (
          <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text style={[type.cardTitle, { color: palette.text, fontSize: 17 }]}>Rotina cumprida</Text>
              <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, opacity: 0.85 }]}>11 – 17 de agosto</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 9, height: 132, marginTop: 20 }}>
              {weekProgress.map((d, i) => (
                <View key={i} style={{ flex: 1, height: `${d.value * 100}%`, borderRadius: 8, overflow: 'hidden' }}>
                  {d.value > 0.75 ? <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ flex: 1 }} /> : <View style={{ flex: 1, backgroundColor: colors.pastelGreen }} />}
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 9, marginTop: 9 }}>
              {weekProgress.map((d, i) => (
                <Text key={i} style={{ flex: 1, textAlign: 'center', fontFamily: 'Lexend_400Regular', fontSize: 11, opacity: 0.55, color: palette.text }}>{d.day}</Text>
              ))}
            </View>
            <Text style={[type.body, { color: palette.textMuted, fontSize: 13, opacity: 0.78, marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: palette.divider, lineHeight: 21 }]}>
              As manhãs seguem firmes. Sexta foi mais leve — e está tudo bem.
            </Text>
          </View>
        ) : (
          <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text style={[type.cardTitle, { color: palette.text, fontSize: 17 }]}>Rotina cumprida</Text>
              <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, opacity: 0.85 }]}>agosto</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 120, marginTop: 20 }}>
              {MONTH_BARS.map((v, i) => {
                const isPause = v === 14;
                return (
                  <View key={i} style={{ flex: 1, height: `${v}%`, borderRadius: 5, overflow: 'hidden' }}>
                    {isPause ? (
                      <View style={{ flex: 1, backgroundColor: 'rgba(46,75,82,.13)' }} />
                    ) : v > 65 ? (
                      <LinearGradient colors={[colors.accent1, colors.accent2]} style={{ flex: 1 }} />
                    ) : (
                      <View style={{ flex: 1, backgroundColor: colors.pastelGreen }} />
                    )}
                  </View>
                );
              })}
            </View>
            <View style={{ flexDirection: 'row', marginTop: 9 }}>
              <Text style={{ flex: 5, fontFamily: 'Lexend_400Regular', fontSize: 10.5, opacity: 0.55, color: palette.text }}>sem 1</Text>
              <Text style={{ flex: 6, textAlign: 'center', fontFamily: 'Lexend_400Regular', fontSize: 10.5, opacity: 0.55, color: palette.text }}>pausa</Text>
              <Text style={{ flex: 2, textAlign: 'right', fontFamily: 'Lexend_400Regular', fontSize: 10.5, opacity: 0.55, color: palette.text }}>agora</Text>
            </View>
            <Text style={[type.body, { color: palette.textMuted, fontSize: 12.5, opacity: 0.75, marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: palette.divider, lineHeight: 21 }]}>
              A pausa aparece cinza, sem alarme. O gráfico só mostra o caminho.
            </Text>
          </View>
        )}

        <View style={{ backgroundColor: child === 'Lia' && tab === 'mês' ? palette.surface : colors.pastelGreen, borderWidth: child === 'Lia' && tab === 'mês' ? 1 : 0, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 20 }}>
          <Text style={[type.title, { color: child === 'Lia' && tab === 'mês' ? palette.text : colors.darkAzure, fontSize: child === 'Lia' && tab === 'mês' ? 24 : 26 }]}>
            Você esteve presente {child === 'Lia' ? 11 : 18} dias esse mês
          </Text>
          <Text style={[type.caption, { color: child === 'Lia' && tab === 'mês' ? palette.textMuted : colors.darkAzure, fontSize: 12.5, opacity: 0.78, marginTop: 8 }]}>
            {child === 'Lia' ? 'um dia por semana já sustenta a rotina' : 'nos dias em que deu, você apareceu'}
          </Text>
        </View>

        <View>
          <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 10 }]}>Fases que avançaram</Text>
          <View style={{ gap: 10 }}>
            <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[type.cardTitle, { color: palette.text, fontSize: 15 }]}>{child === 'Téo' ? 'Novo alimento · fase 3' : 'Pedir com palavras · fase 2'}</Text>
                <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, opacity: 0.85, marginTop: 3 }]}>{child === 'Téo' ? 'há 4 dias' : 'há 3 semanas'}</Text>
              </View>
              <ChevronRight size={16} color={palette.hint} />
            </View>
          </View>
        </View>

        <View style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: 18, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={[type.cardTitle, { color: palette.text, fontSize: 15 }]}>Exportar relatório</Text>
            <Text style={[type.caption, { color: palette.textMuted, fontSize: 11.5, opacity: 0.75, marginTop: 3, lineHeight: 17 }]}>um resumo em PDF para levar às consultas</Text>
          </View>
          <View style={{ borderWidth: 1, borderColor: palette.chipBorder, borderRadius: 20, paddingVertical: 7, paddingHorizontal: 13 }}>
            <Text style={[type.caption, { fontSize: 11.5, color: palette.textMuted, opacity: 0.7 }]}>em breve</Text>
          </View>
        </View>

        <Text style={[type.caption, { color: palette.textFaint, fontSize: 11, opacity: 0.75, textAlign: 'center' }]}>Estes números são só para vocês. Nada aqui é comparado com outras famílias.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
