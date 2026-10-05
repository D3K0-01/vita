import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { History, Info, ChevronRight, ArrowUp, SquarePen, WifiOff } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { ChildPill } from '../../components/ChildPill';
import { TourTarget } from '../../components/tour/Tour';
import { useUI } from '../../components/UIProvider';
import { useApp, ChatMessage } from '../../state/AppContext';
import { askVita } from '../../services/ai';
import { BASE_DAILY_AI_LIMIT } from '../../config';
import { dateKey, formatDayMonth } from '../../utils/date';

const SUGGESTIONS = ['Como lidar com a hora de dormir?', 'Ele não quer sair de casa para a terapia', 'Dicas para a lição de casa', 'Estou exausta(o) hoje'];

export default function ChatIA5a({ navigation, route }: any) {
  const { palette, colors, type } = useTheme();
  const { state, setState } = useApp();
  const { choose, toast } = useUI();
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const messages = state.chat;

  // "Pedir uma ideia" (Fases) chega aqui com um texto pronto
  useEffect(() => {
    const prefill = route.params?.prefill;
    if (prefill) {
      setDraft(prefill);
      navigation.setParams({ prefill: undefined });
    }
  }, [route.params?.prefill, navigation]);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(t);
  }, [messages.length, loading]);

  const today = dateKey();
  const sentToday = messages.filter((m) => m.from === 'user' && dateKey(new Date(m.date)) === today).length;
  const limitReached = state.plan === 'base' && sentToday >= BASE_DAILY_AI_LIMIT;

  const send = async (textArg?: string) => {
    const text = (textArg ?? draft).trim();
    if (!text || loading) return;
    if (limitReached) {
      choose(`Você usou as ${BASE_DAILY_AI_LIMIT} mensagens de hoje`, [
        { label: 'Conhecer o Plus (IA sem limite)', onPress: () => navigation.navigate('PlansStack') },
        { label: 'Abrir o Modo Crise', hint: 'sempre liberado, em qualquer plano', onPress: () => navigation.navigate('CrisisStack', { screen: 'Triage5b' }) },
      ]);
      return;
    }
    const userMsg: ChatMessage = { id: `u${Date.now()}`, from: 'user', text, date: new Date().toISOString() };
    const history = [...messages, userMsg];
    setDraft('');
    setState((s) => ({ ...s, chat: [...s.chat, userMsg] }));
    setLoading(true);
    const result = await askVita(
      history.map((m) => ({ from: m.from, text: m.text })),
      {
        parentName: state.parentName,
        childName: state.childName,
        childAge: state.childAge,
        diagnosis: state.diagnoses[0] ?? '',
        calmingThings: state.calmingThings,
        mood: state.mood,
      }
    );
    setLoading(false);
    const aiMsg: ChatMessage = { id: `a${Date.now()}`, from: 'ai', text: result.text, date: new Date().toISOString(), offline: result.offline, reason: result.reason };
    setState((s) => ({ ...s, chat: [...s.chat, aiMsg] }));
    if (result.offline && result.reason === 'limite') toast('A IA está ocupada agora. Respondi com uma dica salva no app.');
  };

  const newConversation = () => {
    if (!messages.length) return toast('Esta conversa já está vazia');
    const firstUser = messages.find((m) => m.from === 'user');
    setState((s) => ({
      ...s,
      chatThreads: [
        { id: `th${Date.now()}`, title: (firstUser?.text ?? 'Conversa').slice(0, 48), date: s.chat[0]?.date ?? new Date().toISOString(), messages: s.chat },
        ...s.chatThreads,
      ].slice(0, 20),
      chat: [],
    }));
    toast('Conversa anterior salva no histórico');
  };

  const openHistory = () =>
    choose(
      'Conversas',
      [
        { label: 'Nova conversa', hint: 'a atual vai para o histórico', onPress: newConversation },
        ...state.chatThreads.map((t) => ({
          label: t.title,
          hint: `${formatDayMonth(new Date(t.date))} · ${t.messages.length} mensagens`,
          onPress: () =>
            setState((s) => {
              const current = s.chat.length
                ? [{ id: `th${Date.now()}`, title: (s.chat.find((m) => m.from === 'user')?.text ?? 'Conversa').slice(0, 48), date: s.chat[0].date, messages: s.chat }]
                : [];
              return { ...s, chat: t.messages, chatThreads: [...current, ...s.chatThreads.filter((x) => x.id !== t.id)] };
            }),
        })),
      ],
      state.chatThreads.length ? undefined : 'Nenhuma conversa salva ainda.'
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, gap: 8 }}>
        <Text style={[type.title, { color: palette.text }]}>Chat</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={newConversation} accessibilityRole="button" accessibilityLabel="Nova conversa" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <SquarePen size={19} color={palette.text} strokeWidth={1.8} />
          </Pressable>
          <Pressable onPress={openHistory} accessibilityRole="button" accessibilityLabel="Histórico de conversas" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -10 }}>
            <History size={19} color={palette.text} strokeWidth={1.8} />
          </Pressable>
        </View>
      </View>

      {/* SOS fixo: fica sempre visível, mesmo rolando a conversa */}
      <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: palette.divider }}>
        <Pressable
          onPress={() => navigation.navigate('CrisisStack', { screen: state.crisisSession ? 'Resume5e' : 'Triage5b' })}
          accessibilityRole="button"
          accessibilityLabel="SOS: abrir o Modo Crise"
          style={({ pressed }) => ({ backgroundColor: colors.darkAzure, borderRadius: 16, paddingVertical: 9, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: pressed ? 0.9 : 1 })}
        >
          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.offWhite, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 11, color: colors.darkAzure }}>SOS</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[type.cardTitle, { color: colors.offWhite, fontSize: 15 }]}>Modo Crise</Text>
            <Text style={[type.caption, { color: colors.offWhite, fontSize: 11.5, opacity: 0.8 }]}>passo a passo agora, em 1 toque</Text>
          </View>
          <ChevronRight size={18} color={colors.offWhite} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
          <ChildPill />


          <View style={{ flexDirection: 'row', gap: 10, backgroundColor: colors.greyAzure + '29', borderRadius: 14, padding: 12 }}>
            <Info size={16} color={palette.text} strokeWidth={1.8} />
            <Text style={[type.caption, { flex: 1, color: palette.text, fontSize: 12, lineHeight: 18 }]}>
              Apoio para o dia a dia, com IA. Não substitui terapeuta, médico ou psicólogo. Em emergência, ligue 192.
            </Text>
          </View>

          {messages.length === 0 ? (
            <View style={{ gap: 12, marginTop: 6 }}>
              <View style={{ alignSelf: 'flex-start', maxWidth: '88%', backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, borderBottomLeftRadius: 6, padding: 14 }}>
                <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 14.5, lineHeight: 22, color: palette.text }}>
                  Oi, {state.parentName}. Pode me contar o que está acontecendo com {state.childName}, do jeito que der. Eu ajudo a pensar no próximo passo.
                </Text>
              </View>
              <Text style={[type.eyebrow, { color: palette.hint, marginTop: 6 }]}>Sugestões</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {SUGGESTIONS.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => send(s)}
                    accessibilityRole="button"
                    style={({ pressed }) => ({ borderRadius: 20, borderWidth: 1, borderColor: palette.chipBorder, backgroundColor: pressed ? palette.chipSelectedBg : palette.surface, paddingVertical: 9, paddingHorizontal: 13 })}
                  >
                    <Text style={[type.bodySm, { fontSize: 13, color: palette.text }]}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            messages.map((m) => (
              <View key={m.id} style={{ alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '86%' }}>
                <View
                  style={{
                    backgroundColor: m.from === 'user' ? colors.darkAzure : palette.surface,
                    borderWidth: m.from === 'ai' ? 1 : 0,
                    borderColor: palette.surfaceBorder,
                    borderRadius: 18,
                    borderBottomRightRadius: m.from === 'user' ? 6 : 18,
                    borderBottomLeftRadius: m.from === 'ai' ? 6 : 18,
                    padding: 14,
                  }}
                >
                  <Text selectable style={{ fontFamily: 'Lexend_300Light', fontSize: 14.5, lineHeight: 22, color: m.from === 'user' ? colors.offWhite : palette.text }}>
                    {m.text}
                  </Text>
                </View>
                {m.offline ? (
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginTop: 4, marginLeft: 6, marginRight: 6 }}>
                    <WifiOff size={11} color={palette.textFaint} />
                    <Text style={[type.caption, { flex: 1, fontSize: 10.5, color: palette.textFaint }]}>resposta salva no app · IA indisponível{m.reason ? ` (${m.reason})` : ''}</Text>
                  </View>
                ) : null}
              </View>
            ))
          )}

          {loading && (
            <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, borderBottomLeftRadius: 6, paddingVertical: 12, paddingHorizontal: 14 }}>
              <ActivityIndicator size="small" color={colors.accent2} />
              <Text style={[type.caption, { color: palette.textMuted }]}>pensando…</Text>
            </View>
          )}
        </ScrollView>

        <TourTarget id="chat-input">
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10, borderTopWidth: 1, borderTopColor: palette.divider, backgroundColor: palette.bg }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="escreva do jeito que der…"
              placeholderTextColor={palette.textFaint}
              multiline
              maxLength={1500}
              onKeyPress={(e: any) => {
                // no navegador, Enter envia e Shift+Enter quebra linha
                if (Platform.OS === 'web' && e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
                  e.preventDefault?.();
                  send();
                }
              }}
              accessibilityLabel="Mensagem para a IA"
              style={[
                {
                  flex: 1,
                  maxHeight: 120,
                  minHeight: 48,
                  backgroundColor: palette.surface,
                  borderWidth: 1,
                  borderColor: palette.chipBorder,
                  borderRadius: 24,
                  paddingHorizontal: 16,
                  paddingTop: 13,
                  paddingBottom: 13,
                  fontFamily: 'Lexend_400Regular',
                  fontSize: 15,
                  color: palette.text,
                },
                { outlineStyle: 'none' } as any,
              ]}
            />
            <Pressable
              onPress={() => send()}
              disabled={!draft.trim() || loading}
              accessibilityRole="button"
              accessibilityLabel="Enviar"
              style={({ pressed }) => ({
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.darkAzure,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: !draft.trim() || loading ? 0.4 : pressed ? 0.8 : 1,
              })}
            >
              <ArrowUp size={20} color={colors.offWhite} strokeWidth={2.2} />
            </Pressable>
          </View>
          {state.plan === 'base' && (
            <Text style={[type.caption, { fontSize: 10.5, color: palette.textFaint, textAlign: 'center', marginTop: 6 }]}>
              {Math.min(sentToday, BASE_DAILY_AI_LIMIT)} de {BASE_DAILY_AI_LIMIT} mensagens hoje · plano Base
            </Text>
          )}
        </View>
        </TourTarget>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
