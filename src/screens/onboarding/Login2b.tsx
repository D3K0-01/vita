import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { OnboardingShell } from './OnboardingShell';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function Login2b({ navigation, route }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { state, setState, completeOnboarding } = useApp();
  const { prompt, toast } = useUI();
  const [tab, setTab] = useState<'entrar' | 'criar'>(route.params?.mode ?? 'criar');
  const [email, setEmail] = useState(state.email);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = () => {
    const e: typeof errors = {};
    if (!isEmail(email)) e.email = 'Digite um e-mail válido, ex: nome@email.com';
    if (password.length < 6) e.password = 'A senha precisa ter pelo menos 6 caracteres';
    setErrors(e);
    if (e.email || e.password) return;
    setState((s) => ({ ...s, email: email.trim() }));
    // Protótipo: não há servidor de contas. "Entrar" volta para o app com os
    // dados salvos no aparelho; "Criar conta" segue o cadastro.
    if (tab === 'entrar') completeOnboarding();
    else navigation.navigate('WhoAreYou2c');
  };

  const social = (provider: string) => {
    toast(`Login com ${provider} simulado no protótipo`);
    if (tab === 'entrar') completeOnboarding();
    else navigation.navigate('WhoAreYou2c');
  };

  const forgot = async () => {
    const r = await prompt({
      title: 'Recuperar senha',
      message: 'Enviamos um link para você criar uma senha nova.',
      fields: [{ key: 'email', label: 'E-mail', placeholder: 'seu@email.com', initial: email, keyboardType: 'email-address' }],
      confirmLabel: 'Enviar link',
      validate: (v) => (isEmail(v.email) ? null : 'Digite um e-mail válido'),
    });
    if (r) toast(`Link enviado para ${r.email} (simulado)`);
  };

  return (
    <OnboardingShell
      step={2}
      title={tab === 'entrar' ? 'Que bom te ver de novo' : 'Vamos começar juntos'}
      subtitle="Sua conta guarda a rotina e o histórico da família."
      footer={
        <>
          <Button label={tab === 'entrar' ? 'Entrar' : 'Criar conta'} onPress={submit} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: palette.divider }} />
            <Text style={[type.caption, { color: palette.textFaint, fontSize: 12 }]}>ou</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: palette.divider }} />
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button label="Google" variant="secondary" onPress={() => social('Google')} style={{ flex: 1 }} />
            <Button label="Apple" variant="secondary" onPress={() => social('Apple')} style={{ flex: 1 }} />
          </View>
          <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, textAlign: 'center' }]}>
            Ao continuar você aceita os termos e a política de privacidade.
          </Text>
        </>
      }
    >
      <View style={{ flexDirection: 'row', backgroundColor: palette.hint + '29', borderRadius: radii.md, padding: 4 }}>
        {(['criar', 'entrar'] as const).map((t) => (
          <Pressable
            key={t}
            onPress={() => {
              setTab(t);
              setErrors({});
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === t }}
            style={{ flex: 1, paddingVertical: 11, borderRadius: 11, alignItems: 'center', backgroundColor: tab === t ? palette.surface : 'transparent' }}
          >
            <Text style={[type.bodySm, { fontSize: 13.5, color: palette.text, fontFamily: tab === t ? 'Lexend_500Medium' : 'Lexend_400Regular' }]}>
              {t === 'entrar' ? 'Entrar' : 'Criar conta'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ gap: 16 }}>
        <TextField
          label="E-mail"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setErrors((e) => ({ ...e, email: undefined }));
          }}
          placeholder="camila@email.com"
          keyboardType="email-address"
          autoComplete="email"
          error={errors.email}
        />
        <TextField
          label="Senha"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setErrors((e) => ({ ...e, password: undefined }));
          }}
          placeholder={tab === 'criar' ? 'mínimo de 6 caracteres' : 'sua senha'}
          password
          autoComplete={tab === 'criar' ? 'new-password' : 'current-password'}
          onSubmitEditing={submit}
          error={errors.password}
        />
        {tab === 'entrar' && (
          <Pressable onPress={forgot} hitSlop={8} style={{ alignSelf: 'flex-start', paddingVertical: 4 }}>
            <Text style={[type.caption, { color: colors.accent2, fontSize: 13, fontFamily: 'Lexend_500Medium' }]}>Esqueci minha senha</Text>
          </Pressable>
        )}
      </View>
    </OnboardingShell>
  );
}
