import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useApp } from './AppContext';
import { useUI } from '../components/UIProvider';
import { LIMITS, PLAN_RANK, PlanId, planName } from '../data/plans';
import { TRACKS } from '../data/tracks';

/**
 * Permissões do plano atual. `upsell` mostra um aviso gentil explicando o
 * limite e oferecendo os planos — nunca bloqueia o Modo Crise.
 */
export function usePlan() {
  const { state } = useApp();
  const { choose } = useUI();
  const navigation = useNavigation<any>();
  const plan = (state.plan ?? 'base') as PlanId;
  const limits = LIMITS[plan];
  const atLeast = (p: PlanId) => PLAN_RANK[plan] >= PLAN_RANK[p];

  const upsell = useCallback(
    (title: string, message: string, need: PlanId = 'plus') =>
      choose(title, [{ label: `Conhecer o ${planName(need)}`, hint: 'ver planos e valores', onPress: () => navigation.navigate('PlansStack') }], message),
    [choose, navigation]
  );

  const childTaskCount = state.tasks.filter((t) => t.childId === state.activeChildId).length;
  const tracksInProgress = TRACKS.filter((t) => {
    const p = state.tracks[t.id];
    return p && p.step > 0 && p.step <= t.phases.length;
  }).length;

  return {
    plan,
    name: planName(plan),
    limits,
    atLeast,
    upsell,
    canAddTask: childTaskCount < limits.tasksPerChild,
    canStartTrack: tracksInProgress < limits.parallelTracks,
    canAddChild: state.children.length < limits.children,
    canJoinGroup: state.joinedGroups.length < limits.groups,
    hasHistory: atLeast('plus'),
    hasCompanions: atLeast('plus'),
    hasExclusiveGroups: atLeast('plus'),
    hasProfessional: atLeast('premium'),
  };
}
