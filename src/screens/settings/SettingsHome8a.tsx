import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight, Plus, LogOut, Camera } from 'lucide-react-native';
import { pickProfilePhoto } from '../../utils/pickImage';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { Avatar } from '../../components/Avatar';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';

function Row({ title, sub, onPress, first }: { title: string; sub?: string; onPress: () => void; first?: boolean }) {
  const { palette, type } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        minHeight: 56,
        paddingVertical: 13,
        paddingHorizontal: 17,
        borderTopWidth: first ? 0 : 1,
        borderTopColor: palette.divider,
        backgroundColor: pressed ? palette.chipSelectedBg : 'transparent',
      })}
    >
      <View style={{ flex: 1 }}>
        <Text style={[type.body, { fontSize: 14.5, color: palette.text }]}>{title}</Text>
        {sub ? <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 2 }]}>{sub}</Text> : null}
      </View>
      <ChevronRight size={16} color={palette.hint} />
    </Pressable>
  );
}

function Section({ label, right, children }: { label: string; right?: React.ReactNode; children: React.ReactNode }) {
  const { palette, type } = useTheme();
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, minHeight: 28 }}>
        <Text style={[type.eyebrow, { color: palette.hint }]}>{label}</Text>
        {right}
      </View>
      <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, overflow: 'hidden' }}>{children}</View>
    </View>
  );
}

export default function SettingsHome8a({ navigation }: any) {
  const { palette, colors, type } = useTheme();
  const { state, logout, setState } = useApp();
  const { confirm, choose, toast } = useUI();

  const photoMenu = () =>
    choose('Foto de perfil', [
      {
        label: state.photo ? 'Escolher outra foto' : 'Escolher foto da galeria',
        onPress: async () => {
          const uri = await pickProfilePhoto();
          if (uri) {
            setState((s) => ({ ...s, photo: uri }));
            toast('Foto atualizada');
          }
        },
      },
      ...(state.photo
        ? [
            {
              label: 'Remover foto',
              destructive: true,
              onPress: () => {
                setState((s) => ({ ...s, photo: null }));
                toast('Foto removida');
              },
            },
          ]
        : []),
    ]);

  const signOut = async () => {
    if (await confirm({ title: 'Sair da conta?', message: 'Seus dados continuam salvos neste aparelho para quando você voltar.', confirmLabel: 'Sair' })) logout();
  };

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 18 }}>
      <BackHeader title="Perfil e ajustes" onBack={() => navigation.getParent()?.goBack()} />

      <Pressable
        onPress={() => navigation.navigate('EditProfile')}
        accessibilityHint="Abre nome e e-mail"
        style={({ pressed }) => ({ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, opacity: pressed ? 0.8 : 1 })}
      >
        <Pressable onPress={photoMenu} accessibilityRole="button" accessibilityLabel="Trocar foto de perfil" hitSlop={6}>
          <Avatar person="me" name={state.parentName} size={56} />
          <View style={{ position: 'absolute', right: -2, bottom: -2, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.darkAzure, borderWidth: 2, borderColor: palette.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={12} color={colors.offWhite} />
          </View>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[type.title, { color: palette.text, fontSize: 20 }]}>{state.parentName}</Text>
          <Text style={[type.caption, { fontSize: 12, color: palette.textMuted, marginTop: 2 }]} numberOfLines={1}>
            {state.email || 'e-mail não informado'} · plano {state.plan === 'plus' ? 'Plus' : 'Base'}
          </Text>
        </View>
        <ChevronRight size={16} color={palette.hint} />
      </Pressable>

      <Section label="Conta">
        <Row first title="Nome e e-mail" onPress={() => navigation.navigate('EditProfile')} />
        <Row title="Senha e acesso" onPress={() => navigation.navigate('Security')} />
        <Row
          title="Contato de confiança"
          sub={state.trustedContact ? `${state.trustedContact.name} · ${state.trustedContact.relation} · usado no Modo Crise` : 'nenhum contato salvo ainda'}
          onPress={() => navigation.navigate('TrustedContactEdit')}
        />
      </Section>

      <Section
        label="Filhos"
        right={
          <Pressable onPress={() => navigation.navigate('EditChild')} accessibilityRole="button" hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 }}>
            <Plus size={13} color={colors.accent2} strokeWidth={2.2} />
            <Text style={[type.bodySm, { fontSize: 12.5, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>adicionar</Text>
          </Pressable>
        }
      >
        {state.children.map((c, i) => (
          <Pressable
            key={c.id}
            onPress={() => navigation.navigate('EditChild', { id: c.id })}
            accessibilityRole="button"
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: palette.divider, backgroundColor: pressed ? palette.chipSelectedBg : 'transparent' })}
          >
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: i % 2 ? '#D5E1E5' : colors.pastelGreen, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 14, color: colors.darkAzure }}>{c.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { fontSize: 14.5, color: palette.text }]}>
                {c.name}
                {c.id === state.activeChildId ? '  ·  ativo' : ''}
              </Text>
              <Text style={[type.caption, { fontSize: 11.5, color: palette.textFaint, marginTop: 2 }]}>
                {c.age} anos · {c.diagnosis}
              </Text>
            </View>
            <ChevronRight size={16} color={palette.hint} />
          </Pressable>
        ))}
      </Section>

      <Section label="Atalhos">
        <Row first title="Acompanhamento" sub="semana, mês e relatório para consultas" onPress={() => navigation.getParent()?.navigate('TrackingStack')} />
        <Row title="Diário de crises" sub="registros, padrões e análise com a IA" onPress={() => navigation.getParent()?.navigate('CrisisDiary')} />
        <Row title="Respirar 2 minutos" sub="respiração guiada, sem som" onPress={() => navigation.getParent()?.navigate('Breathing')} />
      </Section>

      <Section label="Preferências">
        <Row first title="Notificações" sub="rotina, comunidade, lembretes" onPress={() => navigation.navigate('Notifications8b')} />
        <Row title="Acessibilidade" sub="tamanho do texto, contraste, modo escuro" onPress={() => navigation.navigate('Accessibility8c')} />
      </Section>

      <View>
        <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 6 }]}>Assinatura</Text>
        <Pressable
          onPress={() => navigation.navigate('PlansStack')}
          accessibilityRole="button"
          style={({ pressed }) => ({ backgroundColor: colors.pastelGreen, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.85 : 1 })}
        >
          <View style={{ flex: 1 }}>
            <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 15 }]}>Plano atual: {state.plan === 'plus' ? 'Plus' : 'Base'}</Text>
            <Text style={[type.caption, { fontSize: 11.5, color: colors.darkAzure, opacity: 0.8, marginTop: 3 }]}>ver planos e o que muda no Plus</Text>
          </View>
          <ChevronRight size={16} color={colors.darkAzure} />
        </Pressable>
      </View>

      <Section label="Sobre">
        <Row first title="Privacidade e seus dados (LGPD)" onPress={() => navigation.navigate('Privacy')} />
        <Row title="Central de ajuda" onPress={() => navigation.navigate('Help')} />
        <Row title="Falar com o suporte" onPress={() => navigation.navigate('Support')} />
      </Section>

      <View style={{ alignItems: 'center', marginTop: 4 }}>
        <Pressable onPress={signOut} accessibilityRole="button" style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 48, paddingHorizontal: 16, opacity: pressed ? 0.6 : 1 })}>
          <LogOut size={16} color={palette.text} />
          <Text style={[type.body, { fontSize: 14, color: palette.text }]}>Sair da conta</Text>
        </Pressable>
        <Text style={[type.caption, { fontSize: 11, color: palette.textFaint, marginTop: 4 }]}>versão 1.1 · seus dados continuam salvos</Text>
      </View>
    </ScreenContainer>
  );
}
