import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

// Placeholder das fotos dos parceiros. Quando os assets reais chegarem,
// trocar por <Image source={...} /> — o dimensionamento é o mesmo.
export function PhotoPlaceholder({
  label,
  height,
  radius = 16,
  style,
  fontSize = 10.5,
}: {
  label: string;
  height?: number;
  radius?: number;
  style?: ViewStyle;
  fontSize?: number;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          height,
          borderRadius: radius,
          backgroundColor: colors.greyAzure,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 6,
        },
        style,
      ]}
    >
      <Text
        numberOfLines={2}
        style={{ fontFamily: 'Lexend_500Medium', fontSize, color: colors.white, textAlign: 'center', opacity: 0.95 }}
      >
        {label}
      </Text>
    </View>
  );
}
