import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { Lock, Video, NotebookPen, ChartLine, ArrowUp, CalendarCheck, ShieldCheck, Clock } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenContainer } from '../../components/ScreenContainer';
import { BackHeader } from '../../components/BackHeader';
import { Button } from '../../components/Button';
import { useUI } from '../../components/UIProvider';
import { useApp } from '../../state/AppContext';
import { usePlan } from '../../state/usePlan';
import { addDays, dateKey, formatDayMonth, weekdayLong, weekdayShort } from '../../utils/date';

// Premium: "tudo do Plus + apoio de uma profissional". No protótipo, a profissional
// é fictícia e as respostas são de demonstração (deixamos isso claro na tela).

const PRO = {
  name: 'Dra. Helena Prado',
  role: 'Psicóloga · CRP fictício 06/00000',
  bio: 'Atende famílias de crianças autistas e com TDAH há 12 anos. Foco em rotina, regulação emocional e orientação parental.',
  response: 'responde em até 1 dia útil',
};

const SLOTS = ['09:00', '14:00', '18:30'];

/** Próximos 4 dias úteis, a partir de amanhã. */
function nextWorkdays() {
  const out: Date[] = [];
  let d = addDays(new Date(), 1);
  while (out.length < 4) {
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(d);
    d = addDays(d, 1);
  }
  return out;
}

const AUTO_REPLIES = [
  'Obrigada por contar. Pelo que você descreveu, vale manter o mesmo combinado por mais uma semana antes de mudar algo. Anote o que aconteceu logo antes, isso ajuda muito na nossa conversa.',
  'Recebi. Uma sugestão para esta semana: avise a transição com 5 minutos de antecedência e use sempre a mesma frase. Me conte como foi na sexta?',
  'Faz sentido você estar cansada(o). Cuidar de quem cuida também é parte do plano. Podemos usar parte da próxima orientação só para organizar a sua rede de apoio.',
];

function Avatar({ size = 52 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.greyAzure, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: size * 0.36, color: colors.offWhite }}>HP</Text>
    </View>
  );
}

function Locked({ navigation }: any) {
  const { palette, colors, type } = useTheme();
  const items = [
    { icon: <ShieldCheck size={18} color={colors.darkAzure} />, t: 'Uma psicóloga de referência', d: 'a mesma pessoa acompanha sua família, com mensagens pelo app' },
    { icon: <Video size={18} color={colors.darkAzure} />, t: 'Orientação por vídeo', d: 'um encontro de 30 minutos por mês, no horário que couber' },
    { icon: <NotebookPen size={18} color={colors.darkAzure} />, t: 'Diário e acompanhamento compartilhados', d: 'você escolhe o que enviar; nada é compartilhado sem você' },
  ];
  return (
    <>
      <View style={{ backgroundColor: colors.darkAzure, borderRadius: 22, padding: 20, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Lock size={15} color={colors.offWhite} />
          <Text style={[type.eyebrow, { color: colors.offWhite, opacity: 0.8 }]}>Exclusivo do Premium</Text>
        </View>
        <Text style={[type.titleSm, { color: colors.offWhite, fontSize: 22 }]}>Tudo do Plus + apoio de uma profissional</Text>
        <Text style={[type.bodySm, { color: colors.offWhite, opacity: 0.85, lineHeight: 20 }]}>
          O Chat continua ilimitado no seu plano. No Premium, quando precisar de um olhar humano, uma profissional acompanha sua família.
        </Text>
      </View>
      <View style={{ gap: 10 }}>
        {items.map((it) => (
          <View key={it.t} style={{ flexDirection: 'row', gap: 12, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 16, padding: 14 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.pastelGreen, alignItems: 'center', justifyContent: 'center' }}>{it.icon}</View>
            <View style={{ flex: 1 }}>
              <Text style={[type.cardTitle, { color: palette.text, fontSize: 15 }]}>{it.t}</Text>
              <Text style={[type.caption, { color: palette.textMuted, fontSize: 12.5, marginTop: 2, lineHeight: 18 }]}>{it.d}</Text>
            </View>
          </View>
        ))}
      </View>
      <Button label="Conhecer o Premium · 7 dias grátis" onPress={() => navigation.navigate('PlansStack', { screen: 'Checkout10c', params: { plan: 'premium' } })} />
      <Button label="Ver todos os planos" variant="ghost" onPress={() => navigation.navigate('PlansStack')} />
    </>
  );
}

export default function Professional({ navigation }: any) {
  const { palette, colors, type } = useTheme();
  const { state, setState } = useApp();
  const { toast, confirm } = useUI();
  const { hasProfessional } = usePlan();
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [day, setDay] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const days = nextWorkdays();
  const booking = state.proBooking ? new Date(state.proBooking) : null;
  const upcoming = booking && booking.getTime() > Date.now() ? booking : null;

  const push = (text: string) => {
    const now = new Date().toISOString();
    setState((s) => ({ ...s, proMessages: [...s.proMessages, { id: `pm${Date.now()}`, from: 'me', text, date: now }] }));
    setTyping(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setTyping(false);
      setState((s) => {
        const n = s.proMessages.filter((m) => m.from === 'pro').length;
        return { ...s, proMessages: [...s.proMessages, { id: `pp${Date.now()}`, from: 'pro', text: AUTO_REPLIES[n % AUTO_REPLIES.length], date: new Date().toISOString() }] };
      });
    }, 1800);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    push(text);
  };

  const shareDiary = () => {
    const entries = state.crisisLog.filter((e) => e.childId === state.activeChildId);
    if (!entries.length) return toast('O diário de crises ainda está vazio');
    push(`Compartilhei o diário de crises de ${state.childName}: ${entries.length} registro(s), o último em ${formatDayMonth(new Date(entries[0].date))}.`);
    toast('Diário compartilhado com a profissional');
  };

  const shareTracking = () => {
    const keys = Array.from({ length: 7 }, (_, i) => dateKey(addDays(new Date(), -i)));
    const done = state.tasks.filter((t) => t.childId === state.activeChildId).reduce((n, t) => n + (t.doneDates ?? []).filter((k) => keys.includes(k)).length, 0);
    push(`Compartilhei o acompanhamento dos últimos 7 dias de ${state.childName}: ${done} tarefa(s) concluída(s) na rotina.`);
    toast('Acompanhamento compartilhado');
  };

  const book = (slot: string) => {
    const d = new Date(days[day]);
    const [h, m] = slot.split(':').map(Number);
    d.setHours(h, m, 0, 0);
    setState((s) => ({ ...s, proBooking: d.toISOString() }));
    toast(`Orientação marcada: ${weekdayLong(d)}, ${formatDayMonth(d)} às ${slot}`);
  };

  const cancelBooking = async () => {
    if (await confirm({ title: 'Desmarcar a orientação?', message: 'Você pode marcar outro horário quando quiser.', confirmLabel: 'Desmarcar', destructive: true })) {
      setState((s) => ({ ...s, proBooking: null }));
      toast('Orientação desmarcada');
    }
  };

  if (!hasProfessional) {
    return (
      <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 16 }}>
        <BackHeader title="Profissional" />
        <Locked navigation={navigation} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['top', 'bottom']} contentStyle={{ paddingHorizontal: 20, paddingTop: 4, gap: 16 }}>
      <BackHeader title="Profissional" />

      <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 20, padding: 16, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar />
          <View style={{ flex: 1 }}>
            <Text style={[type.cardTitle, { color: palette.text, fontSize: 16 }]}>{PRO.name}</Text>
            <Text style={[type.caption, { color: palette.textMuted, fontSize: 12 }]}>{PRO.role}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 }}>
              <Clock size={11} color={colors.accent2} />
              <Text style={[type.caption, { color: colors.accent2, fontSize: 11.5 }]}>{PRO.response}</Text>
            </View>
          </View>
        </View>
        <Text style={[type.bodySm, { color: palette.text, fontSize: 13, lineHeight: 20 }]}>{PRO.bio}</Text>
      </View>

      <View style={{ gap: 10 }}>
        <Text style={[type.eyebrow, { color: palette.hint }]}>Orientação por vídeo · 30 min</Text>
        {upcoming ? (
          <View style={{ backgroundColor: colors.pastelGreen, borderRadius: 18, padding: 16, gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <CalendarCheck size={20} color={colors.darkAzure} />
              <Text style={[type.cardTitle, { flex: 1, color: colors.darkAzure, fontSize: 15 }]}>
                {weekdayLong(upcoming)}, {formatDayMonth(upcoming)} às {String(upcoming.getHours()).padStart(2, '0')}:{String(upcoming.getMinutes()).padStart(2, '0')}
              </Text>
            </View>
            <Text style={[type.caption, { color: colors.darkAzure, opacity: 0.85, fontSize: 12.5 }]}>O link da chamada aparece aqui 10 minutos antes.</Text>
            <View style={{ gap: 2 }}>
              <Button label="Entrar na chamada" variant="dark" onPress={() => toast('Protótipo: a chamada abre no horário marcado')} />
              <Button label="Desmarcar" variant="ghost" textColor={colors.darkAzure} onPress={cancelBooking} />
            </View>
          </View>
        ) : (
          <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, padding: 14, gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {days.map((d, i) => (
                <Pressable
                  key={d.toISOString()}
                  onPress={() => setDay(i)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: i === day }}
                  style={{ flex: 1, minHeight: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: i === day ? colors.accent1 : palette.chipBorder, backgroundColor: i === day ? palette.chipSelectedBg : 'transparent' }}
                >
                  <Text style={[type.eyebrow, { fontSize: 10, color: i === day ? colors.darkAzure : palette.hint }]}>{weekdayShort(d)}</Text>
                  <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 17, color: i === day ? colors.darkAzure : palette.text }}>{d.getDate()}</Text>
                </Pressable>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {SLOTS.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => book(s)}
                  accessibilityRole="button"
                  accessibilityLabel={`Marcar às ${s}`}
                  style={({ pressed }) => ({ flex: 1, minHeight: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: palette.chipBorder, backgroundColor: pressed ? palette.chipSelectedBg : 'transparent' })}
                >
                  <Text style={[type.bodySm, { color: palette.text, fontFamily: 'Lexend_500Medium' }]}>{s}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={[type.caption, { color: palette.textFaint, fontSize: 11.5 }]}>Toque em um horário para marcar. 1 orientação por mês no Premium.</Text>
          </View>
        )}
      </View>

      <View style={{ gap: 10 }}>
        <Text style={[type.eyebrow, { color: palette.hint }]}>Compartilhar com a profissional</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button label="Diário de crises" variant="secondary" icon={<NotebookPen size={16} color={palette.text} />} onPress={shareDiary} style={{ flex: 1 }} />
          <Button label="Semana" variant="secondary" icon={<ChartLine size={16} color={palette.text} />} onPress={shareTracking} style={{ flex: 1 }} />
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <Text style={[type.eyebrow, { color: palette.hint }]}>Mensagens</Text>
        <View style={{ alignSelf: 'flex-start', maxWidth: '88%', backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder, borderRadius: 18, borderBottomLeftRadius: 6, padding: 13 }}>
          <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 14, lineHeight: 21, color: palette.text }}>
            Oi, {state.parentName}! Sou a Helena e vou acompanhar você e {state.childName}. Me conte como estão as coisas, sem pressa. Para emergências, use sempre o SOS.
          </Text>
        </View>
        {state.proMessages.map((m) => (
          <View key={m.id} style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '86%' }}>
            <View
              style={{
                backgroundColor: m.from === 'me' ? colors.darkAzure : palette.surface,
                borderWidth: m.from === 'pro' ? 1 : 0,
                borderColor: palette.surfaceBorder,
                borderRadius: 18,
                borderBottomRightRadius: m.from === 'me' ? 6 : 18,
                borderBottomLeftRadius: m.from === 'pro' ? 6 : 18,
                padding: 13,
              }}
            >
              <Text selectable style={{ fontFamily: 'Lexend_300Light', fontSize: 14, lineHeight: 21, color: m.from === 'me' ? colors.offWhite : palette.text }}>
                {m.text}
              </Text>
            </View>
            {m.from === 'pro' ? <Text style={[type.caption, { fontSize: 10.5, color: palette.textFaint, marginTop: 3, marginLeft: 6 }]}>resposta de demonstração</Text> : null}
          </View>
        ))}
        {typing && <Text style={[type.caption, { color: palette.textMuted, fontStyle: 'italic' }]}>Helena está escrevendo…</Text>}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="escreva para a Helena…"
            placeholderTextColor={palette.textFaint}
            multiline
            maxLength={1000}
            accessibilityLabel="Mensagem para a profissional"
            style={[
              { flex: 1, minHeight: 48, maxHeight: 160, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.chipBorder, borderRadius: 24, paddingHorizontal: 16, paddingTop: 13, paddingBottom: 13, fontFamily: 'Lexend_400Regular', fontSize: 15, color: palette.text },
              { outlineStyle: 'none' } as any,
            ]}
          />
          <Pressable
            onPress={send}
            disabled={!draft.trim()}
            accessibilityRole="button"
            accessibilityLabel="Enviar para a profissional"
            style={({ pressed }) => ({ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.darkAzure, alignItems: 'center', justifyContent: 'center', opacity: !draft.trim() ? 0.4 : pressed ? 0.8 : 1 })}
          >
            <ArrowUp size={20} color={colors.offWhite} strokeWidth={2.2} />
          </Pressable>
        </View>
        <Text style={[type.caption, { color: palette.textFaint, fontSize: 11, textAlign: 'center' }]}>Protótipo: profissional e respostas fictícias. Em emergência, ligue 192.</Text>
      </View>
    </ScreenContainer>
  );
}
