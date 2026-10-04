import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { TextField } from '../../components/TextField';
import { useApp } from '../../state/AppContext';
import { formatPhone } from '../../utils/format';
import { OnboardingShell, FieldLabel } from './OnboardingShell';

export const RELATIONS = ['parceiro(a)', 'mãe/pai', 'irmã(o)', 'amiga(o)', 'outro'];

export default function TrustedContact2g({ navigation }: any) {
  const { palette, type, radii } = useTheme();
  const { state, setState } = useApp();
  const [name, setName] = useState(state.trustedContact?.name ?? '');
  const [phone, setPhone] = useState(state.trustedContact?.phone ?? '');
  const [relation, setRelation] = useState(state.trustedContact?.relation ?? 'irmã(o)');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const save = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Informe o nome';
    if (phone.replace(/\D/g, '').length < 10) e.phone = 'Telefone com DDD, ex: (11) 98765-4321';
    setErrors(e);
    if (e.name || e.phone) return;
    setState((s) => ({ ...s, trustedContact: { name: name.trim(), relation, phone } }));
    navigation.navigate('PlansIntro2f');
  };

  return (
    <OnboardingShell
      step={6}
      title="Alguém para chamar em um dia difícil"
      subtitle="Uma pessoa que você ligaria numa emergência. Fica salva no Modo Crise, a um toque."
      footer={
        <>
          <Button label="Salvar contato" onPress={save} />
          <Button label="Configurar depois" variant="ghost" onPress={() => navigation.navigate('PlansIntro2f')} />
        </>
      }
    >
      <TextField label="Nome" value={name} onChangeText={setName} placeholder="ex: Marina" autoCapitalize="words" maxLength={40} error={errors.name} />
      <View>
        <FieldLabel>Vínculo</FieldLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {RELATIONS.map((r) => (
            <Chip key={r} label={r} selected={relation === r} onPress={() => setRelation(r)} />
          ))}
        </View>
      </View>
      <TextField label="Telefone" value={phone} onChangeText={(v) => setPhone(formatPhone(v))} placeholder="(00) 00000-0000" keyboardType="phone-pad" maxLength={15} error={errors.phone} />
      <View style={{ backgroundColor: palette.hint + '29', borderRadius: radii.lg, padding: 16 }}>
        <Text style={[type.caption, { color: palette.text, fontSize: 12.5, lineHeight: 20, opacity: 0.85 }]}>Só você vê esse contato. Nada é enviado sem você tocar.</Text>
      </View>
    </OnboardingShell>
  );
}
