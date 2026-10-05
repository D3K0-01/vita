import { addDays, dateKey } from '../utils/date';

export type Repeat = 'todo dia' | 'dias úteis' | 'fins de semana';

export type Task = {
  id: string;
  childId: string;
  label: string;
  /** "HH:MM", 24h */
  time: string;
  category: string;
  repeat: Repeat;
  reminder: string;
  durationMin?: number;
  /** Dias (dateKey) em que a tarefa foi marcada como feita. */
  doneDates: string[];
};

export type Child = { id: string; name: string; age: number; diagnosis: string };

export const defaultChildren: Child[] = [{ id: 'teo', name: 'Téo', age: 7, diagnosis: 'TDAH' }];

/** A tarefa acontece nesse dia? */
export function taskOccursOn(task: Pick<Task, 'repeat'>, d: Date): boolean {
  const dow = d.getDay();
  if (task.repeat === 'dias úteis') return dow >= 1 && dow <= 5;
  if (task.repeat === 'fins de semana') return dow === 0 || dow === 6;
  return true;
}

const EXAMPLE: Omit<Task, 'id' | 'childId' | 'doneDates'>[] = [
  { label: 'escovar os dentes', time: '07:00', category: 'autocuidado', repeat: 'todo dia', reminder: 'na hora' },
  { label: 'mochila pronta', time: '07:30', category: 'escola', repeat: 'dias úteis', reminder: '10 min antes' },
  { label: 'lição de casa', time: '16:00', category: 'escola', repeat: 'dias úteis', reminder: '10 min antes' },
  { label: 'jantar sem tela', time: '19:00', category: 'autocuidado', repeat: 'todo dia', reminder: 'na hora' },
  { label: 'rotina de dormir', time: '20:30', category: 'autocuidado', repeat: 'todo dia', reminder: '30 min' },
];

/**
 * Rotina de exemplo. Os 6 dias anteriores vêm parcialmente marcados para que
 * Semana e Acompanhamento tenham o que mostrar logo no primeiro uso.
 */
export function exampleRoutine(childId: string, today = new Date()): Task[] {
  // padrão fixo (não aleatório) de dias cumpridos: 1 = feito
  const pattern = [
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 0, 1],
  ];
  return EXAMPLE.map((t, i) => {
    const doneDates: string[] = [];
    pattern.forEach((row, back) => {
      const d = addDays(today, -(back + 1));
      if (row[i] && taskOccursOn(t, d)) doneDates.push(dateKey(d));
    });
    return { ...t, id: `t${Date.now()}-${i}`, childId, doneDates };
  });
}

export const calmingThings = ['abraço apertado', 'objeto favorito'];

// Comunidade: ver data/community.ts
export type { Post, Meeting } from './community';
export { upcomingMeetings } from './community';

export const article = {
  title: 'Por que "quebras saudáveis" não são falhas',
  source: 'Equipe Vita · leitura de 4 min',
  body:
    'Rotina não é sobre perfeição — é sobre previsibilidade. Quando uma pausa é combinada com antecedência, ela deixa de ser uma falha e vira parte do plano. Isso muda completamente como a criança (e o adulto) se relaciona com o dia.',
  full: [
    'Rotina não é sobre perfeição — é sobre previsibilidade. Para muitas crianças neurodivergentes, saber o que vem depois reduz a ansiedade e libera energia para o resto do dia.',
    'Só que a vida real muda: um compromisso atrasa, a avó chega de surpresa, a chuva cancela o parquinho. Quando toda mudança vira "quebra da rotina", cada imprevisto parece um fracasso — para a criança e para quem cuida.',
    'A ideia das quebras saudáveis é inverter isso. Uma pequena variação, combinada com antecedência, vira parte do plano. "Hoje o banho vai ser 20 minutos mais tarde" dito de manhã é muito diferente de uma mudança anunciada na hora.',
    'Comece pequeno: uma variação por semana, de baixo impacto, sempre avisada antes. Use o mesmo apoio visual da rotina. Com o tempo, a flexibilidade também vira hábito.',
    'E se der errado? Tudo bem. A rotina continua ali no dia seguinte — e a tentativa conta.',
  ],
};
