import { Platform } from 'react-native';

// Configuração pública do app. Nada aqui é segredo: a chave da IA fica só no
// servidor (Vercel). A chave do Google Maps é pública por natureza e deve ser
// restrita por domínio no Google Cloud.
//
// Para trocar sem mexer no código, crie um arquivo `.env` na raiz:
//   EXPO_PUBLIC_CHAT_API_URL=https://seu-projeto.vercel.app/api/chat
//   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...

/** Endereço do servidor de IA publicado no Vercel (ver README). */
const DEFAULT_CHAT_API_URL = 'https://vita-ia.vercel.app/api/chat';

function resolveChatUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_CHAT_API_URL;
  if (fromEnv) return fromEnv;
  // quando o próprio site está no Vercel, a API fica no mesmo endereço
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app')) {
    return `${window.location.origin}/api/chat`;
  }
  return DEFAULT_CHAT_API_URL;
}

export const CHAT_API_URL = resolveChatUrl();

export const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

/** Mensagens de IA por dia no plano Base (o Plus não tem limite). */
export const BASE_DAILY_AI_LIMIT = 20;
