import React, { createContext, useContext, useMemo, useState } from 'react';
import { light, dark, colors, gradients, alpha, Palette } from './colors';
import { type, fonts } from './typography';
import { spacing, radii } from './spacing';

type ThemeContextValue = {
  scheme: 'light' | 'dark';
  toggleScheme: () => void;
  setScheme: (s: 'light' | 'dark') => void;
  palette: Palette;
  colors: typeof colors;
  gradients: typeof gradients;
  alpha: typeof alpha;
  type: typeof type;
  fonts: typeof fonts;
  spacing: typeof spacing;
  radii: typeof radii;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  const value = useMemo<ThemeContextValue>(
    () => ({
      scheme,
      toggleScheme: () => setScheme((s) => (s === 'light' ? 'dark' : 'light')),
      setScheme,
      palette: scheme === 'light' ? light : dark,
      colors,
      gradients,
      alpha,
      type,
      fonts,
      spacing,
      radii,
    }),
    [scheme]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
