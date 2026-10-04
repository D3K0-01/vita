import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { Switch } from '../../components/Switch';
import { useApp } from '../../state/AppContext';

export default function Accessibility8c({ navigation }: any) {
  const { palette, colors, type, scheme, toggleScheme } = useTheme();
  const { state, setState } = useApp();
  const [textSize, setTextSize] = useState(0.4);
  const [reducedStimulus, setReducedStimulus] = useState(true);
  const [noAnimations, setNoAnimations] = useState(true);
  const [contrast, setContrast] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40, gap: 20 }}>
        <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ChevronLeft size={20} color={palette.text} strokeWidth={2} />
          <Text style={[type.title, { color: palette.text, fontSize: 22 }]}>Acessibilidade</Text>
        </Pressable>

        <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 20 }}>
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 16 }]}>Tamanho do texto</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 18 }}>
            <Text style={[type.bodySm, { fontSize: 13, color: palette.textMuted, opacity: 0.7 }]}>A</Text>
            <Pressable
              onPress={() => setTextSize((v) => (v >= 1 ? 0 : v + 0.2))}
              style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: palette.divider, position: 'relative' }}
            >
              <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${textSize * 100}%`, backgroundColor: colors.darkAzure, borderRadius: 3 }} />
              <View style={{ position: 'absolute', left: `${textSize * 100}%`, top: -9, width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', borderWidth: 2, borderColor: colors.darkAzure }} />
            </Pressable>
            <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 24, color: palette.text }}>A</Text>
          </View>
          <View style={{ backgroundColor: palette.bg, borderRadius: 14, padding: 16, marginTop: 20 }}>
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 15 + textSize * 6, lineHeight: 24 + textSize * 8, color: palette.text }}>Assim o texto vai aparecer no app.</Text>
          </View>
        </View>

        <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 17 }}>
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { fontSize: 14.5, color: palette.text }]}>Estímulo visual reduzido</Text>
              <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, opacity: 0.85, marginTop: 3 }]}>menos cor, menos movimento</Text>
            </View>
            <Switch value={reducedStimulus} onValueChange={setReducedStimulus} achievement={false} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 17, borderTopWidth: 1, borderTopColor: palette.divider }}>
            <Text style={[type.body, { flex: 1, fontSize: 14.5, color: palette.text }]}>Desligar animações</Text>
            <Switch value={noAnimations} onValueChange={setNoAnimations} achievement={false} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 17, borderTopWidth: 1, borderTopColor: palette.divider }}>
            <Text style={[type.body, { flex: 1, fontSize: 14.5, color: palette.text }]}>Mais contraste</Text>
            <Switch value={contrast} onValueChange={setContrast} achievement={false} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 17, borderTopWidth: 1, borderTopColor: palette.divider }}>
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { fontSize: 14.5, color: palette.text }]}>Modo escuro</Text>
              <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, opacity: 0.85, marginTop: 3 }]}>a mesma calma à noite, inclusive no Modo Crise</Text>
            </View>
            <Switch value={scheme === 'dark'} onValueChange={toggleScheme} achievement={false} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 17, borderTopWidth: 1, borderTopColor: palette.divider }}>
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { fontSize: 14.5, color: palette.text }]}>Simular modo offline</Text>
              <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, opacity: 0.85, marginTop: 3 }]}>demo: o Modo Crise mostra a versão sem internet</Text>
            </View>
            <Switch value={state.simulateOffline} onValueChange={(v) => setState((s) => ({ ...s, simulateOffline: v }))} achievement={false} />
          </View>
        </View>

        <View style={{ backgroundColor: colors.greyAzure + '29', borderRadius: 18, padding: 18 }}>
          <Text style={[type.caption, { color: palette.text, fontSize: 12.5, opacity: 0.85, lineHeight: 21 }]}>Esses ajustes valem para o app inteiro, inclusive no Modo Crise.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
