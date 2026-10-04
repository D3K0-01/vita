// Função serverless (Vercel) que conversa com o Google Gemini em nome do app.
//
// A chave fica SÓ aqui, na variável de ambiente GEMINI_API_KEY do Vercel —
// nunca dentro do app, onde qualquer pessoa poderia copiá-la.
//
// Variáveis de ambiente:
//   GEMINI_API_KEY   (obrigatória) chave gratuita do Google AI Studio
//   GEMINI_MODEL     (opcional)    modelo preferido; padrão: gemini-flash-latest
//   ALLOWED_ORIGINS  (opcional)    sites que podem chamar, separados por vírgula

const env = ((globalThis as any).process?.env ?? {}) as Record<string, string | undefined>;

const MODELS = [env.GEMINI_MODEL, 'gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-3-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'].filter(Boolean) as string[];

const DEFAULT_ORIGINS = ['https://d3k0-01.github.io', 'https://lorenacsilva.github.io', 'http://localhost:8081', 'http://localhost:19006'];

const MAX_MESSAGES = 16;
const MAX_CHARS = 2000;

// Limite simples por IP (melhor esforço: cada instância da função tem o seu).
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 12;
}

type InMsg = { from: 'user' | 'ai'; text: string };
type Ctx = {
  parentName?: string;
  childName?: string;
  childAge?: number;
  diagnosis?: string;
  calmingThings?: string[];
  mood?: string | null;
};

const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.slice(0, n) : '');

function systemPrompt(c: Ctx) {
  const child = clip(c.childName, 30) || 'a criança';
  const lines = [
    'Você é a assistente do Vita, um app brasileiro que apoia mães, pais e cuidadores de crianças neurodivergentes (TDAH, TEA e outras condições, com ou sem laudo).',
    'Responda sempre em português do Brasil, com tom acolhedor, calmo e sem julgamento. Fale como alguém experiente e gentil, nunca como um manual.',
    'Seja breve: no máximo 120 palavras. Prefira 2 a 4 passos práticos e concretos para agora. Pode usar lista com "•". Não use títulos nem markdown pesado.',
    'Valide o sentimento de quem cuida antes de sugerir algo, sem exagerar. Nunca culpe a criança nem o cuidador.',
    'Você não substitui médico, psicólogo ou terapeuta: não faça diagnóstico, não indique remédios nem doses. Quando fizer sentido, sugira levar a questão à equipe que acompanha a criança.',
    'Se houver sinal de risco à vida, ferimento, violência, abuso ou ideação suicida (da criança ou do adulto), diga com clareza para ligar agora: SAMU 192, CVV 188 (apoio emocional 24h) ou Polícia 190.',
    'Se uma crise estiver acontecendo neste momento, lembre que o botão SOS do app abre o Modo Crise com um passo a passo.',
    'Se a pergunta fugir do cuidado da criança, da família ou do bem-estar de quem cuida, responda com gentileza que você só ajuda com esses temas.',
    '',
    'Contexto da família (use com naturalidade, sem repetir tudo):',
    `- Quem conversa: ${clip(c.parentName, 30) || 'responsável'}`,
    `- Criança: ${child}${c.childAge ? `, ${Number(c.childAge)} anos` : ''}`,
    `- Diagnóstico informado: ${clip(c.diagnosis, 40) || 'não informado'}`,
  ];
  if (Array.isArray(c.calmingThings) && c.calmingThings.length) lines.push(`- O que costuma acalmar: ${c.calmingThings.slice(0, 6).map((x) => clip(x, 40)).join(', ')}`);
  if (c.mood) lines.push(`- Como o dia está hoje: ${clip(c.mood, 20)}`);
  return lines.join('\n');
}

async function callGemini(model: string, key: string, system: string, messages: InMsg[]) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: messages.map((m) => ({ role: m.from === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
    generationConfig: { temperature: 0.8, maxOutputTokens: 2048 },
  };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data: any = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false as const, status: r.status, error: data?.error?.message ?? `HTTP ${r.status}` };
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    const text = parts
      .filter((p: any) => typeof p?.text === 'string' && !p.thought)
      .map((p: any) => p.text)
      .join('')
      .trim();
    if (!text) return { ok: false as const, status: 502, error: data?.promptFeedback?.blockReason ?? data?.candidates?.[0]?.finishReason ?? 'resposta vazia' };
    return { ok: true as const, text };
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req: any, res: any) {
  const origin: string | undefined = req.headers?.origin;
  const allowed = (env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()) : DEFAULT_ORIGINS).filter(Boolean);
  // Apps nativos não mandam "Origin"; navegadores, sim — e só os sites listados passam.
  const originOk = !origin || allowed.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);

  if (origin && originOk) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!originOk) return res.status(403).json({ error: 'origem não permitida' });

  const key = env.GEMINI_API_KEY;
  // GET /api/chat?test=1 faz uma pergunta curta de verdade e mostra o resultado (diagnóstico)
  if (req.method === 'GET' && key && String(req.query?.test ?? '') === '1') {
    const ipT = String(req.headers?.['x-forwarded-for'] ?? '').split(',')[0].trim() || 'anon';
    if (rateLimited(ipT)) return res.status(429).json({ error: 'muitos testes seguidos; tente em um minuto' });
    const tried: { model: string; status: number; error: string }[] = [];
    for (const model of MODELS) {
      try {
        const r = await callGemini(model, key, systemPrompt({}), [{ from: 'user', text: 'Diga "olá" em uma frase curta.' }]);
        if (r.ok) return res.status(200).json({ ok: true, model, reply: r.text, tried });
        tried.push({ model, status: r.status, error: r.error.slice(0, 200) });
      } catch (e: any) {
        tried.push({ model, status: 0, error: String(e?.message ?? e).slice(0, 200) });
      }
    }
    return res.status(502).json({ ok: false, tried });
  }
  if (req.method === 'GET') return res.status(200).json({ ok: true, configured: Boolean(key) });
  if (req.method !== 'POST') return res.status(405).json({ error: 'método não permitido' });
  if (!key) return res.status(503).json({ error: 'GEMINI_API_KEY não configurada no servidor' });

  const ip = String(req.headers?.['x-forwarded-for'] ?? '').split(',')[0].trim() || 'anon';
  if (rateLimited(ip)) return res.status(429).json({ error: 'muitas mensagens seguidas; tente em um minuto' });

  let payload: any = req.body;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      payload = null;
    }
  }
  const raw: unknown[] = Array.isArray(payload?.messages) ? payload.messages : [];
  const messages: InMsg[] = raw
    .filter((m: any) => m && (m.from === 'user' || m.from === 'ai') && typeof m.text === 'string' && m.text.trim())
    .slice(-MAX_MESSAGES)
    .map((m: any) => ({ from: m.from, text: m.text.slice(0, MAX_CHARS) }));
  // a conversa precisa começar pelo usuário
  while (messages.length && messages[0].from !== 'user') messages.shift();
  if (!messages.length || messages[messages.length - 1].from !== 'user') return res.status(400).json({ error: 'mensagens inválidas' });

  const system = systemPrompt((payload?.context ?? {}) as Ctx);
  let last: { status: number; error: string } = { status: 502, error: 'sem resposta' };
  for (const model of MODELS) {
    try {
      const r = await callGemini(model, key, system, messages);
      if (r.ok) return res.status(200).json({ reply: r.text, model });
      last = { status: r.status, error: r.error };
      // modelo inexistente ou indisponível: tenta o próximo
      if (![400, 403, 404, 500, 502, 503].includes(r.status)) break;
    } catch (e: any) {
      last = { status: 504, error: e?.name === 'AbortError' ? 'tempo esgotado' : String(e?.message ?? e) };
    }
  }
  return res.status(last.status === 429 ? 429 : 502).json({ error: last.error });
}
