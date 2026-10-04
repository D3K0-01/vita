import { CHAT_API_URL } from '../config';

export type AIMessage = { from: 'user' | 'ai'; text: string };
export type AIContext = {
  parentName: string;
  childName: string;
  childAge: number;
  diagnosis: string;
  calmingThings: string[];
  mood: string | null;
};

export type AIResult = { text: string; offline: boolean; reason?: string };

/**
 * Pergunta à IA (Gemini, via servidor no Vercel). Se o servidor não responder,
 * devolve uma resposta local — o app nunca fica sem resposta.
 */
export async function askVita(history: AIMessage[], context: AIContext): Promise<AIResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const r = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-16), context }),
      signal: controller.signal,
    });
    const data = await r.json().catch(() => ({}));
    if (r.ok && typeof data.reply === 'string' && data.reply.trim()) return { text: data.reply.trim(), offline: false };
    const last = history[history.length - 1]?.text ?? '';
    return { text: localReply(last, context), offline: true, reason: r.status === 429 ? 'limite' : data?.error ?? `HTTP ${r.status}` };
  } catch (e: any) {
    const last = history[history.length - 1]?.text ?? '';
    return { text: localReply(last, context), offline: true, reason: e?.name === 'AbortError' ? 'tempo esgotado' : 'sem conexão' };
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Respostas locais (sem internet ou sem servidor). Variam pelo tema da
// mensagem e são sorteadas entre algumas versões, para não soarem repetidas.

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

type Topic = { keys: string[]; replies: ((c: AIContext) => string)[] };

const TOPICS: Topic[] = [
  {
    keys: ['suicid', 'me matar', 'morrer', 'machuc', 'sangr', 'desmai', 'convuls', 'nao respira', 'engasg', 'agred', 'bateu a cabeca', 'violenc', 'abuso'],
    replies: [
      () =>
        'Se há risco agora, ligue imediatamente:\n• SAMU 192 — ferimento, convulsão, falta de ar\n• CVV 188 — apoio emocional 24h\n• Polícia 190 — violência\nO botão SOS do app mostra esses números e o seu contato de confiança.',
    ],
  },
  {
    keys: ['crise', 'birra', 'grit', 'chor', 'explod', 'descontrol', 'tampou os ouvidos', 'se jogou', 'surto'],
    replies: [
      (c) => `Isso costuma ser sobrecarga, não desobediência. Agora:\n• diminua som e luz\n• fale pouco e baixo, fique por perto\n• ofereça ${c.calmingThings[0] ?? 'algo que acalme'}\nO botão SOS abre o passo a passo do Modo Crise.`,
      (c) => `Respira com você primeiro: ombros soltos, ar devagar. Para ${c.childName}: menos palavras, menos estímulos e presença calma. Explicações ficam para depois que passar.`,
    ],
  },
  {
    keys: ['dorm', 'sono', 'noite', 'acord', 'pesadelo', 'cama'],
    replies: [
      (c) => `Para o sono, previsibilidade ajuda mais que firmeza:\n• mesma sequência toda noite (banho, pijama, história)\n• telas desligadas 1h antes\n• luz baixa e avisos de "faltam 10 minutos"\nVale mostrar a sequência com figuras para ${c.childName}.`,
      () => 'Uma ideia: deixe a roupa de dormir escolhida à tarde e transforme a hora de deitar numa rotina curta e igual todo dia. Mudanças no sono levam algumas semanas — e recaídas fazem parte.',
    ],
  },
  {
    keys: ['comer', 'comida', 'aliment', 'jantar', 'almoc', 'seletiv', 'prato', 'provar'],
    replies: [
      (c) => `Seletividade se trabalha sem pressão:\n• o alimento novo aparece no prato, sem cobrança\n• ${c.childName} pode ajudar a lavar ou mexer\n• encostar e cheirar já contam\nA trilha "Novo alimento", em Fases, vai nesse ritmo.`,
      () => 'Tente oferecer o alimento novo junto de um que já é aceito, em pouca quantidade e sem comentar. Repetição tranquila funciona melhor que insistência.',
    ],
  },
  {
    keys: ['escola', 'licao', 'dever', 'tarefa de casa', 'professor', 'estudar'],
    replies: [
      () => 'Para a lição: blocos curtos (10–15 min) com pausa, um lugar sem distrações e a tarefa dividida em partes que dá para ver acabando. Começar sempre no mesmo horário ajuda muito.',
      (c) => `Combine com ${c.childName} uma ordem visual: primeiro lição, depois algo de que goste. Um cronômetro à vista ajuda a mostrar que vai terminar.`,
    ],
  },
  {
    keys: ['sair', 'terapia', 'consulta', 'transic', 'mudanca', 'atras', 'nao quer ir'],
    replies: [
      () => 'Transições ficam mais fáceis com aviso antecipado: "em 5 minutos a gente sai", mostrando no relógio. Leve um objeto de conforto e diga o que vem depois do compromisso.',
      (c) => `Tente dividir a saída em partes: calçar, pegar ${c.calmingThings[0] ?? 'o objeto favorito'}, ir até a porta. Comemore cada parte, sem pressa.`,
    ],
  },
  {
    keys: ['tela', 'celular', 'tablet', 'video', 'jogo', 'desenho'],
    replies: [
      () => 'Para desligar a tela com menos conflito: avise antes, use um timer visível e tenha a próxima atividade já preparada. Terminar no fim de um episódio costuma ser mais fácil que no meio.',
    ],
  },
  {
    keys: ['cansad', 'exaust', 'nao aguento', 'sozinha', 'sozinho', 'culpa', 'desanim', 'tristeza', 'chorando'],
    replies: [
      () => 'O que você sente faz sentido — cuidar todo dia cansa. Escolha hoje uma coisa só, e deixe o resto. Se puder, chame seu contato de confiança. E se o peso estiver grande, o CVV (188) atende 24h.',
      () => 'Você não precisa dar conta de tudo. Que tal 2 minutos de respiração guiada agora (está na Home)? Pedir ajuda também é cuidar da criança.',
    ],
  },
];

export function localReply(message: string, c: AIContext): string {
  const m = norm(message);
  const topic = TOPICS.find((t) => t.keys.some((k) => m.includes(k)));
  if (topic) return pick(topic.replies)(c);
  return pick([
    `Entendi. Me conta um pouco mais: isso acontece mais em algum horário ou situação com ${c.childName}? Assim consigo sugerir algo mais certeiro.`,
    'Vamos com calma — um passo de cada vez costuma ajudar mais do que resolver tudo de uma vez. O que seria o primeiro passo possível hoje?',
    `Faz sentido você estar pensando nisso. Uma ideia: observe por 2 ou 3 dias o que vem antes dessa situação. Padrões ajudam a planejar, e você pode levar isso à equipe que acompanha ${c.childName}.`,
  ]);
}
