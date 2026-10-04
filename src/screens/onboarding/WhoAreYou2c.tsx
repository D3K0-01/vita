import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { TextField } from '../../components/TextField';
import { useApp } from '../../state/AppContext';
import { OnboardingShell, FieldLabel } from './OnboardingShell';

const VINCULOS = ['mãe', 'pai', 'responsável legal', 'outro'];
const DIAGNOSTICOS = ['TDAH', 'TEA', 'TDAH + TEA', 'outro'];

export default function WhoAreYou2c({ navigation }: any) {
  const { palette, type } = useTheme();
  const { state, setState } = useApp();
  const [name, setName] = useState(state.parentName);
  const [vinculo, setVinculo] = useState(state.relation || 'mãe');
  const [diagnostico, setDiagnostico] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const next = (skip?: boolean) => {
    if (!skip && !name.trim()) {
      setError('Como podemos te chamar?');
      return;
    }
    if (!skip) setState((s) => ({ ...s, parentName: name.trim(), relation: vinculo }));
    navigation.navigate('AboutChild2d');
  };

  return (
    <OnboardingShell
      step={3}
      title="Quem é você?"
      subtitle="Só o essencial. Você pode mudar isso depois."
      footer={
        <>
          <Button label="Continuar" onPress={() => next()} />
          <Button label="Pular por agora" variant="ghost" onPress={() => next(true)} />
        </>
      }
    >
      <TextField
        label="Como podemos te chamar"
        value={name}
        onChangeText={(v) => {
          setName(v);
          setError(null);
        }}
        placeholder="seu nome ou apelido"
        autoCapitalize="words"
        maxLength={40}
        error={error}
      />

      <View>
        <FieldLabel>Seu vínculo com a criança</FieldLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {VINCULOS.map((v) => (
            <Chip key={v} label={v} selected={vinculo === v} onPress={() => setVinculo(v)} />
          ))}
        </View>
      </View>

      <Card>
        <Text style={[type.cardTitle, { color: palette.text, fontSize: 17 }]}>Você também se identifica com algum diagnóstico?</Text>
        <Text style={[type.caption, { color: palette.textMuted, marginTop: 6, fontSize: 12.5 }]}>Opcional. Ajuda a ajustar o ritmo do app pra você.</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {DIAGNOSTICOS.map((d) => (
            <Chip key={d} label={d} selected={diagnostico === d} onPress={() => setDiagnostico(diagnostico === d ? null : d)} />
          ))}
        </View>
        <Pressable onPress={() => setDiagnostico(null)} hitSlop={8} style={{ alignSelf: 'flex-start', marginTop: 12, paddingVertical: 4 }}>
          <Text style={[type.caption, { color: palette.hint, fontSize: 12.5 }]}>prefiro não informar</Text>
        </Pressable>
      </Card>
    </OnboardingShell>
  );
}
