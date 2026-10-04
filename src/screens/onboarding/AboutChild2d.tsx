import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Plus, X, Check } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { TextField } from '../../components/TextField';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import type { Child } from '../../data/mock';
import { OnboardingShell, FieldLabel } from './OnboardingShell';

const DIAGNOSES = ['TDAH', 'TEA', 'Em investigação', 'Prefiro não informar agora'];
const CALMING = ['abraço apertado', 'música', 'objeto favorito', 'silêncio', 'ficar sozinho'];

function RadioRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { palette, colors, type, radii } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: selected ? palette.chipSelectedBg : palette.surface,
        borderWidth: 1,
        borderColor: selected ? colors.accent1 : palette.chipBorder,
        borderRadius: radii.md,
        padding: 14,
        minHeight: 50,
      }}
    >
      <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: selected ? 5 : 1.5, borderColor: selected ? colors.accent2 : palette.hint, backgroundColor: '#fff' }} />
      <Text style={[type.body, { fontSize: 14, color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}

export const askChild = async (prompt: ReturnType<typeof useUI>['prompt'], current?: Child) => {
  const r = await prompt({
    title: current ? `Editar ${current.name}` : 'Adicionar filho ou filha',
    fields: [
      { key: 'name', label: 'Nome ou apelido', initial: current?.name, placeholder: 'ex: Lia', maxLength: 30 },
      { key: 'age', label: 'Idade', initial: current ? String(current.age) : '', placeholder: 'ex: 9', keyboardType: 'number-pad', maxLength: 2 },
      { key: 'diagnosis', label: 'Diagnóstico (opcional)', initial: current?.diagnosis, placeholder: 'ex: TEA, TDAH, em investigação' },
    ],
    validate: (v) => {
      if (!v.name) return 'Informe o nome ou apelido';
      const age = Number(v.age);
      if (!Number.isInteger(age) || age < 0 || age > 25) return 'Informe uma idade entre 0 e 25';
      return null;
    },
  });
  if (!r) return null;
  return { id: current?.id ?? `c${Date.now()}`, name: r.name, age: Number(r.age), diagnosis: r.diagnosis || 'não informado' } as Child;
};

export default function AboutChild2d({ navigation }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { state, setState } = useApp();
  const { prompt } = useUI();
  const first = state.children[0];
  const [name, setName] = useState(first?.name ?? '');
  const [age, setAge] = useState(first ? String(first.age) : '');
  const [diagnosis, setDiagnosis] = useState(DIAGNOSES.includes(first?.diagnosis) ? first.diagnosis : 'TDAH');
  const [consent, setConsent] = useState(true);
  const [calmingOptions, setCalmingOptions] = useState<string[]>(Array.from(new Set([...CALMING, ...state.calmingThings])));
  const [calming, setCalming] = useState<string[]>(state.calmingThings);
  const [others, setOthers] = useState<Child[]>(state.children.slice(1));
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});

  const toggleCalming = (c: string) => setCalming((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const addCalming = async () => {
    const r = await prompt({
      title: 'O que mais acalma?',
      fields: [{ key: 'item', label: 'Descreva em poucas palavras', placeholder: 'ex: balançar na rede', maxLength: 40 }],
      confirmLabel: 'Adicionar',
      validate: (v) => (v.item ? null : 'Escreva algo curto'),
    });
    if (r) {
      setCalmingOptions((o) => (o.includes(r.item) ? o : [...o, r.item]));
      setCalming((c) => (c.includes(r.item) ? c : [...c, r.item]));
    }
  };

  const addChild = async () => {
    const child = await askChild(prompt);
    if (child) setOthers((o) => [...o, child]);
  };

  const onContinue = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Informe o nome ou apelido';
    const n = Number(age);
    if (!Number.isInteger(n) || n < 0 || n > 25) e.age = 'Idade inválida';
    setErrors(e);
    if (e.name || e.age) return;
    const main: Child = { id: first?.id ?? 'teo', name: name.trim(), age: n, diagnosis: consent ? diagnosis : 'não informado' };
    setState((s) => ({ ...s, children: [main, ...others], activeChildId: main.id, calmingThings: calming }));
    navigation.navigate('Personalize2e');
  };

  return (
    <OnboardingShell step={4} title="Sobre seu filho ou filha" subtitle="Com ou sem laudo, o app funciona do mesmo jeito." footer={<Button label="Continuar" onPress={onContinue} />}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 2 }}>
          <TextField label="Nome ou apelido" value={name} onChangeText={setName} placeholder="ex: Téo" autoCapitalize="words" maxLength={30} error={errors.name} />
        </View>
        <View style={{ flex: 1 }}>
          <TextField label="Idade" value={age} onChangeText={(v) => setAge(v.replace(/\D/g, ''))} placeholder="7" keyboardType="number-pad" maxLength={2} error={errors.age} />
        </View>
      </View>

      <View>
        <FieldLabel>Diagnóstico</FieldLabel>
        <View style={{ gap: 8 }}>
          {DIAGNOSES.map((d) => (
            <RadioRow key={d} label={d} selected={diagnosis === d} onPress={() => setDiagnosis(d)} />
          ))}
        </View>
      </View>

      <Card padding={18}>
        <Pressable onPress={() => setConsent((c) => !c)} accessibilityRole="checkbox" accessibilityState={{ checked: consent }} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 7,
              borderWidth: 1.5,
              borderColor: consent ? colors.accent2 : palette.hint,
              backgroundColor: consent ? colors.accent2 : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {consent ? <Check size={14} color="#fff" strokeWidth={3} /> : null}
          </View>
          <Text style={[type.body, { flex: 1, fontSize: 13.5, color: palette.text, lineHeight: 20 }]}>
            Autorizo o uso do diagnóstico do meu filho para personalizar rotina, trilhas e sugestões dentro do app.
          </Text>
        </Pressable>
        <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: palette.divider }]}>
          Usamos esse dado só para isso. Não compartilhamos com terceiros. Você pode apagar quando quiser em Perfil {'>'} Privacidade.
        </Text>
      </Card>

      <View>
        <FieldLabel>O que costuma acalmar</FieldLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {calmingOptions.map((c) => (
            <Chip key={c} label={c} selected={calming.includes(c)} onPress={() => toggleCalming(c)} />
          ))}
          <Chip label="+ outro" dashed onPress={addCalming} />
        </View>
        <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, marginTop: 10, lineHeight: 17 }]}>
          Isso aparece no Modo Crise, quando você mais precisa lembrar. Opcional.
        </Text>
      </View>

      {others.length > 0 && (
        <View style={{ gap: 8 }}>
          <FieldLabel>Outros filhos</FieldLabel>
          {others.map((c) => (
            <View key={c.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: radii.md, paddingLeft: 15 }}>
              <Text style={[type.body, { flex: 1, color: palette.text }]}>
                {c.name} · {c.age} anos
              </Text>
              <Pressable onPress={() => setOthers((o) => o.filter((x) => x.id !== c.id))} accessibilityLabel={`Remover ${c.name}`} style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
                <X size={17} color={palette.hint} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <Pressable
        onPress={addChild}
        accessibilityRole="button"
        style={({ pressed }) => ({ borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: radii.lg, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.6 : 1 })}
      >
        <Plus size={18} color={colors.accent2} strokeWidth={2} />
        <View>
          <Text style={[type.body, { fontSize: 14, color: palette.text }]}>Adicionar outro filho</Text>
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 2 }]}>quantos precisar, em qualquer plano</Text>
        </View>
      </Pressable>
    </OnboardingShell>
  );
}
