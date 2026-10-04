import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenHeader } from '../../components/ScreenHeader';

type Props = {
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

// Moldura comum do cadastro: voltar + progresso, corpo com rolagem e rodapé fixo com os botões.
export function OnboardingShell({ step, title, subtitle, children, footer }: Props) {
  const { palette, type } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <ScreenHeader step={step} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 24, paddingTop: 20, gap: 22 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Text style={[type.title, { color: palette.text }]} accessibilityRole="header">
              {title}
            </Text>
            {subtitle ? <Text style={[type.body, { color: palette.textMuted, marginTop: 10, fontSize: 14 }]}>{subtitle}</Text> : null}
          </View>
          {children}
        </ScrollView>
        <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16, gap: 10, borderTopWidth: 1, borderTopColor: palette.divider, backgroundColor: palette.bg }}>
          {footer}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  const { palette, type } = useTheme();
  return <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 7 }]}>{children}</Text>;
}
