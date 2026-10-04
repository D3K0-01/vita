import React from 'react';
import { ScrollView, View, ViewStyle, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export function ScreenContainer({ children, scroll = true, style, contentStyle, edges = ['top'] }: Props) {
  const { palette } = useTheme();
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: palette.bg }, style]} edges={edges}>
      {scroll ? (
        <ScrollView style={styles.flex} contentContainerStyle={[{ paddingBottom: 24 }, contentStyle]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
