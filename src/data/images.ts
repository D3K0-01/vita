// Registro central das imagens reais do protótipo.
//
// Para trocar uma imagem, basta substituir o arquivo em `assets/` —
// o caminho é o mesmo. Um valor `null` faz a UI voltar ao placeholder
// (círculo com inicial nos avatares, gradiente na capa do conteúdo).

import type { ImageSourcePropType } from 'react-native';

export type AvatarKey = 'camila' | 'julia' | 'diego';

export const avatars: Record<AvatarKey, ImageSourcePropType | null> = {
  // Camila — a usuária do app (Home, Perfil e ajustes)
  camila: require('../../assets/avatars/camila.jpg'),

  // Julia — autora do post "Dia difícil hoje, alguém por perto?" (Comunidade)
  julia: require('../../assets/avatars/julia.jpg'),

  // Diego F. — autor do post "Quadro de rotina visual mudou nossa manhã" (Comunidade)
  diego: require('../../assets/avatars/diego.jpg'),
};

export function getAvatar(key?: AvatarKey | null): ImageSourcePropType | null {
  if (!key) return null;
  return avatars[key] ?? null;
}

// Capa do conteúdo em destaque na Comunidade
// ("Por que 'quebras saudáveis' não são falhas")
export const articleCover: ImageSourcePropType | null = require('../../assets/content/article-cover.jpg');
