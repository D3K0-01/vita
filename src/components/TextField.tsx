import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';

type Props = Omit<TextInputProps, 'style'> & {
  label?: string;
  error?: string | null;
  /** Campo de senha com botão de mostrar/ocultar. */
  password?: boolean;
  right?: React.ReactNode;
};

export function TextField({ label, error, password, right, multiline, ...input }: Props) {
  const { palette, type, radii, colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View>
      {label ? <Text style={[type.eyebrow, { color: palette.hint, marginBottom: 7 }]}>{label}</Text> : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          backgroundColor: palette.surface,
          borderWidth: focused ? 1.5 : 1,
          borderColor: error ? '#9B3D3D' : focused ? colors.accent1 : palette.chipBorder,
          borderRadius: radii.md,
        }}
      >
        <TextInput
          placeholderTextColor={palette.textFaint}
          secureTextEntry={password ? hidden : undefined}
          autoCapitalize={password || input.keyboardType === 'email-address' ? 'none' : input.autoCapitalize}
          multiline={multiline}
          {...input}
          onFocus={(e) => {
            setFocused(true);
            input.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            input.onBlur?.(e);
          }}
          style={[
            {
              flex: 1,
              minHeight: 50,
              paddingHorizontal: 15,
              paddingVertical: 14,
              fontFamily: 'Lexend_400Regular',
              fontSize: 15,
              color: palette.text,
            },
            multiline ? { minHeight: 96, textAlignVertical: 'top' } : null,
            // remove o contorno azul padrão do navegador
            { outlineStyle: 'none' } as any,
          ]}
        />
        {password ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}
            style={{ paddingHorizontal: 14, alignSelf: 'stretch', justifyContent: 'center' }}
          >
            {hidden ? <Eye size={19} color={palette.hint} strokeWidth={1.8} /> : <EyeOff size={19} color={palette.hint} strokeWidth={1.8} />}
          </Pressable>
        ) : null}
        {right}
      </View>
      {error ? <Text style={[type.caption, { color: '#9B3D3D', marginTop: 6 }]}>{error}</Text> : null}
    </View>
  );
}
