import React from 'react';
import { View, Text, Image, ViewStyle } from 'react-native';
import { User } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { fonts } from '../theme/typography';
import { getAvatar, AvatarKey } from '../data/images';
import { useApp } from '../state/AppContext';

type Props = {
  /** Chave no registro de fotos (`src/data/images.ts`), ou "me" para a foto do usuário. */
  person?: AvatarKey | 'me' | null;
  /** Nome usado para gerar a inicial quando não há foto. */
  name?: string;
  size?: number;
  /** Anel na cor de acolhimento em volta da foto. */
  ring?: boolean;
  style?: ViewStyle;
};

export function Avatar({ person, name, size = 40, ring, style }: Props) {
  const { colors } = useTheme();
  const { state } = useApp();
  const isMe = person === 'me';
  const source = isMe ? (state.photo ? { uri: state.photo } : null) : getAvatar(person as AvatarKey | null);
  const initial = name?.trim().charAt(0).toUpperCase() ?? '';

  const base: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: isMe && !source ? '#D5E1E5' : colors.pastelGreen,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...(ring ? { borderWidth: 2, borderColor: colors.pastelGreen } : null),
  };

  return (
    <View style={[base, style]} accessibilityLabel={isMe ? 'Sua foto de perfil' : name}>
      {source ? (
        <Image source={source} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : isMe ? (
        // sem foto: boneco neutro, como o "sem perfil" das redes sociais
        <User size={size * 0.56} color={colors.greyAzure} strokeWidth={1.6} style={{ marginTop: size * 0.12 }} fill={colors.greyAzure} />
      ) : initial ? (
        <Text style={{ fontFamily: fonts.display, color: colors.darkAzure, fontSize: size * 0.4 }}>{initial}</Text>
      ) : null}
    </View>
  );
}
