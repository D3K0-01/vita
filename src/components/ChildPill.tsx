import React from 'react';
import { Pressable, Text } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../state/AppContext';
import { useUI } from './UIProvider';
import { usePlan } from '../state/usePlan';

// Seletor do filho ativo. A rotina, as fases e a IA passam a falar desse filho.
export function ChildPill({ showAge = true }: { showAge?: boolean }) {
  const { palette, type } = useTheme();
  const { state, setActiveChild } = useApp();
  const { choose } = useUI();
  const navigation = useNavigation<any>();
  const { canAddChild, plan, upsell } = usePlan();

  const open = () =>
    choose('De quem estamos falando?', [
      ...state.children.map((c) => ({
        label: `${c.id === state.activeChildId ? '✓  ' : ''}${c.name} · ${c.age} anos`,
        hint: c.diagnosis,
        onPress: () => setActiveChild(c.id),
      })),
      canAddChild
        ? { label: '+ Adicionar filho ou filha', onPress: () => navigation.navigate('SettingsStack', { screen: 'EditChild' }) }
        : {
            label: '+ Adicionar filho ou filha',
            hint: plan === 'base' ? 'o Plus libera 2 perfis' : 'limite de 2 perfis',
            onPress: () =>
              plan === 'base'
                ? upsell('O Gratuito tem 1 perfil de filho', 'Com o Plus, você acompanha 2 filhos, cada um com sua rotina, trilhas e diário.')
                : undefined,
          },
    ]);

  return (
    <Pressable
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={`Filho ativo: ${state.childName}. Trocar`}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.surfaceBorder,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 13,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text style={[type.bodySm, { fontSize: 13, color: palette.text }]}>
        {state.childName}
        {showAge ? ` · ${state.childAge} anos` : ''}
      </Text>
      <ChevronDown size={14} color={palette.hint} />
    </Pressable>
  );
}
