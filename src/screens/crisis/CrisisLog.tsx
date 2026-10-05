import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { TextField } from '../../components/TextField';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { TRIGGERS, HELPERS_BASE, INTENSITIES, DURATIONS, Intensity, Duration, CrisisLogEntry } from '../../data/crisisLog';

const WHEN = [
  { label: 'agora há pouco', hoursAgo: 0 },
  { label: 'hoje mais cedo', hoursAgo: 4 },
  { label: 'ontem', hoursAgo: 24 },
  { label: 'anteontem', hoursAgo: 48 },
];

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: React.ReactNode }) {
  const { palette, colors, type } = useTheme();
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: colors.pastelGreen, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 13, color: colors.darkAzure }}>{n}</Text>
        </View>
        <Text style={[type.cardTitle, { color: palette.text, fontSize: 16.5, flex: 1 }]}>{title}</Text>
      </View>
      {hint ? <Text style={[type.caption, { color: palette.textFaint, marginTop: -4 }]}>{hint}</Text> : null}
      {children}
    </View>
  );
}

function BigOption({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { palette, colors, type } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={{ flex: 1, minHeight: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, backgroundColor: selected ? palette.chipSelectedBg : palette.surface, borderWidth: selected ? 1.5 : 1, borderColor: selected ? colors.accent1 : palette.chipBorder }}
    >
      <Text style={[type.bodySm, { color: palette.text, textAlign: 'center', fontFamily: selected ? 'Lexend_500Medium' : 'Lexend_400Regular' }]}>{label}</Text>
    </Pressable>
  );
}

/**
 * Registro rápido de uma crise (diário). Abre sozinho ao sair do Modo Crise
 * (`fromCrisis`) ou pelo Diário, para registrar uma crise que já passou.
 */
export default function CrisisLog({ navigation, route }: any) {
  const { palette, type } = useTheme();
  const { state, addCrisisLog } = useApp();
  const { toast } = useUI();
  const fromCrisis = !!route.params?.fromCrisis;
  const [category, setCategory] = useState<CrisisLogEntry['category']>(route.params?.category ?? 'sensorial');
  const [when, setWhen] = useState(0);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<Intensity | null>(null);
  const [duration, setDuration] = useState<Duration | null>(null);
  const [helped, setHelped] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const helpers = useMemo(() => Array.from(new Set([...state.calmingThings, ...HELPERS_BASE])), [state.calmingThings]);
  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const close = () => navigation.goBack();

  const save = () => {
    const date = new Date(Date.now() - WHEN[when].hoursAgo * 3600000).toISOString();
    addCrisisLog({ date, category, triggers, intensity: intensity ?? 'média', duration: duration ?? '10 a 30 min', helped, note: note.trim() || undefined });
    toast('Registrado no diário. Com o tempo, os padrões aparecem.');
    close();
  };

  const o = fromCrisis ? 0 : 1; // numeração das etapas
  const ready = triggers.length > 0 || intensity || duration || helped.length > 0;

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 22 }}>
      <BackHeader title={fromCrisis ? 'Como foi?' : 'Registrar uma crise'} onBack={close} right={<Pressable onPress={close} accessibilityRole="button" style={{ minHeight: 44, justifyContent: 'center', paddingLeft: 10 }}><Text style={[type.bodySm, { color: palette.textMuted }]}>pular</Text></Pressable>} />
      <Text style={[type.body, { color: palette.textMuted, marginTop: -12 }]}>
        {fromCrisis ? 'Três toques, se der. Ajuda a perceber padrões com o tempo. Pode pular sem problema.' : `Anote uma crise de ${state.childName} que já passou. Tudo fica só no seu aparelho.`}
      </Text>

      {!fromCrisis && (
        <Step n={1} title="Quando e que tipo">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {WHEN.map((w, i) => (
              <Chip key={w.label} label={w.label} selected={when === i} onPress={() => setWhen(i)} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['sensorial', 'emocional', 'outro'] as const).map((c) => (
              <BigOption key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
            ))}
          </View>
        </Step>
      )}

      <Step n={1 + o} title="O que veio antes?" hint="Pode marcar mais de um.">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {TRIGGERS.map((t) => (
            <Chip key={t} label={t} selected={triggers.includes(t)} onPress={() => toggle(triggers, setTriggers, t)} />
          ))}
        </View>
      </Step>

      <Step n={2 + o} title="Como foi a intensidade e a duração?">
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {INTENSITIES.map((i) => (
            <BigOption key={i} label={i} selected={intensity === i} onPress={() => setIntensity(i)} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {DURATIONS.map((d) => (
            <BigOption key={d} label={d} selected={duration === d} onPress={() => setDuration(d)} />
          ))}
        </View>
      </Step>

      <Step n={3 + o} title="O que ajudou?">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {helpers.map((h) => (
            <Chip key={h} label={h} selected={helped.includes(h)} onPress={() => toggle(helped, setHelped, h)} />
          ))}
        </View>
      </Step>

      <TextField label="Quer anotar algo? (opcional)" value={note} onChangeText={setNote} multiline maxLength={400} placeholder="ex: festa com música alta, saímos depois de 15 min" />

      <View style={{ gap: 4 }}>
        <Button label="Salvar no diário" onPress={save} disabled={!ready} />
        <Button label={fromCrisis ? 'Agora não' : 'Cancelar'} variant="ghost" onPress={close} />
      </View>
    </ScreenContainer>
  );
}
