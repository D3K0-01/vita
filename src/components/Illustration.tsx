import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sprout, Sparkles } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';

// Ilustração leve no lugar dos espaços de imagem: círculos suaves + ícone, nas cores da marca.
export function Illustration({ variant = 'sprout', height = 200 }: { variant?: 'sprout' | 'sparkles'; height?: number }) {
  const { colors } = useTheme();
  const Icon = variant === 'sparkles' ? Sparkles : Sprout;
  const from = variant === 'sparkles' ? colors.pastelGreen : colors.offWhite;
  const to = variant === 'sparkles' ? colors.greyAzure : colors.pastelGreen;
  return (
    <LinearGradient colors={[from, to]} style={{ width: '100%', height, borderRadius: 24, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', width: height * 1.1, height: height * 1.1, borderRadius: height, backgroundColor: 'rgba(255,255,255,.16)', top: -height * 0.45, left: -height * 0.3 }} />
      <View style={{ position: 'absolute', width: height * 0.8, height: height * 0.8, borderRadius: height, backgroundColor: 'rgba(79,122,69,.12)', bottom: -height * 0.35, right: -height * 0.2 }} />
      <View style={{ width: height * 0.42, height: height * 0.42, borderRadius: height, backgroundColor: 'rgba(255,255,255,.55)', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={height * 0.2} color={colors.accent2} strokeWidth={1.6} />
      </View>
    </LinearGradient>
  );
}
