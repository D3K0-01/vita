import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultTasks, Task, trustedContact as defaultTrustedContact, calmingThings as defaultCalming, phaseTrack } from '../data/mock';
import { Coupon, Partner, Review, getPartner } from '../data/partners';

export type Mood = 'tranquilo' | 'agitado' | 'dificil' | null;

export type CrisisAttempt = { id: string; date: string; worked: boolean };

export type CrisisCategory = 'sensorial' | 'emocional';
export type CrisisSession = { category: CrisisCategory; step: number } | null;

export type AppState = {
  hasOnboarded: boolean;
  parentName: string;
  childName: string;
  childAge: number;
  diagnoses: string[];
  calmingThings: string[];
  trustedContact: { name: string; relation: string; phone: string } | null;
  tasks: Task[];
  mood: Mood;
  plan: 'base' | 'plus';
  phase: typeof phaseTrack;
  crisisAttempts: CrisisAttempt[];
  hasFirstTask: boolean; // false -> Home shows the empty 3b state
  crisisSession: CrisisSession; // set while inside the step guide, cleared on resolution
  simulateOffline: boolean; // Accessibility demo toggle -> Crisis step guide shows the offline variant (5f)
  phaseAttempts: number; // attempts registered on the current phase step (6b/6c)
  coupons: Coupon[]; // cupons resgatados — ficam em AsyncStorage para funcionar offline (1d/1h)
  savedPartners: string[]; // parceiros favoritados (1a/1c)
  communityPartners: Partner[]; // locais cadastrados na 1g — sempre sem selo, em análise
  userReviews: Review[]; // relatos escritos pelo usuário (1f)
};

const STORAGE_KEY = 'vita.demo.v1';

const initialState: AppState = {
  hasOnboarded: false,
  parentName: 'Camila',
  childName: 'Téo',
  childAge: 7,
  diagnoses: ['TDAH'],
  calmingThings: defaultCalming,
  trustedContact: null,
  tasks: [],
  mood: null,
  plan: 'base',
  phase: phaseTrack,
  crisisAttempts: [],
  hasFirstTask: false,
  crisisSession: null,
  simulateOffline: false,
  phaseAttempts: 4,
  coupons: [
    {
      id: 'c-jacana',
      partnerId: 'clinica-jacana',
      codigo: 'VITA-JAC1',
      status: 'ativo',
      geradoEm: new Date().toISOString(),
      validade: 'vence em 2 meses',
      avaliado: false,
    },
    {
      id: 'c-mare',
      partnerId: 'estudio-mare',
      codigo: 'VITA-MARE',
      status: 'ativo',
      geradoEm: new Date().toISOString(),
      validade: 'sem prazo',
      avaliado: false,
    },
    {
      id: 'c-girassol',
      partnerId: 'buffet-girassol',
      codigo: 'VITA-GIR7',
      status: 'usado',
      geradoEm: new Date().toISOString(),
      validade: 'usado em 12 de agosto',
      avaliado: false,
    },
  ],
  savedPartners: [],
  communityPartners: [],
  userReviews: [],
};

type Ctx = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  toggleTask: (id: string) => void;
  addTask: (label: string, time: string) => void;
  setMood: (m: Mood) => void;
  completeOnboarding: (patch?: Partial<AppState>) => void;
  addCrisisAttempt: (worked: boolean) => void;
  registerPhaseAttempt: (advanced: boolean) => void;
  setCrisisSession: (s: CrisisSession) => void;
  generateCoupon: (partnerId: string) => Coupon;
  markCouponUsed: (couponId: string) => void;
  markCouponReviewed: (partnerId: string) => void;
  toggleSavedPartner: (partnerId: string) => void;
  addCommunityPartner: (partner: Partner) => void;
  addUserReview: (review: Review) => void;
  resetDemo: () => void;
  loaded: boolean;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setState({ ...initialState, ...JSON.parse(raw) });
      })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, loaded]);

  const toggleTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }));
  }, []);

  const addTask = useCallback((label: string, time: string) => {
    setState((s) => ({
      ...s,
      hasFirstTask: true,
      tasks: [...s.tasks, { id: `t${Date.now()}`, label, time, done: false }],
    }));
  }, []);

  const setMood = useCallback((m: Mood) => {
    setState((s) => ({ ...s, mood: m }));
  }, []);

  const completeOnboarding = useCallback((patch?: Partial<AppState>) => {
    setState((s) => ({ ...s, hasOnboarded: true, ...patch }));
  }, []);

  const addCrisisAttempt = useCallback((worked: boolean) => {
    setState((s) => ({
      ...s,
      crisisAttempts: [...s.crisisAttempts, { id: `a${Date.now()}`, date: new Date().toISOString(), worked }],
    }));
  }, []);

  const registerPhaseAttempt = useCallback((advanced: boolean) => {
    setState((s) => ({
      ...s,
      phaseAttempts: advanced ? 1 : s.phaseAttempts + 1,
      phase: advanced && s.phase.stepIndex < s.phase.stepTotal ? { ...s.phase, stepIndex: s.phase.stepIndex + 1 } : s.phase,
    }));
  }, []);

  const setCrisisSession = useCallback((cs: CrisisSession) => {
    setState((s) => ({ ...s, crisisSession: cs }));
  }, []);

  // Um cupom por parceiro: se já existe um ativo, o resgate devolve o mesmo.
  const generateCoupon = useCallback((partnerId: string) => {
    const existing = stateRef.current.coupons.find((c) => c.partnerId === partnerId && c.status === 'ativo');
    if (existing) return existing;

    const partner = getPartner(partnerId, stateRef.current.communityPartners);
    const coupon: Coupon = {
      id: `c${Date.now()}`,
      partnerId,
      codigo: partner?.beneficio.codigo ?? 'VITA-CUPOM',
      status: 'ativo',
      geradoEm: new Date().toISOString(),
      validade: partner?.beneficio.validadeCurta ?? 'sem prazo',
      avaliado: false,
    };
    setState((s) => ({ ...s, coupons: [coupon, ...s.coupons] }));
    return coupon;
  }, []);

  const markCouponUsed = useCallback((couponId: string) => {
    setState((s) => ({
      ...s,
      coupons: s.coupons.map((c) => (c.id === couponId ? { ...c, status: 'usado' as const } : c)),
    }));
  }, []);

  const markCouponReviewed = useCallback((partnerId: string) => {
    setState((s) => ({
      ...s,
      coupons: s.coupons.map((c) => (c.partnerId === partnerId ? { ...c, avaliado: true } : c)),
    }));
  }, []);

  const toggleSavedPartner = useCallback((partnerId: string) => {
    setState((s) => ({
      ...s,
      savedPartners: s.savedPartners.includes(partnerId)
        ? s.savedPartners.filter((id) => id !== partnerId)
        : [...s.savedPartners, partnerId],
    }));
  }, []);

  // Cadastro da 1g: entra sempre como indicado pela comunidade e em análise.
  // O selo "Vita recomenda" só é atribuído pela equipe, após visita presencial.
  const addCommunityPartner = useCallback((partner: Partner) => {
    setState((s) => ({
      ...s,
      communityPartners: [{ ...partner, selo: 'comunidade', emAnalise: true }, ...s.communityPartners],
    }));
  }, []);

  const addUserReview = useCallback((review: Review) => {
    setState((s) => ({
      ...s,
      userReviews: [review, ...s.userReviews],
      coupons: s.coupons.map((c) => (c.partnerId === review.partnerId ? { ...c, avaliado: true } : c)),
    }));
  }, []);

  const resetDemo = useCallback(() => {
    setState(initialState);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      state,
      setState,
      toggleTask,
      addTask,
      setMood,
      completeOnboarding,
      addCrisisAttempt,
      registerPhaseAttempt,
      setCrisisSession,
      generateCoupon,
      markCouponUsed,
      markCouponReviewed,
      toggleSavedPartner,
      addCommunityPartner,
      addUserReview,
      resetDemo,
      loaded,
    }),
    [
      state,
      loaded,
      toggleTask,
      addTask,
      setMood,
      completeOnboarding,
      addCrisisAttempt,
      registerPhaseAttempt,
      setCrisisSession,
      generateCoupon,
      markCouponUsed,
      markCouponReviewed,
      toggleSavedPartner,
      addCommunityPartner,
      addUserReview,
      resetDemo,
    ]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { defaultTasks };
