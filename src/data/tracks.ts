// Trilhas de "Pequenos Avanços" (Fases). Cada trilha tem fases sem prazo:
// repetir a mesma fase também é progresso.

export type TrackPhase = { title: string; desc: string };

export type TrackDef = {
  id: string;
  area: string;
  name: string;
  count: string;
  intro: string;
  phases: TrackPhase[];
};

export const TRACKS: TrackDef[] = [
  {
    id: 'alimentacao',
    area: 'Alimentação',
    name: 'Novo alimento',
    count: '3 trilhas',
    intro: 'Quatro fases, sem prazo. Repetir a mesma fase também é progresso.',
    phases: [
      { title: 'Apresentar', desc: 'O alimento aparece na mesa, sem cobrança.' },
      { title: 'Preparar junto', desc: 'Participar do preparo: lavar, mexer, escolher o prato. Provar não é o objetivo agora.' },
      { title: 'Convidar a experimentar', desc: 'Encostar, cheirar, lamber já conta.' },
      { title: 'Avançar', desc: 'O alimento entra no cardápio de vez em quando.' },
    ],
  },
  {
    id: 'fala',
    area: 'Fala e comunicação',
    name: 'Pedir com palavras',
    count: '4 trilhas',
    intro: 'Do apontar ao pedir. Gestos, figuras e palavras valem igual.',
    phases: [
      { title: 'Mostrar o que quer', desc: 'Apontar, levar pela mão ou usar uma figura já é um pedido.' },
      { title: 'Escolher entre dois', desc: 'Oferecer duas opções e esperar a escolha, sem pressa.' },
      { title: 'Uma palavra', desc: 'Nomear o objeto junto antes de entregar.' },
      { title: 'Pedido completo', desc: '"Quero água" — com ou sem ajuda visual.' },
    ],
  },
  {
    id: 'social',
    area: 'Socialização',
    name: 'Brincar junto',
    count: '3 trilhas',
    intro: 'Brincar lado a lado já é brincar junto.',
    phases: [
      { title: 'Brincar ao lado', desc: 'Cada um com seu brinquedo, no mesmo espaço.' },
      { title: 'Imitar', desc: 'Repetir o que a criança faz, do jeito dela.' },
      { title: 'Revezar', desc: 'Uma vez você, uma vez eu, com apoio visual se ajudar.' },
      { title: 'Brincadeira combinada', desc: 'Uma regra simples, combinada antes de começar.' },
    ],
  },
  {
    id: 'autonomia',
    area: 'Autonomia',
    name: 'Pequenas escolhas',
    count: '5 trilhas',
    intro: 'Escolher sozinho começa com escolhas pequenas e seguras.',
    phases: [
      { title: 'Escolher a roupa', desc: 'Duas opções separadas pelo adulto.' },
      { title: 'Montar o lanche', desc: 'Escolher entre itens já aprovados.' },
      { title: 'Organizar a mochila', desc: 'Com uma lista visual do que vai.' },
      { title: 'Planejar a tarde', desc: 'Escolher a ordem de duas atividades.' },
      { title: 'Rotina própria', desc: 'Seguir uma parte da rotina com o quadro, sem lembretes.' },
    ],
  },
];

export function getTrack(id: string): TrackDef {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[0];
}

export type TrackEvent = {
  id: string;
  date: string; // ISO
  phase: number; // fase em que a tentativa aconteceu (1-based)
  advanced: boolean;
  note?: string;
};

export type TrackProgress = {
  /** Fase atual, 1-based. 0 = ainda não começou. */
  step: number;
  /** Tentativas registradas na fase atual. */
  attempts: number;
  startedAt?: string;
  history: TrackEvent[];
};

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

// Progresso de exemplo para o protótipo (as datas são relativas a hoje).
export const initialTracks: Record<string, TrackProgress> = {
  alimentacao: {
    step: 2,
    attempts: 4,
    startedAt: daysAgo(48),
    history: [
      { id: 'h1', date: daysAgo(48), phase: 1, advanced: false, note: 'brócolis ficou no prato, sem reclamar' },
      { id: 'h2', date: daysAgo(30), phase: 1, advanced: true, note: 'pediu para colocar mais perto' },
      { id: 'h3', date: daysAgo(14), phase: 2, advanced: false, note: 'lavou as folhas' },
      { id: 'h4', date: daysAgo(3), phase: 2, advanced: false, note: 'mexeu a massa por 5 minutos' },
    ],
  },
  fala: {
    step: 1,
    attempts: 2,
    startedAt: daysAgo(20),
    history: [{ id: 'h5', date: daysAgo(20), phase: 1, advanced: false, note: 'apontou para o copo' }],
  },
  // começa parada para caber no limite do plano Gratuito (2 trilhas em paralelo)
  social: { step: 0, attempts: 0, history: [] },
  autonomia: { step: 0, attempts: 0, history: [] },
};

// Conquistas registradas fora das trilhas (aparecem em "Tudo que já aconteceu").
export const initialConquests = [
  { id: 'q1', label: 'provou abobrinha', date: daysAgo(60) },
  { id: 'q2', label: 'dormiu sozinho', date: daysAgo(25) },
];
