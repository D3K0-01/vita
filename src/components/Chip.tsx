import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { fonts } from '../theme/typography';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  dashed?: boolean;
  style?: ViewStyle;
};

export function Chip({ label, selected, onPress, dashed, style }: Props) {
  const { palette, colors, type, radii } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          borderRadius: radii.pill,
          paddingVertical: 9,
          paddingHorizontal: 15,
          backgroundColor: selected ? palette.chipSelectedBg : palette.chipBg,
          borderWidth: 1,
          borderColor: selected ? palette.chipSelectedBorder : palette.chipBorder,
          borderStyle: dashed ? 'dashed' : 'solid',
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Text style={[type.bodySm, { fontSize: 13, fontFamily: selected ? fonts.bodyMedium : fonts.body, color: selected ? colors.accent2 : palette.text }]}>
        {label}
      </Text>
    </Pressable>
  );
}
