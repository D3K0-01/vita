import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function ProgressBar({ progress, height = 4, color, trackColor }: { progress: number; height?: number; color?: string; trackColor?: string }) {
  const { palette, colors } = useTheme();
  return (
    <View style={{ flex: 1, height, borderRadius: height / 2, backgroundColor: trackColor ?? palette.divider, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%`, height: '100%', borderRadius: height / 2, backgroundColor: color ?? colors.darkAzure }} />
    </View>
  );
}
