import React from 'react';
import { View, Text, Platform, useWindowDimensions } from 'react-native';
import { colors, alpha } from '../theme/colors';
import { fonts } from '../theme/typography';

// Largura a partir da qual deixamos de ser "um celular" e passamos a ser
// "um celular numa tela grande". Abaixo disso o app ocupa a tela toda,
// que é o comportamento correto no navegador do celular.
const BREAKPOINT = 760;

const PHONE_WIDTH = 390;
const PHONE_HEIGHT = 844;

/**
 * Só afeta a web. Em telas largas, enquadra o app numa moldura de celular
 * centralizada, para apresentar em notebook/projetor sem a UI esticar.
 * No mobile (e em qualquer build nativa) devolve os filhos intactos.
 */
export function WebFrame({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();

  if (Platform.OS !== 'web' || width < BREAKPOINT) {
    return <>{children}</>;
  }

  // respeita telas baixas (notebook 13") sem cortar o app
  const frameHeight = Math.min(PHONE_HEIGHT, height - 72);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.darkAzure,
        paddingVertical: 24,
      }}
    >
      <View
        style={{
          width: PHONE_WIDTH,
          height: frameHeight,
          borderRadius: 40,
          overflow: 'hidden',
          backgroundColor: colors.offWhite,
          borderWidth: 1,
          borderColor: alpha(colors.white, 0.14),
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 18 },
          shadowOpacity: 0.32,
          shadowRadius: 44,
        }}
      >
        {children}
      </View>

      <Text
        style={{
          marginTop: 18,
          fontFamily: fonts.body,
          fontSize: 12.5,
          color: alpha(colors.white, 0.5),
        }}
      >
        Vita · protótipo — melhor visto no celular
      </Text>
    </View>
  );
}
