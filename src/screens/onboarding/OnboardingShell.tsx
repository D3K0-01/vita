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

// Shared shell for the 6 onboarding screens: back+progress header, scrolling body, sticky footer CTAs.
export function OnboardingShell({ step, title, subtitle, children, footer }: Props) {
  const { palette, type } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <ScreenHeader step={step} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingTop: 20, gap: 22 }} showsVerticalScrollIndicator={false}>
          <View>
            <Text style={[type.title, { color: palette.text }]}>{title}</Text>
            {subtitle ? <Text style={[type.body, { color: palette.textMuted, marginTop: 10, fontSize: 14 }]}>{subtitle}</Text> : null}
          </View>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={{ padding: 24, paddingTop: 10, gap: 12 }}>{footer}</View>
    </SafeAreaView>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  const { palette, type } = useTheme();
  return <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 7 }]}>{children}</Text>;
}

export function TextInputLike({ value, placeholder }: { value?: string; placeholder?: string }) {
  const { palette, type, radii } = useTheme();
  return (
    <View style={{ backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.chipBorder, borderRadius: radii.md, padding: 15 }}>
      <Text style={[type.body, { fontSize: 14.5, color: value ? palette.text : palette.textFaint }]}>{value ?? placeholder}</Text>
    </View>
  );
}
