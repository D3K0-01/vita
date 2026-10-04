import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';

type Props = {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  /** Cor do texto/ícone, para telas de fundo escuro. */
  tint?: string;
  /** Título grande (padrão) ou discreto ao lado da seta. */
  size?: 'lg' | 'sm';
};

// Cabeçalho das subtelas: seta de voltar com área de toque de 44px + título.
export function BackHeader({ title, onBack, right, tint, size = 'lg' }: Props) {
  const { palette, type } = useTheme();
  const navigation = useNavigation<any>();
  const color = tint ?? palette.text;

  const back = () => {
    if (onBack) return onBack();
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.getParent()?.goBack();
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 48 }}>
      <Pressable
        onPress={back}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        hitSlop={8}
        style={({ pressed }) => ({ width: 44, height: 44, marginLeft: -10, alignItems: 'center', justifyContent: 'center', borderRadius: 22, opacity: pressed ? 0.5 : 1 })}
      >
        <ChevronLeft size={24} color={color} strokeWidth={2} />
      </Pressable>
      {title ? (
        <Text
          numberOfLines={1}
          style={[size === 'lg' ? type.titleSm : type.cardTitle, { flex: 1, color, fontSize: size === 'lg' ? 22 : 16 }]}
          accessibilityRole="header"
        >
          {title}
        </Text>
      ) : (
        <View style={{ flex: 1 }} />
      )}
      {right}
    </View>
  );
}
