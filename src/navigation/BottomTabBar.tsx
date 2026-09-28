import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, CalendarCheck, Layers, Store, Users, MessageCircle } from 'lucide-react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme/ThemeProvider';

const ICONS: Record<string, any> = {
  HomeTab: Home,
  RotinaTab: CalendarCheck,
  FasesTab: Layers,
  ParceirosTab: Store,
  ComunidadeTab: Users,
  IATab: MessageCircle,
};

const LABELS: Record<string, string> = {
  HomeTab: 'Home',
  RotinaTab: 'Rotina',
  FasesTab: 'Fases',
  ParceirosTab: 'Parceiros',
  ComunidadeTab: 'Comunidade',
  IATab: 'IA / SOS',
};

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();

  // Dentro do fluxo de Parceiros, as telas internas (detalhe, cupom, mapa,
  // avaliações, cadastro) têm rodapé próprio — a barra some, como no design.
  const focusedRoute = state.routes[state.index];
  const nestedIndex = (focusedRoute.state as { index?: number } | undefined)?.index ?? 0;
  if (focusedRoute.name === 'ParceirosTab' && nestedIndex > 0) return null;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingTop: 10,
        paddingBottom: Math.max(insets.bottom, 14),
        backgroundColor: palette.bg + 'F5',
        borderTopWidth: 1,
        borderTopColor: palette.divider,
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const Icon = ICONS[route.name] ?? Home;
        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={{ flex: 1, alignItems: 'center', gap: 4 }}
          >
            <Icon size={20} color={focused ? palette.tabActive : palette.tabInactive} strokeWidth={1.9} />
            <Text
              style={{
                fontFamily: focused ? 'Lexend_500Medium' : 'Lexend_400Regular',
                fontSize: 9,
                color: focused ? palette.tabActive : palette.tabInactive,
              }}
              numberOfLines={1}
            >
              {LABELS[route.name]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
