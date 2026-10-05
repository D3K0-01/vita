// Tour guiado de primeiro uso: escurece a tela, ilumina só o elemento da etapa
// e mostra uma caixinha explicando. Dá para voltar, avançar ou pular tudo.
//
// Para marcar um elemento como alvo: <TourTarget id="home-mood">…</TourTarget>.
// O mesmo id pode existir em várias telas montadas (ex.: o SOS de cada aba);
// o tour usa o que estiver visível.
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, useWindowDimensions, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useApp } from '../../state/AppContext';
import { navigationRef } from '../../navigation/navigationRef';

type Step = { tab?: string; target?: string; title: string; text: string };

const STEPS: Step[] = [
  { tab: 'HomeTab', title: 'Bem-vinda(o) ao Vita 💚', text: 'Em um minuto mostramos onde fica cada coisa. Você pode pular quando quiser e rever o tour depois em Perfil e ajustes → Central de ajuda.' },
  { tab: 'HomeTab', target: 'tabbar', title: 'As abas do app', text: 'Home, Rotina, Fases, Parceiros, Comunidade e Chat. Toque numa aba para trocar de área.' },
  { tab: 'HomeTab', target: 'home-child', title: 'De quem estamos falando', text: 'Toque aqui para trocar de filho ou filha. Rotina, Fases e Chat passam a falar dessa criança.' },
  { tab: 'HomeTab', target: 'home-mood', title: 'Como está o dia?', text: 'Um toque ajusta o app ao dia. Em "difícil", a Home fica curtinha, com uma tarefa só.' },
  { tab: 'HomeTab', target: 'home-main', title: 'Resumo do dia', text: 'As tarefas de hoje aparecem aqui. Marque direto na Home, sem precisar abrir a Rotina.' },
  { tab: 'HomeTab', target: 'sos', title: 'SOS, sempre à mão', text: 'Em qualquer tela, o SOS abre o Modo Crise: um passo a passo calmo, que funciona até sem internet.' },
  { tab: 'RotinaTab', target: 'routine-add', title: 'Criar tarefas', text: 'Use o + para criar uma tarefa com horário e lembrete. Tocar no nome de uma tarefa abre a edição.' },
  { tab: 'RotinaTab', target: 'routine-week', title: 'Dia e semana', text: 'Navegue pelos dias da semana. Na aba "semana", veja o que já foi feito em cada período.' },
  { tab: 'FasesTab', target: 'phases-track', title: 'Pequenos avanços', text: 'Cada trilha anda no ritmo da criança. Registre tentativas — repetir a mesma fase também é progresso.' },
  { tab: 'ParceirosTab', target: 'partners-actions', title: 'Lugares que acolhem', text: 'Veja os parceiros no mapa e seus cupons. O selo "Vita recomenda" só vai para lugares que a equipe visitou.' },
  { tab: 'ComunidadeTab', target: 'community-tabs', title: 'Comunidade', text: 'Converse com outras famílias no feed e nos grupos, e participe dos encontros online e presenciais.' },
  { tab: 'IATab', target: 'chat-input', title: 'Chat com IA', text: 'Escreva do jeito que der: a IA responde com passos práticos para o dia a dia. Ela não substitui profissionais.' },
  { tab: 'HomeTab', target: 'home-gear', title: 'Ajustes e muito mais', text: 'Na engrenagem ficam o perfil, os filhos, o Acompanhamento, o Diário de crises, a acessibilidade e o modo escuro.' },
  { tab: 'HomeTab', title: 'Tudo pronto!', text: 'Comece pelo que fizer mais sentido hoje. Uma coisa só já basta.' },
];

type Rect = { x: number; y: number; w: number; h: number };

type Ctx = { register: (id: string, ref: React.RefObject<any>) => () => void; start: () => void; active: boolean };
const TourCtx = createContext<Ctx | null>(null);

export function useTour() {
  const ctx = useContext(TourCtx);
  if (!ctx) throw new Error('useTour must be used within TourProvider');
  return ctx;
}

/** Marca um elemento como alvo do tour. */
export function TourTarget({ id, children, style }: { id: string; children: React.ReactNode; style?: ViewStyle }) {
  const ctx = useContext(TourCtx);
  const ref = useRef<View>(null);
  useEffect(() => ctx?.register(id, ref), [ctx, id]);
  return (
    <View ref={ref} collapsable={false} style={style}>
      {children}
    </View>
  );
}

const measure = (ref: React.RefObject<any>) =>
  new Promise<Rect | null>((resolve) => {
    const node = ref.current;
    if (!node?.measureInWindow) return resolve(null);
    node.measureInWindow((x: number, y: number, w: number, h: number) => resolve(w > 0 && h > 0 ? { x, y, w, h } : null));
  });

export function TourProvider({ children }: { children: React.ReactNode }) {
  const { palette, colors, type, radii } = useTheme();
  const { state, setState, loaded } = useApp();
  const { width: winW, height: winH } = useWindowDimensions();
  const targets = useRef(new Map<string, Set<React.RefObject<any>>>());
  const rootRef = useRef<View>(null);
  const [step, setStep] = useState<number | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [frame, setFrame] = useState<Rect>({ x: 0, y: 0, w: winW, h: winH });
  const [cardH, setCardH] = useState(200);
  const [ready, setReady] = useState(false);

  const register = useCallback((id: string, ref: React.RefObject<any>) => {
    if (!targets.current.has(id)) targets.current.set(id, new Set());
    targets.current.get(id)!.add(ref);
    return () => targets.current.get(id)?.delete(ref);
  }, []);

  const start = useCallback(() => setStep(0), []);

  // primeiro uso: começa sozinho logo depois do cadastro
  useEffect(() => {
    if (!loaded || !state.hasOnboarded || state.tourDone || step !== null) return;
    const t = setTimeout(() => setStep(0), 900);
    return () => clearTimeout(t);
  }, [loaded, state.hasOnboarded, state.tourDone, step]);

  const end = useCallback(() => {
    setStep(null);
    setRect(null);
    setState((s) => ({ ...s, tourDone: true }));
    if (navigationRef.isReady()) (navigationRef as any).navigate('Main', { screen: 'HomeTab' });
  }, [setState]);

  // a cada etapa: troca de aba, espera desenhar e mede o alvo
  useEffect(() => {
    if (step === null) return;
    let cancelled = false;
    const s = STEPS[step];
    setReady(false);
    if (s.tab && navigationRef.isReady()) (navigationRef as any).navigate('Main', { screen: s.tab });

    const run = async () => {
      for (let attempt = 0; attempt < 8 && !cancelled; attempt++) {
        await new Promise((r) => setTimeout(r, attempt === 0 ? 350 : 150));
        const root = await measure(rootRef);
        if (root) setFrame(root);
        if (!s.target) break;
        const refs = [...(targets.current.get(s.target) ?? [])];
        for (const ref of refs) {
          const r = await measure(ref);
          if (r && root && r.y + r.h > root.y && r.y < root.y + root.h && r.x < root.x + root.w) {
            if (!cancelled) setRect({ x: r.x - root.x, y: r.y - root.y, w: r.w, h: r.h });
            if (!cancelled) setReady(true);
            return;
          }
        }
      }
      // sem alvo visível: a explicação aparece centralizada
      if (!cancelled) {
        setRect(null);
        setReady(true);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [step]);

  const active = step !== null;
  const s = step !== null ? STEPS[step] : null;
  const pad = 6;
  const W = frame.w;
  const H = frame.h;
  const hole = rect ? { x: Math.max(0, rect.x - pad), y: Math.max(0, rect.y - pad), w: Math.min(W, rect.w + pad * 2), h: rect.h + pad * 2 } : null;
  const dim = 'rgba(15,26,29,0.72)';

  let cardTop = (H - cardH) / 2;
  if (hole) {
    const below = hole.y + hole.h + 12;
    const above = hole.y - cardH - 12;
    cardTop = below + cardH < H - 8 ? below : above > 8 ? above : Math.max(8, H - cardH - 8);
  }

  return (
    <TourCtx.Provider value={{ register, start, active }}>
      <View ref={rootRef} collapsable={false} style={{ flex: 1 }}>
        {children}
        {active && s && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} accessibilityViewIsModal>
            {hole && ready ? (
              <>
                <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: hole.y, backgroundColor: dim }} />
                <View style={{ position: 'absolute', left: 0, right: 0, top: hole.y + hole.h, bottom: 0, backgroundColor: dim }} />
                <View style={{ position: 'absolute', left: 0, width: hole.x, top: hole.y, height: hole.h, backgroundColor: dim }} />
                <View style={{ position: 'absolute', left: hole.x + hole.w, right: 0, top: hole.y, height: hole.h, backgroundColor: dim }} />
                <View style={{ position: 'absolute', left: hole.x, top: hole.y, width: hole.w, height: hole.h, borderRadius: 10, borderWidth: 2, borderColor: colors.pastelGreen }} />
              </>
            ) : (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: dim }} />
            )}

            {ready && (
              <View
                onLayout={(e) => setCardH(e.nativeEvent.layout.height)}
                style={{ position: 'absolute', left: 16, right: 16, top: cardTop, backgroundColor: palette.bg, borderRadius: radii.xl, padding: 18, gap: 8, maxWidth: 480, alignSelf: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 10 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={[type.eyebrow, { color: colors.accent2 }]}>
                    {step! + 1} de {STEPS.length}
                  </Text>
                  <Pressable onPress={end} accessibilityRole="button" accessibilityLabel="Pular o tour" hitSlop={8} style={{ minHeight: 32, justifyContent: 'center' }}>
                    <Text style={[type.bodySm, { color: palette.textMuted, fontSize: 13 }]}>Pular tour</Text>
                  </Pressable>
                </View>
                <Text style={[type.titleSm, { color: palette.text, fontSize: 20 }]} accessibilityRole="header">
                  {s.title}
                </Text>
                <Text style={[type.body, { color: palette.textMuted, fontSize: 14, lineHeight: 21 }]}>{s.text}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 }}>
                  <View style={{ flexDirection: 'row', gap: 4, flex: 1 }}>
                    {STEPS.map((_, i) => (
                      <View key={i} style={{ width: i === step ? 14 : 5, height: 5, borderRadius: 3, backgroundColor: i <= step! ? colors.accent2 : palette.divider }} />
                    ))}
                  </View>
                  {step! > 0 && (
                    <Pressable onPress={() => setStep((n) => Math.max(0, (n ?? 0) - 1))} accessibilityRole="button" style={{ minHeight: 44, paddingHorizontal: 12, justifyContent: 'center' }}>
                      <Text style={[type.bodySm, { color: palette.text, fontFamily: 'Lexend_500Medium' }]}>Voltar</Text>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => (step! >= STEPS.length - 1 ? end() : setStep((n) => (n ?? 0) + 1))}
                    accessibilityRole="button"
                    style={({ pressed }) => ({ minHeight: 44, paddingHorizontal: 20, borderRadius: 22, backgroundColor: colors.darkAzure, justifyContent: 'center', opacity: pressed ? 0.85 : 1 })}
                  >
                    <Text style={[type.button, { color: colors.offWhite, fontSize: 14 }]}>{step === 0 ? 'Começar' : step! >= STEPS.length - 1 ? 'Concluir' : 'Próximo'}</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </TourCtx.Provider>
  );
}
