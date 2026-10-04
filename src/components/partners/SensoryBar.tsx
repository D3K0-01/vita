import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ProgressBar } from '../ProgressBar';

export function SensoryBar({
  label,
  progress,
  value,
  tone = 'calm',
  labelWidth = 58,
}: {
  label: string;
  progress: number;
  value: string;
  tone?: 'calm' | 'medium';
  labelWidth?: number;
}) {
  const { palette, colors, type } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Text numberOfLines={1} style={[type.bodySm, { width: labelWidth, fontSize: 12.5, color: palette.textMuted }]}>
        {label}
      </Text>
      <ProgressBar progress={progress} height={7} color={tone === 'calm' ? colors.accent1 : colors.greyAzure} trackColor={colors.pastelGreen + '66'} />
      <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 12, color: palette.text, minWidth: 48, textAlign: 'right' }}>{value}</Text>
    </View>
  );
}
