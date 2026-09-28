import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ProgressBar } from '../ProgressBar';

// Cabeçalho de formulário multi-etapa ("1 de 3") — usado no cadastro 1g.
export function StepProgressHeader({ step, total, onBack, title }: { step: number; total: number; onBack?: () => void; title?: string }) {
  const { palette, colors, type } = useTheme();
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable onPress={onBack} hitSlop={12}>
          <ChevronLeft size={22} color={palette.text} strokeWidth={2} />
        </Pressable>
        {title ? <Text style={[type.bodySm, { flex: 1, fontSize: 13.5, color: palette.textMuted }]}>{title}</Text> : <View style={{ flex: 1 }} />}
        <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 12, color: palette.hint }}>
          {step} de {total}
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <ProgressBar progress={step / total} height={5} color={colors.accent1} />
      </View>
    </View>
  );
}
