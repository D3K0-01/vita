import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';

type Props = {
  label: string;
  time?: string;
  done?: boolean;
  onToggle?: () => void;
  size?: number;
};

export function CheckRow({ label, time, done, onToggle, size = 22 }: Props) {
  const { palette, colors, gradients, type } = useTheme();
  return (
    <Pressable onPress={onToggle} style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
      {done ? (
        <LinearGradient
          colors={gradients.achievement}
          style={{ width: size, height: size, borderRadius: size * 0.32, alignItems: 'center', justifyContent: 'center' }}
        >
          <Check size={size * 0.6} color="#fff" strokeWidth={3} />
        </LinearGradient>
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size * 0.32,
            borderWidth: 2,
            borderColor: colors.pastelGreen,
          }}
        />
      )}
      <Text
        style={[
          type.body,
          {
            flex: 1,
            fontSize: 14,
            color: palette.text,
            opacity: done ? 0.5 : 1,
            textDecorationLine: done ? 'line-through' : 'none',
            fontFamily: done ? undefined : type.body.fontFamily,
          },
        ]}
      >
        {label}
      </Text>
      {time ? <Text style={[type.caption, { fontSize: 12, opacity: done ? 0.5 : 0.6, color: palette.text }]}>{time}</Text> : null}
    </Pressable>
  );
}
