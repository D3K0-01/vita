// Diário de crises: registro rápido depois de cada crise e padrões calculados
// no próprio aparelho (nada sai do app sem a pessoa pedir).
import { weekdayLong } from '../utils/date';

export type Intensity = 'leve' | 'média' | 'forte';
export type Duration = 'menos de 10 min' | '10 a 30 min' | 'mais de 30 min';

export type CrisisLogEntry = {
  id: string;
  date: string; // ISO — quando a crise aconteceu
  childId: string;
  category: 'sensorial' | 'emocional' | 'outro';
  triggers: string[];
  intensity: Intensity;
  duration: Duration;
  helped: string[];
  note?: string;
  /** Registro de exemplo (para demonstração), pode ser apagado de uma vez. */
  example?: boolean;
};

export const TRIGGERS = [
  'barulho',
  'lugar cheio',
  'fome',
  'cansaço / sono',
  'transição ou mudança',
  'ouvir um "não"',
  'desligar a tela',
  'roupa ou textura',
  'espera / fila',
  'não sei',
];

export const HELPERS_BASE = ['diminuir estímulos', 'ficar perto em silêncio', 'respirar junto', 'espaço sozinho', 'água', 'abafador', 'nada ajudou dessa vez'];

export const INTENSITIES: Intensity[] = ['leve', 'média', 'forte'];
export const DURATIONS: Duration[] = ['menos de 10 min', '10 a 30 min', 'mais de 30 min'];

export function periodOf(iso: string): 'manhã' | 'tarde' | 'noite' {
  const h = new Date(iso).getHours();
  if (h < 12) return 'manhã';
  if (h < 18) return 'tarde';
  return 'noite';
}

function top(values: string[], n = 2) {
  const count = new Map<string, number>();
  values.forEach((v) => count.set(v, (count.get(v) ?? 0) + 1));
  return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

export type Insight = { title: string; text: string };

/** Padrões simples, só a partir de 3 registros. */
export function insightsFor(entries: CrisisLogEntry[]): Insight[] {
  if (entries.length < 3) return [];
  const total = entries.length;
  const out: Insight[] = [];
  const triggers = top(entries.flatMap((e) => e.triggers).filter((t) => t !== 'não sei'));
  if (triggers.length) {
    out.push({
      title: 'O que mais aparece antes',
      text: triggers.map(([t, n]) => `${t} (${Math.round((n / total) * 100)}% das vezes)`).join(' e '),
    });
  }
  const [period] = top(entries.map((e) => periodOf(e.date)), 1);
  if (period && period[1] >= 2) out.push({ title: 'Horário mais comum', text: `${period[0]} — ${period[1]} de ${total} registros` });
  const [day] = top(entries.map((e) => weekdayLong(new Date(e.date))), 1);
  if (day && day[1] >= 2) out.push({ title: 'Dia que mais pesa', text: `${day[0]} — vale preparar esse dia com mais calma` });
  const helped = top(entries.flatMap((e) => e.helped).filter((h) => h !== 'nada ajudou dessa vez'));
  if (helped.length) out.push({ title: 'O que mais ajuda', text: helped.map(([h]) => h).join(' e ') });
  const strong = entries.filter((e) => e.intensity === 'forte').length;
  out.push({ title: 'Intensidade', text: strong ? `${strong} de ${total} foram fortes. As outras passaram mais leves.` : 'Nenhuma crise forte entre os registros. 💚' });
  return out;
}

/** Texto curto para levar ao Chat ou ao relatório. */
export function summaryFor(entries: CrisisLogEntry[], childName: string) {
  const last = entries.slice(0, 10);
  const lines = last.map((e) => {
    const d = new Date(e.date);
    return `- ${d.toLocaleDateString('pt-BR')} (${periodOf(e.date)}): ${e.category}, ${e.intensity}, ${e.duration}. Antes: ${e.triggers.join(', ') || 'não registrado'}. Ajudou: ${e.helped.join(', ') || 'não registrado'}.`;
  });
  return `Diário de crises de ${childName} (${last.length} registros mais recentes):\n${lines.join('\n')}`;
}

const at = (daysAgo: number, hour: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
};

export function exampleLog(childId: string): CrisisLogEntry[] {
  const e = (id: string, daysAgo: number, hour: number, category: CrisisLogEntry['category'], triggers: string[], intensity: Intensity, duration: Duration, helped: string[], note?: string): CrisisLogEntry => ({
    id: `ex-${id}`,
    date: at(daysAgo, hour),
    childId,
    category,
    triggers,
    intensity,
    duration,
    helped,
    note,
    example: true,
  });
  return [
    e('1', 1, 18, 'sensorial', ['barulho', 'cansaço / sono'], 'média', '10 a 30 min', ['diminuir estímulos', 'abafador'], 'Aniversário do primo, muita música.'),
    e('2', 4, 19, 'emocional', ['desligar a tela', 'cansaço / sono'], 'forte', 'mais de 30 min', ['ficar perto em silêncio', 'água']),
    e('3', 6, 8, 'emocional', ['transição ou mudança'], 'leve', 'menos de 10 min', ['respirar junto']),
    e('4', 9, 18, 'sensorial', ['lugar cheio', 'barulho'], 'média', '10 a 30 min', ['diminuir estímulos', 'espaço sozinho'], 'Supermercado no sábado.'),
    e('5', 11, 19, 'emocional', ['ouvir um "não"', 'cansaço / sono'], 'média', '10 a 30 min', ['ficar perto em silêncio']),
  ];
}
