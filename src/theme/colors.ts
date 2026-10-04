// Vita brand palette — do manual de marca (arquivo original: neuroflow-manual-de-marca.html)
export const colors = {
  darkAzure: '#2E4B52', // base — confiança e estrutura
  greyAzure: '#7FA0AC', // apoio — serenidade
  pastelGreen: '#C7D6BF', // acolhimento — respiro, uso amplo
  offWhite: '#F2EFE6', // fundo — calma visual
  accent1: '#6B8F5C', // Verde de Conquista — início do gradiente
  accent2: '#4F7A45', // Verde de Conquista — fim do gradiente
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const gradients = {
  achievement: [colors.accent1, colors.accent2] as const, // Verde de Conquista, 135deg
  card3b: [colors.pastelGreen, colors.greyAzure] as const,
  brandDot: [colors.accent1, colors.accent2] as const,
};

// rgba helpers matching common opacities used across the mockups
export const alpha = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

export type Palette = {
  bg: string;
  surface: string;
  surfaceBorder: string;
  text: string;
  textMuted: string;
  textFaint: string;
  hint: string;
  chipBg: string;
  chipBorder: string;
  chipSelectedBg: string;
  chipSelectedBorder: string;
  divider: string;
  tabInactive: string;
  tabActive: string;
};

// Light theme (default) — the mockups are light-first; a dark sample exists for Home (3a/3c escuro)
export const light: Palette = {
  bg: colors.offWhite,
  surface: colors.white,
  surfaceBorder: alpha(colors.darkAzure, 0.1),
  text: colors.darkAzure,
  textMuted: alpha(colors.darkAzure, 0.65),
  textFaint: alpha(colors.darkAzure, 0.55),
  hint: colors.greyAzure,
  chipBg: colors.offWhite,
  chipBorder: alpha(colors.darkAzure, 0.14),
  chipSelectedBg: colors.pastelGreen,
  chipSelectedBorder: colors.accent1,
  divider: alpha(colors.darkAzure, 0.1),
  tabInactive: colors.greyAzure,
  tabActive: colors.darkAzure,
};

export const dark: Palette = {
  bg: '#1B2E33',
  surface: '#243C42',
  surfaceBorder: alpha(colors.offWhite, 0.1),
  text: colors.offWhite,
  textMuted: alpha(colors.offWhite, 0.7),
  textFaint: alpha(colors.offWhite, 0.55),
  hint: colors.greyAzure,
  chipBg: '#243C42',
  chipBorder: alpha(colors.offWhite, 0.16),
  chipSelectedBg: alpha(colors.accent1, 0.28),
  chipSelectedBorder: colors.accent1,
  divider: alpha(colors.offWhite, 0.12),
  tabInactive: colors.greyAzure,
  tabActive: colors.offWhite,
};
