import React from 'react';
import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';

export function Switch({ value, onValueChange, achievement }: { value: boolean; onValueChange: (v: boolean) => void; achievement?: boolean }) {
  const { colors, gradients } = useTheme();
  const body = (
    <View style={{ width: 21, height: 21, borderRadius: 11, backgroundColor: '#fff' }} />
  );
  return (
    <Pressable onPress={() => onValueChange(!value)} hitSlop={8}>
      {value ? (
        achievement !== false ? (
          <LinearGradient colors={gradients.achievement} style={{ width: 46, height: 27, borderRadius: 14, alignItems: 'flex-end', justifyContent: 'center', padding: 3 }}>
            {body}
          </LinearGradient>
        ) : (
          <View style={{ width: 46, height: 27, borderRadius: 14, backgroundColor: colors.darkAzure, alignItems: 'flex-end', justifyContent: 'center', padding: 3 }}>{body}</View>
        )
      ) : (
        <View style={{ width: 46, height: 27, borderRadius: 14, backgroundColor: 'rgba(46,75,82,.15)', justifyContent: 'center', padding: 3 }}>{body}</View>
      )}
    </Pressable>
  );
}
