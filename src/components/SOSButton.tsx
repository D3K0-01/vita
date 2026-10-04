import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../state/AppContext';

// Floating SOS button — bottom-right, opens Modo Crise directly (5b),
// or resumes the "you had this open" screen (5e) if a session was left mid-step.
export function SOSButton({ bottom = 104 }: { bottom?: number }) {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { state } = useApp();
  return (
    <View style={{ position: 'absolute', right: 18, bottom, alignItems: 'center', gap: 3 }}>
      <Pressable
        onPress={() =>
          navigation.navigate('CrisisStack', { screen: state.crisisSession ? 'Resume5e' : 'Triage5b' })
        }
        style={({ pressed }) => ({
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: colors.darkAzure,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.85 : 1,
          shadowColor: colors.darkAzure,
          shadowOpacity: 0.4,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        })}
      >
        <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 14, color: colors.offWhite }}>SOS</Text>
      </Pressable>
      <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 9.5, color: colors.greyAzure }}>agora</Text>
    </View>
  );
}
