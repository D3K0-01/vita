import React from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { TourTarget } from '../components/tour/Tour';
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
  IATab: 'Chat',
};

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const labelSize = width < 380 ? 9 : 10;

  // Dentro do fluxo de Parceiros, as telas internas (detalhe, cupom, mapa,
  // avaliações, cadastro) têm rodapé próprio — a barra some, como no design.
  const focusedRoute = state.routes[state.index];
  const nestedIndex = (focusedRoute.state as { index?: number } | undefined)?.index ?? 0;
  if (focusedRoute.name === 'ParceirosTab' && nestedIndex > 0) return null;

  return (
    <TourTarget id="tabbar">
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingTop: 6,
        paddingBottom: Math.max(insets.bottom, 8),
        backgroundColor: palette.bg,
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
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              // tocar de novo na aba ativa volta para a primeira tela dela
              else if (focused && (route.state as any)?.index > 0) navigation.navigate(route.name, { screen: (route.state as any).routeNames?.[0] });
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={LABELS[route.name]}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: 48 }}
          >
            <Icon size={21} color={focused ? palette.tabActive : palette.tabInactive} strokeWidth={1.9} />
            <Text
              style={{
                fontFamily: focused ? 'Lexend_500Medium' : 'Lexend_400Regular',
                fontSize: labelSize,
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
    </TourTarget>
  );
}
