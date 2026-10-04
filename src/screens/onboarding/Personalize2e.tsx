import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { OnboardingShell } from './OnboardingShell';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Card } from '../../components/Card';
import { useApp } from '../../state/AppContext';

function Question({ title, options, value, onChange }: { title: string; options: string[]; value: string | null; onChange: (v: string) => void }) {
  const { palette, type } = useTheme();
  return (
    <Card padding={18}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={[type.cardTitle, { color: palette.text, fontSize: 16 }]}>{title}</Text>
        <Text onPress={() => onChange('')} style={[type.caption, { color: palette.hint, fontSize: 12.5 }]}>
          pular
        </Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
        {options.map((o) => (
          <Chip key={o} label={o} selected={value === o} onPress={() => onChange(o)} />
        ))}
      </View>
    </Card>
  );
}

export default function Personalize2e({ navigation }: any) {
  const { completeOnboarding } = useApp();
  const [challenge, setChallenge] = useState<string | null>('rotina');
  const [routine, setRoutine] = useState<string | null>('em construção');
  const [likes, setLikes] = useState<string | null>('música');

  return (
    <OnboardingShell
      step={5}
      title="O que ajudaria mais agora?"
      subtitle="Pode pular qualquer pergunta. Nada aqui é obrigatório."
      footer={
        <>
          <Button label="Continuar" onPress={() => navigation.navigate('TrustedContact2g')} />
          <Button label="Pular tudo e ir para a Home" variant="ghost" onPress={() => completeOnboarding()} />
        </>
      }
    >
      <Question title="Qual o maior desafio hoje?" options={['rotina', 'comportamento', 'sono', 'alimentação', 'social', 'outro']} value={challenge} onChange={setChallenge} />
      <Question title="Como é a rotina hoje?" options={['organizada', 'caótica', 'em construção']} value={routine} onChange={setRoutine} />
      <Question title="Do que o Téo gosta?" options={['música', 'dinossauros', 'desenhar', 'água / banho', 'carrinhos']} value={likes} onChange={setLikes} />
    </OnboardingShell>
  );
}
