import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Eye } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { OnboardingShell, FieldLabel, TextInputLike } from './OnboardingShell';
import { Button } from '../../components/Button';

export default function Login2b({ navigation }: any) {
  const { palette, colors, type, radii } = useTheme();
  const [tab, setTab] = useState<'entrar' | 'criar'>('entrar');

  return (
    <OnboardingShell
      step={2}
      title="Vamos começar juntos"
      subtitle="Sua conta guarda a rotina e o histórico da família."
      footer={
        <>
          <Button label={tab === 'entrar' ? 'Entrar' : 'Criar conta'} onPress={() => navigation.navigate('WhoAreYou2c')} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: palette.divider }} />
            <Text style={[type.caption, { color: palette.textFaint, fontSize: 12 }]}>ou</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: palette.divider }} />
          </View>
          <Button label="Continuar com Google" variant="secondary" onPress={() => navigation.navigate('WhoAreYou2c')} />
          <Button label="Continuar com Apple" variant="secondary" onPress={() => navigation.navigate('WhoAreYou2c')} />
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, textAlign: 'center', opacity: 0.85 }]}>
            Ao continuar você aceita os termos e a política de privacidade.
          </Text>
        </>
      }
    >
      <View style={{ flexDirection: 'row', backgroundColor: palette.hint + '29', borderRadius: radii.md, padding: 4 }}>
        {(['entrar', 'criar'] as const).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 11,
              alignItems: 'center',
              backgroundColor: tab === t ? palette.surface : 'transparent',
            }}
          >
            <Text style={[type.bodySm, { fontSize: 13.5, color: palette.text, fontFamily: tab === t ? undefined : undefined }]}>
              {t === 'entrar' ? 'Entrar' : 'Criar conta'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ gap: 16 }}>
        <View>
          <FieldLabel>E-mail</FieldLabel>
          <TextInputLike placeholder="camila@email.com" />
        </View>
        <View>
          <FieldLabel>Senha</FieldLabel>
          <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.chipBorder, borderRadius: radii.md, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 15, letterSpacing: 3, opacity: 0.55, color: palette.text }}>••••••••</Text>
            <Eye size={19} color={palette.hint} strokeWidth={1.8} />
          </View>
        </View>
        <Text style={[type.caption, { color: colors.accent2, fontSize: 12.5 }]}>Esqueci minha senha</Text>
      </View>
    </OnboardingShell>
  );
}
