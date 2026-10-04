import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronDown, Info, ChevronRight, ArrowUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../state/AppContext';

type Msg = { id: string; from: 'user' | 'ai'; text: string };

const SCRIPTED: Msg[] = [
  { id: 'm1', from: 'user', text: 'O Téo não quer sair de casa para a terapia. Já são 20 minutos assim.' },
  { id: 'm2', from: 'ai', text: 'Dá pra tentar em partes. Primeiro: avisa que vocês saem em 5 minutos e mostra no relógio.' },
  { id: 'm3', from: 'user', text: 'Tentei, ele tampou os ouvidos.' },
  { id: 'm4', from: 'ai', text: 'Isso costuma ser sobrecarga, não recusa. Quer o passo a passo do Modo Crise?' },
];

export default function ChatIA5a({ navigation }: any) {
  const { palette, colors, type, radii } = useTheme();
  const { state } = useApp();
  const [messages, setMessages] = useState<Msg[]>(SCRIPTED);
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    const userMsg: Msg = { id: `u${Date.now()}`, from: 'user', text: draft.trim() };
    setDraft('');
    setMessages((m) => [
      ...m,
      userMsg,
      { id: `a${Date.now()}`, from: 'ai', text: 'Entendi. Vamos com calma — um passo de cada vez costuma ajudar mais do que resolver tudo de uma vez.' },
    ]);
  };

  return (
    <ScreenContainer scroll={false} contentStyle={{ paddingHorizontal: 20, paddingTop: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={[type.title, { color: palette.text }]}>Conversar</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={[type.caption, { color: palette.textMuted, fontSize: 12.5, opacity: 0.7 }]}>histórico</Text>
          <ChevronDown size={14} color={palette.hint} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', gap: 6, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, marginTop: 12 }}>
        <Text style={[type.bodySm, { fontSize: 13, color: palette.text }]}>sobre o {state.childName}, {state.childAge}</Text>
        <ChevronDown size={14} color={palette.hint} />
      </View>

      <Pressable
        onPress={() => navigation.navigate('CrisisStack', { screen: state.crisisSession ? 'Resume5e' : 'Triage5b' })}
        style={{ backgroundColor: colors.darkAzure, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12 }}
      >
        <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.offWhite, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 13, color: colors.darkAzure }}>SOS</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.cardTitle, { color: colors.offWhite, fontSize: 16 }]}>Modo Crise</Text>
          <Text style={[type.caption, { color: colors.offWhite, fontSize: 12, opacity: 0.75, marginTop: 2 }]}>passo a passo agora, em 1 toque</Text>
        </View>
        <ChevronRight size={18} color={colors.offWhite} />
      </Pressable>

      <View style={{ flexDirection: 'row', gap: 11, backgroundColor: colors.greyAzure + '29', borderRadius: 14, padding: 13, marginTop: 12 }}>
        <Info size={17} color={colors.darkAzure} strokeWidth={1.8} />
        <Text style={[type.caption, { flex: 1, color: palette.text, fontSize: 12, opacity: 0.8, lineHeight: 18 }]}>
          Esta conversa é um apoio para o dia a dia. Não substitui terapeuta, médico ou psicólogo.
        </Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <View style={{ flex: 1, paddingTop: 16, gap: 12 }}>
          <Text style={[type.caption, { textAlign: 'center', color: palette.textFaint, fontSize: 11, opacity: 0.8 }]}>hoje, 9h38</Text>
          {messages.map((m) => (
            <View
              key={m.id}
              style={{
                alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '84%',
                backgroundColor: m.from === 'user' ? colors.darkAzure : palette.surface,
                borderWidth: m.from === 'ai' ? 1 : 0,
                borderColor: palette.surfaceBorder,
                borderRadius: 18,
                borderBottomRightRadius: m.from === 'user' ? 6 : 18,
                borderBottomLeftRadius: m.from === 'ai' ? 6 : 18,
                padding: 14,
              }}
            >
              <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 14, lineHeight: 21, color: m.from === 'user' ? colors.offWhite : palette.text }}>{m.text}</Text>
            </View>
          ))}

          <View style={{ marginTop: 'auto', paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="escreva do jeito que der…"
              placeholderTextColor={palette.textFaint}
              onSubmitEditing={send}
              style={{ flex: 1, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.chipBorder, borderRadius: 24, padding: 14, fontFamily: 'Lexend_400Regular', fontSize: 14, color: palette.text }}
            />
            <Pressable onPress={send} style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.darkAzure, alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUp size={20} color={colors.offWhite} strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
