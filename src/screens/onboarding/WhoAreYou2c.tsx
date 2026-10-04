import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { OnboardingShell, FieldLabel, TextInputLike } from './OnboardingShell';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Card } from '../../components/Card';

const VINCULOS = ['mãe', 'pai', 'responsável legal', 'outro'];
const DIAGNOSTICOS = ['TDAH', 'TEA', 'TDAH + TEA', 'outro'];

export default function WhoAreYou2c({ navigation }: any) {
  const { palette, type } = useTheme();
  const [vinculo, setVinculo] = useState('mãe');
  const [diagnostico, setDiagnostico] = useState<string | null>(null);

  return (
    <OnboardingShell
      step={3}
      title="Quem é você?"
      subtitle="Só o essencial. Você pode mudar isso depois."
      footer={
        <>
          <Button label="Continuar" onPress={() => navigation.navigate('AboutChild2d')} />
          <Button label="Pular por agora" variant="ghost" onPress={() => navigation.navigate('AboutChild2d')} />
        </>
      }
    >
      <View>
        <FieldLabel>Como podemos te chamar</FieldLabel>
        <TextInputLike value="Camila" />
      </View>

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
            <Chip key={d} label={d} selected={diagnostico === d} onPress={() => setDiagnostico(d)} />
          ))}
        </View>
        <Text onPress={() => setDiagnostico(null)} style={[type.caption, { color: palette.hint, marginTop: 12, fontSize: 12.5 }]}>
          prefiro não informar
        </Text>
      </Card>
    </OnboardingShell>
  );
}
