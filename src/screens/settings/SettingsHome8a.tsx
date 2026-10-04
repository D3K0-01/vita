import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { Avatar } from '../../components/Avatar';
import { useApp } from '../../state/AppContext';

function Row({ title, sub, onPress, last }: { title: string; sub?: string; onPress?: () => void; last?: boolean }) {
  const { palette, type } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15, paddingHorizontal: 17, borderTopWidth: last === undefined ? 1 : last ? 1 : 1, borderTopColor: palette.divider }}
    >
      <View style={{ flex: 1 }}>
        <Text style={[type.body, { fontSize: 14, color: palette.text }]}>{title}</Text>
        {sub ? <Text style={[type.caption, { fontSize: 11, color: palette.textFaint, opacity: 0.85, marginTop: 2 }]}>{sub}</Text> : null}
      </View>
      <ChevronRight size={16} color={palette.hint} />
    </Pressable>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  const { palette, type } = useTheme();
  return (
    <View>
      <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 9 }]}>{label}</Text>
      <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, overflow: 'hidden' }}>{children}</View>
    </View>
  );
}

export default function SettingsHome8a({ navigation }: any) {
  const { palette, colors, type } = useTheme();
  const { state } = useApp();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40, gap: 18 }}>
        <Pressable onPress={() => navigation.getParent()?.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ChevronLeft size={20} color={palette.text} strokeWidth={2} />
          <Text style={[type.cardTitle, { color: palette.text, fontSize: 15 }]}>Perfil e ajustes</Text>
        </Pressable>

        <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Avatar person="camila" name={state.parentName} size={48} />
          <View style={{ flex: 1 }}>
            <Text style={[type.title, { color: palette.text, fontSize: 20 }]}>{state.parentName}</Text>
            <Text style={[type.caption, { fontSize: 12, color: palette.textMuted, opacity: 0.75, marginTop: 2 }]}>camila@email.com · plano {state.plan === 'plus' ? 'Plus' : 'Base'}</Text>
          </View>
          <ChevronRight size={16} color={palette.hint} />
        </View>

        <Section label="Conta">
          <Row title="Nome e e-mail" />
          <Row title="Senha e acesso" />
          <Row title="Contato de confiança" sub={state.trustedContact ? `${state.trustedContact.name} · ${state.trustedContact.relation} · usado no Modo Crise` : 'nenhum contato salvo ainda'} />
        </Section>

        <View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 9 }}>
            <Text style={[type.eyebrow, { color: palette.hint }]}>Filhos</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Plus size={12} color={colors.accent2} strokeWidth={2} />
              <Text style={[type.bodySm, { fontSize: 12, color: colors.accent2, fontFamily: 'Lexend_500Medium' }]}>adicionar</Text>
            </View>
          </View>
          <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15 }}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.pastelGreen, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 13, color: colors.darkAzure }}>T</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.body, { fontSize: 14.5, color: palette.text }]}>{state.childName}</Text>
                <Text style={[type.caption, { fontSize: 11, color: palette.textFaint, opacity: 0.85, marginTop: 2 }]}>{state.childAge} anos · {state.diagnoses[0] ?? '—'}</Text>
              </View>
              <ChevronRight size={16} color={palette.hint} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, borderTopWidth: 1, borderTopColor: palette.divider }}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.greyAzure + '4D', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 13, color: colors.darkAzure }}>L</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.body, { fontSize: 14.5, color: palette.text }]}>Lia</Text>
                <Text style={[type.caption, { fontSize: 11, color: palette.textFaint, opacity: 0.85, marginTop: 2 }]}>12 anos · em investigação</Text>
              </View>
              <ChevronRight size={16} color={palette.hint} />
            </View>
          </View>
        </View>

        <Section label="Preferências">
          <Row title="Notificações" sub="rotina, comunidade, lembretes" onPress={() => navigation.navigate('Notifications8b')} />
          <Row title="Acessibilidade" sub="tamanho do texto, estímulo visual reduzido" onPress={() => navigation.navigate('Accessibility8c')} />
        </Section>

        <View>
          <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 9 }]}>Assinatura</Text>
          <Pressable
            onPress={() => navigation.navigate('PlansStack')}
            style={{ backgroundColor: colors.pastelGreen, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}
          >
            <View style={{ flex: 1 }}>
              <Text style={[type.cardTitle, { color: colors.darkAzure, fontSize: 15 }]}>Plano atual: {state.plan === 'plus' ? 'Plus' : 'Base'}</Text>
              <Text style={[type.caption, { fontSize: 11.5, color: colors.darkAzure, opacity: 0.75, marginTop: 3 }]}>ver planos e o que muda no Plus</Text>
            </View>
            <ChevronRight size={16} color={colors.darkAzure} />
          </Pressable>
        </View>

        <Section label="Sobre">
          <Row title="Privacidade e seus dados (LGPD)" />
          <Row title="Central de ajuda" />
          <Row title="Falar com o suporte" />
        </Section>

        <View style={{ alignItems: 'center', marginTop: 6 }}>
          <Text style={[type.body, { fontSize: 14, color: palette.text, opacity: 0.75 }]}>Sair da conta</Text>
          <Text style={[type.caption, { fontSize: 11, color: palette.textFaint, opacity: 0.7, marginTop: 8 }]}>versão 1.0 · seus dados continuam salvos</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
