import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import {
  useFonts as useBricolageFonts,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  useFonts as useLexendFonts,
  Lexend_300Light,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
} from '@expo-google-fonts/lexend';

import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { AppProvider, useApp } from './src/state/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { WebFrame } from './src/components/WebFrame';

function LoadingScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2EFE6' }}>
      <ActivityIndicator color="#2E4B52" />
    </View>
  );
}

function AppShell() {
  const { loaded } = useApp();
  const { palette, scheme } = useTheme();

  if (!loaded) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <View style={{ flex: 1, backgroundColor: palette.bg }}>
        <RootNavigator />
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  const [bricolageLoaded] = useBricolageFonts({ BricolageGrotesque_500Medium, BricolageGrotesque_600SemiBold });
  const [lexendLoaded] = useLexendFonts({ Lexend_300Light, Lexend_400Regular, Lexend_500Medium, Lexend_600SemiBold });

  if (!bricolageLoaded || !lexendLoaded) return <LoadingScreen />;

  return (
    <WebFrame>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppProvider>
            <AppShell />
          </AppProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </WebFrame>
  );
}
