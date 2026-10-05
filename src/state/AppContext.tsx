import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Task,
  Child,
  Post,
  defaultChildren,
  exampleRoutine,
  calmingThings as defaultCalming,
  taskOccursOn,
} from '../data/mock';
import { Coupon, Partner, Review, getPartner } from '../data/partners';
import { TrackProgress, initialTracks, initialConquests } from '../data/tracks';
import { getGroup } from '../data/community';
import { CrisisLogEntry, exampleLog } from '../data/crisisLog';
import { dateKey } from '../utils/date';

export type Mood = 'tranquilo' | 'agitado' | 'dificil' | null;

export type CrisisAttempt = { id: string; date: string; worked: boolean };

export type CrisisCategory = 'sensorial' | 'emocional';
export type CrisisSession = { category: CrisisCategory; step: number } | null;

export type ChatMessage = { id: string; from: 'user' | 'ai'; text: string; date: string; offline?: boolean; reason?: string };
export type ChatThread = { id: string; title: string; date: string; messages: ChatMessage[] };

export type HealthyBreak = { id: string; label: string; date: string; childId: string };

/** Comentário do usuário. `postId` é o id do post ou do encontro; `parentId` indica resposta. */
export type Comment = { id: string; postId: string; parentId?: string; mention?: string; text: string; date: string };

export type Prefs = {
  notifications: Record<string, boolean>;
  quietHours: boolean;
  textScale: number; // 0–1
  reducedStimulus: boolean;
  noAnimations: boolean;
};

export type StoredState = {
  hasOnboarded: boolean;
  parentName: string;
  email: string;
  relation: string;
  children: Child[];
  activeChildId: string;
  calmingThings: string[];
  trustedContact: { name: string; relation: string; phone: string } | null;
  tasks: Task[];
  mood: Mood;
  moodDate: string | null;
  plan: 'base' | 'plus';
  tracks: Record<string, TrackProgress>;
  conquests: { id: string; label: string; date: string }[];
  crisisAttempts: CrisisAttempt[];
  crisisLog: CrisisLogEntry[];
  /** Tour guiado de primeiro uso já visto (ou pulado). */
  tourDone: boolean;
  crisisSession: CrisisSession; // set while inside the step guide, cleared on resolution
  simulateOffline: boolean; // Accessibility demo toggle -> Crisis step guide shows the offline variant (5f)
  breaks: HealthyBreak[];
  coupons: Coupon[]; // cupons resgatados — ficam em AsyncStorage para funcionar offline (1d/1h)
  savedPartners: string[]; // parceiros favoritados (1a/1c)
  communityPartners: Partner[]; // locais cadastrados na 1g — sempre sem selo, em análise
  userReviews: Review[]; // relatos escritos pelo usuário (1f)
  /** Publicações feitas pelo usuário (as de exemplo ficam em data/community.ts). */
  posts: Post[];
  likedComments: string[];
  /** Foto de perfil escolhida pelo usuário (data URI). */
  photo: string | null;
  likedPosts: string[];
  savedPosts: string[];
  hiddenPosts: string[];
  comments: Comment[];
  joinedGroups: string[];
  meetings: string[]; // encontros com inscrição
  chat: ChatMessage[];
  chatThreads: ChatThread[];
  prefs: Prefs;
};

/** Estado exposto às telas: o armazenado + atalhos derivados do filho ativo e do dia. */
export type AppState = StoredState & {
  childName: string;
  childAge: number;
  diagnoses: string[];
  activeChild: Child;
  /** Tarefas do filho ativo que acontecem hoje, com `done` calculado para hoje. */
  todayTasks: (Task & { done: boolean })[];
  hasFirstTask: boolean;
};

const STORAGE_KEY = 'vita.demo.v2';

const initialState: StoredState = {
  hasOnboarded: false,
  parentName: 'Camila',
  email: '',
  relation: 'mãe',
  children: defaultChildren,
  activeChildId: defaultChildren[0].id,
  calmingThings: defaultCalming,
  trustedContact: null,
  tasks: [],
  mood: null,
  moodDate: null,
  plan: 'base',
  tracks: initialTracks,
  conquests: initialConquests,
  crisisAttempts: [],
  crisisLog: [],
  tourDone: false,
  crisisSession: null,
  simulateOffline: false,
  breaks: [],
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
      validade: 'já usado',
      avaliado: false,
    },
  ],
  savedPartners: [],
  communityPartners: [],
  userReviews: [],
  posts: [],
  likedComments: [],
  photo: null,
  likedPosts: [],
  savedPosts: [],
  hiddenPosts: [],
  comments: [],
  joinedGroups: [],
  meetings: [],
  chat: [],
  chatThreads: [],
  prefs: {
    notifications: { routine: true, phases: true, community: false, news: false },
    quietHours: true,
    textScale: 0.4,
    reducedStimulus: false,
    noAnimations: false,
  },
};

export type TaskInput = Omit<Task, 'id' | 'childId' | 'doneDates'>;

type ToggleKey = 'likedPosts' | 'savedPosts' | 'hiddenPosts' | 'joinedGroups' | 'meetings' | 'likedComments';

type Ctx = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<StoredState>>;
  toggleTask: (id: string, day?: string) => void;
  addTask: (task: TaskInput) => void;
  updateTask: (id: string, patch: Partial<TaskInput>) => void;
  deleteTask: (id: string) => void;
  loadExampleRoutine: () => void;
  setMood: (m: Mood) => void;
  setActiveChild: (id: string) => void;
  saveChild: (child: Child) => void;
  removeChild: (id: string) => void;
  completeOnboarding: (patch?: Partial<StoredState>) => void;
  logout: () => void;
  addCrisisAttempt: (worked: boolean) => void;
  addCrisisLog: (entry: Omit<CrisisLogEntry, 'id' | 'childId'>) => void;
  removeCrisisLog: (id: string) => void;
  loadExampleCrisisLog: () => void;
  clearExampleCrisisLog: () => void;
  registerTrackAttempt: (trackId: string, advanced: boolean, note?: string) => void;
  startTrack: (trackId: string) => void;
  setCrisisSession: (s: CrisisSession) => void;
  addBreak: (label: string, date: string) => void;
  removeBreak: (id: string) => void;
  generateCoupon: (partnerId: string) => Coupon;
  markCouponUsed: (couponId: string) => void;
  markCouponReviewed: (partnerId: string) => void;
  toggleSavedPartner: (partnerId: string) => void;
  addCommunityPartner: (partner: Partner) => void;
  addUserReview: (review: Review) => void;
  addPost: (body: string, groupId: string) => void;
  toggleIn: (key: ToggleKey, id: string) => void;
  addComment: (postId: string, text: string, parentId?: string, mention?: string) => void;
  setPrefs: (patch: Partial<Prefs>) => void;
  resetDemo: () => void;
  loaded: boolean;
};

const AppCtx = createContext<Ctx | null>(null);

const uid = (p: string) => `${p}${Date.now()}${Math.floor(Math.random() * 1000)}`;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [stored, setStored] = useState<StoredState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const stateRef = useRef(stored);
  stateRef.current = stored;

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const saved = JSON.parse(raw) as Partial<StoredState>;
          setStored({
            ...initialState,
            ...saved,
            prefs: { ...initialState.prefs, ...(saved.prefs ?? {}) },
            // versões antigas guardavam os posts de exemplo junto; agora só os do usuário
            posts: (saved.posts ?? []).filter((p) => p.mine).map((p) => ({ ...p, groupId: p.groupId ?? 'g1', avatar: 'me' as const })),
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stored)).catch(() => {});
  }, [stored, loaded]);

  const toggleTask = useCallback((id: string, day: string = dateKey()) => {
    setStored((s) => ({
      ...s,
      tasks: s.tasks.map((t) =>
        t.id === id
          ? { ...t, doneDates: t.doneDates.includes(day) ? t.doneDates.filter((d) => d !== day) : [...t.doneDates, day] }
          : t
      ),
    }));
  }, []);

  const addTask = useCallback((task: TaskInput) => {
    setStored((s) => ({ ...s, tasks: [...s.tasks, { ...task, id: uid('t'), childId: s.activeChildId, doneDates: [] }] }));
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<TaskInput>) => {
    setStored((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setStored((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  }, []);

  const loadExampleRoutine = useCallback(() => {
    setStored((s) => ({ ...s, tasks: [...s.tasks.filter((t) => t.childId !== s.activeChildId), ...exampleRoutine(s.activeChildId)] }));
  }, []);

  const setMood = useCallback((m: Mood) => {
    setStored((s) => ({ ...s, mood: m, moodDate: m ? dateKey() : null }));
  }, []);

  const setActiveChild = useCallback((id: string) => setStored((s) => ({ ...s, activeChildId: id })), []);

  const saveChild = useCallback((child: Child) => {
    setStored((s) => {
      const exists = s.children.some((c) => c.id === child.id);
      return { ...s, children: exists ? s.children.map((c) => (c.id === child.id ? child : c)) : [...s.children, child] };
    });
  }, []);

  const removeChild = useCallback((id: string) => {
    setStored((s) => {
      if (s.children.length <= 1) return s;
      const remaining = s.children.filter((c) => c.id !== id);
      return {
        ...s,
        children: remaining,
        tasks: s.tasks.filter((t) => t.childId !== id),
        activeChildId: s.activeChildId === id ? remaining[0].id : s.activeChildId,
      };
    });
  }, []);

  const completeOnboarding = useCallback((patch?: Partial<StoredState>) => {
    setStored((s) => ({ ...s, hasOnboarded: true, ...patch }));
  }, []);

  // Sair da conta: volta para o login, mas os dados continuam salvos no aparelho.
  const logout = useCallback(() => setStored((s) => ({ ...s, hasOnboarded: false })), []);

  const addCrisisAttempt = useCallback((worked: boolean) => {
    setStored((s) => ({ ...s, crisisAttempts: [...s.crisisAttempts, { id: uid('a'), date: new Date().toISOString(), worked }] }));
  }, []);

  const addCrisisLog = useCallback((entry: Omit<CrisisLogEntry, 'id' | 'childId'>) => {
    setStored((s) => ({ ...s, crisisLog: [{ ...entry, id: uid('cl'), childId: s.activeChildId }, ...s.crisisLog].sort((a, b) => b.date.localeCompare(a.date)) }));
  }, []);

  const removeCrisisLog = useCallback((id: string) => setStored((s) => ({ ...s, crisisLog: s.crisisLog.filter((e) => e.id !== id) })), []);

  const loadExampleCrisisLog = useCallback(() => {
    setStored((s) => ({
      ...s,
      crisisLog: [...s.crisisLog.filter((e) => !e.example), ...exampleLog(s.activeChildId)].sort((a, b) => b.date.localeCompare(a.date)),
    }));
  }, []);

  const clearExampleCrisisLog = useCallback(() => setStored((s) => ({ ...s, crisisLog: s.crisisLog.filter((e) => !e.example) })), []);

  const registerTrackAttempt = useCallback((trackId: string, advanced: boolean, note?: string) => {
    setStored((s) => {
      const cur = s.tracks[trackId] ?? { step: 1, attempts: 0, history: [] };
      const step = Math.max(1, cur.step);
      const event = { id: uid('h'), date: new Date().toISOString(), phase: step, advanced, note: note?.trim() || undefined };
      return {
        ...s,
        tracks: {
          ...s.tracks,
          [trackId]: {
            ...cur,
            startedAt: cur.startedAt ?? event.date,
            step: advanced ? step + 1 : step,
            attempts: advanced ? 0 : cur.attempts + 1,
            history: [...cur.history, event],
          },
        },
      };
    });
  }, []);

  const startTrack = useCallback((trackId: string) => {
    setStored((s) => ({
      ...s,
      tracks: { ...s.tracks, [trackId]: { step: 1, attempts: 0, startedAt: new Date().toISOString(), history: s.tracks[trackId]?.history ?? [] } },
    }));
  }, []);

  const setCrisisSession = useCallback((cs: CrisisSession) => setStored((s) => ({ ...s, crisisSession: cs })), []);

  const addBreak = useCallback((label: string, date: string) => {
    setStored((s) => ({ ...s, breaks: [...s.breaks, { id: uid('b'), label, date, childId: s.activeChildId }] }));
  }, []);

  const removeBreak = useCallback((id: string) => setStored((s) => ({ ...s, breaks: s.breaks.filter((b) => b.id !== id) })), []);

  // Um cupom por parceiro: se já existe um ativo, o resgate devolve o mesmo.
  const generateCoupon = useCallback((partnerId: string) => {
    const existing = stateRef.current.coupons.find((c) => c.partnerId === partnerId && c.status === 'ativo');
    if (existing) return existing;

    const partner = getPartner(partnerId, stateRef.current.communityPartners);
    const coupon: Coupon = {
      id: uid('c'),
      partnerId,
      codigo: partner?.beneficio.codigo ?? 'VITA-CUPOM',
      status: 'ativo',
      geradoEm: new Date().toISOString(),
      validade: partner?.beneficio.validadeCurta ?? 'sem prazo',
      avaliado: false,
    };
    setStored((s) => ({ ...s, coupons: [coupon, ...s.coupons] }));
    return coupon;
  }, []);

  const markCouponUsed = useCallback((couponId: string) => {
    setStored((s) => ({ ...s, coupons: s.coupons.map((c) => (c.id === couponId ? { ...c, status: 'usado' as const } : c)) }));
  }, []);

  const markCouponReviewed = useCallback((partnerId: string) => {
    setStored((s) => ({ ...s, coupons: s.coupons.map((c) => (c.partnerId === partnerId ? { ...c, avaliado: true } : c)) }));
  }, []);

  const toggleSavedPartner = useCallback((partnerId: string) => {
    setStored((s) => ({
      ...s,
      savedPartners: s.savedPartners.includes(partnerId) ? s.savedPartners.filter((id) => id !== partnerId) : [...s.savedPartners, partnerId],
    }));
  }, []);

  // Cadastro da 1g: entra sempre como indicado pela comunidade e em análise.
  // O selo "Vita recomenda" só é atribuído pela equipe, após visita presencial.
  const addCommunityPartner = useCallback((partner: Partner) => {
    setStored((s) => ({ ...s, communityPartners: [{ ...partner, selo: 'comunidade', emAnalise: true }, ...s.communityPartners] }));
  }, []);

  const addUserReview = useCallback((review: Review) => {
    setStored((s) => ({
      ...s,
      userReviews: [review, ...s.userReviews],
      coupons: s.coupons.map((c) => (c.partnerId === review.partnerId ? { ...c, avaliado: true } : c)),
    }));
  }, []);

  const addPost = useCallback((body: string, groupId: string) => {
    setStored((s) => ({
      ...s,
      posts: [
        { id: uid('p'), groupId, group: getGroup(groupId)?.name ?? 'Comunidade', author: s.parentName, avatar: 'me', body, likes: 0, createdAt: new Date().toISOString(), mine: true },
        ...s.posts,
      ],
    }));
  }, []);

  const toggleIn = useCallback((key: ToggleKey, id: string) => {
    setStored((s) => ({ ...s, [key]: s[key].includes(id) ? s[key].filter((x) => x !== id) : [...s[key], id] }));
  }, []);

  const addComment = useCallback((postId: string, text: string, parentId?: string, mention?: string) => {
    setStored((s) => ({ ...s, comments: [...s.comments, { id: uid('cm'), postId, parentId, mention, text, date: new Date().toISOString() }] }));
  }, []);

  const setPrefs = useCallback((patch: Partial<Prefs>) => setStored((s) => ({ ...s, prefs: { ...s.prefs, ...patch } })), []);

  const resetDemo = useCallback(() => {
    setStored(initialState);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  const today = dateKey();
  const state = useMemo<AppState>(() => {
    const activeChild = stored.children.find((c) => c.id === stored.activeChildId) ?? stored.children[0] ?? defaultChildren[0];
    const childTasks = stored.tasks.filter((t) => t.childId === activeChild.id);
    const todayDate = new Date();
    const todayTasks = childTasks
      .filter((t) => taskOccursOn(t, todayDate))
      .sort((a, b) => a.time.localeCompare(b.time))
      .map((t) => ({ ...t, done: t.doneDates.includes(today) }));
    return {
      ...stored,
      // o check-in de humor vale só para o dia em que foi feito
      mood: stored.moodDate === today ? stored.mood : null,
      activeChild,
      childName: activeChild.name,
      childAge: activeChild.age,
      diagnoses: [activeChild.diagnosis],
      todayTasks,
      hasFirstTask: childTasks.length > 0,
    };
  }, [stored, today]);

  const value = useMemo<Ctx>(
    () => ({
      state,
      setState: setStored,
      toggleTask,
      addTask,
      updateTask,
      deleteTask,
      loadExampleRoutine,
      setMood,
      setActiveChild,
      saveChild,
      removeChild,
      completeOnboarding,
      logout,
      addCrisisAttempt,
      addCrisisLog,
      removeCrisisLog,
      loadExampleCrisisLog,
      clearExampleCrisisLog,
      registerTrackAttempt,
      startTrack,
      setCrisisSession,
      addBreak,
      removeBreak,
      generateCoupon,
      markCouponUsed,
      markCouponReviewed,
      toggleSavedPartner,
      addCommunityPartner,
      addUserReview,
      addPost,
      toggleIn,
      addComment,
      setPrefs,
      resetDemo,
      loaded,
    }),
    [
      state,
      loaded,
      toggleTask,
      addTask,
      updateTask,
      deleteTask,
      loadExampleRoutine,
      setMood,
      setActiveChild,
      saveChild,
      removeChild,
      completeOnboarding,
      logout,
      addCrisisAttempt,
      addCrisisLog,
      removeCrisisLog,
      loadExampleCrisisLog,
      clearExampleCrisisLog,
      registerTrackAttempt,
      startTrack,
      setCrisisSession,
      addBreak,
      removeBreak,
      generateCoupon,
      markCouponUsed,
      markCouponReviewed,
      toggleSavedPartner,
      addCommunityPartner,
      addUserReview,
      addPost,
      toggleIn,
      addComment,
      setPrefs,
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
