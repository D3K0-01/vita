import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Easing, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Pause, Play } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useApp } from '../../state/AppContext';

const INHALE = 4;
const EXHALE = 6;
const TOTAL = 120; // 2 minutos

// Respiração guiada: 4 segundos entra, 6 sai. Sem som, sem texto para ler.
export default function Breathing({ navigation }: any) {
  const { colors } = useTheme();
  const { state } = useApp();
  const still = state.prefs.noAnimations || state.prefs.reducedStimulus;
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const scale = useRef(new Animated.Value(0.6)).current;

  const cyclePos = elapsed % (INHALE + EXHALE);
  const inhaling = cyclePos < INHALE;
  const done = elapsed >= TOTAL;

  useEffect(() => {
    if (!running || done) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [running, done]);

  useEffect(() => {
    if (!running || done || still) return;
    // anima no início de cada fase
    if (cyclePos === 0 || cyclePos === INHALE) {
      Animated.timing(scale, {
        toValue: inhaling ? 1 : 0.6,
        duration: (inhaling ? INHALE : EXHALE) * 1000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  }, [cyclePos, inhaling, running, done, still, scale]);

  const remaining = Math.max(0, TOTAL - elapsed);
  const mm = Math.floor(remaining / 60);
  const ss = String(remaining % 60).padStart(2, '0');
  const phaseLeft = inhaling ? INHALE - cyclePos : INHALE + EXHALE - cyclePos;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkAzure }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 }}>
        <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 13, color: colors.offWhite, opacity: 0.7, paddingLeft: 6 }}>Respirar · {mm}:{ss}</Text>
        <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Fechar" style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
          <X size={22} color={colors.offWhite} />
        </Pressable>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 40 }}>
        <View style={{ width: 260, height: 260, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ position: 'absolute', width: 260, height: 260, borderRadius: 130, borderWidth: 1.5, borderColor: 'rgba(199,214,191,.35)' }} />
          <Animated.View
            style={{
              width: 260,
              height: 260,
              borderRadius: 130,
              backgroundColor: 'rgba(199,214,191,.28)',
              transform: [{ scale: still ? (inhaling ? 1 : 0.6) : scale }],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 56, color: colors.offWhite }}>{done ? '✓' : phaseLeft}</Text>
          </Animated.View>
        </View>
        <View style={{ alignItems: 'center', gap: 8, paddingHorizontal: 30 }}>
          <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 30, color: colors.offWhite, textAlign: 'center' }}>
            {done ? 'Pronto.' : inhaling ? 'Inspira devagar' : 'Solta o ar'}
          </Text>
          <Text style={{ fontFamily: 'Lexend_300Light', fontSize: 14, color: colors.offWhite, opacity: 0.75, textAlign: 'center', lineHeight: 21 }}>
            {done ? 'Dois minutos só seus. Volte quando precisar.' : '4 segundos entra, 6 segundos sai.'}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 16, gap: 10 }}>
        {done ? (
          <Pressable onPress={() => navigation.goBack()} style={{ backgroundColor: colors.offWhite, borderRadius: 30, paddingVertical: 17, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'BricolageGrotesque_500Medium', fontSize: 15, color: colors.darkAzure }}>Voltar</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setRunning((r) => !r)}
            accessibilityRole="button"
            style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(242,239,230,.3)', borderRadius: 30, paddingVertical: 16, alignItems: 'center' }}
          >
            {running ? <Pause size={17} color={colors.offWhite} /> : <Play size={17} color={colors.offWhite} />}
            <Text style={{ fontFamily: 'Lexend_400Regular', fontSize: 14, color: colors.offWhite }}>{running ? 'pausar' : 'continuar'}</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
