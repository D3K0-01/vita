import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { OnboardingShell, FieldLabel, TextInputLike } from './OnboardingShell';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Card } from '../../components/Card';
import { useApp } from '../../state/AppContext';

const DIAGNOSES = ['TDAH', 'TEA', 'Em investigação', 'Prefiro não informar agora'];
const CALMING = ['abraço apertado', 'música', 'objeto favorito', 'silêncio', 'ficar sozinho'];

function RadioRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { palette, colors, type, radii } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: selected ? palette.chipSelectedBg : palette.surface,
        borderWidth: 1,
        borderColor: selected ? colors.accent1 : palette.chipBorder,
        borderRadius: radii.md,
        padding: 14,
      }}
    >
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          borderWidth: selected ? 5 : 1.5,
          borderColor: selected ? colors.accent2 : palette.hint,
          backgroundColor: '#fff',
        }}
      />
      <Text style={[type.body, { fontSize: 14, color: palette.text, fontFamily: selected ? undefined : undefined }]}>{label}</Text>
    </Pressable>
  );
}

export default function AboutChild2d({ navigation }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { setState } = useApp();
  const [diagnosis, setDiagnosis] = useState('TDAH');
  const [consent, setConsent] = useState(true);
  const [calming, setCalming] = useState<string[]>(['abraço apertado', 'objeto favorito']);

  const toggleCalming = (c: string) => setCalming((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const onContinue = () => {
    setState((s) => ({ ...s, diagnoses: [diagnosis], calmingThings: calming }));
    navigation.navigate('Personalize2e');
  };

  return (
    <OnboardingShell
      step={4}
      title="Sobre seu filho ou filha"
      subtitle="Com ou sem laudo, o app funciona do mesmo jeito."
      footer={<Button label="Continuar" onPress={onContinue} />}
    >
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 2 }}>
          <FieldLabel>Nome ou apelido</FieldLabel>
          <TextInputLike value="Téo" />
        </View>
        <View style={{ flex: 1 }}>
          <FieldLabel>Idade</FieldLabel>
          <TextInputLike value="7" />
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
        <Pressable onPress={() => setConsent((c) => !c)} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 7,
              borderWidth: 1.5,
              borderColor: consent ? colors.accent2 : palette.hint,
              backgroundColor: consent ? colors.accent2 : 'transparent',
            }}
          />
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
          {CALMING.map((c) => (
            <Chip key={c} label={c} selected={calming.includes(c)} onPress={() => toggleCalming(c)} />
          ))}
          <Chip label="+ outro" dashed />
        </View>
        <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5, marginTop: 10, lineHeight: 17 }]}>
          Isso aparece no Modo Crise, quando você mais precisa lembrar. <Text style={{ opacity: 0.8 }}>opcional · pode pular</Text>
        </Text>
      </View>

      <Pressable style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder, borderRadius: radii.lg, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Plus size={18} color={colors.accent2} strokeWidth={2} />
        <View>
          <Text style={[type.body, { fontSize: 14, color: palette.text }]}>Adicionar outro filho</Text>
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 2 }]}>quantos precisar, em qualquer plano</Text>
        </View>
      </Pressable>
    </OnboardingShell>
  );
}
