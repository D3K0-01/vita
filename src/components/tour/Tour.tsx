// Tour guiado de primeiro uso: escurece a tela, ilumina só o elemento da etapa
// (com cantos arredondados) e mostra uma caixinha explicando. O destaque
// desliza de um item para o outro. Dá para voltar, avançar ou pular tudo.
//
// Para marcar um elemento como alvo: <TourTarget id="home-mood">…</TourTarget>.
// O mesmo id pode existir em várias telas montadas (ex.: o SOS de cada aba);
// o tour usa o que estiver visível.
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, useWindowDimensions, ViewStyle, Animated, Easing } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useApp } from '../../state/AppContext';
import { navigationRef } from '../../navigation/navigationRef';

type Step = { tab?: string; target?: string; title: string; text: string };

/** As etapas da Home mudam se a pessoa ainda não tem rotina (primeiro acesso). */
function buildSteps(hasRoutine: boolean): Step[] {
  const home: Step[] = hasRoutine
    ? [
        { tab: 'HomeTab', target: 'home-mood', title: 'Como está o dia?', text: 'Um toque ajusta o app ao dia. Em "difícil", a Home fica curtinha, com uma tarefa só.' },
        { tab: 'HomeTab', target: 'home-main', title: 'Resumo do dia', text: 'As tarefas de hoje aparecem aqui. Marque direto na Home, sem precisar abrir a Rotina.' },
      ]
    : [
        {
          tab: 'HomeTab',
          target: 'home-main',
          title: 'Comece com uma tarefa só',
          text: 'Crie a primeira tarefa ou use uma rotina de exemplo. Depois disso, a Home passa a mostrar o check-in "como está o dia?" e o resumo das tarefas de hoje.',
        },
      ];
  return [
    { tab: 'HomeTab', title: 'Bem-vinda(o) ao Vita 💚', text: 'Em um minuto mostramos onde fica cada coisa. Você pode pular quando quiser e rever o tour depois em Perfil e ajustes → Central de ajuda.' },
    { tab: 'HomeTab', target: 'tabbar', title: 'As abas do app', text: 'Home, Rotina, Fases, Parceiros, Comunidade e Chat. Toque numa aba para trocar de área.' },
    { tab: 'HomeTab', target: 'home-child', title: 'De quem estamos falando', text: 'Toque aqui para trocar de filho ou filha. Rotina, Fases e Chat passam a falar dessa criança.' },
    ...home,
    { tab: 'HomeTab', target: 'sos', title: 'SOS, sempre à mão', text: 'Em qualquer tela, o SOS abre o Modo Crise: um passo a passo calmo, que funciona até sem internet.' },
    { tab: 'RotinaTab', target: 'routine-add', title: 'Criar tarefas', text: 'Use o + para criar uma tarefa com horário e lembrete. Tocar no nome de uma tarefa abre a edição.' },
    { tab: 'RotinaTab', target: 'routine-week', title: 'Dia e semana', text: 'Navegue pelos dias da semana. Na aba "semana", veja o que já foi feito em cada período.' },
    { tab: 'FasesTab', target: 'phases-track', title: 'Pequenos avanços', text: 'Cada trilha anda no ritmo da criança. Registre tentativas — repetir a mesma fase também é progresso.' },
    { tab: 'ParceirosTab', target: 'partners-actions', title: 'Lugares que acolhem', text: 'Veja os parceiros no mapa e seus cupons. O selo "Vita recomenda" só vai para lugares que a equipe visitou.' },
    { tab: 'ComunidadeTab', target: 'community-tabs', title: 'Comunidade', text: 'Converse com outras famílias no feed e nos grupos, e participe dos encontros online e presenciais.' },
    { tab: 'IATab', target: 'chat-input', title: 'Chat', text: 'Escreva do jeito que der, quando precisar: o Chat responde com passos práticos para o dia a dia. Não substitui profissionais de saúde.' },
    { tab: 'HomeTab', target: 'home-gear', title: 'Ajustes e muito mais', text: 'Na engrenagem ficam o perfil, os filhos, o Acompanhamento, o Diário de crises, a acessibilidade e o modo escuro.' },
    { tab: 'HomeTab', title: 'Tudo pronto!', text: 'Comece pelo que fizer mais sentido hoje. Uma coisa só já basta.' },
  ];
}

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

// mede um elemento na tela; se o navegador não responder em 300 ms, desiste (nunca trava o tour)
const measure = (ref: React.RefObject<any>) =>
  new Promise<Rect | null>((resolve) => {
    const node = ref.current;
    if (!node?.measureInWindow) return resolve(null);
    const timer = setTimeout(() => resolve(null), 300);
    try {
      node.measureInWindow((x: number, y: number, w: number, h: number) => {
        clearTimeout(timer);
        resolve(w > 0 && h > 0 ? { x, y, w, h } : null);
      });
    } catch {
      clearTimeout(timer);
      resolve(null);
    }
  });

export function TourProvider({ children }: { children: React.ReactNode }) {
  const { palette, colors, type, radii } = useTheme();
  const { state, setState, loaded } = useApp();
  const { width: winW, height: winH } = useWindowDimensions();
  const targets = useRef(new Map<string, Set<React.RefObject<any>>>());
  const rootRef = useRef<View>(null);
  const [steps, setSteps] = useState<Step[]>(() => buildSteps(false));
  const [step, setStep] = useState<number | null>(null);
  const [frame, setFrame] = useState<Rect>({ x: 0, y: 0, w: winW, h: winH });
  const [hasHole, setHasHole] = useState(false);
  const [holeRect, setHoleRect] = useState<Rect | null>(null);
  const [cardH, setCardH] = useState(200);
  const [ready, setReady] = useState(false);
  const still = state.prefs.noAnimations;

  // posição animada do "furo" iluminado
  const hx = useRef(new Animated.Value(winW / 2)).current;
  const hy = useRef(new Animated.Value(winH / 2)).current;
  const hw = useRef(new Animated.Value(0)).current;
  const hh = useRef(new Animated.Value(0)).current;
  const dimOpacity = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  const register = useCallback((id: string, ref: React.RefObject<any>) => {
    if (!targets.current.has(id)) targets.current.set(id, new Set());
    targets.current.get(id)!.add(ref);
    return () => targets.current.get(id)?.delete(ref);
  }, []);

  const hasRoutine = state.hasFirstTask;
  const start = useCallback(() => {
    setSteps(buildSteps(hasRoutine));
    setStep(0);
  }, [hasRoutine]);

  // primeiro uso: começa sozinho logo depois do cadastro
  useEffect(() => {
    if (!loaded || !state.hasOnboarded || state.tourDone || step !== null) return;
    const t = setTimeout(start, 900);
    return () => clearTimeout(t);
  }, [loaded, state.hasOnboarded, state.tourDone, step, start]);

  const end = useCallback(() => {
    // some com um fade curto e, garantidamente, desmonta a camada escura
    Animated.timing(dimOpacity, { toValue: 0, duration: still ? 0 : 200, useNativeDriver: false }).start();
    setTimeout(() => {
      setStep(null);
      setReady(false);
      setHasHole(false);
      dimOpacity.setValue(0);
    }, still ? 0 : 210);
    setState((s) => ({ ...s, tourDone: true }));
    if (navigationRef.isReady()) (navigationRef as any).navigate('Main', { screen: 'HomeTab' });
  }, [setState, dimOpacity, still]);

  const moveHole = useCallback(
    (r: Rect, animate: boolean) => {
      const d = animate && !still ? 320 : 0;
      const cfg = (v: Animated.Value, to: number) => Animated.timing(v, { toValue: to, duration: d, easing: Easing.out(Easing.cubic), useNativeDriver: false });
      Animated.parallel([cfg(hx, r.x), cfg(hy, r.y), cfg(hw, r.w), cfg(hh, r.h)]).start();
    },
    [hx, hy, hw, hh, still]
  );

  // a cada etapa: troca de aba, espera desenhar, mede o alvo e anima o destaque
  useEffect(() => {
    if (step === null) return;
    let cancelled = false;
    const s = steps[step];
    setReady(false);
    cardAnim.setValue(0);
    if (step === 0) Animated.timing(dimOpacity, { toValue: 1, duration: still ? 0 : 260, useNativeDriver: false }).start();
    if (s.tab && navigationRef.isReady()) (navigationRef as any).navigate('Main', { screen: s.tab });

    let shown = false;
    const show = (r: Rect | null, root: Rect) => {
      if (cancelled || shown) return;
      shown = true;
      const pad = 6;
      const target = r
        ? { x: Math.max(4, r.x - pad), y: Math.max(4, r.y - pad), w: Math.min(root.w - 8, r.w + pad * 2), h: r.h + pad * 2 }
        : { x: root.w / 2, y: root.h / 2, w: 0, h: 0 };
      setHasHole(!!r);
      setHoleRect(target);
      moveHole(target, step > 0);
      setReady(true);
    };

    const run = async () => {
      let root: Rect | null = null;
      for (let attempt = 0; attempt < 8 && !cancelled; attempt++) {
        await new Promise((r) => setTimeout(r, attempt === 0 ? 300 : 150));
        root = await measure(rootRef);
        if (root) setFrame(root);
        if (!s.target || !root) break;
        for (const ref of [...(targets.current.get(s.target) ?? [])]) {
          const r = await measure(ref);
          if (r && r.y + r.h > root.y && r.y < root.y + root.h && r.x < root.x + root.w) {
            return show({ x: r.x - root.x, y: r.y - root.y, w: r.w, h: r.h }, root);
          }
        }
      }
      // sem alvo visível: a explicação aparece centralizada
      show(null, root ?? frame);
    };
    run();
    // segurança: se a etapa não ficar pronta em 2 s, mostra a explicação centralizada
    const watchdog = setTimeout(() => {
      if (!cancelled) show(null, frame);
    }, 2000);
    return () => {
      cancelled = true;
      clearTimeout(watchdog);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // O cartão aparece com fade só depois de montado. Antes, a animação começava
  // junto com a troca do destaque e, na última etapa (sem destaque), o Animated
  // parava no meio: o cartão ficava invisível e a tela, toda escura.
  useEffect(() => {
    if (!ready) return;
    let live = true;
    cardAnim.setValue(0);
    const anim = Animated.timing(cardAnim, { toValue: 1, duration: still ? 0 : 260, delay: still ? 0 : 140, easing: Easing.out(Easing.quad), useNativeDriver: false });
    // se algo interromper a animação, o cartão aparece mesmo assim
    anim.start(({ finished }) => {
      if (!finished && live) cardAnim.setValue(1);
    });
    return () => {
      live = false;
      anim.stop();
    };
  }, [ready, step, cardAnim, still]);

  const active = step !== null;
  const s = step !== null ? steps[step] : null;
  const W = frame.w;
  const H = frame.h;
  const dim = 'rgba(15,26,29,0.72)';
  const B = Math.max(W, H) * 2; // borda gigante que escurece tudo ao redor do furo
  // raio dos cantos: itens pequenos (como o SOS) ganham destaque redondo
  const R = holeRect && holeRect.w < 100 && holeRect.h < 100 ? Math.min(holeRect.w, holeRect.h) / 2 : 14;

  let cardTop = (H - cardH) / 2;
  if (hasHole && holeRect) {
    const below = holeRect.y + holeRect.h + 14;
    const above = holeRect.y - cardH - 14;
    cardTop = below + cardH < H - 8 ? below : above > 8 ? above : Math.max(8, H - cardH - 8);
  }

  return (
    <TourCtx.Provider value={{ register, start, active }}>
      <View ref={rootRef} collapsable={false} style={{ flex: 1 }}>
        {children}
        {active && s && (
          <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, overflow: 'hidden', opacity: dimOpacity }} accessibilityViewIsModal>
            {/* escurecimento com furo arredondado: uma borda enorme em volta do destaque */}
            <Animated.View
              style={{
                pointerEvents: 'none',
                position: 'absolute',
                left: Animated.subtract(hx, B),
                top: Animated.subtract(hy, B),
                width: Animated.add(hw, B * 2),
                height: Animated.add(hh, B * 2),
                borderWidth: B,
                borderColor: dim,
                borderRadius: B + R,
              }}
            />
            {/* contorno suave do destaque */}
            {hasHole && (
              <Animated.View
                style={{
                  pointerEvents: 'none',
                  position: 'absolute',
                  left: Animated.subtract(hx, 3),
                  top: Animated.subtract(hy, 3),
                  width: Animated.add(hw, 6),
                  height: Animated.add(hh, 6),
                  borderRadius: R + 3,
                  borderWidth: 2,
                  borderColor: colors.pastelGreen,
                  opacity: cardAnim,
                }}
              />
            )}
            {/* bloqueia toques no app enquanto o tour está aberto */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

            {ready && (
              <Animated.View
                onLayout={(e) => setCardH(e.nativeEvent.layout.height)}
                style={{
                  position: 'absolute',
                  left: 16,
                  right: 16,
                  top: cardTop,
                  opacity: cardAnim,
                  transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
                  backgroundColor: palette.bg,
                  borderRadius: radii.xl,
                  padding: 18,
                  gap: 8,
                  maxWidth: 480,
                  alignSelf: 'center',
                  shadowColor: '#000',
                  shadowOpacity: 0.25,
                  shadowRadius: 16,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: 10,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={[type.eyebrow, { color: colors.accent2 }]}>
                    {step! + 1} de {steps.length}
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
                  <View style={{ flexDirection: 'row', gap: 4, flex: 1, flexWrap: 'wrap' }}>
                    {steps.map((_, i) => (
                      <View key={i} style={{ width: i === step ? 14 : 5, height: 5, borderRadius: 3, backgroundColor: i <= step! ? colors.accent2 : palette.divider }} />
                    ))}
                  </View>
                  {step! > 0 && (
                    <Pressable onPress={() => setStep((n) => Math.max(0, (n ?? 0) - 1))} accessibilityRole="button" style={{ minHeight: 44, paddingHorizontal: 12, justifyContent: 'center' }}>
                      <Text style={[type.bodySm, { color: palette.text, fontFamily: 'Lexend_500Medium' }]}>Voltar</Text>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => (step! >= steps.length - 1 ? end() : setStep((n) => (n ?? 0) + 1))}
                    accessibilityRole="button"
                    style={({ pressed }) => ({ minHeight: 44, paddingHorizontal: 20, borderRadius: 22, backgroundColor: colors.darkAzure, justifyContent: 'center', opacity: pressed ? 0.85 : 1 })}
                  >
                    <Text style={[type.button, { color: colors.offWhite, fontSize: 14 }]}>{step === 0 ? 'Começar' : step! >= steps.length - 1 ? 'Concluir' : 'Próximo'}</Text>
                  </Pressable>
                </View>
              </Animated.View>
            )}
          </Animated.View>
        )}
      </View>
    </TourCtx.Provider>
  );
}
