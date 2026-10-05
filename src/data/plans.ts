// Planos do Vita (valores fictícios do protótipo) e o que cada um libera.

export type PlanId = 'base' | 'plus' | 'premium';

export type Plan = {
  id: PlanId;
  name: string;
  price: string;
  priceShort: string;
  tagline: string;
  highlights: string[];
  recommended?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: 'base',
    name: 'Gratuito',
    price: 'R$ 0',
    priceShort: 'grátis',
    tagline: 'O essencial para começar, para sempre.',
    highlights: ['até 15 tarefas por filho', '2 trilhas em paralelo', 'comunidade completa (até 20 grupos)', 'Chat ilimitado + Modo Crise', 'resumo semanal · 1 filho'],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 'R$ 27,90/mês',
    priceShort: 'R$ 27,90',
    tagline: 'Para a rotina da família inteira.',
    highlights: ['tarefas ilimitadas + acompanhantes', 'todas as trilhas', 'grupos exclusivos + selo de apoiador', 'Chat ilimitado + Crise prioritário', 'histórico completo + exportação · 2 filhos'],
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 64,90/mês',
    priceShort: 'R$ 64,90',
    tagline: 'Tudo do Plus + apoio de um profissional.',
    highlights: ['tudo do Plus', 'até 5 perfis de filhos', 'apoio de uma psicóloga de referência', 'orientação por vídeo agendada', 'compartilhe diário e acompanhamento com a profissional'],
  },
];

export const planName = (id: PlanId) => PLANS.find((p) => p.id === id)?.name ?? 'Gratuito';

export type Level = 'limited' | 'included' | 'extra';
export type FeatureRow = { label: string; base: [Level, string]; plus: [Level, string]; premium: [Level, string] };

/** Tabela de comparação (igual à referência enviada pelo grupo). */
export const COMPARISON: FeatureRow[] = [
  { label: 'Rotina', base: ['limited', '15 tarefas por filho'], plus: ['included', 'Tarefas ilimitadas + acompanhantes'], premium: ['included', 'Tudo do Plus'] },
  { label: 'Fases', base: ['limited', '2 trilhas em paralelo'], plus: ['included', 'Todas as trilhas'], premium: ['included', 'Tudo do Plus'] },
  { label: 'Comunidade', base: ['included', 'Acesso completo, até 20 grupos'], plus: ['included', 'Grupos exclusivos + selo'], premium: ['included', 'Tudo do Plus'] },
  { label: 'Chat com suporte 24h', base: ['included', 'Ilimitado + Modo Crise'], plus: ['included', 'Ilimitado + Crise prioritário'], premium: ['extra', 'Profissional humano'] },
  { label: 'Acompanhamento', base: ['included', 'Resumo semanal'], plus: ['included', 'Histórico + exportação'], premium: ['included', 'Tudo do Plus'] },
  { label: 'Perfis de filhos', base: ['limited', '1 filho'], plus: ['included', '2 filhos'], premium: ['extra', 'Até 5 filhos'] },
];

export const LIMITS: Record<PlanId, { tasksPerChild: number; parallelTracks: number; groups: number; children: number }> = {
  base: { tasksPerChild: 15, parallelTracks: 2, groups: 20, children: 1 },
  plus: { tasksPerChild: Infinity, parallelTracks: Infinity, groups: Infinity, children: 2 },
  premium: { tasksPerChild: Infinity, parallelTracks: Infinity, groups: Infinity, children: 5 },
};

export const PLAN_RANK: Record<PlanId, number> = { base: 0, plus: 1, premium: 2 };
