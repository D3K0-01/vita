import React from 'react';
import { View, Text } from 'react-native';
import { Bell, Accessibility, ShieldCheck, LifeBuoy, PlayCircle, MessageSquare, UserRound } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { useTour } from '../../components/tour/Tour';
import { useApp } from '../../state/AppContext';
import { Row, Section, CrossLink } from './SettingsParts';

// Configurações (engrenagem na Home): como o app funciona para você —
// notificações, acessibilidade, privacidade e ajuda. Conta, filhos e plano
// ficam no Perfil (foto na Home).
export default function SettingsHome8a({ navigation }: any) {
  const { palette, type } = useTheme();
  const { state } = useApp();
  const { start } = useTour();
  const p = state.prefs;
  const icon = (I: typeof Bell) => <I size={18} color={palette.text} strokeWidth={1.8} />;

  const a11y = [p.reducedStimulus ? 'menos estímulos' : null, p.noAnimations ? 'sem animações' : null].filter(Boolean);

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 18 }}>
      <BackHeader title="Configurações" onBack={() => (navigation.getState().index > 0 ? navigation.goBack() : navigation.getParent()?.goBack())} />

      <Section label="Preferências">
        <Row first icon={icon(Bell)} title="Notificações" sub="rotina, comunidade, lembretes" onPress={() => navigation.navigate('Notifications8b')} />
        <Row icon={icon(Accessibility)} title="Acessibilidade" sub={a11y.length ? a11y.join(' · ') : 'tamanho do texto, contraste, modo escuro'} onPress={() => navigation.navigate('Accessibility8c')} />
      </Section>

      <Section label="Privacidade">
        <Row first icon={icon(ShieldCheck)} title="Privacidade e seus dados (LGPD)" sub="baixar, apagar dados e recomeçar a demonstração" onPress={() => navigation.navigate('Privacy')} />
      </Section>

      <Section label="Ajuda">
        <Row first icon={icon(LifeBuoy)} title="Central de ajuda" sub="perguntas frequentes" onPress={() => navigation.navigate('Help')} />
        <Row icon={icon(PlayCircle)} title="Rever o tour do app" sub="a apresentação rápida das telas" onPress={start} />
        <Row icon={icon(MessageSquare)} title="Falar com o suporte" onPress={() => navigation.navigate('Support')} />
      </Section>

      <CrossLink
        title="Seu perfil"
        sub="conta, filhos, rede de apoio, registros e plano"
        icon={<UserRound size={18} color={palette.text} strokeWidth={1.8} />}
        onPress={() => navigation.navigate('ProfileHome')}
      />

      <View style={{ alignItems: 'center', marginTop: 4 }}>
        <Text style={[type.caption, { fontSize: 11, color: palette.textFaint }]}>Vita · versão 1.1</Text>
      </View>
    </ScreenContainer>
  );
}
