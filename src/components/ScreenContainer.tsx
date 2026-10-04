import React from 'react';
import { ScrollView, View, ViewStyle, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  /**
   * Elementos flutuantes (SOS, botões de ação). Ficam fora da rolagem, presos
   * ao canto da tela, e o conteúdo ganha espaço no fim para nunca ficar
   * escondido atrás deles.
   */
  floating?: React.ReactNode;
};

export function ScreenContainer({ children, scroll = true, style, contentStyle, edges = ['top'], floating }: Props) {
  const { palette } = useTheme();
  const bottomSpace = floating ? 96 : 28;
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: palette.bg }, style]} edges={edges}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[{ paddingBottom: bottomSpace }, contentStyle]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, contentStyle]}>{children}</View>
        )}
      </KeyboardAvoidingView>
      {floating}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
