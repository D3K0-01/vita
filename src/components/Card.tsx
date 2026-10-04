import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  tone?: 'surface' | 'muted' | 'dark' | 'outline' | 'dashed';
  padding?: number;
  radius?: number;
};

export function Card({ children, style, tone = 'surface', padding = 20, radius }: Props) {
  const { palette, colors, radii } = useTheme();
  const r = radius ?? radii.lg;

  const toneStyle: ViewStyle = (() => {
    switch (tone) {
      case 'muted':
        return { backgroundColor: colors.pastelGreen };
      case 'dark':
        return { backgroundColor: colors.darkAzure };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.chipBorder };
      case 'dashed':
        return { backgroundColor: 'transparent', borderWidth: 1, borderStyle: 'dashed', borderColor: palette.chipBorder };
      default:
        return { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.surfaceBorder };
    }
  })();

  return <View style={[{ borderRadius: r, padding }, toneStyle, style]}>{children}</View>;
}
