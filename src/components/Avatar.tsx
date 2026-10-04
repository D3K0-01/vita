import React from 'react';
import { View, Text, Image, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { fonts } from '../theme/typography';
import { getAvatar, AvatarKey } from '../data/images';

type Props = {
  /** Chave no registro de fotos (`src/data/avatars.ts`). */
  person?: AvatarKey | null;
  /** Nome usado para gerar a inicial quando não há foto. */
  name?: string;
  size?: number;
  /** Anel na cor de acolhimento em volta da foto. */
  ring?: boolean;
  style?: ViewStyle;
};

export function Avatar({ person, name, size = 40, ring, style }: Props) {
  const { colors } = useTheme();
  const source = getAvatar(person);
  const initial = name?.trim().charAt(0).toUpperCase() ?? '';

  const base: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: colors.pastelGreen,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...(ring ? { borderWidth: 2, borderColor: colors.pastelGreen } : null),
  };

  return (
    <View style={[base, style]}>
      {source ? (
        <Image source={source} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : initial ? (
        <Text style={{ fontFamily: fonts.display, color: colors.darkAzure, fontSize: size * 0.4 }}>
          {initial}
        </Text>
      ) : null}
    </View>
  );
}
