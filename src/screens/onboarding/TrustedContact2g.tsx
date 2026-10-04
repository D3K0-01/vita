import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { OnboardingShell, FieldLabel, TextInputLike } from './OnboardingShell';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { useApp } from '../../state/AppContext';

const RELATIONS = ['parceiro(a)', 'mãe/pai', 'irmã(o)', 'amiga(o)', 'outro'];

export default function TrustedContact2g({ navigation }: any) {
  const { palette, type, radii } = useTheme();
  const { setState } = useApp();
  const [relation, setRelation] = useState('irmã(o)');

  const save = (skip?: boolean) => {
    if (!skip) {
      setState((s) => ({ ...s, trustedContact: { name: 'Marina', relation, phone: '(11) 98765-4321' } }));
    }
    navigation.navigate('PlansIntro2f');
  };

  return (
    <OnboardingShell
      step={6}
      title="Alguém para chamar em um dia difícil"
      subtitle="Uma pessoa que você ligaria numa emergência. Fica salva no Modo Crise, a um toque."
      footer={
        <>
          <Button label="Salvar contato" onPress={() => save(false)} />
          <Button label="Configurar depois" variant="ghost" onPress={() => save(true)} />
        </>
      }
    >
      <View>
        <FieldLabel>Nome</FieldLabel>
        <TextInputLike placeholder="ex: Marina" />
      </View>
      <View>
        <FieldLabel>Vínculo</FieldLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {RELATIONS.map((r) => (
            <Chip key={r} label={r} selected={relation === r} onPress={() => setRelation(r)} />
          ))}
        </View>
      </View>
      <View>
        <FieldLabel>Telefone</FieldLabel>
        <TextInputLike placeholder="(00) 00000-0000" />
      </View>
      <View style={{ backgroundColor: palette.hint + '29', borderRadius: radii.lg, padding: 16 }}>
        <Text style={[type.caption, { color: palette.text, fontSize: 12.5, lineHeight: 20, opacity: 0.85 }]}>Só você vê esse contato. Nada é enviado sem você tocar.</Text>
      </View>
    </OnboardingShell>
  );
}
