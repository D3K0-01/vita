// Datas reais do dia a dia (antes o protótipo mostrava sempre "terça, 12 de agosto").

const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const WEEKDAYS_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

/** Chave estável de um dia no fuso local, ex: "2026-10-04". */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

/** Segunda-feira da semana de `d`. */
export function startOfWeek(d: Date): Date {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = r.getDay(); // 0 = domingo
  return addDays(r, dow === 0 ? -6 : 1 - dow);
}

export function weekdayShort(d: Date): string {
  return WEEKDAYS_SHORT[d.getDay()];
}

export function weekdayLong(d: Date): string {
  return WEEKDAYS[d.getDay()];
}

export function monthName(d: Date): string {
  return MONTHS[d.getMonth()];
}

/** "sábado, 4 de outubro" */
export function formatLongDate(d: Date = new Date()): string {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}

/** "4 de outubro" */
export function formatDayMonth(d: Date): string {
  return `${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}

/** "29 set – 5 out" ou "6 – 12 de outubro" */
export function formatWeekRange(start: Date): string {
  const end = addDays(start, 6);
  if (start.getMonth() === end.getMonth()) return `${start.getDate()} – ${end.getDate()} de ${MONTHS[end.getMonth()]}`;
  return `${start.getDate()} ${MONTHS[start.getMonth()].slice(0, 3)} – ${end.getDate()} ${MONTHS[end.getMonth()].slice(0, 3)}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return dateKey(a) === dateKey(b);
}

export function greeting(d: Date = new Date()): string {
  const h = d.getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

/** "07:30" -> "7h30", "16:00" -> "16h" */
export function formatHour(hhmm: string): string {
  const [h, m] = hhmm.split(':');
  if (!m) return hhmm;
  return `${Number(h)}h${m === '00' ? '' : m}`;
}

/** "16:00" -> minutos desde meia-noite (para ordenar). */
export function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** Aceita "7", "7h", "7h30", "07:30", "730" e devolve "07:30" (ou null se inválido). */
export function parseHour(input: string): string | null {
  const clean = input.trim().toLowerCase().replace('h', ':').replace(/[^0-9:]/g, '');
  let h: number;
  let m: number;
  if (clean.includes(':')) {
    const [a, b] = clean.split(':');
    h = Number(a);
    m = b ? Number(b) : 0;
  } else if (clean.length >= 3) {
    h = Number(clean.slice(0, clean.length - 2));
    m = Number(clean.slice(-2));
  } else {
    h = Number(clean);
    m = 0;
  }
  if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || h > 23 || m < 0 || m > 59 || clean === '') return null;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function nowHHMM(d: Date = new Date()): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** "agora", "há 5 min", "há 2 h", "há 3 dias" */
export function timeAgo(iso: string, now: Date = new Date()): string {
  const diff = Math.max(0, now.getTime() - new Date(iso).getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const days = Math.floor(h / 24);
  if (days === 1) return 'ontem';
  if (days < 30) return `há ${days} dias`;
  return formatDayMonth(new Date(iso));
}
