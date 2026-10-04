import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { Switch } from '../../components/Switch';
import { useApp } from '../../state/AppContext';

const STEPS = [0, 0.2, 0.4, 0.6, 0.8, 1];

export default function Accessibility8c() {
  const { palette, colors, type, scheme, toggleScheme, highContrast, setHighContrast } = useTheme();
  const { state, setState, setPrefs } = useApp();
  const { textScale, reducedStimulus, noAnimations } = state.prefs;
  const idx = STEPS.findIndex((s) => Math.abs(s - textScale) < 0.01);
  const setIdx = (i: number) => setPrefs({ textScale: STEPS[Math.max(0, Math.min(STEPS.length - 1, i))] });

  const Row = ({ title, sub, value, onChange, first }: { title: string; sub?: string; value: boolean; onChange: (v: boolean) => void; first?: boolean }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 17, borderTopWidth: first ? 0 : 1, borderTopColor: palette.divider }}>
      <View style={{ flex: 1 }}>
        <Text style={[type.body, { fontSize: 14.5, color: palette.text }]}>{title}</Text>
        {sub ? <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 3 }]}>{sub}</Text> : null}
      </View>
      <Switch label={title} value={value} onValueChange={onChange} achievement={false} />
    </View>
  );

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 18 }}>
      <BackHeader title="Acessibilidade" />

      <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 20 }}>
        <Text style={[type.cardTitle, { color: palette.text, fontSize: 16 }]}>Tamanho do texto</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 }}>
          <Pressable onPress={() => setIdx(idx - 1)} disabled={idx <= 0} accessibilityRole="button" accessibilityLabel="Diminuir texto" style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: palette.chipBorder, alignItems: 'center', justifyContent: 'center', opacity: idx <= 0 ? 0.35 : 1 }}>
            <Minus size={18} color={palette.text} />
          </Pressable>
          <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
            {STEPS.map((s, i) => (
              <Pressable key={s} onPress={() => setIdx(i)} accessibilityLabel={`Tamanho ${i + 1} de ${STEPS.length}`} style={{ flex: 1, paddingVertical: 12 }}>
                <View style={{ height: 6, borderRadius: 3, backgroundColor: i <= idx ? palette.text : palette.divider }} />
              </Pressable>
            ))}
          </View>
          <Pressable onPress={() => setIdx(idx + 1)} disabled={idx >= STEPS.length - 1} accessibilityRole="button" accessibilityLabel="Aumentar texto" style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: palette.chipBorder, alignItems: 'center', justifyContent: 'center', opacity: idx >= STEPS.length - 1 ? 0.35 : 1 }}>
            <Plus size={18} color={palette.text} />
          </Pressable>
        </View>
        <View style={{ backgroundColor: palette.bg, borderRadius: 14, padding: 16, marginTop: 16 }}>
          <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 15, lineHeight: 24, color: palette.text }}>Assim o texto vai aparecer no app.</Text>
        </View>
        <Text style={[type.caption, { color: palette.textFaint, marginTop: 10 }]}>No navegador, o app inteiro muda de escala. No celular, o Vita também segue o tamanho de fonte do sistema.</Text>
      </View>

      <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, overflow: 'hidden' }}>
        <Row first title="Estímulo visual reduzido" sub="respiração guiada sem movimento" value={reducedStimulus} onChange={(v) => setPrefs({ reducedStimulus: v })} />
        <Row title="Desligar animações" sub="troca de telas sem transição" value={noAnimations} onChange={(v) => setPrefs({ noAnimations: v })} />
        <Row title="Mais contraste" sub="textos e bordas mais fortes" value={highContrast} onChange={setHighContrast} />
        <Row title="Modo escuro" sub="a mesma calma à noite, inclusive no Modo Crise" value={scheme === 'dark'} onChange={toggleScheme} />
        <Row
          title="Simular modo offline"
          sub="demonstração: o Modo Crise mostra a versão sem internet"
          value={state.simulateOffline}
          onChange={(v) => setState((s) => ({ ...s, simulateOffline: v }))}
        />
      </View>

      <View style={{ backgroundColor: colors.greyAzure + '29', borderRadius: 18, padding: 18 }}>
        <Text style={[type.caption, { color: palette.text, fontSize: 12.5, lineHeight: 21 }]}>Esses ajustes valem para o app inteiro, inclusive no Modo Crise.</Text>
      </View>
    </ScreenContainer>
  );
}
