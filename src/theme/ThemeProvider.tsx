import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { light, dark, colors, gradients, alpha, Palette } from './colors';
import { type, fonts } from './typography';
import { spacing, radii } from './spacing';

type ThemeContextValue = {
  scheme: 'light' | 'dark';
  toggleScheme: () => void;
  setScheme: (s: 'light' | 'dark') => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
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
const STORAGE_KEY = 'vita.theme.v1';

// "Mais contraste": textos secundários e bordas ficam mais fortes.
function contrasted(p: Palette, scheme: 'light' | 'dark'): Palette {
  const base = scheme === 'light' ? colors.darkAzure : colors.offWhite;
  return {
    ...p,
    textMuted: alpha(base, 0.88),
    textFaint: alpha(base, 0.78),
    surfaceBorder: alpha(base, 0.28),
    chipBorder: alpha(base, 0.35),
    divider: alpha(base, 0.22),
    hint: scheme === 'light' ? '#4E6F7B' : '#A9C2CB',
    tabInactive: scheme === 'light' ? '#4E6F7B' : '#A9C2CB',
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  const [highContrast, setHighContrast] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw);
        if (saved.scheme === 'dark' || saved.scheme === 'light') setScheme(saved.scheme);
        setHighContrast(!!saved.highContrast);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ scheme, highContrast })).catch(() => {});
  }, [scheme, highContrast, loaded]);

  const value = useMemo<ThemeContextValue>(() => {
    const base = scheme === 'light' ? light : dark;
    return {
      scheme,
      toggleScheme: () => setScheme((s) => (s === 'light' ? 'dark' : 'light')),
      setScheme,
      highContrast,
      setHighContrast,
      palette: highContrast ? contrasted(base, scheme) : base,
      colors,
      gradients,
      alpha,
      type,
      fonts,
      spacing,
      radii,
    };
  }, [scheme, highContrast]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
