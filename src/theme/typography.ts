// Type scale — from the brand manual's type-row samples.
// Headings: Bricolage Grotesque 600/500. Body: Lexend 300/400/500/600.
export const fonts = {
  display: 'BricolageGrotesque_600SemiBold',
  displayMedium: 'BricolageGrotesque_500Medium',
  body: 'Lexend_400Regular',
  bodyLight: 'Lexend_300Light',
  bodyMedium: 'Lexend_500Medium',
  bodySemibold: 'Lexend_600SemiBold',
};

export const type = {
  h1: { fontFamily: fonts.display, fontSize: 46, lineHeight: 48 },
  h2: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36 },
  title: { fontFamily: fonts.display, fontSize: 26, lineHeight: 30 },
  titleSm: { fontFamily: fonts.display, fontSize: 22, lineHeight: 27 },
  cardTitle: { fontFamily: fonts.display, fontSize: 17, lineHeight: 22 },
  button: { fontFamily: fonts.display, fontSize: 15, lineHeight: 19 },
  bodyLg: { fontFamily: fonts.body, fontSize: 16, lineHeight: 26 },
  body: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 22 },
  bodySm: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 20 },
  caption: { fontFamily: fonts.body, fontSize: 12.5, lineHeight: 18 },
  micro: { fontFamily: fonts.bodySemibold, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase' as const },
  eyebrow: { fontFamily: fonts.bodySemibold, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' as const },
};
