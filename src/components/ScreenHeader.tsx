import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { ProgressBar } from './ProgressBar';
import { useNavigation } from '@react-navigation/native';

// Onboarding-style header: back chevron + progress bar + "n de 7"
export function ScreenHeader({ step, total = 7, onBack }: { step: number; total?: number; onBack?: () => void }) {
  const { palette } = useTheme();
  const navigation = useNavigation();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 24, paddingTop: 14 }}>
      <Pressable onPress={onBack ?? (() => navigation.canGoBack() && navigation.goBack())} hitSlop={12}>
        <ChevronLeft size={22} color={palette.text} strokeWidth={2} />
      </Pressable>
      <ProgressBar progress={step / total} />
      <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 12, color: palette.hint }}>
        {step} de {total}
      </Text>
    </View>
  );
}
